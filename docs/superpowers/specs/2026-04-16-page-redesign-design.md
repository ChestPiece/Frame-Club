# Plan: Redesign Shop, About, Contact & Product Detail Pages

## Context

All four pages (Shop `/shop`, About `/about`, Contact `/contact`, Product Detail `/shop/[slug]`) share the same problem: they feel too minimal, cramped, and lack the visual depth and presence the brand demands. The homepage already demonstrates what "done right" looks like — heavy use of GSAP animations, SVG accents, generous spacing, and strong typographic contrast. These four pages need to catch up. Additionally, the entire site needs a full responsive audit across all screen sizes (mobile, tablet, desktop, large desktop).

**User's core complaints:**
- All 4 pages: overall layout lacks visual presence / feels cramped
- Full app: responsiveness broken across all screen sizes

**Approach:** Full Layout Redesign Per Page — restructure each page's layout while keeping the existing design system (tokens, fonts, animations, components) intact.

---

## Critical Files

| File | Role |
|------|------|
| `src/app/shop/page.tsx` | Shop/collection page |
| `src/app/about/page.tsx` | Story/about page |
| `src/app/contact/page.tsx` | Contact page |
| `src/app/shop/[slug]/page.tsx` | Product detail page |
| `src/components/shop/catalog-product-card.tsx` | Product card component |
| `src/components/layout/site-header.tsx` | Global nav — needs responsive audit |
| `src/components/layout/site-footer.tsx` | Global footer — needs responsive audit |
| `src/app/globals.css` | Design tokens, utility classes |

---

## Page-by-Page Redesign Plan

---

### 1. Shop Page (`/shop`)

**Current problem:** Hero feels generic, filter toolbar wraps awkwardly on mid-size screens, product grid has insufficient breathing room between cards.

**Redesign:**

#### Hero Section
- Increase vertical padding: `py-24 sm:py-32` (currently `py-12`)
- Add a large ambient background number (e.g. product count) behind the heading as a watermark — Bebas Neue, ~20vw, `text-border/10` opacity
- Add a one-line editorial descriptor beneath the heading: *"Every frame made to order. No two alike."* in `technical-label` style
- Stats bar below hero: 3 stats in a horizontal row (`50+ Frames Delivered`, `7–10 Day Turnaround`, `Rs. 5,000 Flat`) separated by vertical `border-r border-border/20` — full width, `bg-bg-recessed py-6`

#### Filter Toolbar
- Wrap the filter form in `bg-bg-surface border-y border-border/20 py-6` for visual separation
- On mobile: stack filters vertically in a single column
- On sm+: 2-column grid for dropdowns, search full width above
- On md+: current `md:grid-cols-[1.4fr_1fr_1fr_auto]` layout
- Add `sticky top-[var(--header-height)]` so filters pin to top on scroll (currently they scroll away)

#### Product Grid
- Increase card gap: `gap-10 sm:gap-12` (currently `gap-8`)
- Add more top padding to grid: `pt-14 pb-24` (currently `py-16`)
- On xl screens (1280px+): add `xl:grid-cols-4` for wider monitors
- Empty state: increase padding, add a large "0" watermark

---

### 2. About/Story Page (`/about`)

**Current problem:** Page feels too short and thin. The timeline section is weak on mobile. The three-column cards feel generic. Not enough visual depth.

**Redesign:**

#### Hero Section
- Increase to `py-28 sm:py-36` (currently implicit padding)
- Add a full-bleed horizontal rule `border-t border-border/20` above the section
- Split hero into 2 columns on md+: left = heading + kicker, right = paragraph + a pull-quote in larger type
- Pull-quote example: *"Started in Instagram DMs. 50+ frames later, we built this."* — `text-2xl text-text-muted leading-snug`
- Radial gradient stays, but increase its size and opacity slightly

#### Stats/Info Cards Section
- Replace the 3 generic cards with a horizontal data strip (similar to homepage):
  - `grid-cols-1 sm:grid-cols-3` with `border border-border/20 divide-x divide-border/20`
  - Each cell: large Bebas number + label beneath
  - Content: `50+` Frames Delivered / `5,000` Rs. Flat / `7–10` Day Turnaround
  - `py-10 px-8` per cell, `bg-bg-surface`
  - This replaces the generic card layout with something editorial

#### The Journey Timeline
- On desktop: keep horizontal timeline with SVG line
- On mobile: convert to a vertical numbered list (1, 2, 3) with `border-l border-border/20 pl-6` left accent line
- Add more vertical padding to each phase: `py-8` minimum
- Phase titles: increase to `text-5xl sm:text-6xl` Bebas Neue
- Add a short 1-sentence description under each phase title (currently missing)

#### New: Brand Statement Section
- Full-bleed `bg-bg-recessed py-24` section at the bottom
- Large centered Bebas Neue quote: *"WHERE SPEED MEETS ART"* at `clamp(4rem, 8vw, 9rem)`
- Subtext: `text-text-muted text-lg` — one sentence about the brand ethos
- CTA button linking to `/shop`

---

### 3. Contact Page (`/contact`)

**Current problem:** Page feels too minimal. Both columns feel lightweight. The form doesn't feel premium. Not enough visual presence.

**Redesign:**

#### Overall Layout
- Change from equal 2-column `md:grid-cols-2` to asymmetric `md:grid-cols-[1fr_1.2fr]` — give the form slightly more room
- Increase section padding: `p-10 sm:p-16 md:p-20` (currently `p-6 sm:p-10 md:p-14`)
- Add `bg-bg-recessed` full-bleed background to the entire page section

