/**
 * ArenaMind 2026 - Main Application Controller
 * Handles routing, portal switching, accessibility overrides, SVG mapping,
 * form handlers, and simulator connections.
 */

// Global Variables
let currentPortalMode = 'fan'; // 'fan' or 'staff'
let currentActiveTab = 'map';  // 'map', 'assistant', 'sustainability', 'tests'
let isTextToSpeechActive = false;
let currentFontSizePercent = 100;

// HTML Escaper Utility for XSS mitigation
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHTML = escapeHTML;

// Coordinate Mapping for Stadium Nodes
const NODE_COORDINATES = {
  'Gate A (North)': { x: 400, y: 30 },
  'Gate B (East)': { x: 760, y: 250 },
  'Gate C (South)': { x: 400, y: 470 },
  'Gate D (West)': { x: 40, y: 250 },
  'Sensory Friendly Room - Concourse 1': { x: 215, y: 105 },
  'Concessions Green Hub - Block 105': { x: 595, y: 125 },
  'Wheelchair Reserved Seating - Block 112': { x: 195, y: 385 },
  'Medical Station 2 - Gate D': { x: 125, y: 165 }
};

// Cached DOM element references
let DOM = {};

// ==========================================================================
// 1. INITIALIZATION
// ==========================================================================
const initStart = performance.now();
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM cache
  DOM = {
    btnFan: document.getElementById('btn-mode-fan'),
    btnStaff: document.getElementById('btn-mode-staff'),
    btnContrast: document.getElementById('btn-contrast-toggle'),
    btnTextInc: document.getElementById('btn-text-scale-inc'),
    btnTextDec: document.getElementById('btn-text-scale-dec'),
    btnSpeech: document.getElementById('btn-speech-toggle'),
    routeStart: document.getElementById('route-start'),
    routeEnd: document.getElementById('route-end'),
    routeOption: document.getElementById('route-option'),
    routingForm: document.getElementById('routing-form'),
    routeResultPanel: document.getElementById('route-result-panel'),
    routeDirections: document.getElementById('route-directions'),
    routeEta: document.getElementById('route-eta'),
    routeDistance: document.getElementById('route-distance'),
    chatLangSelect: document.getElementById('chat-lang-select'),
    chatMessagesBox: document.getElementById('chat-messages-box'),
    chatChipsContainer: document.getElementById('chat-chips-container'),
    chatInputForm: document.getElementById('chat-input-form'),
    chatTextField: document.getElementById('chat-text-field'),
    debugPromptContext: document.getElementById('debug-prompt-context'),
    carbonForm: document.getElementById('carbon-form'),
    carbonFootprintValue: document.getElementById('carbon-footprint-value'),
    carbonTierDesc: document.getElementById('carbon-tier-desc'),
    sustainabilityAiAdvice: document.getElementById('sustainability-ai-advice'),
    staffOccupancy: document.getElementById('staff-metric-occupancy'),
    staffEta: document.getElementById('staff-metric-eta'),
    staffIncidents: document.getElementById('staff-metric-incidents'),
    alertsFeed: document.getElementById('operations-alerts-feed'),
    simulatorControls: document.getElementById('simulator-controls'),
    aiTacticalResponseContainer: document.getElementById('ai-tactical-response-container'),
    btnTacticalBriefing: document.getElementById('btn-tactical-briefing'),
    btnRunTests: document.getElementById('btn-run-tests'),
    testProgressCounter: document.getElementById('test-progress-counter'),
    testProgressBarInner: document.getElementById('test-progress-bar-inner'),
    testCoverageUnit: document.getElementById('test-coverage-unit'),
    testCoverageA11y: document.getElementById('test-coverage-a11y'),
    testCoverageSecurity: document.getElementById('test-coverage-security'),
    testCoveragePerformance: document.getElementById('test-coverage-performance'),
    testResultsBox: document.getElementById('test-results-box')
  };

  // Listen for simulator updates
  window.addEventListener('stadiumUpdate', (e) => {
    updateDashboardUI(e.detail);
  });

  // Bind Event Listeners dynamically
  bindEvents();

  // Load Initial Sustainability advice
  calculateCarbonFootprint();

  // Initialize view states
  switchPortalMode('fan');
  
  // Set up screen-reader announcement container dynamically
  const ariaAnnounce = document.createElement('div');
  ariaAnnounce.id = 'sr-announcer';
  ariaAnnounce.className = 'sr-only';
  ariaAnnounce.setAttribute('aria-live', 'assertive');
  document.body.appendChild(ariaAnnounce);

  // Check for potential script 404/loading errors on load
  checkModuleLoadState();

  announceAccessibility("ArenaMind 2026 World Cup Operations Dashboard fully loaded.");
  
  window.appInitDuration = performance.now() - initStart;
});

