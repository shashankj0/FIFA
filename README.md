# ArenaMind 2026 - World Cup Stadium Commander & Fan Hub

A high-performance, accessible, and secure digital platform built for **MetLife Stadium (World Cup 2026)** to manage venue operations for staff and provide high-fidelity wayfinding, carbon footprint tracking, and multilingual AI assistance for fans.

---

## 🏗️ Architecture & Component Design

```
                   +-----------------------+
                   |      index.html       |
                   |   (DOM View & CSP)    |
                   +-----------+-----------+
                               |
            +------------------+------------------+
            |                  |                  |
            ▼                  ▼                  ▼
   +-----------------+ +-----------------+ +-----------------+
   |   js/app.js     | |  js/dom-cache.js  | |  js/qa-tests.js |
   | (Controller/    | | (Cached DOM Look- | |  (Automated QA  |
   | Event Binding)  | |  up Selectors)    | |  Diagnostics)  |
   +--------+--------+ +-----------------+ +-----------------+
            |
            +-------------+-------------+-------------+
            |             |             |             |
            ▼             ▼             ▼             ▼
   +-----------------+ +---------+ +-----------+ +------------+
   | js/wayfinding.js| |js/chat.  | |js/sustain-| |js/opera-   |
   | (Bezier Paths & | |   js    | | ability.js| |  tions.js  |
   |  Step-free Map) | |(Concier-| | (Carbon   | | (Dashboard |
   +-----------------+ | ge/Chips| |  Emissions| |  Console & |
                       +----+----+ | Calculator| |  Simulator)|
                            |      +-----------+ +------------+
                            ▼
                   +-----------------+
                   | js/ai-engine.js |
                   | (Intents Classifier
                   |  & text stream) |
                   +-----------------+
```

---

## 📂 Folder Structure

```
ArenaMind-2026/
│
├── .github/                      # GitHub integrations
│   ├── ISSUE_TEMPLATE/           # Structured issue reporting forms
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── pull_request_template.md  # Quality checklist for PR submissions
│   └── workflows/
│       └── ci.yml                # CI automation pipelines
│
├── js/                           # JavaScript application modules
│   ├── accessibility.js          # Speech & text accessibility control overrides
│   ├── ai-engine.js              # NLP intents parser & metered text streaming
│   ├── app.js                    # Main page events and views coordinator
│   ├── chat.js                   # Concierge chip choices & query controller
│   ├── dom-cache.js              # Centralized DOM elements references map
│   ├── operations.js             # Staff dashboard and resolved metrics updater
│   ├── qa-tests.js               # Diagnostics test suite checks definitions
│   ├── simulator.js              # Incident loads fluctuations emulator
│   ├── sustainability.js         # Carbon calculator footprint coefficients
│   └── wayfinding.js             # SVG Bezier maps calculations & route planning
│
├── .editorconfig                 # IDE style guidelines configs
├── CHANGELOG.md                  # Release version updates record log
├── CONTRIBUTING.md               # Code contribution guides
├── index.html                    # Layout structure view and CSP metadata
├── LICENSE                       # MIT License copy
├── README.md                     # Technical architecture documentation
├── SECURITY.md                   # Security disclosures policies
└── style.css                     # Stylings tokens and high-contrast sheets
```

---

## 📋 Feature Matrix

| Portal / Module | Feature | Target Audience | Primary Technical Stack |
| :--- | :--- | :--- | :--- |
| **Fan Hub** | Step-free SVG Wayfinding | Accessibility-focused Fans | SVG coordinates parsing, Bezier curve mapping |
| **Fan Hub** | Multilingual GenAI Assistant | International Spectators | Keyword intent classification (6 languages), delta-time rAF loop text streaming |
| **Fan Hub** | Carbon footprint calculator | Eco-conscious Spectators | Travel mileage coefficients, dining emissions mapping, recycling offset subtraction |
| **Staff Console**| Live Occupancy & Gate wait times | Venue managers & Staff | Stadium occupancy counters, gate bottleneck wait times calculations |
| **Staff Console**| Simulated Incident dispatcher | Venue managers & Staff | Custom browser event dispatching (`stadiumUpdate`) |
| **Staff Console**| AI Tactical Commander | Venue managers & Staff | Scenario tactical guidelines output streaming |
| **QA Diagnostics**| Automated Audit Suite | Developers & Auditors | In-browser unit assertions, security checks, accessibility scans |

