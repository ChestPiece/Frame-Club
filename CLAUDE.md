@AGENTS.md
# CLAUDE.md — The Frame Club

## What This Project Is

The Frame Club is a Pakistani e-commerce business selling custom diecast car frames. Every frame is made to order — the customer picks a car model, chooses a background design, and the maker sources the diecast, builds the frame, and ships it nationwide across Pakistan. One product. One price: Rs. 5,000.

The business ran entirely through Instagram DMs before this website. 50+ orders fulfilled that way. This site replaces that system with a proper storefront, checkout, and order management. The ordering is still conversational by nature — the client builds each frame himself — so the site's job is to capture demand, not simulate a warehouse.

Instagram: @frameclub__
Tagline: Where Speed Meets Art

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database + Auth:** Supabase
- **UI Components:** shadcn/ui (customized to match brand — override defaults aggressively)
- **Styling:** Tailwind CSS + CSS custom properties
- **Design Reference:** Stitch-generated mockups ("The Machined Monolith" design system)
- **Payments:** PayFast (primary Pakistani gateway — EasyPaisa, JazzCash, cards, bank transfer)
- **Email:** Resend (order confirmations, admin notifications)
- **Image Storage:** Supabase Storage
- **Deployment:** Vercel

---

## Design System — The Machined Monolith

This site is not a generic e-commerce template. It should feel like a high-end automotive brochure — heavy, precise, expensive. When in doubt, make it darker and give it more space.

### Color Tokens

```css
:root {
  /* Backgrounds */
  --bg-base:          #141313;  /* primary canvas */
  --bg-recessed:      #0E0E0E;  /* recessed sections */
  --bg-surface:       #1C1B1B;  /* section blocks */
  --bg-elevated:      #2A2A2A;  /* cards, lifted elements */
  --bg-highest:       #353434;  /* modals */
  --bg-nav:           rgba(58, 57, 57, 0.6); /* frosted nav */

  /* Brand */
  --brand:            #380306;  /* primary accent, CTAs */
  --brand-mid:        #8E130C;  /* hover, gradient end */
  --brand-bright:     #C0392B;  /* highlights, focus */

  /* Text */
  --text-primary:     #F5F5F5;
  --text-muted:       #888888;

  /* Borders */
  --border:           #494542;
  --border-subtle:    rgba(84, 67, 66, 0.15);

  /* Shadows */
  --shadow-ambient:   rgba(56, 3, 6, 0.15);
}
```

### Typography

- **Headlines:** Bebas Neue — all caps, letter-spacing 0.1em to 0.2em, treated as graphic elements
- **Body:** Inter — 16px base, line-height 1.6 minimum
- Use extreme scale contrast. A massive Bebas Neue headline next to a tiny Inter spec label is intentional.

### Non-Negotiable Rules

- **0px border radius. Everywhere. No exceptions.** Not on buttons, cards, inputs, badges, modals. Nothing.
- **No white backgrounds.** The darkest thing on the page is `#0E0E0E`. The lightest text is `#F5F5F5`.
- **No 1px solid borders for sectioning.** Boundaries come from background color shifts, not lines.
- **No traditional drop shadows.** Use tonal layering — put a `#2A2A2A` element on `#141313` for lift.
- **No filled or playful icons.** Thin stroke only. Lucide icons are fine, keep strokeWidth at 1.5.
- **Red is an accent, not a background.** Use it on CTAs, active states, badges, one accent per section. Not as a full section fill.
- **shadcn components must be overridden** to match this system. Do not ship shadcn defaults.

### Tailwind Config Extensions

```ts
theme: {
  extend: {
    colors: {
      'bg-base':      '#141313',
      'bg-recessed':  '#0E0E0E',
      'bg-surface':   '#1C1B1B',
      'bg-elevated':  '#2A2A2A',
      'brand':        '#380306',
      'brand-mid':    '#8E130C',
      'brand-bright': '#C0392B',
      'text-primary': '#F5F5F5',
      'text-muted':   '#888888',
      'border-dark':  '#494542',
    },
    fontFamily: {
      display: ['Bebas Neue', 'sans-serif'],
      body:    ['Inter', 'sans-serif'],
    },
    borderRadius: {
      none:    '0px',
      DEFAULT: '0px',
      sm:      '0px',
      md:      '0px',
      lg:      '0px',
      full:    '0px',
    },
  }
}
```

---

## Database Schema

Four tables. Keep it simple.

```sql
-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  description text,
  images text[],
  price integer not null default 5000,
  status text check (status in ('available', 'preorder', 'unavailable')) default 'available',
  delivery_days integer default 7,
  specs jsonb,
  years text,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text not null,
  product_id uuid references products(id),
  customization jsonb,
  price integer not null,
  payment_status text check (payment_status in ('pending', 'paid', 'failed')) default 'pending',
  order_status text check (order_status in ('pending', 'confirmed', 'in_production', 'shipped', 'delivered')) default 'pending',
  payfast_payment_id text,
  notes text,
  created_at timestamptz default now()
);

-- Customization options (per product)
create table customization_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  type text not null,  -- 'background_color', 'background_design'
  label text not null,
  value text not null,
  preview_url text
);

-- Admin users handled by Supabase Auth
```

---

## Product Availability System

Each product has three states. The UI must reflect these clearly:

