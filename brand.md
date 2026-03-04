# Slotra Brand & Design System

> **Source of truth** for visual design across all Slotra products — landing, web app, and mobile.
> AI agents (Claude, Codex, Gemini) should read this file before generating any UI code or copy for Slotra.

---

## 1. Brand Identity

| Property | Value |
|---|---|
| **Product name** | Slotra |
| **Legal entity** | Slotra Technologies Inc. |
| **Tagline** | Scheduling software built for the Philippines |
| **Category** | B2B SaaS — automated scheduling & booking |
| **Market** | Philippine businesses (SMEs, salons, clinics, services) |
| **Tone** | Professional, confident, modern, approachable — never corporate-stiff |
| **Contact** | hello@slotra.ph |
| **Facebook** | https://www.facebook.com/profile.php?id=61586607277534 |

---

## 2. Color Palette

### Primary

| Token | Hex | Usage |
|---|---|---|
| `brand` | `#2e3192` | Primary actions, links, active states, highlights |
| `brand-hover` | `#252880` | Hover state of brand-colored elements |
| `brand-light` | `#ecedf9` | Brand tints, badges, soft backgrounds |

### Neutrals

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#0f1f2e` | Primary text, headings, dark backgrounds |
| `page` | `#f7f8fa` | Default page background |
| `secondary` | `#4a5668` | Body text, secondary labels |
| `muted` | `#7a8799` | Placeholders, captions, footer copy |
| `border` | `#e2e6ea` | Dividers, input borders, card outlines |

### Extended

| Hex | Usage |
|---|---|
| `#d0d5dd` | Input borders (default state), scrollbar thumb |
| `#b0b7c3` | Scrollbar thumb hover |
| `#d4d8de` | Form input borders |
| `#a0aab4` | Input icon default color |
| `#f0f1f3` | Subtle section dividers |
| `#dde1e7` | Navbar internal dividers |

### Semantic

| State | Hex | Usage |
|---|---|---|
| Error | `#e53e3e` | Input error borders, error text, error icons |
| Error ring | `rgba(229,62,62,0.10)` | Focus ring on errored inputs |
| Brand ring | `rgba(46,49,146,0.08)` | Focus ring on focused inputs |

### Dark Surface (Toast / Banner)

| Hex | Usage |
|---|---|
| `#0f1f2e` | Dark toasts, dev banner background (= `navy`) |

---

## 3. Typography

### Font

```
Primary: Inter
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

Load via Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Type Scale

| Role | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|
| Hero headline | `46px` / `34px` mobile | `700` | `-0.03em` | `1.1` |
| Section heading | `28–32px` | `700` | `-0.02em` | `1.2` |
| Sub-heading | `22–24px` | `700` | `-0.015em` | `1.3` |
| Body large | `16px` | `400` | `0` | `1.75` |
| Body | `15px` | `400` | `0` | `1.75` |
| Body small | `14px` | `400` | `0` | `1.6` |
| Label / Caption | `12–13px` | `400–500` | `0` | `1.5` |
| Overline / Badge | `10px` | `700` | `0.6–0.9px` | — |
| Nav link | `13.5px` | `500` | `0` | — |
| Button | `13–14px` | `600` | `0.1px` | — |

---

## 4. Spacing

Base unit is `8px`. All spacing follows an 8pt grid.

| Steps | px |
|---|---|
| `2` | `8px` |
| `3` | `12px` |
| `4` | `16px` |
| `5` | `20px` |
| `6` | `24px` |
| `8` | `32px` |
| `10` | `40px` |
| `12` | `48px` |
| `14` | `56px` |
| `16` | `64px` |
| `24` | `96px` |

**Max content width:** `1200px`, centered with `px-6` (24px) or `px-8` (32px) horizontal padding.

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `sm` | `6px` / `rounded-md` | Small elements, tags |
| `md` | `8px` / `rounded-lg` | Inputs, small cards |
| `lg` | `10–12px` / `rounded-xl` | Buttons, cards |
| `xl` | `16px` / `rounded-2xl` | Large cards, modals |
| `full` | `9999px` / `rounded-full` | Pills, badges, avatars |

---

## 6. Buttons

All buttons use a subtle gradient + inset highlight for a polished, slightly 3D feel. **No flat solid fills.**

### Primary Button (Brand)

```
height: 34px (navbar) / 44px (forms, CTAs)
padding: 0 16–28px
border-radius: 8–10px
font-size: 13–14px
font-weight: 600
color: #ffffff
border: 1px solid rgba(0,0,0,0.18)

