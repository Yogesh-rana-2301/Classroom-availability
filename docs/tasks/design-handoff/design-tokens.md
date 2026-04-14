# Design Tokens Specification (Campus Signal)

Date: 2026-03-30
Source Direction: Campus Signal (selected in `docs/tasks/visual-design-directions.md`)
Governance: Naming conventions and usage rules are published in `docs/tasks/design-handoff/token-governance.md`.

## Token Model

Token tiers:

- Primitive tokens: raw values (hex, px, ms, cubic-bezier)
- Semantic tokens: intent-based aliases used by components
- Component tokens: optional local aliases inside component styles

Naming format:

- CSS custom property: `--ca-{category}-{group}-{name}`
- Example: `--ca-color-bg-surface`, `--ca-space-4`, `--ca-motion-duration-fast`

Rules:

- Do not use raw color, px, or ms directly in components.
- Components consume semantic tokens first.
- Primitive changes must not break semantic intent names.

## Color Tokens

### Primitive Palette

```css
:root {
  --ca-color-blue-900: #0b3a63;
  --ca-color-blue-800: #0f4c81;
  --ca-color-blue-700: #1f5fa0;

  --ca-color-teal-700: #007d7d;
  --ca-color-teal-600: #00a3a3;

  --ca-color-green-700: #1a7f37;
  --ca-color-amber-700: #b7791f;
  --ca-color-red-700: #b42318;

  --ca-color-slate-950: #0f172a;
  --ca-color-slate-700: #334155;
  --ca-color-slate-600: #475569;
  --ca-color-slate-300: #cbd5e1;
  --ca-color-slate-200: #d5dde8;
  --ca-color-slate-100: #e2e8f0;
  --ca-color-slate-50: #f7f9fc;
  --ca-color-white: #ffffff;
}
```

### Semantic Colors

```css
:root {
  --ca-color-bg-canvas: var(--ca-color-slate-50);
  --ca-color-bg-surface: var(--ca-color-white);
  --ca-color-bg-surface-subtle: #f8fafc;

  --ca-color-text-strong: var(--ca-color-slate-950);
  --ca-color-text-default: #1f2937;
  --ca-color-text-muted: var(--ca-color-slate-600);
  --ca-color-text-on-primary: var(--ca-color-white);

  --ca-color-border-default: var(--ca-color-slate-200);
  --ca-color-border-strong: var(--ca-color-slate-300);
  --ca-color-border-focus: #2563eb;

  --ca-color-action-primary-bg: var(--ca-color-blue-800);
  --ca-color-action-primary-bg-hover: var(--ca-color-blue-900);
  --ca-color-action-primary-text: var(--ca-color-white);

  --ca-color-action-secondary-bg: var(--ca-color-white);
  --ca-color-action-secondary-bg-hover: #eef2ff;
  --ca-color-action-secondary-text: var(--ca-color-slate-700);

  --ca-color-status-success-bg: #ecfdf3;
  --ca-color-status-success-text: var(--ca-color-green-700);
  --ca-color-status-warning-bg: #fff7e6;
  --ca-color-status-warning-text: var(--ca-color-amber-700);
  --ca-color-status-danger-bg: #fef2f2;
  --ca-color-status-danger-text: var(--ca-color-red-700);
  --ca-color-status-info-bg: #eff6ff;
  --ca-color-status-info-text: var(--ca-color-blue-800);
}
```

## Spacing Tokens

Base unit: 4px

```css
:root {
  --ca-space-0: 0;
  --ca-space-1: 4px;
  --ca-space-2: 8px;
  --ca-space-3: 12px;
  --ca-space-4: 16px;
  --ca-space-5: 20px;
  --ca-space-6: 24px;
  --ca-space-8: 32px;
  --ca-space-10: 40px;
  --ca-space-12: 48px;
  --ca-space-16: 64px;
}
```

Usage guidance:

- Control gap: `--ca-space-2` to `--ca-space-3`
- Section gap inside cards: `--ca-space-4` to `--ca-space-6`
- Page rhythm: `--ca-space-6` to `--ca-space-8`

## Radius Tokens

```css
:root {
  --ca-radius-none: 0;
  --ca-radius-sm: 6px;
  --ca-radius-md: 10px;
  --ca-radius-lg: 12px;
  --ca-radius-xl: 16px;
  --ca-radius-pill: 999px;
}
```

Usage guidance:

- Inputs and buttons: `--ca-radius-md`
- Cards and table containers: `--ca-radius-lg`
- Status chips and nav pills: `--ca-radius-pill`

## Shadow Tokens

```css
:root {
  --ca-shadow-0: none;
  --ca-shadow-1: 0 1px 2px rgba(15, 23, 42, 0.06);
  --ca-shadow-2: 0 4px 12px rgba(15, 23, 42, 0.08);
  --ca-shadow-3: 0 10px 24px rgba(15, 23, 42, 0.12);
  --ca-shadow-focus: 0 0 0 3px rgba(37, 99, 235, 0.35);
}
```

Usage guidance:

- Default cards: `--ca-shadow-1`
- Elevated overlays/dropdowns: `--ca-shadow-2`
- Modal/popover emphasis: `--ca-shadow-3`
- Focus-visible ring: `--ca-shadow-focus`

## Motion Tokens

### Duration

```css
:root {
  --ca-motion-duration-instant: 0ms;
  --ca-motion-duration-fast: 120ms;
  --ca-motion-duration-base: 180ms;
  --ca-motion-duration-slow: 280ms;
  --ca-motion-duration-emphasis: 420ms;
}
```

### Easing

```css
:root {
  --ca-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ca-motion-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ca-motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ca-motion-ease-emphasis: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

### Motion Policy

- Hover/focus transitions use `fast` or `base` duration only.
- Layout transitions do not exceed `slow` by default.
- Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Optional Supporting Tokens

### Z-Index

```css
:root {
  --ca-z-base: 0;
  --ca-z-sticky: 100;
  --ca-z-dropdown: 400;
  --ca-z-overlay: 800;
  --ca-z-modal: 1000;
  --ca-z-toast: 1200;
}
```

### Breakpoints

```css
:root {
  --ca-breakpoint-sm: 480px;
  --ca-breakpoint-md: 768px;
  --ca-breakpoint-lg: 1024px;
  --ca-breakpoint-xl: 1280px;
}
```

## Token Adoption Sequence

1. Replace global colors, spacing, radius, and shadow values in `frontend/src/styles.css` with tokens.
2. Migrate shared UI primitives (`Button`, `TextInput`, `DataTable`) to semantic tokens.
3. Migrate page-level CSS by priority: Classrooms, Room Availability, My Bookings, Admin pages.
4. Run contrast and focus-visible QA after each migration batch.