| Status | Badge | CTA | Notes |
|--------|-------|-----|-------|
| `available` | Green "Available" | "Order Now" | Normal checkout flow |
| `preorder` | Red "Pre-Order" | "Pre-Order Now" | Shows estimated wait |
| `unavailable` | Grey "Unavailable" | "Notify Me" | Email capture only |

The admin can change product status from the dashboard. No code deployment needed.

---

## Order Flow

1. Customer lands on product page
2. Selects background design from swatches
3. Adds optional notes (special requests)
4. Clicks Order Now → goes to checkout
5. Fills name, email, phone, delivery address
6. Pays via PayFast (EasyPaisa / JazzCash / card / bank)
7. PayFast webhook hits `/api/payfast/webhook` → marks order as paid
8. Customer gets confirmation email via Resend
9. Admin gets new order notification email
10. Admin logs into dashboard, sees order, updates status as it progresses

---

## Pages

| Page | Route | Notes |
|------|-------|-------|
| Homepage | `/` | 7 sections — hero, what is this, how it works, collection, customization, social proof, CTA |
| Collection | `/shop` | Product grid with Available/Pre-order/Unavailable filters |
| Product Detail | `/shop/[slug]` | Image gallery, customization selector, specs, order CTA |
| Checkout | `/checkout` | Customer details form + PayFast redirect |
| Order Confirmation | `/order/[id]` | Post-payment confirmation |
| About | `/about` | Brand story |
| Contact | `/contact` | WhatsApp link + contact form |
| Admin Login | `/admin/login` | Supabase Auth |
| Admin Dashboard | `/admin` | Stats overview |
| Admin Orders | `/admin/orders` | Order table, inline status updates |
| Admin Products | `/admin/products` | Product management, status toggles |

---

## Admin Dashboard

Protected by Supabase Auth. One admin user — the client.

What the admin can do:
- View all orders sorted by date (newest first)
- Update order status inline (pending → confirmed → in_production → shipped → delivered)
- Change product availability (available / preorder / unavailable)
- View customer contact details per order
- Export orders as CSV

The admin dashboard uses the same dark design system as the customer-facing site. It is functional, not decorative.

---

## API Routes

```
POST /api/payfast/webhook     — PayFast payment confirmation
POST /api/orders              — Create new order
GET  /api/orders/[id]         — Get order details
POST /api/contact             — Contact form submission
POST /api/notify              — "Notify me" email capture for unavailable products
```

---

## Component Architecture

```
/components
  /ui          — shadcn base components (all overridden for brand)
  /layout      — Navbar, Footer
  /home        — Hero, WhatIsThis, HowItWorks, FeaturedCollection,
                 CustomizationSection, SocialProof, FinalCTA
  /shop        — ProductGrid, ProductCard, FilterBar
  /product     — ImageGallery, CustomizationSelector, SpecsGrid,
                 OrderButton, RelatedFrames
  /checkout    — CheckoutForm, OrderSummary
  /admin       — StatCard, OrderTable, ProductTable, StatusBadge,
                 StatusToggle
  /shared      — StatusBadge, SectionHeading, CTAButton
```

---

## Key Business Rules

- Every order is made to order. There is no stock sitting in a warehouse.
- One price: Rs. 5,000. No discounts, no variants, no size options.
- Payment is full upfront. No COD.
- Pre-order products show estimated delivery time. Standard is 7-10 working days.
- The client handles all production and shipping himself. The website's job is to capture the order and get out of the way.
- Keychains are a planned product but not launched yet. Do not build anything for them yet. Leave room in the schema.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true  # flip to false on launch
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
ADMIN_EMAIL=
# Required in production for signed order confirmation / checkout retry links (do not reuse service role key).
ORDER_ACCESS_TOKEN_SECRET=
```

---

## Copy — Final Approved Text

These are locked. Do not rewrite them.

**Hero:** YOUR FAVOURITE CAR. FRAMED. FOREVER.
**Hero sub:** Custom diecast frames for the car obsessed. Nationwide delivery across Pakistan.
**Hero CTA:** Order Your Frame — Rs. 5,000

**Section 2:** NOT A POSTER. NOT A TOY. SOMETHING BETTER.

**Section 3:** THREE STEPS. ONE FRAME. DELIVERED TO YOUR DOOR.
- Step 1 — Pick Your Car
- Step 2 — Customise It
- Step 3 — We Build & Ship

**Collection:** THE COLLECTION — Every frame is made to order. No two are exactly alike.

**Customization:** BUILT AROUND YOUR OBSESSION.

**Social proof:** 50+ FRAMES DELIVERED. ZERO COMPLAINTS.

**Final CTA:** READY TO FRAME YOUR OBSESSION?
**CTA sub:** Rs. 5,000. Fully customised. Delivered nationwide. Takes 2 minutes to order.
**CTA button:** ORDER NOW

**Trust line:** Nationwide Delivery 🇵🇰 | Secure Payment | Handcrafted to Order

---

## Sanity Check

Clone the repo, set up `.env.local`, and the site should run. Adding a new product should take under 2 minutes in the admin dashboard. Changing a product from available to preorder should not require touching code.

If any of that requires digging through the codebase, something is built wrong.

---

## Hard Stops

- Generic shadcn styling. Every component that ships with defaults is a failure.
- Rounded corners. Anywhere.
- White or near-white backgrounds.
- Placeholder content in production — no lorem ipsum, no fake car names, no made-up reviews.
- Building anything for keychains. That product doesn't exist yet.
- Overcomplicating checkout. One product, one price. Keep it stupid simple.
- Order state that lives only on the client. Everything hits Supabase.