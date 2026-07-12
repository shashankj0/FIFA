# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-12

### Added
- Enterprise-grade Content-Security-Policy (CSP) headers, including `object-src 'none'` and `frame-ancestors 'none'`.
- Referrer policy and frame options metadata in the header.
- Explicit `aria-label` tags for text size adjustment and theme toggle buttons.
- Modern `@media (prefers-reduced-motion: reduce)` CSS block to neutralize animations and transitions.
- MIT License, EditorConfig, Security disclosures, Contribution guidelines, and Issue/PR templates.
- Multilingual keywords mapping for GenAI intent classification in Spanish, French, German, Arabic, Japanese, and Portuguese.

### Changed
- Replaced all innerHTML operations with secure DOM APIs (`replaceChildren()`, `createElement()`, `appendChild()`).
- Addressed medical context typos and added input validation bounds.

## [1.0.0] - 2026-07-11

### Added
- Initial modularization of stadium features: wayfinding, sustainability tracker, concierge, and operations command console.
- Automated QA testing suite with in-browser audit panels.
