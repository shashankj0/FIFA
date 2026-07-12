# Contributing to ArenaMind 2026

We welcome contributions to optimize stadium venue operations and fan experience. To maintain high code quality, security, and accessibility standards, please follow these guidelines.

## Code of Conduct

Please be respectful, helpful, and professional in all interactions.

## How to Contribute

1. **Find an Issue**: Search our open issues or create a new one to discuss your ideas.
2. **Fork and Branch**: Fork the repository and create a branch using the naming convention `feature/your-feature` or `bugfix/your-fix`.
3. **Write Code**:
   - Write clean, JSDoc-annotated JavaScript.
   - Enforce `"use strict";` in all new scripts.
   - Avoid `.innerHTML` assignments; build DOM structures programmatically.
   - Ensure color combinations satisfy WCAG 2.2 AA guidelines (contrast ratio >= 4.5:1).
4. **Run Diagnostics**: Open `index.html` and run the diagnostic test suite to ensure all 4 modules (Unit, Accessibility, Security, Performance) score 100%.
5. **Submit a PR**: Submit a Pull Request (PR) detailing your modifications against the `main` branch.
