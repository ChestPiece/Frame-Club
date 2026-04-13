# Frame Club Codebase Refactor

## Context

The codebase has accumulated structural debt: components built but never wired in, duplicate utilities copied across three files, orphaned dead code, and the homepage inlining 385 lines of JSX despite matching section components existing in `/components/home/`. This refactor connects those pieces, removes duplication, and activates the SiteLoader and page transitions that were built but never mounted.

---

## Phase 1 — Dead Code Deletion (zero risk)

**Delete these files — confirmed zero imports anywhere in the codebase:**

- `src/components/shared/card-reveal.tsx`
- `src/hooks/use-mobile.ts`

No import updates needed.

---

## Phase 2 — Extract `isNonEmpty` to `lib/utils.ts`

The same function is copy-pasted identically in 3 API route files.

**Step 2.1** — Append to `src/lib/utils.ts` (after existing `cn()` export):
```ts
export function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
```

**Step 2.2** — Update the 3 API routes to import from utils:
- `src/app/api/orders/route.ts` — remove local declaration, add `import { isNonEmpty } from "@/lib/utils";`
- `src/app/api/contact/route.ts` — same
- `src/app/api/notify/route.ts` — same

---

## Phase 3 — Standardize GSAP Imports

All client components that need `gsap` + `ScrollTrigger` should import from `@/lib/gsap-config`. Providers (`gsap-provider.tsx`, `smooth-scroll-provider.tsx`) are exempt — they are the registration root.

**Files to update:**

- `src/components/shared/page-scroll-animations.tsx`  
  Replace `import gsap from "gsap"` + `from "gsap/ScrollTrigger"` → `import { gsap, ScrollTrigger } from "@/lib/gsap-config";`

- `src/components/layout/site-header.tsx`  
  Replace `import { gsap } from "gsap"` + `from "gsap/ScrollTrigger"` → `import { gsap, ScrollTrigger } from "@/lib/gsap-config";`  
  Keep `import { ScrollSmoother } from "gsap/ScrollSmoother"` — not exported from gsap-config.

- `src/components/home/home-animations.tsx`  
  Replace `import gsap from "gsap"` + `from "gsap/ScrollTrigger"` → `import { gsap, ScrollTrigger } from "@/lib/gsap-config";`  
  Keep `ScrambleTextPlugin` and `SplitText` imports from their direct paths.

---

## Phase 4 — Merge Supabase Clients (medium risk — test after)

`src/lib/supabase/admin.ts` and `src/lib/supabase/server.ts` both export service-role clients. `server.ts`'s `createServiceClient()` is the better implementation (includes `auth: { autoRefreshToken: false, persistSession: false }`).

**Step 4.1** — `src/lib/services.ts`:
- Replace `import { createAdminClient } from "@/lib/supabase/admin"` → `import { createServiceClient } from "@/lib/supabase/server"`
- At the 4 call-sites (~lines 146, 159, 171, 205): `createAdminClient()` → `await createServiceClient()` (note: `createServiceClient` is async)

**Step 4.2** — `src/app/admin/actions.ts`:
- Replace the `admin` import → `import { createServiceClient } from "@/lib/supabase/server"`
- Lines ~10 and ~44: `createAdminClient()` → `await createServiceClient()`

**Step 4.3** — Delete `src/lib/supabase/admin.ts` after confirming no remaining imports.

**Test:** Admin order status updates, admin product status toggles, and the public ordering flow.

---

## Phase 5 — Activate SiteLoader + TransitionProvider in Root Layout

Both components exist but are never mounted. `SiteLoader` is a first-visit cinematic boot screen. `TransitionProvider` provides the page wipe context and overlay (used by `TransitionLink` in the footer).

**Update `src/app/layout.tsx`** — add two imports and update the body:

```tsx
import { SiteLoader } from "@/components/layout/site-loader";
import { TransitionProvider } from "@/components/layout/page-transition";

// Inside <body>:
<GSAPProvider>
  <TransitionProvider>
    <SiteLoader />
    <SiteHeader />
    <SmoothScrollProvider>{children}</SmoothScrollProvider>
  </TransitionProvider>
</GSAPProvider>
```

**Ordering rationale:**
- `GSAPProvider` stays outermost — plugin registration must run before any animated component mounts
- `TransitionProvider` wraps everything so its overlay (`z-[80]`) is in the stacking context
- `SiteLoader` at `z-[100]` sits above the transition overlay — the wipe should not fire during the loader
- `SiteHeader` position unchanged (renders after `SiteLoader` in DOM order, floats via `fixed position`)

---

## Phase 6 — Refactor `page.tsx` to Import Home Section Components

