/**
 * ArenaMind 2026 - Venue Operations Command Module
 * Governs staff dashboard visual metrics updates, mock simulation incident dispatch,
 * and tactical incident response planner.
 */

"use strict";

/**
 * Updates operations dashboard metric fields and active incidents list.
 * @param {object} state The current live state of the StadiumSimulator.
 * @returns {void}
 */
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
      alertFeed.innerHTML = `<div class="metric-subtext text-center">No active incidents registered. Nominal state.</div>`;
    } else {
      state.incidents.forEach(inc => {
        const row = document.createElement('div');
        row.className = `alert-row ${inc.level}`;
        
        if (inc.aiResolved) {
          row.classList.add('resolved-incident');
        }

        const badgeClass = inc.level === 'critical' ? 'alert-badge-critical' : 'alert-badge-warning';
        const badgeLabel = inc.aiResolved ? 'RESOLVED' : inc.level.toUpperCase();
        
        row.innerHTML = `
          <div>
            <span class="badge ${badgeClass}">${badgeLabel}</span>
            <strong>${escapeHTML(inc.title)}</strong>: ${escapeHTML(inc.description)} <small class="metric-subtext display-block mt-2">Logged at: ${escapeHTML(inc.timestamp)}</small>
          </div>
          <div>
            ${!inc.aiResolved 
              ? `<button class="btn btn-secondary" data-action="resolve-incident" data-incident-id="${escapeHTML(inc.id)}" data-target-area="${escapeHTML(inc.target)}">AI Resolve Plan</button>` 
              : `<span class="text-primary-color font-bold">🟢 Dispatched</span>`
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

/**
 * Triggers a new simulated incident.
 * @param {string} type The category type of the incident to trigger ('gate-c', 'medical', 'concession').
 * @returns {void}
 */
function triggerMockIncident(type) {
  if (window.stadiumSimulator) {
    const inc = window.stadiumSimulator.triggerIncident(type);
    if (inc) {
      announceAccessibility(`Alert: New ${inc.level} incident triggered. ${inc.title}.`);
    }
  }
}

/**
 * Executes a simulated incident response dispatching an AI response.
 * @param {string} incidentId Unique identifier of the target incident.
 * @param {string} targetArea Dynamic location coordinate description of the incident area.
 * @returns {void}
 */
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

/**
 * Resets the simulator engine state to default nominal stadium loads.
 * @returns {void}
 */
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

/**
 * Requests and streams the daily tactical operations briefing.
 * @returns {void}
 */
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

/**
 * Initiates the automated QA diagnostic testing run, temporarily disabling the trigger button.
 * @returns {void}
 */
function runSuiteTests() {
  if (window.qaTestSuite) {
    const btn = DOM.btnRunTests || document.getElementById('btn-run-tests');
    if (btn) btn.disabled = true;
    window.qaTestSuite.runAll().then(() => {
      if (btn) btn.disabled = false;
    });
  }
}

// Bind to window scope
window.updateDashboardUI = updateDashboardUI;
window.triggerMockIncident = triggerMockIncident;
window.simulateIncidentResponse = simulateIncidentResponse;
window.resetSimulatorData = resetSimulatorData;
window.requestTacticalBriefing = requestTacticalBriefing;
window.runSuiteTests = runSuiteTests;
