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

### 1. Separation of Concerns (Code Quality)
- **Zero Inline Styles**: All dynamic elements and layout rules are completely decoupled from HTML markup and standard CSS classes. Style definitions have been refactored into utility variables inside `style.css`.
- **Programmatic Event Binding**: Removed all inline `onclick`, `onsubmit`, `onchange`, and `oninput` handlers. The application lifecycle is governed programmatically inside `app.js` using standard DOM event listeners registered at `DOMContentLoaded`.
- **DOM Reference Caching**: Element selectors are indexed in a centralized `DOM` dictionary on load to minimize expensive DOM lookups.

### 2. High-Performance Text Rendering (Efficiency)
- **rAF Metered Loops**: Text-streaming logic inside `ai-engine.js` has been converted from a heavy `setInterval` timer to a `requestAnimationFrame` delta-time loop. This aligns writing execution frame rates directly with browser refresh cycles, eliminating layout thrashing and CPU spikes.

### 3. Accessible Interactive Maps (WCAG 2.1 Compliance)
- **Keyboard Wayfinding**: Added programmatic event hooks tracking `Enter` and `Space` key presses on all SVG gate and facility group elements (`.interactive-map-node`), making wayfinding controls completely keyboard-operable.
- **Landmarking**: Added explicit landmark roles (`role="banner"`, `role="main"`, etc.), labels matching inputs (`label[for]`), and unique DOM identifier constraints.

### 4. Defense-in-Depth Auditing (Security)
- **XSS Sanitization**: Dynamic HTML markup additions (such as simulator alerts or messages) are automatically sanitized using a global `escapeHTML` helper to encode text structures before `.innerHTML` insertion.
- **Active Static Scan Audits**: The bundled security diagnostic suite performs real-time static code fetching and scanning of runtime files to detect forbidden executions (like `eval()` or `new Function()`) and checks for unescaped template string interpolations in `.innerHTML` statements.
- **State Hygiene Audit**: The scanner reviews `localStorage` key-value pairs to detect plaintext sensitive structures (e.g. `token`, `secret`, `password`) leaking into unencrypted web storage.

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