// Bind element listeners dynamically
function bindEvents() {
  // Mode toggle handlers
  if (DOM.btnFan) DOM.btnFan.addEventListener('click', () => switchPortalMode('fan'));
  if (DOM.btnStaff) DOM.btnStaff.addEventListener('click', () => switchPortalMode('staff'));

  // Accessibility controller handlers
  if (DOM.btnContrast) DOM.btnContrast.addEventListener('click', toggleHighContrast);
  if (DOM.btnTextInc) DOM.btnTextInc.addEventListener('click', () => adjustTextScale(true));
  if (DOM.btnTextDec) DOM.btnTextDec.addEventListener('click', () => adjustTextScale(false));
  if (DOM.btnSpeech) DOM.btnSpeech.addEventListener('click', toggleTextToSpeech);

  // Static navigation button links
  const initialNavBtns = document.querySelectorAll('#navigation-links button[data-tab]');
  initialNavBtns.forEach(btn => {
    const tabId = btn.getAttribute('data-tab');
    btn.addEventListener('click', () => switchTab(tabId));
  });

  // SVG interactive nodes
  document.querySelectorAll('.interactive-map-node').forEach(node => {
    const nodeName = node.getAttribute('data-node-name');
    if (nodeName) {
      node.addEventListener('click', () => selectMapNode(nodeName));
      
      // Accessibility: Keypress handler for Enter and Space keys
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectMapNode(nodeName);
        }
      });
    }
  });

  // Wayfinding planner form
  if (DOM.routingForm) {
    DOM.routingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateRoute();
    });
  }

  // Chat language change
  if (DOM.chatLangSelect) {
    DOM.chatLangSelect.addEventListener('change', updateChatLanguage);
  }

  // Chat recommended prompts delegation
  if (DOM.chatChipsContainer) {
    DOM.chatChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.prompt-chip');
      if (chip) {
        const promptText = chip.getAttribute('data-prompt');
        if (promptText) submitQuickPrompt(promptText);
      }
    });
  }

  // Chat manually typed form submit
  if (DOM.chatInputForm) {
    DOM.chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleChatSubmit();
    });
  }

  // Carbon calculator form
  if (DOM.carbonForm) {
    DOM.carbonForm.addEventListener('input', calculateCarbonFootprint);
    DOM.carbonForm.addEventListener('change', calculateCarbonFootprint);
  }

  // Operations panel alert resolution buttons (using delegation)
  if (DOM.alertsFeed) {
    DOM.alertsFeed.addEventListener('click', (e) => {
      const resolveBtn = e.target.closest('button[data-action="resolve-incident"]');
      if (resolveBtn) {
        const incidentId = resolveBtn.getAttribute('data-incident-id');
        const targetArea = resolveBtn.getAttribute('data-target-area');
        simulateIncidentResponse(incidentId, targetArea);
      }
    });
  }

  // Operations simulator trigger controls (using delegation)
  if (DOM.simulatorControls) {
    DOM.simulatorControls.addEventListener('click', (e) => {
      const triggerBtn = e.target.closest('button[data-trigger]');
      if (triggerBtn) {
        const triggerType = triggerBtn.getAttribute('data-trigger');
        triggerMockIncident(triggerType);
      }
      const resetBtn = e.target.closest('button[data-action="reset-sim"]');
      if (resetBtn) {
        resetSimulatorData();
      }
    });
  }

  // Tactical briefing generator
  if (DOM.btnTacticalBriefing) {
    DOM.btnTacticalBriefing.addEventListener('click', requestTacticalBriefing);
  }

  // Audit diagnostic test suite runner
  if (DOM.btnRunTests) {
    DOM.btnRunTests.addEventListener('click', runSuiteTests);
  }
}