---

## 🔒 Security Architecture

1. **Content-Security-Policy (CSP)**:
   - Configured with high-rigor constraints (`default-src 'self'`).
   - Disables `'unsafe-inline'` styles entirely.
   - Restricts plugin injections using `object-src 'none'` and frames embedding using `frame-ancestors 'none'`.
2. **Security Headers Meta Equivalents**:
   - `Referrer-Policy: no-referrer` prevents leakage of URL structures to third parties.
   - `X-Frame-Options: DENY` protects the page from Clickjacking frame attacks.
   - `X-Content-Type-Options: nosniff` forces strict MIME compliance.
   - `Permissions-Policy` locks down microphone, camera, and geolocation sensors.
3. **OWASP DOM Protection (Zero-innerHTML)**:
   - Programmatically builds all dynamic elements using `createElement()` and `.textContent` rather than `.innerHTML` string assignments.
   - Uses `.replaceChildren()` for secure container clearing.
4. **Input Length Truncation**:
   - Chat queries are truncated to a maximum of 200 characters defensively to prevent buffer allocation overheads and Denial of Service (DoS).
   - Distance mileage parameters are bounded programmatically between 0 and 300 miles.

---

## ♿ Accessibility Guidelines (WCAG 2.2 AA Compliance)

1. **High Contrast Focus**:
   - High contrast mode forces text colors to `#ffffff` and backgrounds to `#000000` (contrast ratio of $\ge 7:1$), satisfying WCAG 2.2 AAA standards.
2. **Interactive Elements Access**:
   - All interactive paths and POI map nodes feature explicit `tabindex="0"` and `role="button"` properties.
   - Handlers respond dynamically to both `Enter` and `Space` keyboard actions.
3. **Screen Reader Support**:
   - Descriptive `aria-label` tags are attached to zoom controls, portal toggles, and language pickers.
   - An active screen-reader announcer (`#sr-announcer`) with `aria-live="polite"` broadcasts navigation switches, language choices, and wayfinding calculations dynamically.
4. **Reduced Motion**:
   - Implements `@media (prefers-reduced-motion: reduce)` to disable transitions and SVG translations for motion-sensitive users.

---

## ⚡ Performance Optimizations

1. **rAF Metered Streams**:
   - Text writing utilizes `requestAnimationFrame` delta-time tracking to meter out words. This synchronizes operations with screen paint cycles, avoiding layout thrashing.
2. **Centralized DOM Caching**:
   - Centralizes all selector cache references in `DOM` to avoid redundant traversals.
3. **replaceChildren() API**:
   - Uses `replaceChildren()` rather than `.innerHTML = ""` for DOM clear actions, avoiding HTML parsing cycles.

---

## 🧪 Testing Strategy

1. **Unit & Logic Assertions**:
   - Validates mathematical carbon estimates (including boundary edge-cases).
   - Asserts wayfinding coordinate calculations and eta modifiers.
   - Checks simulator state updates and incident dispatches.
2. **Accessibility Audits**:
   - Scans DOM trees for landmark roles (`role="main"`, etc.).
   - Asserts all form input nodes have an associated `<label for="...">` element.
   - Audits DOM nodes for unique identifier IDs.
3. **Security Audits**:
   - Fetches runtime files dynamically and scans content signatures for forbidden dynamic executors (`eval` and `Function`).
   - Asserts localStorage contains no plain-text secret variables.
   - Validates CSP headers presence in the document head.

---

## 🚀 Deployment Guide

1. **Local Access**:
   - Simply download the project files and open `index.html` in any modern web browser.
2. **Server Access**:
   - Deploy the folder containing the project files directly to any static file hosting service (e.g. GitHub Pages, Netlify, Vercel, or AWS S3).
   - Ensure the server sets standard security headers (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) at the network layer for maximum defense-in-depth.