`src/app/page.tsx` is ~385 lines of inlined section JSX. Six matching components exist in `components/home/` but are never imported.

**Section-to-component mapping:**

| Section | Component | Props |
|---------|-----------|-------|
| Hero | No component — keep inline | Tightly coupled to HomeAnimations animation targets |
| What Is This | `WhatIsThisSection` | none (content hardcoded) |
| How It Works | `HowItWorksSection` | none (steps array internal) |
| Featured Collection | `FeaturedCollectionSection` | `products: Product[]` |
| Customisation | `CustomisationSection` | none |
| Social Proof | `SocialProofSection` | `testimonials: Testimonial[]` |
| Final CTA | `FinalCTASection` | none |

**Key structural constraints:**
- Each component renders the **inner div only**. The outer `<section>` wrapper with background/padding stays in page.tsx.
- Exception: `FinalCTASection` — do NOT add an extra `frame-container` div; its inner div already provides it.
- Move the static `testimonials` array to module scope (above the async function).
- Remove now-unused lucide-react icon imports after extraction.

**page.tsx target shape (~80 lines):**
```tsx
export default async function Home() {
  const featuredProducts = (await getProducts()).slice(0, 3);
  return (
    <>
      <main className="pb-0 pt-30">
        <HomeAnimations>
          <section data-animate-section="hero" ...>{/* hero inline */}</section>
          <section data-animate-section="not-a-poster" ...><WhatIsThisSection /></section>
          <section data-animate-section="three-steps" ...><div className="frame-container"><HowItWorksSection /></div></section>
          <section id="collection-section" ...><div className="frame-container"><FeaturedCollectionSection products={featuredProducts} /></div></section>
          <section data-animate-section="customisation" ...><div className="frame-container"><CustomisationSection /></div></section>
          <section data-animate-section="social-proof" ...><div className="frame-container"><SocialProofSection testimonials={testimonials} /></div></section>
          <section data-animate-section="final-cta" ...><FinalCTASection /></section>
        </HomeAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
```

---

## Phase 7 — Optional Follow-ups (separate commits)

- **`AdminErrorFallback` component** — extract the copy-pasted error UI from `app/admin/page.tsx` and `app/admin/orders/page.tsx` into `src/components/admin/admin-error-fallback.tsx` with a `message` prop.
- **`mock-data.ts` comment** — add a file-level comment `// Test fixture only — do not import in production code` to prevent accidental production use.
- **`isActive` pathname helper** — the two implementations in `site-header.tsx` and `admin/layout.tsx` differ enough that extraction isn't straightforward. Defer.

---

## Execution Order

| Phase | Risk | Notes |
|-------|------|-------|
| 1 — Delete dead files | None | Start here |
| 2 — Extract isNonEmpty | Very low | |
| 3 — GSAP import normalization | Low | |
| 4 — Merge Supabase clients | Medium | Commit separately, test admin + orders |
| 5 — Activate SiteLoader/TransitionProvider | Low | |
| 6 — Refactor page.tsx | Medium | Verify homepage visually after |
| 7 — Optional follow-ups | Low | Separate commits |

---

## Files Changed

| File | Action |
|------|--------|
| `src/components/shared/card-reveal.tsx` | Delete |
| `src/hooks/use-mobile.ts` | Delete |
| `src/lib/supabase/admin.ts` | Delete (after Phase 4) |
| `src/lib/utils.ts` | Add `isNonEmpty` export |
| `src/app/api/orders/route.ts` | Use shared `isNonEmpty` |
| `src/app/api/contact/route.ts` | Use shared `isNonEmpty` |
| `src/app/api/notify/route.ts` | Use shared `isNonEmpty` |
| `src/components/shared/page-scroll-animations.tsx` | Normalize GSAP imports |
| `src/components/layout/site-header.tsx` | Normalize GSAP imports |
| `src/components/home/home-animations.tsx` | Normalize GSAP imports |
| `src/lib/services.ts` | Swap `createAdminClient` → `createServiceClient` |
| `src/app/admin/actions.ts` | Swap `createAdminClient` → `createServiceClient` |
| `src/app/layout.tsx` | Mount `SiteLoader` + `TransitionProvider` |
| `src/app/page.tsx` | Import home section components |

---

## Verification Checklist

1. `npm run build` — zero TypeScript errors
2. `/` homepage — all 7 sections render; SiteLoader plays on first visit; page transitions fire on nav links
3. `/shop` — products render, filters work
4. `/admin` — stats load, order status dropdown works, product status toggle works
5. `npm test` — copy-contracts and shop-card-semantics tests pass