#### Left Column — Contact Info
- Make the heading larger: `text-6xl sm:text-7xl md:text-8xl` Bebas Neue
- Add a decorative thin vertical accent line (2px, brand color) to the left of the heading block
- Below description: add the stats strip — `50+ customers served`, `Reply within 24h`, `Nationwide delivery`
- WhatsApp + Instagram cards: increase padding to `p-6`, add subtle `bg-bg-surface` background
- Add hover state: `hover:border-brand/60 transition-colors`

#### Right Column — Form
- Wrap entire form in `bg-bg-elevated p-8 sm:p-10` card treatment
- Increase spacing between form fields: `space-y-8` (currently `space-y-7`)
- Add a thin `border-t-2 border-brand` accent at the top of the form card
- Label size: increase from `text-[10px]` to `text-xs` for readability
- Textarea: increase rows from 4 to 5
- Submit button: full width, `py-4 text-lg display-kicker`

#### Mobile
- Stack left column above form
- Left column: remove vertical divider, add `border-b border-border/20 pb-10 mb-10`
- Form card keeps its `bg-bg-elevated` treatment even on mobile

---

### 4. Product Detail Page (`/shop/[slug]`)

**Current problem:** The page lacks visual weight. The split between image and form sections feels functional but not premium. Specs section underutilises the space. Mobile layout needs better handling.

**Redesign:**

#### Hero / Main Section
- Increase top padding: `pt-16 pb-20` (currently `py-12`)
- Add breadcrumb visual separation: `border-b border-border/20 pb-4 mb-10`
- Switch grid gap: `gap-16 lg:gap-20` (currently `gap-12`)

#### Left Column — Image Gallery
- Primary image container: increase padding `p-12` (currently `p-8`) and add `bg-bg-recessed` (currently `bg-bg-deep`) for more contrast
- Add a thin `border border-border/30` to primary image — already exists, keep
- Thumbnails: increase to `sm:grid-cols-4` (currently `sm:grid-cols-3`) — gives more options visibility
- Add thumbnail label beneath: *"3 of 4 views"* in `technical-label` style

#### Right Column — Form & Info
- Brand label + product name: add `border-b border-border/20 pb-6 mb-8` separator beneath the title block
- Status badge + price: increase price to `text-3xl font-bold text-text-primary` (currently `text-2xl font-semibold`)
- Background design selector: add a descriptive line above radio options — *"Choose your background"* as a `technical-label`
- Radio swatches: increase size to `h-12 w-12` (currently `h-10 w-10`)
- CTA button: increase to `py-6 text-2xl` (currently `py-5 text-xl`) — make it more dominant
- Trust line: add 3 icons (package, clock, shield) with labels in a `grid-cols-3` layout instead of `flex justify-between`

#### Specs Section
- Increase padding: `py-32` (currently `py-24`)
- Add editorial subheading beneath "THE SPECS" heading: *"Built to last. Engineered to display."* in `text-text-muted`
- Spec cells: increase padding to `p-9` (currently `p-7`)
- On mobile: force `grid-cols-2` (already done), on sm: `grid-cols-3`, on md+: `grid-cols-5` (already done)

#### Related Products
- Increase section padding: `py-28` (currently `py-20`)
- Add editorial description beneath heading: *"Other frames you might obsess over."*
- Card hover overlay: already exists, keep — it's good
- On xl+: add `xl:grid-cols-4` for wider screens

---

## Global Responsive Audit

These fixes apply site-wide across all pages:

| Area | Fix |
|------|-----|
| **xs (< 375px)** | Add `min-w-0` to flex children to prevent overflow. Check `frame-container` horizontal padding (`px-4` minimum) |
| **sm (640px)** | Audit all `sm:grid-cols-2` grids — ensure items don't overflow at exactly 640px |
| **md (768px)** | Fix specs grid cramping: `md:grid-cols-5` becomes `md:grid-cols-3`, `lg:grid-cols-5` |
| **lg (1024px)** | Product detail main grid activates here — verify stacking on 900–1023px range |
| **xl (1280px+)** | Add `xl:grid-cols-4` to shop product grid and related products grid |
| **Nav** | Audit hamburger menu on xs screens — ensure it doesn't overflow |
| **Typography** | Replace raw text size jumps (e.g. `sm:text-5xl md:text-8xl`) with `clamp()` values in globals.css for fluid scaling |
| **Touch targets** | Ensure all interactive elements are minimum 44px tall on mobile |

---

## Implementation Order

1. **Global CSS fixes** — fluid typography clamps, responsive container padding (globals.css)
2. **Shop page** (`src/app/shop/page.tsx`)
3. **About page** (`src/app/about/page.tsx`)
4. **Contact page** (`src/app/contact/page.tsx`)
5. **Product detail page** (`src/app/shop/[slug]/page.tsx`)
6. **Header/Footer responsive audit** (`src/components/layout/`)

---

## Verification

After implementation, test at these exact viewport widths:
- 375px (iPhone SE)
- 430px (iPhone 15 Pro Max)
- 768px (iPad portrait)
- 1024px (iPad landscape / small laptop)
- 1280px (standard desktop)
- 1440px (wide desktop)

Check each page for:
- No horizontal overflow (no `overflow-x` scroll)
- No text truncation or clipping
- CTA buttons are full-width on mobile, appropriate on desktop
- Filter toolbar on `/shop` is usable on all sizes
- Form fields on `/contact` and `/shop/[slug]` are readable and tappable
- Images maintain correct aspect ratios
- Navigation is accessible and not broken

Run `npx tsc --noEmit` and confirm zero TypeScript errors before calling done.
