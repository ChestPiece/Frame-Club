# Logo Faithful Palette — Design Spec
**Date:** 2026-04-14
**Status:** Approved

---

## Context

The Frame Club codebase accumulated ~25 distinct color values across its components with no systematic rationale. The problems:

1. **Dark soup** — 10 near-identical near-black values (`#030303`, `#0a0a0a`, `#0e0e0e`, `#0f0f0f`, `#141313`, `#1a1614`, `#1c1b1b`, `#2a2a2a`, `#353434`, `#544342`) used interchangeably with no token mapping
2. **Unmapped pink** — `#ffb3af` and 5 variants appear in 9+ places with no declared token and no visual ancestry in the brand
3. **Off-brand reds** — `--brand-bright: #C0392B` is an orange-red that diverges from the deep crimson logo
4. **Cool neutrals** — greys like `#888888` and `#494542` feel lifeless against a warm dark brand

The fix traces every color back to the logo itself: `#350407`, `#3D0306`, `#030303` sampled directly from the FrameClub.png. The result is a palette where every token has a clear logo ancestor.

---

## New Token System

### Background Scale — 4 levels, strictly enforced

```css
--bg-deep:     #030303   /* deepest canvas — logo background, image containers, alternating section fills */
--bg-base:     #0F0D0D   /* primary page canvas */
--bg-surface:  #1A1715   /* cards, testimonials, step cards, section blocks */
--bg-elevated: #2C2828   /* modals, lifted elements, nav overlay */
```

**Retired values** (map to nearest token):
- `#0a0a0a`, `#0e0e0e`, `#0f0f0f` → `--bg-deep`
- `#141313` → `--bg-base`
- `#1c1b1b`, `#1a1614` → `--bg-surface`
- `#2a2a2a`, `#353434` → `--bg-elevated`

### Brand Scale — 3 levels, all darker/richer

```css
--brand:        #350407   /* logo sampled — deep crimson base, ambient glows, SVG strokes */
--brand-mid:    #5C0A0D   /* section decorations, badge borders, selected swatches */
--brand-bright: #8E130C   /* CTAs, hover states, active/focus rings — interactive states only */
```

**Retired:** `#C0392B` — too orange-red, replaced entirely by `--brand-bright: #8E130C`

### Text Scale — 3 tokens

```css
--text-primary: #F0EDED   /* all body text — warm white */
--text-muted:   #7A7070   /* labels, captions, secondary info — warm grey */
--text-accent:  #D4B8B8   /* warm desaturated rose — replaces all #ffb3af family usage */
```

**Retired pink family** (all map to `--text-accent`):
`#ffb3af`, `#ffd3d0`, `#ffd5d2`, `#f5c4c1`, `#f3bbb7`, `#ffb4ab`

### Borders & Shadows — 2 tokens

```css
--border:        #3D3030              /* all borders — warm reddish dark */
--border-subtle: rgba(61,48,48,0.15) /* hairline dividers */
--shadow-ambient: rgba(53,4,7,0.18)  /* glow effects — logo base color */
```

### Status Colors — kept, 2 new tokens added

```css
--text-success:          #9bf0ba   /* available badge text, pulsing dot */
--status-success-bg:     #173628   /* NEW — available/paid badge background */
--status-success-border: #2e6f4f   /* NEW — available/paid badge border */
--text-error:            #f1a39d   /* form errors */
```

### Nav

```css
--bg-nav: rgba(44, 40, 40, 0.6)   /* frosted nav — updated to use --bg-elevated base */
```

---

## Tailwind @theme Mapping

```css
@theme {
  --color-bg-deep:              var(--bg-deep);
  --color-bg-base:              var(--bg-base);
  --color-bg-surface:           var(--bg-surface);
  --color-bg-elevated:          var(--bg-elevated);

  --color-brand:                var(--brand);
  --color-brand-mid:            var(--brand-mid);
  --color-brand-bright:         var(--brand-bright);

  --color-text-primary:         var(--text-primary);
  --color-text-muted:           var(--text-muted);
  --color-text-accent:          var(--text-accent);
  --color-text-error:           var(--text-error);
  --color-text-success:         var(--text-success);

  --color-status-success-bg:    var(--status-success-bg);
  --color-status-success-border:var(--status-success-border);

  --color-border:               var(--border);
  --color-border-subtle:        var(--border-subtle);
}
```

---

## File-by-File Application Map

### `src/app/globals.css`
- Rewrite `:root` block entirely with new tokens
- Update `@theme` block to match
- Update `html, body` to use `--bg-base` (unchanged behavior, new value)
- Update `.machined-field` to use `--border` instead of `--border-dark`
- Update `.nav-link-underline` to use `--brand-bright` instead of `--brand-mid`

### `src/app/page.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#030303]` | `bg-bg-deep` |
| `bg-[#0F0F0F]` | `bg-bg-deep` |
| `bg-[#0E0E0E]` | `bg-bg-deep` |
| `bg-[#1A1614]` | `bg-bg-surface` |
| `text-[#ffb3af]` | `text-text-accent` |
| `text-[#8e130c]` | `text-brand-bright` |
| `stroke="#380306"` | `stroke="var(--brand)"` |
| `rgba(56,3,6,0.4)` / `rgba(56,3,6,0.35)` | `rgba(53,4,7,0.4)` / `rgba(53,4,7,0.35)` |

