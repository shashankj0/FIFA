# ArenaMind 2026 - World Cup Stadium Commander & Fan Hub

A high-performance, accessible, and secure digital platform built for **MetLife Stadium (World Cup 2026)** to manage venue operations for staff and provide high-fidelity wayfinding, carbon footprint tracking, and multilingual AI assistance for fans.

---

## ⚽ Chosen Vertical

**Vertical: Smart Stadium Venue Operations & Fan Experience**
- **Target Venue**: MetLife Stadium, configured for FIFA World Cup matches (82,500 seating capacity).
- **Core Goal**: Enhance venue management efficiency (crowd ingress, peak gate wait-time monitoring, security response dispatching) while simultaneously providing fans with step-free accessibility-preferred wayfinding maps, carbon impact tracking, and a translation-capable GenAI concierge.

---

## 🛠️ Architecture & Design Approach

The codebase has been refactored under strict production-grade web guidelines:

### 1. Separation of Concerns & Modular Architecture (Code Quality)
The JavaScript logic has been refactored and decoupled from a single monolithic structure into **7 domain-specific modules** loaded sequentially in `index.html`:
- **`js/dom-cache.js`**: Declares and populates the global `DOM` cached element reference selectors to eliminate repeated DOM query overhead.
- **`js/accessibility.js`**: Governs contrast theme toggles, font scaling utilities, text-to-speech helpers, and screen reader announcements.
- **`js/wayfinding.js`**: Coordinates SVG gate mapping, active node selections, and Bezier route calculations.
- **`js/chat.js`**: Executes recommended prompt quick chips and manual chatbot query dialogs.
- **`js/sustainability.js`**: Calculates matchday carbon footprint metrics using transportation and concession variables, categorized by constants.
- **`js/operations.js`**: Updates operations console queues and lists, triggering mock simulator incidents.
- **`js/app.js`**: Coordinates state, binds dynamic page event listeners at load, and orchestrates portal switches.

Every top-level function across all `.js` scripts is documented using standard **JSDoc blocks** mapping parameter types and returns. Magic numbers/strings have been extracted to constants (e.g. `GATE_C_CONGESTED_WAIT`, `GATE_C_RESOLVED_WAIT` in `simulator.js`, `CARBON_TIER_THRESHOLDS` in `sustainability.js`, and `STREAM_INTERVAL_MS` in `ai-engine.js`).

### 2. High-Performance Text Rendering (Efficiency)
- **rAF Metered Loops**: Text-streaming logic inside `ai-engine.js` has been converted from a heavy `setInterval` timer to a `requestAnimationFrame` delta-time loop. This aligns writing execution frame rates directly with browser refresh cycles, eliminating layout thrashing and CPU spikes.

### 3. Accessible Interactive Maps (WCAG 2.1 Compliance)
- **Keyboard Wayfinding**: Added programmatic event hooks tracking `Enter` and `Space` key presses on all SVG gate and facility group elements (`.interactive-map-node`), making wayfinding controls completely keyboard-operable.
- **Landmarking**: Added explicit landmark roles (`role="banner"`, `role="main"`, etc.), labels matching inputs (`label[for]`), and unique DOM identifier constraints.

### 4. Defense-in-Depth Auditing (Security)
- **XSS Sanitization**: Dynamic HTML markup additions (such as simulator alerts or messages) are automatically sanitized using a global `escapeHTML` helper to encode text structures before `.innerHTML` insertion.
- **Content-Security-Policy (CSP)**: Added a strict CSP meta tag to the document head to block unauthorized inline script injections at the browser level.
- **Active Static Scan Audits (Hardened)**: The security diagnostic suite fetches runtime scripts and scans for forbidden executions (`eval`/`Function`) and verifies that *all* dynamic variables inside innerHTML templates are fully wrapped in `escapeHTML()` (blocked by regex check `^escapeHTML\([^)]*\)$` if any raw concatenated parts exist).
- **State Hygiene Audit**: Scans `localStorage` keys for unencrypted plaintext credential leaks.
- **CSP Protection Audit**: Verifies that the CSP meta tag exists in the document and contains the `default-src` directive.

---

## 🚀 How the Solution Works

### Solution Diagram
```
[index.html Page Load]
         │
         ▼
[DOM Caching & Listener Binding]
         │
         ▼
[Check Module Load State]
         │
         ▼
  [Portal Selector]
   ├──► Fan Mode  ──► Stadium Navigation Map & Route Bezier Curve
   │              ──► Carbon Footprint Calculator
   │              ──► GenAI Concierge Chatbot
   │
   └──► Staff Mode ──► Operations Dashboard Metric Analytics
                   ──► Mock Incident Dispatcher
         │
         ▼
  [QA Testing Center] ──► In-browser Unit, Accessibility, Security & Performance Profiler
```

### 1. Fan Navigation & Carbon Tracker
- Interactive SVG nodes allow fans to click or tab-focus points. Selecting a node calculates a custom curved Bezier path matching their routing options (Flat-surface Step-free accessible pathing, low-crowd pathing, or express pathing).
- The carbon tracker monitors transport, distance, food choice, and waste management parameters to return exact CO2 emission weights and dynamic recommendations.

### 2. Staff Dashboard & Simulator
- Monitors real-time occupancy, gate queue latency times, and critical incidents.
- Operations alerts let staff dispatch resolution protocols, invoking the AI tactical engine to render coordinates, briefings, and maps.

### 3. Automated Diagnostics Suite
- Evaluates four independent audit modules:
  1. **Unit & Integration**: Runs 9 comprehensive assertions that call the real functions and validate their return state (Simulator initialization, AI intent mapping keyword checks, Carbon formula accuracy, Wayfinding algorithms, Tab-focus portal switching toggles, simulator Incident dispatch resolution round-trips, dynamic language switcher notices, accessibility preference toggle states, and negative distance boundaries).
  2. **Accessibility**: Audits landmarks, inputs, focusability index, and duplicate DOM IDs.
  3. **Security**: Runs sandboxing, storage hygiene, dynamic XSS escaping sweeps, and static scan audits for unescaped template string variables in `.innerHTML` assignments.
  4. **Performance**: Measures load speeds and rendering complexity density.

---

## 📝 Assumptions Made

1. **CORS Protocol Handling**: Since standard file fetching (`fetch()`) is blocked under local `file://` protocols by modern browser security policies, static code scanner checks dynamically fallback to global window object inspections (e.g. checking native signatures of `eval.toString()`) to ensure tests run seamlessly on local files.
2. **Plaintext Storage Key Signatures**: Assumes standard credential patterns (`auth`, `token`, `password`, `key`) represent leak targets. The scanner validates these signatures and asserts they do not store plaintext values length > 5.
3. **Escaping Identifiers**: Assumes dynamic variables inside `.innerHTML` should be explicitly wrapped in `escapeHTML()` or checked against a whitelist of static template classes (like `badgeClass`, `badgeLabel`, etc.) to qualify as secure.