background (default):  linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)
background (hover):    linear-gradient(180deg, #3538b5 0%, #272a86 100%)

box-shadow (default):  inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)
box-shadow (hover):    inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)
```

### Secondary Button (Ghost / Outlined)

```
height: 34px (navbar) / 44px (forms, CTAs)
padding: 0 16–28px
border-radius: 8–10px
font-size: 13–14px
font-weight: 500
color (default): #4a5668
color (hover):   #0f1f2e
border: 1px solid #d0d5dd

background (default):  linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)
background (hover):    linear-gradient(180deg, #f9fafb 0%, #eceef1 100%)

box-shadow (default):  inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05)
box-shadow (hover):    inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.08)
```

### Rules
- Always use `transition-all duration-150` for hover transitions
- Never use flat solid backgrounds on buttons — always gradient
- The inset top shadow creates the highlight-edge that gives buttons dimension
- Hover state lightens the gradient slightly and increases the drop shadow

---

## 7. Form Inputs

```
height: 44px
border-radius: 8px (rounded-lg)
font-size: 14px
padding: 0 14px 0 40px  (40px left for leading icon)
border: 1px solid #d4d8de (default)
border: 1px solid #2e3192 (focus)
border: 1px solid #e53e3e (error)
background: #ffffff
color: #0f1f2e
box-shadow (default): 0 1px 2px rgba(0,0,0,0.04)
box-shadow (focus):   0 0 0 3px rgba(46,49,146,0.08), 0 1px 2px rgba(0,0,0,0.04)
box-shadow (error):   0 0 0 3px rgba(229,62,62,0.10), 0 1px 2px rgba(0,0,0,0.04)
outline: none (use box-shadow for focus ring)
```

**Icons inside inputs:** Use Lucide icons, size `15px`, positioned `left: 14px`, color `#a0aab4` (default) / `#e53e3e` (error).

**Error indicator:** `AlertCircle` (Lucide) at `right: 14px`, color `#e53e3e`.

**Labels:**
```
font-size: 12px
font-weight: 500
color: #4a5668
always text-left regardless of parent alignment
```

**Validation pattern:**
- Validate on blur, clear error as soon as field becomes valid again
- Validate all fields on submit attempt
- Show error icon + red border + error message text below input

---

## 8. Shadows

| Name | Value | Usage |
|---|---|---|
| Card | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Cards, panels |
| Elevated | `0 4px 16px rgba(0,0,0,0.08)` | Dropdowns, popovers |
| Brand glow (sm) | `0 2px 6px rgba(46,49,146,0.25)` | Primary button default |
| Brand glow (md) | `0 3px 10px rgba(46,49,146,0.4)` | Primary button hover |
| Brand glow (lg) | `0 24px 64px rgba(46,49,146,0.2)` | 3D icon/hero elements |
| Inset highlight | `inset 0 1px 0 rgba(255,255,255,0.14)` | Button top edge |

---

## 9. Navbar

```
position: fixed, top (offset by --banner-h CSS variable)
height: 62px
max-width: 1200px, px-8
background: transparent → #ffffff on scroll
box-shadow: none → 0 1px 0 rgba(0,0,0,0.07) on scroll
transition: background, box-shadow, duration-150
```

**Nav links:** `13.5px`, `font-medium`, color `#4a5668` → hover `#0f1f2e` → active `#2e3192`

**Right CTAs:** Secondary "Book a Demo" + Primary "Get Started" (hidden when `inDevelopment`)

**Responsive:** Nav links hidden below `900px`.

---

## 10. Layout Patterns

### Page Sections
- Full-width section, content constrained to `max-w-[1200px] mx-auto px-8`
- Vertical rhythm: `py-20` to `py-24` between major sections
- Background alternates between `#ffffff` and `#f7f8fa`

### Two-Column (Hero / Feature)
- `grid grid-cols-2 gap-16 items-center`
- Collapses to single column below `900px`

### Three-Column (Features / Steps)
- `grid grid-cols-3 gap-8`
- Collapses to single column below `640px`

