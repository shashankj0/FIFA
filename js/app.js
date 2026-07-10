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

// ==========================================================================
// 1. INITIALIZATION
// ==========================================================================
const initStart = performance.now();
document.addEventListener('DOMContentLoaded', () => {
  // Listen for simulator updates
  window.addEventListener('stadiumUpdate', (e) => {
    updateDashboardUI(e.detail);
  });

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

  announceAccessibility("ArenaMind 2026 World Cup Operations Dashboard fully loaded.");
  
  window.appInitDuration = performance.now() - initStart;
});

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
  
  const btnFan = document.getElementById('btn-mode-fan');
  const btnStaff = document.getElementById('btn-mode-staff');
  
  if (mode === 'fan') {
    btnFan.classList.add('active');
    btnStaff.classList.remove('active');
    
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
    btnFan.classList.remove('active');
    btnStaff.classList.add('active');
    
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
    button.setAttribute('onclick', `switchTab('${link.id}')`);
    button.setAttribute('aria-label', link.label);
    button.textContent = link.text;
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
  const btn = document.getElementById('btn-contrast-toggle');
  
  if (isActive) {
    btn.textContent = '☀️ Normal Contrast';
    announceAccessibility("High contrast mode enabled.");
  } else {
    btn.textContent = '🌗 High Contrast Mode';
    announceAccessibility("High contrast mode disabled.");
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
  const btn = document.getElementById('btn-speech-toggle');
  
  if (isTextToSpeechActive) {
    btn.textContent = '🔇 Text-to-Speech (On)';
    btn.classList.add('active');
    announceAccessibility("Text to speech navigation aids activated.");
  } else {
    btn.textContent = '🔊 Text-to-Speech (Off)';
    btn.classList.remove('active');
    // Stop any ongoing speaking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// ==========================================================================
// 4. WAYFINDING & SVG MAPPING
// ==========================================================================
function selectMapNode(nodeName) {
  const startSelect = document.getElementById('route-start');
  const endSelect = document.getElementById('route-end');
  
  // Decide start or destination selection logic
  if (nodeName.includes('Gate')) {
    startSelect.value = nodeName;
    announceAccessibility(`Selected starting gate: ${nodeName}`);
  } else {
    endSelect.value = nodeName;
    announceAccessibility(`Selected destination target: ${nodeName}`);
  }
  
  // Auto calculate
  calculateRoute();
}

function calculateRoute() {
  const startName = document.getElementById('route-start').value;
  const endName = document.getElementById('route-end').value;
  const preference = document.getElementById('route-option').value;
  
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
  pathElement.setAttribute('d', pathD);
  
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

  // Update UI Panels
  const resultPanel = document.getElementById('route-result-panel');
  const directionsText = document.getElementById('route-directions');
  const etaText = document.getElementById('route-eta');
  const distanceText = document.getElementById('route-distance');
  
  resultPanel.style.display = 'block';
  directionsText.textContent = routeDirections;
  etaText.textContent = `${etaMinutes} min`;
  distanceText.textContent = `${distanceFeet} ft`;
  
  const spokenDirections = `Route calculated. Estimated arrival in ${etaMinutes} minutes. Directions: ${routeDirections}`;
  announceAccessibility(spokenDirections);

  return { directions: routeDirections, eta: etaMinutes, distance: distanceFeet };
}

// ==========================================================================
// 5. GENAI CHATBOT ACTIONS
// ==========================================================================
function submitQuickPrompt(promptText) {
  const textInput = document.getElementById('chat-text-field');
  if (textInput) {
    textInput.value = promptText;
    handleChatSubmit();
  }
}

function handleChatSubmit() {
  const textInput = document.getElementById('chat-text-field');
  const chatMsgBox = document.getElementById('chat-messages-box');
  const lang = document.getElementById('chat-lang-select').value;
  
  if (!textInput || !chatMsgBox || !textInput.value.trim()) return;
  
  const query = textInput.value;
  textInput.value = '';
  
  // Render user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble bubble-user';
  userBubble.textContent = query; // Escaped text insertion
  chatMsgBox.appendChild(userBubble);
  chatMsgBox.scrollTop = chatMsgBox.scrollHeight;
  
  // Render placeholder AI bubble for streaming
  const aiBubble = document.createElement('div');
  aiBubble.className = 'chat-bubble bubble-ai';
  aiBubble.textContent = '...';
  chatMsgBox.appendChild(aiBubble);
  chatMsgBox.scrollTop = chatMsgBox.scrollHeight;

  // Retrieve current simulator values for contextual reasoning
  const simState = window.stadiumSimulator ? window.stadiumSimulator.state : {};
  
  // Call AI response generation
  setTimeout(() => {
    const responseText = window.stadiumAIEngine.generateResponse(query, lang, simState);
    window.stadiumAIEngine.streamText(responseText, aiBubble, () => {
      announceAccessibility(aiBubble.textContent);
    });
  }, 300);
}

function updateChatLanguage() {
  const lang = document.getElementById('chat-lang-select').value;
  announceAccessibility(`AI assistant language switched to ${lang}.`);
  
  // Stream translation change notice
  const chatMsgBox = document.getElementById('chat-messages-box');
  const noticeBubble = document.createElement('div');
  noticeBubble.className = 'chat-bubble bubble-ai';
  chatMsgBox.appendChild(noticeBubble);
  
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
  const transport = document.getElementById('transport-type').value;
  const distVal = document.getElementById('travel-distance').value;
  const food = document.getElementById('food-choice').value;
  const waste = document.getElementById('waste-offset').value;
  
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
  const footprintValue = document.getElementById('carbon-footprint-value');
  const footprintDesc = document.getElementById('carbon-tier-desc');
  const adviceText = document.getElementById('sustainability-ai-advice');
  
  if (footprintValue) {
    footprintValue.textContent = totalCO2.toFixed(2);
  }
  
  // Tier definition
  let tier = 'Eco Champion 🟢';
  let color = 'var(--color-primary)';
  let advice = '';
  
  if (totalCO2 < 3.0) {
    tier = 'Elite Green Fan Level: Elite Champion 🟢';
    color = 'var(--color-primary)';
    advice = "Exceptional effort! Choosing high-efficiency public transit and plant-based concessions drastically offsets your matchday footprint. MetLife Stadium grants you a 20% Eco-rewards token. Scan at any merchandise stand!";
  } else if (totalCO2 < 10.0) {
    tier = 'Active Green Fan Level: Silver Contender 🟡';
    color = 'var(--color-accent)';
    advice = "Great work! You are helping reduce emissions. Consider carpooling or trying a green concession next match. Transitioning from beef to chicken dining reduces food emissions by 75%.";
  } else {
    tier = 'High Carbon Footprint Level: Needs Action 🔴';
    color = 'var(--color-danger)';
    advice = "Your estimated matchday emissions are high. To reduce your impact, we recommend checking the Express Rail shuttle lines. Taking public transit saves on average 0.31 kg CO2 per mile over single occupancy travel.";
  }
  
  if (footprintDesc) {
    footprintDesc.textContent = tier;
    footprintDesc.style.color = color;
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
  const totalOccupancyVal = document.getElementById('staff-metric-occupancy');
  const waitEtaVal = document.getElementById('staff-metric-eta');
  const activeIncVal = document.getElementById('staff-metric-incidents');
  
  if (totalOccupancyVal) totalOccupancyVal.textContent = state.occupancy.toLocaleString();
  
  // Determine peak gate wait times
  let peakWait = 0;
  let peakGate = '';
  for (const gate in state.gates) {
    if (state.gates[gate].waitTime > peakWait) {
      peakWait = state.gates[gate].waitTime;
      peakGate = gate;
    }
  }
  if (waitEtaVal) {
    waitEtaVal.textContent = `${peakWait} min`;
    waitEtaVal.style.color = peakWait > 15 ? 'var(--color-danger)' : 'var(--color-accent)';
  }

  // Active Incidents count
  const activeIncidents = state.incidents.filter(inc => !inc.aiResolved);
  if (activeIncVal) {
    activeIncVal.textContent = activeIncidents.length;
    activeIncVal.style.color = activeIncidents.length > 0 ? 'var(--color-danger)' : 'var(--text-primary)';
  }

  // Update operations list element
  const alertFeed = document.getElementById('operations-alerts-feed');
  if (alertFeed) {
    alertFeed.innerHTML = '';
    
    if (state.incidents.length === 0) {
      alertFeed.innerHTML = `<div style="padding:var(--spacing-md); text-align:center; color:var(--text-muted);">No active incidents registered. Nominal state.</div>`;
    } else {
      state.incidents.forEach(inc => {
        const row = document.createElement('div');
        row.className = `alert-row ${inc.level} ${inc.aiResolved ? 'resolved' : ''}`;
        
        if (inc.aiResolved) {
          row.style.opacity = '0.6';
          row.style.borderLeft = '4px solid var(--color-primary)';
        }

        const badgeClass = inc.level === 'critical' ? 'alert-badge-critical' : 'alert-badge-warning';
        const badgeLabel = inc.aiResolved ? 'RESOLVED' : inc.level.toUpperCase();
        
        row.innerHTML = `
          <div>
            <span class="badge ${badgeClass}" style="margin-right:8px;">${badgeLabel}</span>
            <strong>${inc.title}</strong>: ${inc.description} <small style="display:block; color:var(--text-muted); margin-top:2px;">Logged at: ${inc.timestamp}</small>
          </div>
          <div>
            ${!inc.aiResolved 
              ? `<button class="btn btn-secondary" onclick="simulateIncidentResponse('${inc.id}', '${inc.target}')">AI Resolve Plan</button>` 
              : `<span style="color:var(--color-primary); font-weight:700;">🟢 Dispatched</span>`
            }
          </div>
        `;
        alertFeed.appendChild(row);
      });
    }
  }

  // Update Debug context string in assistant view
  const debugContext = document.getElementById('debug-prompt-context');
  if (debugContext) {
    const gateBriefs = Object.keys(state.gates).map(g => `${g.split(' ')[1]}: ${state.gates[g].waitTime}m`).join(' | ');
    debugContext.textContent = `[Context State -> ${gateBriefs} | Active Incident Count: ${activeIncidents.length}]`;
  }
}

// Trigger simulated incidents
function triggerMockIncident(type) {
  const inc = window.stadiumSimulator.triggerIncident(type);
  if (inc) {
    announceAccessibility(`Alert: New ${inc.level} incident triggered. ${inc.title}.`);
  }
}

// Resolve incidents with AI Planner
function simulateIncidentResponse(incidentId, targetArea) {
  const resolvedInc = window.stadiumSimulator.resolveIncident(incidentId);
  if (resolvedInc) {
    announceAccessibility(`Dispatching resolving plan for ${resolvedInc.title}.`);
    
    // Show AI Tactical Briefing
    const aiBrief = window.stadiumAIEngine.generateTacticalResponse(targetArea, window.stadiumSimulator.state);
    const briefingContainer = document.getElementById('ai-tactical-response-container');
    
    if (briefingContainer) {
      window.stadiumAIEngine.streamText(aiBrief, briefingContainer);
    }
  }
}

function resetSimulatorData() {
  window.stadiumSimulator.resetState();
  const briefingContainer = document.getElementById('ai-tactical-response-container');
  if (briefingContainer) {
    briefingContainer.textContent = "No active critical issues. Stadium operations are stable.";
  }
  announceAccessibility("Stadium simulator state has been reset to nominal parameters.");
}

function requestTacticalBriefing() {
  const briefingContainer = document.getElementById('ai-tactical-response-container');
  if (briefingContainer) {
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
    const btn = document.getElementById('btn-run-tests');
    if (btn) btn.disabled = true;
    
    window.qaTestSuite.runAll().then(() => {
      if (btn) btn.disabled = false;
    });
  }
}
