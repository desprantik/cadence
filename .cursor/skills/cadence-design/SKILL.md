---
name: cadence-design
description: >-
  Cadence dashboard UI standards — progress-tier colors, typography, contrast,
  and layout. Use when building or editing Cadence screens, dashboard components,
  progress indicators, platform chips, or when the user mentions Cadence design tokens.
---

# Cadence Design System

## Progress colors (not brand colors)

Progress rings, bars, and chip borders use **completion tier**, not platform brand color.

Use `getProgressColor(percent)` from `src/utils/progressColor.js`:

| Progress | Color   | Status     |
|----------|---------|------------|
| ≥ 70%    | #2A9D5C | Green — on track |
| ≥ 40%    | #C9A006 | Yellow — caution |
| < 40%    | #D64545 | Red — behind |

Statuses map to `getProgressStatus()`: `on-track` | `caution` | `behind`.

- **Platform logos and badges** on course cards keep brand colors (Udemy, Coursera, etc.).
- **Overall hero arc** keeps coral → yellow gradient (`#E8734A` → `#F5C842`).

## Typography

- **Display / numbers**: Space Grotesk 700
- **Body / labels**: Inter 400–500
- **Minimum UI text**: 12px — never go smaller for readable labels, meta, badges, or percentages

## Color tokens

```css
--yellow: #f5c842;
--black: #111111;
--cream: #f7f5f0;
--white: #ffffff;
--muted: #5f5f5f;   /* AA on gray/cream backgrounds */
--border: #e4e2dc;
--surface: #f7f5f0;
--bg: #e9e8e4;       /* page background — subtle gray */
```

## Accessibility

- Muted text on `--bg` or `--surface` must meet **WCAG AA** (4.5:1). Use `--muted` (#5f5f5f), not light gray (#888).
- Progress stroke colors on light backgrounds use the darker tier palette above.
- Platform chip logos: min 20×20px inside rings; panel logos min 24×24px.
- Interactive chips need `aria-selected`, `aria-expanded`, and collapse via outside click + chevron.

## Layout

- **No outer white shell** — content sits on `--bg`; section panels use `--surface` with border.
- **Progressive disclosure** for per-platform breakdown: horizontal mini-rings → expand for bar + stats.
- Stat pills (enrolled / in progress / completed) only visible when a platform is selected.

## Checklist

When adding UI to Cadence:

- [ ] Progress indicators use `getProgressColor`, not `platformColors`
- [ ] No text below 12px
- [ ] Muted copy uses `--muted` (#5f5f5f)
- [ ] Brand color only on logos/badges, not progress chrome
- [ ] Section cards use `--surface` on `--bg`, not nested white → beige → card
