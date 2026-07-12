"use strict";

/**
 * ArenaMind 2026 - Main Application Orchestrator
 * Integrates visual portal switching, sidebar routing links, centralized event delegation,
 * and dependency validation audits.
 */

// Global State Variables on window
window.currentPortalMode = 'fan'; // 'fan' or 'staff'
window.currentActiveTab = 'map';  // 'map', 'assistant', 'sustainability', 'tests'
window.isTextToSpeechActive = false;
window.currentFontSizePercent = 100;

/**
 * Escapes dynamic string values to mitigate DOM-based Cross-Site Scripting (XSS).
 * @param {string} str The raw string to escape.
 * @returns {string} Sanitized string with encoded HTML entities.
 */
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

const initStart = performance.now();

document.addEventListener('DOMContentLoaded', () => {
  // Populate element cache
  populateDOMCache();

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
  if (window.stadiumSimulator) {
    updateDashboardUI(window.stadiumSimulator.state);
  }
  
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

/**
 * Attaches dynamic event listeners and delegations to cached DOM elements.
 * @returns {void}
 */
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

/**
 * Switches application view portals (Fan Mode vs Staff dashboard) and re-populates side navigations.
 * @param {string} mode The portal mode identifier ('fan' or 'staff').
 * @returns {void}
 */
function switchPortalMode(mode) {
  window.currentPortalMode = mode;
  
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

/**
 * Regenerates the side navigation panel buttons layout.
 * @param {Array<{id: string, text: string, label: string}>} links Array of link button descriptors.
 * @returns {void}
 */
function updateSidebarNav(links) {
  const navContainer = document.getElementById('navigation-links');
  if (!navContainer) return;
  
  navContainer.replaceChildren();
  links.forEach(link => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.id = `nav-btn-${link.id}`;
    button.className = `nav-item-btn ${window.currentActiveTab === link.id ? 'active' : ''}`;
    button.setAttribute('data-tab', link.id);
    button.setAttribute('aria-label', link.label);
    button.textContent = link.text;
    
    // Programmatic click handler
    button.addEventListener('click', () => switchTab(link.id));
    
    li.appendChild(button);
    navContainer.appendChild(li);
  });
}

/**
 * Changes active tab selections and reveals corresponding viewport elements.
 * @param {string} tabId The unique tab section ID to show.
 * @returns {void}
 */
function switchTab(tabId) {
  window.currentActiveTab = tabId;
  
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

/**
 * Validates dependencies loading status and logs any missing components warnings.
 * @returns {void}
 */
function checkModuleLoadState() {
  if (!window.qaTestSuite || !window.stadiumSimulator || !window.stadiumAIEngine) {
    const logBox = DOM.testResultsBox || document.getElementById('test-results-box');
    if (logBox) {
      logBox.replaceChildren();
      const div = document.createElement('div');
      div.className = 'test-log-line test-failure';
      div.textContent = '❌ ERROR: Core diagnostic components failed to load (404 Not Found or file path error). Please verify that the \'js/\' folder is accessible and files exist.';
      logBox.appendChild(div);
    }
  }
}
// Bind orchestrator functions to window scope
window.switchPortalMode = switchPortalMode;
window.updateSidebarNav = updateSidebarNav;
window.switchTab = switchTab;
window.checkModuleLoadState = checkModuleLoadState;