// Check if any modules failed to load and log diagnostic issues
function checkModuleLoadState() {
  if (!window.qaTestSuite || !window.stadiumSimulator || !window.stadiumAIEngine) {
    const logBox = DOM.testResultsBox || document.getElementById('test-results-box');
    if (logBox) {
      logBox.innerHTML = `<div class="test-log-line test-failure">❌ ERROR: Core diagnostic components failed to load (404 Not Found or file path error). Please verify that the 'js/' folder is accessible and files exist.</div>`;
    }
  }
}

// Screen reader dynamic announcements
function announceAccessibility(text) {
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = text;
  }
  
  // Optional Text-To-Speech
  if (isTextToSpeechActive && 'speechSynthesis' in window) {
    // Stop ongoing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// ==========================================================================
// 2. PORTAL & TAB NAVIGATION
// ==========================================================================
function switchPortalMode(mode) {
  currentPortalMode = mode;
  
  if (mode === 'fan') {
    if (DOM.btnFan) DOM.btnFan.classList.add('active');
    if (DOM.btnStaff) DOM.btnStaff.classList.remove('active');
    
    // Update navigation items for Fans
    updateSidebarNav([
      { id: 'map', text: '🗺️ Stadium Navigation', label: 'Stadium Wayfinding Navigation' },
      { id: 'assistant', text: '🤖 GenAI Assistant', label: 'Multilingual Chat Assistant' },
      { id: 'sustainability', text: '🌱 Sustainability Hub', label: 'Sustainability carbon tracker' },
      { id: 'tests', text: '🧪 QA Testing Center', label: 'In-app automated QA and audits' }
    ]);
    
    switchTab('map');
    announceAccessibility("Switched to Fan Portal.");
  } else {
    if (DOM.btnFan) DOM.btnFan.classList.remove('active');
    if (DOM.btnStaff) DOM.btnStaff.classList.add('active');
    
    // Update navigation items for Staff
    updateSidebarNav([
      { id: 'staff', text: '📊 Operations Dashboard', label: 'Operations command hub' },
      { id: 'assistant', text: '🤖 Tactical AI Assistant', label: 'Operations AI chat assistant' },
      { id: 'tests', text: '🧪 QA Testing Center', label: 'Diagnostics and test logs' }
    ]);
    
    switchTab('staff');
    announceAccessibility("Switched to Venue Operations Portal.");
  }
}

function updateSidebarNav(links) {
  const navContainer = document.getElementById('navigation-links');
  if (!navContainer) return;
  
  navContainer.innerHTML = '';
  links.forEach(link => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.id = `nav-btn-${link.id}`;
    button.className = `nav-item-btn ${currentActiveTab === link.id ? 'active' : ''}`;
    button.setAttribute('data-tab', link.id);
    button.setAttribute('aria-label', link.label);
    button.textContent = link.text;
    
    // Programmatic click handler
    button.addEventListener('click', () => switchTab(link.id));
    
    li.appendChild(button);
    navContainer.appendChild(li);
  });
}

