import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { CardReveal } from "@/components/shared/card-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/data";
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

  const products = await getProducts(status);

  return (
    <>
      <SiteHeader />
      <main className="pb-16 bg-bg-base">
        <section className="border-b border-border-dark bg-[#0a0a0a] py-16">
          <div className="frame-container flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="display-kicker text-[10px] text-brand uppercase tracking-[0.3em] mb-2">DROP ARCHIVE</p>
              <h1 className="display-kicker mt-4 text-7xl leading-none md:display-fluid">THE COLLECTION</h1>
            </div>
          </div>
        </section>

        <section className="border-b border-border-dark/60 bg-[#030303]">
          <div className="frame-container py-6">
            <div className="flex flex-wrap gap-4">
              {statusOptions.map((option) => {
                const isActive = option.value === status || (!option.value && !status);
                const href = option.value ? `/shop?status=${option.value}` : "/shop";

                return (
                  <Button
                    key={option.label}
                    render={<Link href={href} />}
                    variant={isActive ? "brand" : "outline"}
                    className={`display-kicker px-8 py-6 text-sm tracking-[0.2em] ${
                      isActive
                        ? "border-brand bg-brand text-text-primary hover:bg-brand-mid"
                        : "border-border-dark bg-transparent text-text-muted hover:border-text-primary hover:text-text-primary hover:bg-transparent"
                    }`}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="frame-container grid gap-8 py-16 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const ctaLabel =
              product.status === "available"
                ? "Order Now"
                : product.status === "preorder"
                  ? "Pre-Order Now"
                  : "Notify Me";

            return (
              <CardReveal key={product.id} index={index}>
              {/* ARCHITECTURE CONSTRAINT: The outer Link wraps the entire card.
                  Do NOT add render={<Link />} to any Button inside this card.
                  That creates nested <a> elements and hydration failures. */}
              <Link
                href={`/shop/${product.slug}`}
                className={`group flex h-full flex-col border border-border-dark bg-bg-surface hover:border-brand transition-colors duration-300 ${
                  product.status === "unavailable" ? "opacity-70" : "opacity-100"
                }`}
              >
                <div className="relative overflow-hidden bg-[#0A0A0A]">
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="scale-105 object-cover grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                    />
                    <div className="absolute top-4 right-4 rotate-12 border border-brand text-brand px-2 py-1 text-[10px] uppercase tracking-widest bg-[#1A1614]/80 backdrop-blur-sm z-10">
                      MADE TO ORDER
                    </div>
                  </div>

                  <div className="absolute left-4 top-4 z-20">
                    <StatusBadge status={product.status} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-8 border-t-2 border-t-transparent transition-colors group-hover:border-t-brand">
                  <h2 className="display-kicker text-4xl leading-none">{product.name}</h2>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-text-muted">{product.brand}</p>

                  <div className="mt-auto pt-10">
                    <span className="bg-brand text-text-primary px-3 py-1 text-xs display-kicker inline-block">
                      Rs. {product.price.toLocaleString("en-PK")}
                    </span>

                    {product.status === "preorder" ? (
                      <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#ffb3af]">
                        Est. delivery {product.deliveryDays}-{product.deliveryDays + 3} working days
                      </p>
                    ) : null}

                    <div className="mt-8">
                      {product.status === "unavailable" ? (
                        <Button
                          variant="muted"
                          className="display-kicker w-full justify-center py-6 text-sm"
                        >
                          {ctaLabel}
                        </Button>
                      ) : (
                        <Button
                          variant="brand"
                          className="display-kicker w-full justify-center py-6 text-sm"
                        >
                          {ctaLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              </CardReveal>
            );
          })}
        </section>

        <section className="border-t border-border-dark/30 bg-[#0E0E0E] py-32">
          <div className="frame-container max-w-4xl text-center">
            <h2 className="display-kicker text-5xl leading-none md:text-7xl">JOIN THE INNER CIRCLE</h2>
            <p className="mx-auto mt-6 max-w-2xl text-xs uppercase tracking-[0.26em] text-text-muted">
              Early access to limited releases and mechanical updates. No clutter. Just permanence.
            </p>

            <form className="mx-auto mt-16 flex max-w-3xl flex-col gap-6 md:flex-row" action="/api/notify" method="post">
              <Input
                type="email"
                name="email"
                required
                placeholder="COMMUNICATION PROTOCOL (EMAIL)"
                className="flex-1 border-0 border-b-2 border-[#494542] bg-transparent px-0 py-6 text-center text-sm uppercase tracking-[0.2em] text-text-primary focus-visible:border-[#8E130C] focus-visible:ring-0 md:text-left rounded-none"
              />
              <Input type="hidden" name="productSlug" value="collection-alert" className="hidden" />
              <Button
                type="submit"
                variant="brand"
                className="display-kicker px-10 py-6 text-sm tracking-[0.3em] rounded-none"
              >
                AUTHENTICATE
              </Button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
