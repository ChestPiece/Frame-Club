import { SiteFooter } from "@/components/layout/site-footer";
import { CatalogProductCard } from "@/components/shop/catalog-product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageScrollAnimations } from "@/components/shared/page-scroll-animations";
import { ShopAnimations } from "@/components/shop/shop-animations";
import { getProducts } from "@/lib/shop/data";
import { applyCatalogQuery, normalizeCatalogQuery } from "@/lib/shop/catalog";

type ShopPageProps = {
  searchParams: Promise<{ status?: string; q?: string; brand?: string; sort?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const query = normalizeCatalogQuery(params);
  const baseProducts = await getProducts(query.status);
  const products = applyCatalogQuery(baseProducts, query);

  return (
    <>
      <main id="main-content" className="pb-16 pt-30 bg-bg-base">
        <PageScrollAnimations config="shop">
          <ShopAnimations />
          <section
            data-shop-grid
            className="frame-container grid grid-cols-1 gap-10 pt-14 pb-24 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3 xl:grid-cols-4"
            data-animate-page="shop"
          >
            {products.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </section>

          {products.length === 0 ? (
            <section className="frame-container pb-24">
              <div className="border border-border/30 bg-bg-deep p-8 sm:p-12">
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
