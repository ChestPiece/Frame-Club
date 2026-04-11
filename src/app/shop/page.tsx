import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getProducts } from "@/lib/mock-data";
import type { ProductStatus } from "@/lib/types";

type ShopPageProps = {
  searchParams: Promise<{ status?: string }>;
};

const statusOptions: Array<{ label: string; value?: ProductStatus }> = [
  { label: "All" },
  { label: "Available", value: "available" },
  { label: "Pre-Order", value: "preorder" },
  { label: "Unavailable", value: "unavailable" },
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const status =
    params.status === "available" ||
    params.status === "preorder" ||
    params.status === "unavailable"
      ? params.status
      : undefined;

  const products = getProducts(status);

  return (
    <>
      <SiteHeader />
      <main className="pb-16">
        <section className="border-b border-border-dark bg-bg-surface py-10">
          <div className="frame-container flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="technical-label text-[10px] text-[#ffb3af]">Premium Archive</p>
              <h1 className="display-kicker mt-3 text-6xl leading-none md:text-8xl">THE COLLECTION</h1>
            </div>

            <div className="border border-border-dark bg-bg-recessed px-4 py-2">
              <p className="technical-label text-[10px] text-text-muted">Sort By: Newest</p>
            </div>
          </div>
        </section>

        <section className="border-b border-border-dark/60 bg-bg-base">
          <div className="frame-container overflow-x-auto py-6">
            <div className="flex min-w-max gap-3">
              {statusOptions.map((option) => {
                const isActive = option.value === status || (!option.value && !status);
                const href = option.value ? `/shop?status=${option.value}` : "/shop";

                return (
                  <Link
                    key={option.label}
                    href={href}
                    className={`display-kicker border px-7 py-3 text-xs tracking-[0.2em] transition-colors ${
                      isActive
                        ? "border-brand bg-brand text-text-primary"
                        : "border-border-dark bg-bg-recessed text-text-muted hover:border-text-primary hover:text-text-primary"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="frame-container grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const ctaLabel =
              product.status === "available"
                ? "Order Now"
                : product.status === "preorder"
                  ? "Pre-Order Now"
                  : "Notify Me";

            return (
              <article
                key={product.id}
                className={`group flex flex-col border border-border-dark bg-bg-surface ${
                  product.status === "unavailable" ? "opacity-70" : "opacity-100"
                }`}
              >
                <div className="relative overflow-hidden bg-bg-recessed">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="aspect-4/3 w-full scale-105 object-cover grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                  />

                  <div className="absolute right-4 top-4">
                    <StatusBadge status={product.status} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-8">
                  <h2 className="display-kicker text-4xl leading-none">{product.name}</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-muted">{product.brand}</p>

                  <div className="mt-auto pt-8">
                    <p className="text-xl font-semibold">Rs. {product.price.toLocaleString("en-PK")}</p>

                    {product.status === "preorder" ? (
                      <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#f5c4c1]">
                        Est. delivery {product.deliveryDays}-{product.deliveryDays + 3} working days
                      </p>
                    ) : null}

                    <div className="mt-6 grid gap-3">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="display-kicker border border-border-dark px-4 py-3 text-center text-xs transition-colors hover:bg-bg-elevated"
                      >
                        View Specs
                      </Link>

                      {product.status === "unavailable" ? (
                        <Link
                          href={`/contact?intent=notify&product=${product.slug}`}
                          className="display-kicker border border-border-dark bg-bg-recessed px-4 py-3 text-center text-xs text-text-muted transition-colors hover:text-text-primary"
                        >
                          {ctaLabel}
                        </Link>
                      ) : (
                        <Link
                          href={`/shop/${product.slug}`}
                          className="display-kicker border border-brand bg-brand px-4 py-3 text-center text-xs transition-colors hover:bg-brand-mid"
                        >
                          {ctaLabel}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="border-t border-border-dark/30 bg-bg-recessed py-24">
          <div className="frame-container max-w-4xl text-center">
            <h2 className="display-kicker text-5xl leading-none md:text-7xl">JOIN THE INNER CIRCLE</h2>
            <p className="mx-auto mt-6 max-w-2xl text-xs uppercase tracking-[0.26em] text-text-muted">
              Early access to limited releases and mechanical updates. No clutter. Just permanence.
            </p>

            <form className="mx-auto mt-12 flex max-w-3xl flex-col gap-3 md:flex-row" action="/api/notify" method="post">
              <input
                type="email"
                name="email"
                required
                placeholder="COMMUNICATION PROTOCOL (EMAIL)"
                className="machined-field border border-border-dark/60 bg-bg-surface px-5 py-4 text-center text-xs uppercase tracking-[0.2em] md:text-left"
              />
              <input type="hidden" name="productSlug" value="collection-alert" />
              <button
                type="submit"
                className="display-kicker border border-brand bg-brand px-8 py-4 text-xs tracking-[0.3em] transition-colors hover:bg-brand-mid"
              >
                AUTHENTICATE
              </button>
            </form>
          </div>
        </section>

        <section className="border-t border-border-dark bg-bg-recessed py-20 text-center">
          <div className="frame-container max-w-3xl">
            <h2 className="display-kicker text-5xl leading-none md:text-7xl">THE COLLECTION — Every frame is made to order. No two are exactly alike.</h2>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
