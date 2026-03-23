---
name: ux-design-system
description: >
  Enterprise and customer-facing UI/UX design system following Apple Human Interface Guidelines.
  Component library standards, design tokens, accessibility patterns, responsive layouts, and
  interaction design. Use whenever discussing UI patterns, design tokens, component architecture,
  visual consistency, or interface quality.
---

# UX Design System Skill

## Official Documentation (ALWAYS check first)
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/
- WCAG 2.1: https://www.w3.org/TR/WCAG21/
- WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/
- Tailwind CSS: https://tailwindcss.com/docs
- Radix UI (headless): https://www.radix-ui.com/docs/primitives

## Design Tokens (source of truth)

All design values must be defined as tokens, not hardcoded:
```
colors/       -> Brand, neutral, semantic (success/error/warning/info)
spacing/      -> 4px grid scale (4, 8, 12, 16, 24, 32, 48, 64)
typography/   -> Font family, size scale, weight scale, line heights
shadows/      -> Elevation levels (sm, md, lg, xl)
radii/        -> Border radius scale (sm: 4px, md: 8px, lg: 12px, full)
breakpoints/  -> 640, 768, 1024, 1280, 1536
animation/    -> Duration scale, easing curves
```

## Component Quality Checklist
Every component must have:
- [ ] All interaction states (default, hover, active, focus, disabled)
- [ ] Keyboard navigable
- [ ] Screen reader accessible (ARIA labels)
- [ ] Responsive at all breakpoints
- [ ] Dark mode support (if applicable)
- [ ] Loading/skeleton state
- [ ] Error state
- [ ] Empty state
- [ ] Documentation with usage examples

## Accessibility Non-Negotiables
- 4.5:1 contrast for normal text, 3:1 for large text
- All images have alt text
- All form inputs have labels
- Focus visible on all interactive elements
- Skip navigation link
- Logical tab order
- `prefers-reduced-motion` respected

## Anti-Patterns
- Do NOT mix icon libraries; use one consistently (e.g., Lucide)
- Do NOT use custom colors outside the design token system
- Do NOT create one-off component variants; extend the design system
- Do NOT show raw technical errors to users; translate to human-friendly messages
- Do NOT ignore loading and empty states; they are part of the design