### `src/components/home/what-is-this-section.tsx`
| Remove | Use instead |
|---|---|
| `stroke="#380306"` | `stroke="var(--brand)"` |
| `text-[#ffb3af]` | `text-text-accent` |

### `src/components/home/how-it-works-section.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#1A1614]` | `bg-bg-surface` |

### `src/components/home/featured-collection-section.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#0E0E0E]` | `bg-bg-deep` |
| `text-[#ffb3af]` | `text-text-accent` |
| `border border-[#494542]` | `border border-border` |

### `src/components/home/customisation-section.tsx`
| Remove | Use instead |
|---|---|
| `stroke="#380306"` (×4) | `stroke="var(--brand)"` |
| `text-[#ffb3af]` (×3) | `text-text-accent` |
| `text-[#888888]` (×3) | `text-text-muted` |
| `style={{ color: "#380306" }}` | `style={{ color: "var(--brand)" }}` |
| GSAP `color: "#C0392B"` | `color: "var(--brand-bright)"` |

### `src/components/home/social-proof-section.tsx`
| Remove | Use instead |
|---|---|
| `text-[#ffb3af]` | `text-text-accent` |
| `bg-[#1A1614]` | `bg-bg-surface` |

### `src/components/home/final-cta-section.tsx`
| Remove | Use instead |
|---|---|
| `stroke="#8E130C"` | `stroke="var(--brand-mid)"` |
| `border border-[#494542]` | `border border-border` |

### `src/components/layout/fullscreen-nav.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#0E0E0E]` | `bg-bg-deep` |

### `src/components/shared/pulsing-dot.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#9bf0ba]` | `bg-text-success` |
| `rgba(155,240,186,...)` GSAP values | keep as-is (RGB decomposition, not a class) |

### `src/components/shared/animated-cta-link.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#F5F5F5]` | `bg-text-primary` |

### `src/components/ui/badge.tsx`
| Variant | Remove | Use instead |
|---|---|---|
| available | `border-[#2e6f4f] bg-[#173628] text-[#9bf0ba]` | `border-status-success-border bg-status-success-bg text-text-success` |
| preorder | `border-[#6a1510] text-[#ffd3d0]` | `border-brand-mid text-text-accent` |
| unavailable | `bg-[#1a1614]` | `bg-bg-surface` |
| paid | `text-[#ffd5d2]` | `text-text-accent` |

### `src/components/admin/product-status-toggle.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#ffb3af]` (×2) | `bg-text-accent` |
| `bg-[#544342]` | `bg-border` |

### `src/app/shop/page.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#0a0a0a]` | `bg-bg-deep` |
| `bg-[#030303]` | `bg-bg-deep` |

### `src/app/shop/[slug]/page.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#0f0f0f]` | `bg-bg-deep` |
| `border-[#544342]/30` | `border-border/30` |
| `border-[#8E130C]` | `border-brand-bright` |
| `text-[#f5c4c1]` | `text-text-accent` |

### `src/app/order/[id]/page.tsx`
| Remove | Use instead |
|---|---|
| `border-[#2e6f4f] bg-[#173628] text-[#9bf0ba]` | `border-status-success-border bg-status-success-bg text-text-success` |
| `border-[#6f2e2e] bg-[#281717] text-[#f09b9b]` | `border-brand-mid bg-brand text-text-accent` |

### `src/app/checkout/page.tsx`
| Remove | Use instead |
|---|---|
| `text-[#f5c4c1]` | `text-text-accent` |

### `src/app/admin/page.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#ffb3af]` | `bg-text-accent` |
| `text-[#ffb3af]` (×2) | `text-text-accent` |
| `text-[#f3bbb7]` | `text-text-accent` |

### `src/app/admin/login/page.tsx`
| Remove | Use instead |
|---|---|
| `text-[#ffb4ab]` | `text-text-error` |

### `src/app/error.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#0A0A0A]` | `bg-bg-deep` |
| `text-[#544342]` | `text-text-muted` |

### `src/app/about/page.tsx`
| Remove | Use instead |
|---|---|
| `rgba(56,3,6,0.35)` | `rgba(53,4,7,0.35)` |

### `src/components/shop/catalog-product-card.tsx`
| Remove | Use instead |
|---|---|
| `bg-[#0A0A0A]` | `bg-bg-deep` |
| `bg-[#1A1614]/80` | `bg-bg-surface/80` |

---

## Before / After Summary

| Metric | Before | After |
|---|---|---|
| Distinct color values | ~25 | 14 tokens |
| Near-black variants | 10 | 4 (strict) |
| Unmapped pink values | 6 | 0 (→ `--text-accent`) |
| Unmapped status colors | 4 | 0 (→ status tokens) |
| Files with hardcoded colors | 18 | 0 |

---

## Verification

1. Run `grep -r "#[0-9a-fA-F]\{3,6\}" src/` — should return zero results after implementation (only `rgba()` values for GSAP animations and gradients are permitted)
2. Run `npm run build` — no type errors
3. Visually check homepage, shop, product detail, checkout, and admin pages in browser
4. Confirm badge variants (available/preorder/unavailable/paid) render correctly on `/shop`
5. Confirm pulsing dot, CTA hover states, and nav frosted glass still animate correctly
