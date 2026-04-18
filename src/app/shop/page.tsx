import { SiteFooter } from "@/components/layout/site-footer";
import { CatalogProductCard } from "@/components/shop/catalog-product-card";
import { CatalogToolbar } from "@/components/shop/catalog-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { PageScrollAnimations } from "@/components/shared/page-scroll-animations";
import { ShopAnimations } from "@/components/shop/shop-animations";
import { getProducts } from "@/lib/shop/data";
import { applyCatalogQuery, getCatalogBrands, normalizeCatalogQuery } from "@/lib/shop/catalog";

type ShopPageProps = {
  searchParams: Promise<{ status?: string; q?: string; brand?: string; sort?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const query = normalizeCatalogQuery(params);
  const allProducts = await getProducts();
  const brands = getCatalogBrands(allProducts);
  const baseProducts = query.status
    ? allProducts.filter((p) => p.status === query.status)
    : allProducts;
  const products = applyCatalogQuery(baseProducts, query);

  const animationKey = [
    query.status ?? "",
    query.q ?? "",
    query.brand ?? "",
    query.sort,
    ...products.map((p) => p.id),
  ].join("|");

  const resultLabel =
    products.length === 0
      ? "No frames match"
      : products.length === 1
        ? "1 frame"
        : `${products.length} frames`;

  return (
    <>
      <main id="main-content" className="pb-16 pt-30 bg-bg-base">
        <PageScrollAnimations config="shop" contentKey={animationKey}>
          <ShopAnimations layoutKey={animationKey} />
          <div className="bg-bg-surface">
            <div className="frame-container scroll-margin-site-header pt-14 pb-12">
              <header className="max-w-3xl">
                <p data-animate-heading className="display-kicker text-text-muted text-sm tracking-[0.2em]">
                  The collection
                </p>
                <h1 className="display-kicker display-section mt-3 text-text-primary">THE COLLECTION</h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
                  Every frame is made to order. No two are exactly alike.
                </p>
              </header>

              <CatalogToolbar query={query} brands={brands} />

              <p className="technical-label mt-8 text-[10px] text-text-muted" aria-live="polite">
                {resultLabel}
              </p>
            </div>
          </div>

          <section
            data-shop-grid
            className="frame-container grid grid-cols-1 gap-10 pt-12 pb-24 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3"
            data-animate-page="shop"
          >
            {products.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </section>

          {products.length === 0 ? (
            <section className="frame-container pb-24">
              <div className="bg-bg-deep p-8 sm:p-12">
                <EmptyState
                  title="No frames match your filters."
                  description="Try removing a brand filter or clearing search to explore the full catalog."
                  cta={{ label: "Reset Filters", href: "/shop" }}
                />
              </div>
            </section>
          ) : null}
        </PageScrollAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