function switchTab(tabId) {
  currentActiveTab = tabId;
  
  // Hide all sections
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(sec => sec.classList.remove('active'));
  
  // Show target section
  const activeSec = document.getElementById(`section-${tabId}`);
  if (activeSec) {
    activeSec.classList.add('active');
    // Set focus on container for accessibility
    activeSec.setAttribute('tabindex', '-1');
    activeSec.focus();
  }

  // Update navigation button active state
  const buttons = document.querySelectorAll('.nav-item-btn');
  buttons.forEach(btn => {
    if (btn.id === `nav-btn-${tabId}`) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  announceAccessibility(`Navigated to ${tabId} section.`);
}

// ==========================================================================
// 3. ACCESSIBILITY OVERRIDES
// ==========================================================================
function toggleHighContrast() {
  const body = document.body;
  body.classList.toggle('high-contrast');
  
  const isActive = body.classList.contains('high-contrast');
  
  if (DOM.btnContrast) {
    if (isActive) {
      DOM.btnContrast.textContent = '☀️ Normal Contrast';
      announceAccessibility("High contrast mode enabled.");
    } else {
      DOM.btnContrast.textContent = '🌗 High Contrast Mode';
      announceAccessibility("High contrast mode disabled.");
    }
  }
}

function adjustTextScale(increase) {
  const html = document.documentElement;
  
  if (increase) {
    currentFontSizePercent = Math.min(150, currentFontSizePercent + 10);
  } else {
    currentFontSizePercent = Math.max(85, currentFontSizePercent - 10);
  }
  
  html.style.fontSize = `${currentFontSizePercent}%`;
  announceAccessibility(`Text size scaled to ${currentFontSizePercent} percent.`);
}

function toggleTextToSpeech() {
  isTextToSpeechActive = !isTextToSpeechActive;
  
  if (DOM.btnSpeech) {
    if (isTextToSpeechActive) {
      DOM.btnSpeech.textContent = '🔇 Text-to-Speech (On)';
      DOM.btnSpeech.classList.add('active');
      announceAccessibility("Text to speech navigation aids activated.");
    } else {
      DOM.btnSpeech.textContent = '🔊 Text-to-Speech (Off)';
      DOM.btnSpeech.classList.remove('active');
      // Stop any ongoing speaking
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }
}

// ==========================================================================
// 4. WAYFINDING & SVG MAPPING
// ==========================================================================
function selectMapNode(nodeName) {
  if (!DOM.routeStart || !DOM.routeEnd) return;
  
  // Decide start or destination selection logic
  if (nodeName.includes('Gate')) {
    DOM.routeStart.value = nodeName;
    announceAccessibility(`Selected starting gate: ${nodeName}`);
  } else {
    DOM.routeEnd.value = nodeName;
    announceAccessibility(`Selected destination target: ${nodeName}`);
  }
  
  // Auto calculate
  calculateRoute();
}

function calculateRoute() {
  if (!DOM.routeStart || !DOM.routeEnd || !DOM.routeOption) return null;

  const startName = DOM.routeStart.value;
  const endName = DOM.routeEnd.value;
  const preference = DOM.routeOption.value;
  
  const startCoord = NODE_COORDINATES[startName];
  const endCoord = NODE_COORDINATES[endName];
  
  if (!startCoord || !endCoord) return null;
  
  // Draw path on SVG using a Bezier curve
  const pathElement = document.getElementById('wayfinding-path-line');
  
  // Calculate curved path to look premium (quadratic bezier)
  const mx = (startCoord.x + endCoord.x) / 2;
  const my = (startCoord.y + endCoord.y) / 2;
  // Offset control point to generate pleasant arc curves
  const controlX = mx - (endCoord.y - startCoord.y) * 0.15;
  const controlY = my + (endCoord.x - startCoord.x) * 0.15;
  
  const pathD = `M ${startCoord.x} ${startCoord.y} Q ${controlX} ${controlY} ${endCoord.x} ${endCoord.y}`;
  if (pathElement) pathElement.setAttribute('d', pathD);
  
  // Calculate simulated metrics
  const dx = Math.abs(endCoord.x - startCoord.x);
  const dy = Math.abs(endCoord.y - startCoord.y);
  const distanceFeet = Math.round(Math.sqrt(dx*dx + dy*dy) * 2.5);
  
  let etaMinutes = Math.round(distanceFeet / 220); // standard walking speed
  if (preference === 'accessible') {
    etaMinutes = Math.round(etaMinutes * 1.15); // wheelchair routes take slightly longer paths
  } else if (preference === 'low-crowd') {
    etaMinutes = Math.round(etaMinutes * 1.3); // quiet routing might detour busy gates
  }
  
  // Build dynamic text routing directions
  let routeDirections = `From **${startName}**, walk along the outer security corridor. `;
  if (preference === 'accessible') {
    routeDirections += `Use the low-gradient accessibility ramp at Elevator Bay 1. Proceed on Level 1 flat surface directly to **${endName}**. (No stairs, step-free access).`;
  } else if (preference === 'low-crowd') {
    routeDirections += `Avoid main concourse line 3. Detour via the outer quiet promenade towards the sensory zone. Arrive at **${endName}**.`;
  } else {
    routeDirections += `Take the express escalator at Concourse A. Walk straight towards Block 105 to arrive at **${endName}**.`;
  }

  // Update UI Panels using classes instead of inline style
  if (DOM.routeResultPanel) DOM.routeResultPanel.classList.remove('hidden');
  if (DOM.routeDirections) DOM.routeDirections.textContent = routeDirections;
  if (DOM.routeEta) DOM.routeEta.textContent = `${etaMinutes} min`;
  if (DOM.routeDistance) DOM.routeDistance.textContent = `${distanceFeet} ft`;
  
  const spokenDirections = `Route calculated. Estimated arrival in ${etaMinutes} minutes. Directions: ${routeDirections}`;
  announceAccessibility(spokenDirections);

  return { directions: routeDirections, eta: etaMinutes, distance: distanceFeet };
}

// ==========================================================================
// 5. GENAI CHATBOT ACTIONS
// ==========================================================================
function submitQuickPrompt(promptText) {
  if (DOM.chatTextField) {
    DOM.chatTextField.value = promptText;
    handleChatSubmit();
  }
}

function handleChatSubmit() {
  if (!DOM.chatTextField || !DOM.chatMessagesBox || !DOM.chatLangSelect || !DOM.chatTextField.value.trim()) return;
  
  const query = DOM.chatTextField.value;
  DOM.chatTextField.value = '';
  
  // Render user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble bubble-user';
  userBubble.textContent = query; // Escaped text insertion
  DOM.chatMessagesBox.appendChild(userBubble);
  DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;
  
  // Render placeholder AI bubble for streaming
  const aiBubble = document.createElement('div');
  aiBubble.className = 'chat-bubble bubble-ai';
  aiBubble.textContent = '...';
  DOM.chatMessagesBox.appendChild(aiBubble);
  DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;

  // Retrieve current simulator values for contextual reasoning
  const simState = window.stadiumSimulator ? window.stadiumSimulator.state : {};
  const lang = DOM.chatLangSelect.value;
  
  // Call AI response generation
  setTimeout(() => {
    const responseText = window.stadiumAIEngine.generateResponse(query, lang, simState);
    window.stadiumAIEngine.streamText(responseText, aiBubble, () => {
      announceAccessibility(aiBubble.textContent);
    });
  }, 300);
}

function updateChatLanguage() {
  if (!DOM.chatLangSelect || !DOM.chatMessagesBox) return;
  const lang = DOM.chatLangSelect.value;
  announceAccessibility(`AI assistant language switched to ${lang}.`);
  
  // Stream translation change notice
  const noticeBubble = document.createElement('div');
  noticeBubble.className = 'chat-bubble bubble-ai';
  DOM.chatMessagesBox.appendChild(noticeBubble);
  
  const baseNotices = {
    en: "Language set to English 🇺🇸. Ready for your query.",
    es: "Idioma configurado en Español 🇲🇽. Listo para su consulta.",
    fr: "Langue configurée en Français 🇨🇦. Prêt pour votre question.",
    ar: "تم تعيين اللغة إلى العربية 🇸🇦. جاهز لاستفسارك.",
    de: "Sprache auf Deutsch eingestellt 🇩🇪. Bereit für Ihre Anfrage.",
    ja: "言語を日本語に設定しました 🇯🇵。質問を入力してください。",
    pt: "Idioma definido como Português 🇧🇷. Pronto para sua consulta."
  };
  
  const noticeText = baseNotices[lang] || baseNotices['en'];
  window.stadiumAIEngine.streamText(noticeText, noticeBubble);
}

// ==========================================================================
// 6. SUSTAINABILITY HUB FORM ACTIONS
// ==========================================================================
function calculateCarbonFootprint() {
  const transportEl = document.getElementById('transport-type');
  const travelDistanceEl = document.getElementById('travel-distance');
  const foodChoiceEl = document.getElementById('food-choice');
  const wasteOffsetEl = document.getElementById('waste-offset');
  
  if (!transportEl || !travelDistanceEl || !foodChoiceEl || !wasteOffsetEl) return "0.00";

  const transport = transportEl.value;
  const distVal = travelDistanceEl.value;
  const food = foodChoiceEl.value;
  const waste = wasteOffsetEl.value;
  
  const distance = parseFloat(distVal) || 0;
  
  // Transport coefficients (kg CO2 per mile)
  const transportCoeffs = {
    train: 0.05,
    bus: 0.08,
    carpool: 0.18,
    single: 0.36
  };
  
  // Food emissions (kg CO2)
  const foodEmissions = {
    plant: 0.4,
    chicken: 1.2,
    beef: 4.8
  };
  
  // Waste offsets (kg CO2)
  const wasteOffsets = {
    none: 0,
    basic: 0.5,
    champion: 1.5
  };
  
  // CO2 calculation formula
  const transportTotal = distance * (transportCoeffs[transport] || 0.0);
  const foodTotal = foodEmissions[food] || 0.0;
  const wasteTotal = wasteOffsets[waste] || 0.0;
  
  const totalCO2 = Math.max(0, transportTotal + foodTotal - wasteTotal);
  
  // Update DOM values
  const footprintValue = DOM.carbonFootprintValue || document.getElementById('carbon-footprint-value');
  const footprintDesc = DOM.carbonTierDesc || document.getElementById('carbon-tier-desc');
  const adviceText = DOM.sustainabilityAiAdvice || document.getElementById('sustainability-ai-advice');
  
  if (footprintValue) {
    footprintValue.textContent = totalCO2.toFixed(2);
  }
  
  // Tier definition
  let tier = 'Eco Champion 🟢';
  let className = 'text-primary-color';
  let advice = '';
  
  if (totalCO2 < 3.0) {
    tier = 'Elite Green Fan Level: Elite Champion 🟢';
    className = 'text-primary-color';
    advice = "Exceptional effort! Choosing high-efficiency public transit and plant-based concessions drastically offsets your matchday footprint. MetLife Stadium grants you a 20% Eco-rewards token. Scan at any merchandise stand!";
  } else if (totalCO2 < 10.0) {
    tier = 'Active Green Fan Level: Silver Contender 🟡';
    className = 'text-accent-color';
    advice = "Great work! You are helping reduce emissions. Consider carpooling or trying a green concession next match. Transitioning from beef to chicken dining reduces food emissions by 75%.";
  } else {
    tier = 'High Carbon Footprint Level: Needs Action 🔴';
    className = 'text-danger-color';
    advice = "Your estimated matchday emissions are high. To reduce your impact, we recommend checking the Express Rail shuttle lines. Taking public transit saves on average 0.31 kg CO2 per mile over single occupancy travel.";
  }
  
  if (footprintDesc) {
    footprintDesc.textContent = tier;
    footprintDesc.className = `carbon-metric-tier ${className}`;
  }
  
  if (adviceText) {
    adviceText.textContent = advice;
  }

  return totalCO2.toFixed(2);
}

// ==========================================================================
// 7. SIMULATOR & OPERATIONS UPDATES
// ==========================================================================
function updateDashboardUI(state) {
  // Update Staff metrics if active
  const totalOccupancyVal = DOM.staffOccupancy || document.getElementById('staff-metric-occupancy');
  const waitEtaVal = DOM.staffEta || document.getElementById('staff-metric-eta');
  const activeIncVal = DOM.staffIncidents || document.getElementById('staff-metric-incidents');
  
  if (totalOccupancyVal) totalOccupancyVal.textContent = state.occupancy.toLocaleString();
  
  // Determine peak gate wait times
  let peakWait = 0;
  for (const gate in state.gates) {
    if (state.gates[gate].waitTime > peakWait) {
      peakWait = state.gates[gate].waitTime;
    }
  }
  if (waitEtaVal) {
    waitEtaVal.textContent = `${peakWait} min`;
    waitEtaVal.className = `metric-value-huge ${peakWait > 15 ? 'text-danger-color' : 'text-accent-color'}`;
  }

  // Active Incidents count
  const activeIncidents = state.incidents.filter(inc => !inc.aiResolved);
  if (activeIncVal) {
    activeIncVal.textContent = activeIncidents.length;
    activeIncVal.className = `metric-value-huge ${activeIncidents.length > 0 ? 'text-danger-color' : 'text-primary-color'}`;
  }

  // Update operations list element
  const alertFeed = DOM.alertsFeed || document.getElementById('operations-alerts-feed');
  if (alertFeed) {
    alertFeed.innerHTML = '';
    
    if (state.incidents.length === 0) {
      alertFeed.innerHTML = `<div class="metric-subtext" style="text-align:center;">No active incidents registered. Nominal state.</div>`;
    } else {
      state.incidents.forEach(inc => {
        const row = document.createElement('div');
        row.className = `alert-row ${inc.level}`;
        
        if (inc.aiResolved) {
          row.classList.add('resolved-incident');
        }

        const badgeClass = inc.level === 'critical' ? 'alert-badge-critical' : 'alert-badge-warning';
        const badgeLabel = inc.aiResolved ? 'RESOLVED' : inc.level.toUpperCase();
        
        const cleanTitle = escapeHTML(inc.title);
        const cleanDescription = escapeHTML(inc.description);
        const cleanTimestamp = escapeHTML(inc.timestamp);
        const cleanId = escapeHTML(inc.id);
        const cleanTarget = escapeHTML(inc.target);

        row.innerHTML = `
          <div>
            <span class="badge ${badgeClass}">${badgeLabel}</span>
            <strong>${cleanTitle}</strong>: ${cleanDescription} <small class="metric-subtext" style="display:block; margin-top:2px;">Logged at: ${cleanTimestamp}</small>
          </div>
          <div>
            ${!inc.aiResolved 
              ? `<button class="btn btn-secondary" data-action="resolve-incident" data-incident-id="${cleanId}" data-target-area="${cleanTarget}">AI Resolve Plan</button>` 
              : `<span class="text-primary-color" style="font-weight:700;">🟢 Dispatched</span>`
            }
          </div>
        `;
        alertFeed.appendChild(row);
      });
    }
  }

  // Update Debug context string in assistant view
  const debugContext = DOM.debugPromptContext || document.getElementById('debug-prompt-context');
  if (debugContext) {
    const gateBriefs = Object.keys(state.gates).map(g => `${g.split(' ')[1]}: ${state.gates[g].waitTime}m`).join(' | ');
    debugContext.textContent = `[Context State -> ${gateBriefs} | Active Incident Count: ${activeIncidents.length}]`;
  }
}

// Trigger simulated incidents
function triggerMockIncident(type) {
  if (window.stadiumSimulator) {
    const inc = window.stadiumSimulator.triggerIncident(type);
    if (inc) {
      announceAccessibility(`Alert: New ${inc.level} incident triggered. ${inc.title}.`);
    }
  }
}

// Resolve incidents with AI Planner
function simulateIncidentResponse(incidentId, targetArea) {
  if (window.stadiumSimulator) {
    const resolvedInc = window.stadiumSimulator.resolveIncident(incidentId);
    if (resolvedInc) {
      announceAccessibility(`Dispatching resolving plan for ${resolvedInc.title}.`);
      
      // Show AI Tactical Briefing
      const aiBrief = window.stadiumAIEngine.generateTacticalResponse(targetArea, window.stadiumSimulator.state);
      const briefingContainer = DOM.aiTacticalResponseContainer || document.getElementById('ai-tactical-response-container');
      
      if (briefingContainer) {
        window.stadiumAIEngine.streamText(aiBrief, briefingContainer);
      }
    }
  }
}

function resetSimulatorData() {
  if (window.stadiumSimulator) {
    window.stadiumSimulator.resetState();
  }
  const briefingContainer = DOM.aiTacticalResponseContainer || document.getElementById('ai-tactical-response-container');
  if (briefingContainer) {
    briefingContainer.textContent = "No active critical issues. Stadium operations are stable.";
  }
  announceAccessibility("Stadium simulator state has been reset to nominal parameters.");
}

function requestTacticalBriefing() {
  const briefingContainer = DOM.aiTacticalResponseContainer || document.getElementById('ai-tactical-response-container');
  if (briefingContainer && window.stadiumSimulator) {
    const state = window.stadiumSimulator.state;
    const brief = `📋 **AI Daily Stadium Briefing**:
- Current Crowd: **${state.occupancy}** / 82,500.
- Operations: Nominal load across Gate A, B, C.
- Security Protocol: High alert corridors active near west parking lot.
- Sustainability: Standard Zero-waste target is active. Average recycle score at ${state.sustainability.recyclingRate}%.
Ready for tournament kickoff.`;
    window.stadiumAIEngine.streamText(brief, briefingContainer);
  }
}

// ==========================================================================
// 8. TEST RUNNER TRIGGERS
// ==========================================================================
function runSuiteTests() {
  if (window.qaTestSuite) {
    const btn = DOM.btnRunTests || document.getElementById('btn-run-tests');
    if (btn) btn.disabled = true;
    
    window.qaTestSuite.runAll().then(() => {
      if (btn) btn.disabled = false;
    });
  }
}
