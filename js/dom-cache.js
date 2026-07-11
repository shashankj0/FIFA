"use strict";

/**
 * ArenaMind 2026 - DOM Element Reference Caching Module
 * Centralizes DOM lookups to minimize duplicate traversals and layout query overhead.
 */

/**
 * Centralized object holding cached DOM element references.
 * @type {Object<string, HTMLElement>}
 */
let DOM = {};
window.DOM = DOM;

/**
 * Queries and caches DOM element references inside the global DOM object.
 * @returns {void}
 */
function populateDOMCache() {
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
  window.DOM = DOM;
}

window.populateDOMCache = populateDOMCache;
