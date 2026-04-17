# Frame Club — Codebase Restructuring Plan

## Context

Codebase has a solid foundation but accumulated organizational debt:
- Two form components living inside route folders (breaks separation of concerns)
- 14 utility files dumped at `lib/` root with mixed concerns (animation, payment, DB, content, shop)
- No barrel/index files anywhere
- `services.ts` gets moved to logical home (not split — 295 lines is fine)

Goal: Apply Next.js 16 best-practice file structure without changing any logic.

---

## What Does NOT Change

- `src/proxy.ts` — correct position (Next.js 16 renamed middleware → proxy)
- `src/lib/utils.ts` — stays at root (shadcn convention, 18 importers, highest import count)
- `src/lib/supabase/` — already organized, untouched
- `src/lib/emails/` — already organized, untouched
- `src/__tests__/` — keep centralized (tests are cross-component integration tests, not unit tests)
- `services.ts` — NOT split (295 lines, shared private helpers, clean as-is)
- Component folders `ui/`, `layout/`, `home/`, `providers/`, `admin/`, `shop/`, `shared/`, `about/` — no barrel files (Next.js tree-shaking concern, too many import sites)

---

## Phase 1 — Move Form Components Out of Route Folders

### Files to move
```
src/app/checkout/checkout-form.tsx  →  src/components/checkout/checkout-form.tsx
src/app/contact/contact-form.tsx    →  src/components/contact/contact-form.tsx
```
Note: `src/components/contact/` already exists (has `contact-animations.tsx`)

### Import updates (3 sites)
```
src/app/checkout/page.tsx:
  "./checkout-form"  →  "@/components/checkout/checkout-form"

src/app/contact/page.tsx:
  "./contact-form"   →  "@/components/contact/contact-form"

src/__tests__/checkout-form.test.tsx:
  "@/app/checkout/checkout-form"  →  "@/components/checkout/checkout-form"
```

**Verify:** `tsc --noEmit && npx vitest run`

---

## Phase 2 — Reorganize lib/ Root (13 file moves)

### New directories to create
```
src/lib/animation/
src/lib/payment/
src/lib/http/
src/lib/shop/
src/lib/content/
src/lib/db/
```

### Files to move
```
ANIMATION GROUP:
  src/lib/gsap-config.ts              →  src/lib/animation/gsap-config.ts
  src/lib/scroll-layout.ts            →  src/lib/animation/scroll-layout.ts
  src/lib/scroll-trigger-refresh.ts   →  src/lib/animation/scroll-trigger-refresh.ts
  src/lib/wait-for-layout-stable.ts   →  src/lib/animation/wait-for-layout-stable.ts

PAYMENT GROUP:
  src/lib/payfast.ts                  →  src/lib/payment/payfast.ts
  src/lib/order-access-token.ts       →  src/lib/payment/order-access-token.ts

HTTP:
  src/lib/api-envelope.ts             →  src/lib/http/api-envelope.ts

SHOP GROUP:
  src/lib/catalog.ts                  →  src/lib/shop/catalog.ts
  src/lib/data.ts                     →  src/lib/shop/data.ts
  src/lib/diecast-assets.ts           →  src/lib/shop/diecast-assets.ts

CONTENT:
  src/lib/copy-constants.ts           →  src/lib/content/copy-constants.ts

DB GROUP:
  src/lib/services.ts                 →  src/lib/db/services.ts
  src/lib/types.ts                    →  src/lib/db/types.ts
```

### Import path remappings (sed across all src/ .ts/.tsx files)
```
@/lib/gsap-config             →  @/lib/animation/gsap-config
@/lib/scroll-layout           →  @/lib/animation/scroll-layout
@/lib/scroll-trigger-refresh  →  @/lib/animation/scroll-trigger-refresh
@/lib/wait-for-layout-stable  →  @/lib/animation/wait-for-layout-stable
@/lib/payfast                 →  @/lib/payment/payfast
@/lib/order-access-token      →  @/lib/payment/order-access-token
@/lib/api-envelope            →  @/lib/http/api-envelope
@/lib/catalog                 →  @/lib/shop/catalog
@/lib/data                    →  @/lib/shop/data
@/lib/diecast-assets          →  @/lib/shop/diecast-assets
@/lib/copy-constants          →  @/lib/content/copy-constants
@/lib/services                →  @/lib/db/services
@/lib/types                   →  @/lib/db/types
```

### Internal relative imports to fix after moves
- `src/lib/animation/scroll-trigger-refresh.ts` imports `@/lib/gsap-config` and `@/lib/scroll-layout` — caught by sed pass above
- `src/lib/shop/data.ts` imports `@/lib/diecast-assets` — caught by sed pass above

**Caution:** `@/lib/types` sed must NOT match `@/lib/supabase/database.types` — pattern is specific enough since the other path includes `supabase/`, verify after running.

**Verify:** `tsc --noEmit && npx vitest run`

---

## Phase 3 — Add Barrel Files (2 files only)

Only two barrels justified — animation and payment groups have enough co-usage to warrant them. All others skipped (Next.js tree-shaking concern).

### `src/lib/animation/index.ts`
```ts
export { gsap, ScrollTrigger } from "./gsap-config";
export * from "./scroll-layout";
export { scheduleScrollTriggerRefresh } from "./scroll-trigger-refresh";
export { waitForLayoutStable } from "./wait-for-layout-stable";
```

### `src/lib/payment/index.ts`
```ts
export * from "./payfast";
export * from "./order-access-token";
```

These barrels are additive — existing import paths still work. Future code can use `@/lib/animation` or the specific file.

**Verify:** `tsc --noEmit && npx vitest run`

---

## Final lib/ Structure

```
src/lib/
├── animation/
│   ├── gsap-config.ts
│   ├── index.ts
│   ├── scroll-layout.ts
│   ├── scroll-trigger-refresh.ts
│   └── wait-for-layout-stable.ts
├── content/
│   └── copy-constants.ts
├── db/
│   ├── services.ts
│   └── types.ts
├── emails/
│   ├── send.ts
│   └── templates.ts
├── http/
│   └── api-envelope.ts
├── payment/
│   ├── index.ts
│   ├── order-access-token.ts
│   └── payfast.ts
├── shop/
│   ├── catalog.ts
│   ├── data.ts
│   └── diecast-assets.ts
├── supabase/
│   ├── client.ts
│   ├── database.types.ts
│   ├── middleware.ts
│   └── server.ts
└── utils.ts
```

---

## Critical Files

- [src/app/checkout/checkout-form.tsx](../src/app/checkout/checkout-form.tsx)
- [src/app/contact/contact-form.tsx](../src/app/contact/contact-form.tsx)
- [src/app/checkout/page.tsx](../src/app/checkout/page.tsx)
- [src/app/contact/page.tsx](../src/app/contact/page.tsx)
- [src/__tests__/checkout-form.test.tsx](../src/__tests__/checkout-form.test.tsx)
- [src/lib/scroll-trigger-refresh.ts](../src/lib/scroll-trigger-refresh.ts) (internal imports)
- [src/lib/data.ts](../src/lib/data.ts) (imports diecast-assets)

---

## Verification

After each phase:
1. `tsc --noEmit` — zero type errors
2. `npx vitest run` — all 7 suites pass
3. `grep -r "@/lib/gsap-config\|@/lib/scroll-layout\|@/lib/services\|@/lib/types\b" src/` — zero results (confirm old paths gone)
4. Start dev server, load homepage + shop + checkout — no runtime errors
