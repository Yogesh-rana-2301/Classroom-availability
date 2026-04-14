# Token Governance: Naming Conventions and Usage Rules

Date: 2026-03-30
Applies To: Frontend design tokens and component styling

## Naming Conventions

### Global Format

- CSS variable format: `--ca-{domain}-{scope}-{name}`
- Prefix `ca` is mandatory for all project tokens.
- Use lowercase kebab-case only.

Examples:

- `--ca-color-bg-surface`
- `--ca-space-4`
- `--ca-radius-md`
- `--ca-shadow-2`
- `--ca-motion-duration-fast`

### Domain Vocabulary

- `color`: visual colors
- `space`: spacing scale
- `radius`: corner radius scale
- `shadow`: elevation/focus shadows
- `motion`: duration/easing curves
- `z`: stacking order
- `breakpoint`: responsive breakpoints

### Scope Vocabulary

- Primitive scale values:
  - color scales: `blue-800`, `slate-200`, etc.
  - numeric scales: `1`, `2`, `3`, etc. for spacing
- Semantic intent values:
  - backgrounds: `bg-canvas`, `bg-surface`
  - text: `text-strong`, `text-muted`
  - actions: `action-primary-bg`
  - status: `status-success-bg`, `status-danger-text`

## Usage Rules

### Rule 1: Semantic-First Consumption

- Components must consume semantic tokens, not raw primitives.
- Exception: token definition files may reference primitive aliases.

Allowed:

```css
color: var(--ca-color-text-default);
```

Avoid in components:

```css
color: var(--ca-color-slate-700);
```

### Rule 2: No Raw Values in Component Styles

- Do not use hardcoded hex, pixel, rem, ms, or cubic-bezier values inside component CSS.
- Use token variables for all style values that are part of system behavior.

Avoid:

```css
border-radius: 10px;
transition-duration: 180ms;
color: #0f4c81;
```

### Rule 3: One Intent, One Token

- Reuse existing semantic tokens for the same intent.
- Do not create near-duplicate tokens (`text-muted-2`, `primary-hover-2`) without design review.

### Rule 4: Scale Discipline

- Spacing must come from `--ca-space-*` only.
- Radius must come from `--ca-radius-*` only.
- Shadow must come from `--ca-shadow-*` only.
- Motion durations/easings must come from `--ca-motion-*` only.

### Rule 5: Accessibility Safety

- Token changes must preserve WCAG 2.2 AA contrast for text and controls.
- Focus indicators must always use dedicated focus token(s), never be removed.
- Status styling must include non-color cues where required (icon/text/label).

### Rule 6: Motion Safety

- Use `fast` or `base` durations for micro-interactions.
- Respect `prefers-reduced-motion` and disable non-essential animation.
- Avoid page-level motion that delays core task completion.

### Rule 7: Versioning and Change Management

- Additive token changes are preferred over breaking renames.
- If a token must be renamed, keep a temporary alias for one release cycle.
- Document every token addition/removal in PR notes.

## Authoring Workflow

1. Add/update token in `docs/tasks/design-handoff/design-tokens.md`.
2. Apply token in `frontend/src/styles.css` or shared component styles.
3. Verify no raw values are introduced in changed files.
4. Run accessibility checks (contrast + focus visibility).
5. Record migration notes in PR summary.

## Linting Recommendations (Optional)

- Add stylelint rules to block raw hex and fixed px/ms values in component files.
- Allow raw values only in the token definition layer.
