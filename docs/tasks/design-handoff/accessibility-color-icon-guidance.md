# Accessibility Guidance: Color Usage and Icon-Only Controls

Date: 2026-03-31
Applies To: All frontend pages, shared components, and design handoff specs

## 1) Accessible Color Usage

### Contrast Requirements (WCAG 2.2 AA)

- Body text and UI text under 24px regular / 18.66px bold: minimum 4.5:1 contrast.
- Large text (at least 24px regular or 18.66px bold): minimum 3:1 contrast.
- Interactive UI boundaries and state indicators (input borders, button outlines, focus rings, selected rows): minimum 3:1 against adjacent colors.
- Focus indicators must be clearly visible and meet minimum 3:1 contrast against surrounding colors.

### Rules for Product UI

- Do not communicate status with color alone. Pair color with text labels and, where helpful, icons.
- Keep semantic meaning consistent across screens:
  - Success = success token pair
  - Warning = warning token pair
  - Error = danger token pair
  - Info = info token pair
- Do not use low-contrast placeholder-like colors for essential information.
- Disabled controls can be visually muted, but nearby active alternatives must remain clear and discoverable.

### Token Guidance

- Use semantic color tokens first.
- Avoid hardcoded hex values in component/page styles.
- Keep foreground/background pairs documented and reused.

Required token categories:

- Text: strong, default, muted, inverse
- Surface: canvas, elevated, subtle
- Border: default, strong, focus
- Action: primary, secondary, hover, active
- Status: success, warning, danger, info

### Validation Workflow

1. Validate color pairs during design handoff (contrast checker).
2. Validate in implementation (browser accessibility tools).
3. Validate in QA on key flows: login, booking creation, booking management, admin maintenance, admin audit.
4. Reject changes that pass visual review but fail contrast thresholds.

## 2) Guidance for Icon-Only Controls

### When Icon-Only Is Allowed

Use icon-only controls only when the action is globally recognizable and repeated in a dense UI (for example: close, search, filter, overflow menu, sort direction toggle).

If the action is ambiguous, use icon + visible text instead.

### Required Accessibility Rules

- Use semantic interactive elements (`button`, `a`) instead of clickable `div`/`span`.
- Every icon-only control must have an accessible name:
  - `aria-label` or
  - `aria-labelledby` pointing to visible text.
- Decorative SVG/icon content must be hidden from assistive tech with `aria-hidden="true"`.
- Maintain a minimum hit target of 44x44 CSS pixels.
- Provide visible focus styles on keyboard navigation.
- Preserve state semantics where relevant:
  - toggle buttons use `aria-pressed`
  - disclosure buttons use `aria-expanded` + `aria-controls`

### Interaction and Feedback Rules

- Hover style alone is not enough; keyboard focus style is required.
- Keep pointer and keyboard behavior equivalent (Enter/Space for buttons).
- Ensure disabled state is programmatically set (`disabled`, `aria-disabled` when needed).
- Optional tooltip text may help sighted users, but it does not replace an accessible name.

### Implementation Pattern

```jsx
<button
  type="button"
  className="icon-button"
  aria-label="Close dialog"
  onClick={onClose}
>
  <CloseIcon aria-hidden="true" />
</button>
```

### Anti-Patterns to Avoid

- Icon-only clickable `div` with `onClick` and no role.
- Missing accessible name.
- Focus outline removed with no replacement.
- Color-only state indication (for example, only changing icon color to indicate active state).

## 3) Review Checklist (PR and QA)

- [ ] Text and UI contrast thresholds pass.
- [ ] Focus indicator is visible on all keyboard-reachable controls.
- [ ] No essential information conveyed by color alone.
- [ ] Every icon-only control has an accessible name.
- [ ] Icon-only controls meet 44x44 hit target.
- [ ] State attributes (`aria-pressed`, `aria-expanded`, `aria-controls`) are present where applicable.
