# Visual Design Directions

Date: 2026-03-30
Purpose: Propose two strong UI directions for the classroom availability product before tokenization and component redesign.

## Direction A: Campus Signal

### Positioning

Clear, operational, and fast. Built for high-frequency task completion (search rooms, create bookings, approve admin actions) with dashboard-first clarity.

### Layout Moodboard

- Structured split shell: sticky top utility bar + left task rail on desktop.
- Dense information zones with intentional whitespace gutters.
- Card clusters for high-priority stats and shortcuts.
- Table-first pages with sticky header + quick filter bar anchored above data.
- Mobile pattern: collapsible utility rail and bottom quick-action tray.

Keywords: operational console, wayfinding, urgency, precision, institutional confidence.

### Typography Direction

- Headings: Sora (600/700) for compact modern authority.
- Body/UI: IBM Plex Sans (400/500) for dense readability.
- Data/meta: IBM Plex Mono (400/500) for slots, IDs, and logs.

Type scale suggestion:

- Display: 36/44
- H1: 30/36
- H2: 24/30
- H3: 20/26
- Body: 16/24
- Dense table text: 14/20
- Caption/meta: 12/16

### Color Direction

- Primary: #0F4C81 (deep institutional blue)
- Primary hover: #0B3A63
- Accent: #00A3A3 (teal for active states)
- Success: #1A7F37
- Warning: #B7791F
- Danger: #B42318
- Surface 1: #F7F9FC
- Surface 2: #FFFFFF
- Border: #D5DDE8
- Text strong: #0F172A
- Text muted: #475569

Contrast intent:

- All text and controls should meet WCAG 2.2 AA.
- Non-color cue required for status chips (icon or pattern + label).

### Component Tone

- Buttons: medium corner radius (10px), strong fill, high legibility labels.
- Inputs: clean bordered fields with explicit focus ring and helper text zones.
- Tables: compact row density with optional comfortable mode toggle.
- Status chips: semantic icon + text, not color-only.
- Cards: low-elevation, crisp borders, utility-first content hierarchy.

### Best Fit

- Best when task throughput and admin/faculty productivity are primary goals.

## Direction B: Academic Atelier

### Positioning

Warm, human, and guidance-forward. Designed to reduce intimidation for occasional users while retaining professional credibility for admin workflows.

### Layout Moodboard

- Content-led pages with generous section rhythm and narrative headers.
- Hero context band on top of key pages (what this page does + next step).
- Progressive disclosure: advanced filters hidden behind "More filters" drawer.
- Blend of cards and tables where table appears only after intent is narrowed.
- Mobile pattern: stacked journey cards with sticky contextual action button.

Keywords: approachable rigor, guided flows, calm confidence, academic warmth.

### Typography Direction

- Headings: Fraunces (600) for distinctive academic character.
- Body/UI: Manrope (400/600) for clarity and approachable tone.
- Data/meta: Space Mono (400) for timestamps, slots, and audit details.

Type scale suggestion:

- Display: 40/46
- H1: 32/38
- H2: 26/32
- H3: 22/28
- Body: 17/26
- Dense table text: 14/21
- Caption/meta: 12/18

### Color Direction

- Primary: #1F6B5C (deep green-teal)
- Primary hover: #175346
- Accent: #C97A2B (burnt amber for emphasis)
- Success: #2E7D32
- Warning: #9A6700
- Danger: #A9372A
- Surface 1: #FAF8F3
- Surface 2: #FFFFFF
- Border: #E6DFD1
- Text strong: #1F2937
- Text muted: #5B6472

Contrast intent:

- Maintain AA contrast for all text, badges, and interactive states.
- Focus ring color independent of status palette.

### Component Tone

- Buttons: softer geometry (12px radius), clear primary vs secondary hierarchy.
- Inputs: filled-light backgrounds with explicit active border and hint copy.
- Tables: card-framed table sections with row separators and sticky row actions.
- Empty states: illustrated but restrained, with one direct next action.
- Feedback: richer success/error blocks with short "what to do next" guidance.

### Best Fit

- Best when clarity for mixed user maturity (students + occasional faculty users) is prioritized.

## Side-by-Side Selection Guide

| Decision Lens             | Campus Signal | Academic Atelier |
| ------------------------- | ------------- | ---------------- |
| Speed for expert users    | Strongest     | Strong           |
| Ease for occasional users | Strong        | Strongest        |
| Data-density handling     | Strongest     | Moderate-Strong  |
| Visual distinctiveness    | Moderate      | Strongest        |
| Implementation complexity | Moderate      | Moderate-High    |

## Recommendation To Validate

Prototype one critical journey in each direction before choosing:

1. Faculty booking flow: Classrooms -> Availability -> Create Booking.
2. Admin maintenance flow: Filter -> Toggle -> Confirm feedback.

Choose the direction that wins both:

- > = 10% faster median task completion time.
- > = 0.5 point higher confidence rating (1-5 post-task survey).

## Final Direction Selection

Selected Direction: Campus Signal (Direction A)

Decision Date: 2026-03-30

### Rationale

Readability:

- Direction A uses a cleaner, denser UI typography pairing (Sora + IBM Plex Sans) that performs better in data-heavy pages such as Classrooms, My Bookings, and Admin Audit Logs.
- The compact scale and stronger contrast hierarchy improve scan speed for tables, filters, and status labels without sacrificing legibility.
- Direction A better supports consistent treatment of dense metadata and scheduling information.

Trust:

- The deep institutional blue foundation and restrained semantic accents communicate reliability and operational confidence.
- Crisp surfaces, explicit borders, and low-elevation cards align with enterprise and institutional product expectations.
- The visual language is more aligned with administrative decision-making contexts where precision and predictability are critical.

Task Speed:

- Direction A is optimized for high-frequency actions with table-first layouts, anchored quick filters, and compact controls.
- It minimizes cognitive overhead for frequent faculty/admin flows: find room, create booking, toggle maintenance, inspect audit event.
- Lower implementation complexity than Direction B enables faster rollout of improvements, reducing time-to-value.

### Trade-Off Acknowledgement

- Direction B is more expressive and potentially warmer for occasional users.
- To preserve approachability while using Direction A, incorporate selected B-style guidance patterns:
  - contextual helper text on first-use actions,
  - clearer empty-state next actions,
  - progressive disclosure for advanced filters on mobile.

### Decision Guardrails

- Maintain WCAG 2.2 AA contrast and visible focus states across all components.
- Keep dense data views readable with spacing and typography constraints, not color alone.
- Validate improvements against journey KPIs in `docs/tasks/user-journeys.md`.