### Interactive Grid Background
- SVG grid of 40×40px squares
- Stroke: `rgba(46,49,146,0.05)`, stroke-width 1
- Hover fill: `rgba(46,49,146,0.03)`, transition 100ms in / 1000ms out
- Paired with a radial gradient fade mask toward the page background color

---

## 11. Iconography

**Library:** [Lucide React](https://lucide.dev/) — use exclusively for all UI icons.

**Sizes:**
| Context | Size |
|---|---|
| Inline / input | `14–15px` |
| Button | `14–15px` |
| Nav / toolbar | `16px` |
| Feature icons | `20–24px` |
| Empty state | `40–48px` |

---

## 12. Logo & Brand Assets

All assets live in `packages/branding/assets/`.

| File | Usage |
|---|---|
| `slotra_symbol_wordmark.png` | Primary logo — navbar, footer, email headers |
| `slotra_app-icon.png` | App icon — mobile, hero illustrations, 3D showcase |
| `slotra_symbol.png` | Symbol only — favicons, small lockups |

**Logo sizing in navbar:** `h-[50px] w-auto`
**Logo sizing in footer:** `h-9 w-auto self-start`

**Never** stretch, recolor, or add drop shadows directly to the logo assets.

---

## 13. Motion & Animation

| Property | Value |
|---|---|
| Default transition | `duration-150`, `ease` |
| Color/border transitions | `duration-150` |
| Page-level transitions | `duration-300` |
| Float animation | `4s ease-in-out infinite`, ±8px Y |
| SVG draw-in (highlights) | `0.5–0.7s ease-out`, stroke-dashoffset |
| 3D tilt (icon) | `perspective(1000px) rotateX/Y`, clamped ±12deg, `0.2s ease-out` |

**Principle:** Motion should be subtle and fast. No animations longer than 700ms for UI feedback. Reserve slower animations for decorative/hero elements only.

---

## 14. Toast Notifications

**Library:** [sileo](https://www.npmjs.com/package/sileo)

```
position: bottom-left
fill: #0f1f2e  (navy)
roundness: 14
title color: #ffffff
description color: rgba(255,255,255,0.60)
badge background: rgba(255,255,255,0.10)
success state color: oklch(0.38 0.19 264)  (= brand indigo #2e3192)
```

---

## 15. Scrollbar

```css
scrollbar-width: thin;
scrollbar-color: #d0d5dd transparent;

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d0d5dd; border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: #b0b7c3; }
```

---

## 16. Dev Banner

Shown sitewide when `IN_DEVELOPMENT = true`. Fixed top, `z-[1002]`, height `40px`.

```
background: #0f1f2e
badge: brand-light bg (#ecedf9), brand text (#2e3192), uppercase, 10px, bold
message text: rgba(255,255,255,0.65)
CTA link: rgba(255,255,255,0.9), underline
dismiss button: rgba(255,255,255,0.35) → rgba(255,255,255,0.9) on hover
```

The navbar `top` position is offset by `--banner-h` CSS variable (set to `40px` when banner is visible, `0px` when dismissed).

---

## 17. Do's and Don'ts for AI Agents

### Do
- Use Inter as the only typeface
- Use gradient backgrounds on all buttons (never flat fills)
- Use inline `style` props for all brand colors, gradients, and shadows in React components — Tailwind for layout/spacing only
- Keep hover states implemented via `useState` + inline style mutation (consistent with existing codebase)
- Use `transition-all duration-150` for hover transitions
- Use `#0f1f2e` (navy) for all primary headings
- Use Lucide icons exclusively
- Follow the 8pt spacing grid
- Use `max-w-[1200px] mx-auto px-8` for all content containers

### Don't
- Don't use flat solid color buttons
- Don't use any font other than Inter
- Don't invent new brand colors — use only the palette defined above
- Don't use Tailwind custom color classes (`text-brand`, `bg-navy`) for colors that need to render in shared packages outside the app's `@source` scan path — use inline styles instead
- Don't add drop shadows to logo assets
- Don't use animations longer than 700ms for interactive UI feedback
- Don't add `outline` on focused inputs — use `box-shadow` for focus rings with `outline: none`

---

*Last updated: March 2026 — reflects the current landing page (`apps/landing`) as the design reference.*
