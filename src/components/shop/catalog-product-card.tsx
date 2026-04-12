import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Product } from "@/lib/types";

type CatalogProductCardProps = {
  product: Product;
};

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const defaultBackground = product.backgrounds[0]?.value ?? "carbon-grid";
  const quickAddHref = `/checkout?slug=${encodeURIComponent(product.slug)}&background=${encodeURIComponent(defaultBackground)}`;

  return (
    <article
      data-animate-item
      className={`group flex flex-col border border-border-dark bg-bg-surface transition-colors duration-300 hover:border-brand ${
        product.status === "unavailable" ? "opacity-75" : "opacity-100"
      }`}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#0A0A0A]">
          <div className="relative aspect-4/3 w-full overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="scale-105 object-cover grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
            />
            <div className="absolute right-4 top-4 z-10 rotate-12 border border-brand bg-[#1A1614]/80 px-2 py-1 text-[10px] uppercase tracking-widest text-brand backdrop-blur-sm">
              MADE TO ORDER
            </div>
          </div>

          <div className="absolute left-4 top-4 z-20">
            <StatusBadge status={product.status} />
          </div>
        </div>

        <div className="border-t-2 border-t-transparent p-7 transition-colors group-hover:border-t-brand">
          <h2 className="display-kicker text-xl sm:text-2xl leading-none">{product.name}</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-muted">{product.brand}</p>
          <p className="mt-4 line-clamp-2 text-sm text-text-muted">{product.description}</p>
        </div>
      </Link>

      <div className="mt-auto space-y-4 px-7 pb-7">
        <div className="flex items-center justify-between border border-border-dark/60 bg-bg-recessed px-3 py-2">
          <span className="technical-label text-[10px] text-text-muted">Price</span>
          <span className="display-kicker text-sm text-text-primary">
            Rs. {product.price.toLocaleString("en-PK")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            render={<Link href={`/shop/${product.slug}`} />}
            variant="outline"
            className="display-kicker w-full justify-center"
          >
            View Specs
          </Button>

          {product.status === "unavailable" ? (
            <Button
              render={<Link href={`/contact?product=${encodeURIComponent(product.slug)}`} />}
              variant="muted"
              className="display-kicker w-full justify-center"
            >
              Notify Me
            </Button>
          ) : (
            <Button
              render={<Link href={quickAddHref} />}
              variant="brand"
              className="display-kicker w-full justify-center"
            >
              Quick Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
