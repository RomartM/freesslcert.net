---
name: accessibility-deep
description: >
  WCAG 2.2 AA compliance, ARIA patterns, screen reader support, and keyboard
  navigation. Trigger for any accessibility, ARIA, or a11y work.
---

# Accessibility (WCAG 2.2 AA)

## Official Documentation
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core](https://github.com/dequelabs/axe-core)

## Key Patterns
- **Semantic HTML first**: Use native elements (`button`, `nav`, `main`) before ARIA roles
- **Keyboard navigation**: All interactive elements reachable and operable via keyboard
- **Focus management**: Visible focus indicators; logical tab order; trap focus in modals
- **Color contrast**: 4.5:1 for normal text; 3:1 for large text; never color-only indicators
- **Screen reader**: Meaningful `alt` text; `aria-label` for icon-only buttons; live regions for updates
- **Forms**: Every input has a visible `<label>`; errors linked with `aria-describedby`
- **Headings**: Proper hierarchy (h1 → h2 → h3); never skip levels
- **Motion**: Respect `prefers-reduced-motion`; provide controls for animations
- **Testing**: axe-core in CI; manual screen reader testing (VoiceOver, NVDA) for critical flows
- **Skip links**: "Skip to main content" link as first focusable element

## Anti-Patterns
- Do NOT use `div` or `span` for interactive elements; use `button` or `a`
- Do NOT remove focus outlines without providing an alternative indicator
- Do NOT use ARIA when native HTML semantics suffice
- Do NOT rely solely on color to convey information
- Do NOT auto-play audio or video without user control
