import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { CatalogProductCard } from "@/components/shop/catalog-product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageScrollAnimations } from "@/components/shared/page-scroll-animations";
import { ShopAnimations } from "@/components/shop/shop-animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/data";
import {
  applyCatalogQuery,
  catalogSortOptions,
  getCatalogBrands,
  normalizeCatalogQuery,
} from "@/lib/catalog";
import type { ProductStatus } from "@/lib/types";

type ShopPageProps = {
  searchParams: Promise<{ status?: string; q?: string; brand?: string; sort?: string }>;
};

const statusOptions: Array<{ label: string; value?: ProductStatus }> = [
  { label: "All" },
  { label: "Available", value: "available" },
  { label: "Pre-Order", value: "preorder" },
  { label: "Unavailable", value: "unavailable" },
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const query = normalizeCatalogQuery(params);
  const baseProducts = await getProducts(query.status);
  const products = applyCatalogQuery(baseProducts, query);
  const brands = getCatalogBrands(baseProducts);

  function buildStatusHref(nextStatus?: ProductStatus) {
    const nextParams = new URLSearchParams();
    if (nextStatus) nextParams.set("status", nextStatus);
    if (query.q) nextParams.set("q", query.q);
    if (query.brand) nextParams.set("brand", query.brand);
    if (query.sort && query.sort !== "newest") nextParams.set("sort", query.sort);

    const value = nextParams.toString();
    return value ? `/shop?${value}` : "/shop";
  }

  return (
    <>
      <main id="main-content" className="pb-16 pt-30 bg-bg-base">
        <PageScrollAnimations config="shop">
        <ShopAnimations />
        <section
          data-animate-page="shop"
          data-shop-hero
          className="border-b border-border bg-bg-deep py-12 sm:py-16"
        >
          <div className="frame-container flex flex-wrap items-end justify-between gap-6">
            <div>
              <p
                data-shop-kicker
                className="display-kicker text-[10px] text-brand uppercase tracking-[0.3em] mb-2"
              >
                DROP ARCHIVE
              </p>
              <h1 data-shop-heading className="display-kicker mt-4 display-section leading-none">
                THE COLLECTION
              </h1>
              <svg
                aria-hidden="true"
                data-drawsvg-shop-accent
                className="mt-6 h-px w-32 sm:w-48 max-w-full block text-brand"
                viewBox="0 0 192 1"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="0.5"
                  x2="192"
                  y2="0.5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              <p data-shop-count className="mt-4 text-sm text-text-muted">
                {products.length} frame{products.length === 1 ? "" : "s"} found
                {query.q ? ` for "${query.q}"` : ""}.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg-deep">
          <div className="frame-container space-y-8 py-6">
            <div className="flex flex-wrap gap-4">
              {statusOptions.map((option) => {
                const isActive = option.value === query.status || (!option.value && !query.status);
                const href = buildStatusHref(option.value);

                return (
                  <Button
                    key={option.label}
                    render={<Link href={href} />}
                    variant={isActive ? "brand" : "outline"}
                    className={`display-kicker px-8 py-6 text-sm tracking-[0.2em] ${
                      isActive
                        ? "border-brand bg-brand text-text-primary hover:bg-brand-mid"
                        : "border-border bg-transparent text-text-muted hover:border-text-primary hover:text-text-primary hover:bg-transparent"
                    }`}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <form action="/shop" method="get" className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
              {query.status ? <Input type="hidden" name="status" value={query.status} /> : null}

              <Input
                name="q"
                defaultValue={query.q ?? ""}
                placeholder="Search by car, brand, or description"
                className="border border-border bg-bg-surface"
              />

              <select
                name="brand"
                defaultValue={query.brand ?? ""}
                className="h-11 sm:h-10 border border-border bg-bg-surface px-3 text-sm text-text-primary"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              <select
                name="sort"
                defaultValue={query.sort}
                className="h-11 sm:h-10 border border-border bg-bg-surface px-3 text-sm text-text-primary"
              >
                {catalogSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button type="submit" variant="brand" className="display-kicker px-6">
                Apply
              </Button>
            </form>
          </div>
        </section>

        <section className="frame-container grid grid-cols-1 gap-8 py-16 sm:grid-cols-2 lg:grid-cols-3" data-animate-page="shop">
          {products.map((product) => (
            <CatalogProductCard key={product.id} product={product} />
          ))}
        </section>

        {products.length === 0 ? (
          <section className="frame-container pb-16">
            <EmptyState
              title="No frames match your filters."
              description="Try removing a brand filter or clearing search to explore the full catalog."
              cta={{ label: "Reset Filters", href: "/shop" }}
            />
          </section>
        ) : null}

        <section className="frame-container pb-16">
          <div className="border border-border bg-bg-deep px-5 py-4 text-xs uppercase tracking-[0.18em] text-text-muted">
            Showing {products.length} / {baseProducts.length} {query.status ? `${query.status} ` : ""}products
          </div>
        </section>

        </PageScrollAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
