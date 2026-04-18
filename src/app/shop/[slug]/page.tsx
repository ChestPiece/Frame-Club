import Image from "next/image";
import { notFound } from "next/navigation";
import { TransitionLink } from "@/components/layout/page-transition";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductDetailForm } from "@/components/shop/product-detail-form";
import { RelatedProductsSection } from "@/components/shop/related-products-section";
import { getProductBySlug, getRelatedProducts } from "@/lib/shop/data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.slug);

  return (
    <>
      <main id="main-content" className="pb-24">
        <section className="frame-container pt-16 pb-20">
          <nav className="mb-10 border-b border-border/20 pb-4 text-xs uppercase tracking-widest text-text-muted">
            <TransitionLink href="/" className="hover:text-text-primary">
              Home
            </TransitionLink>{" "}
            &gt;{" "}
            <TransitionLink href="/shop" className="hover:text-text-primary">
              Shop
            </TransitionLink>{" "}
            &gt; <span className="text-text-primary">{product.name}</span>
          </nav>

          <div className="grid gap-16 lg:grid-cols-10 lg:gap-20">
            <section className="space-y-4 lg:col-span-6">
              <article className="relative aspect-4/5 border border-border/30 bg-bg-recessed p-12">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-8"
                />
              </article>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {product.images.map((image, index) => (
                  <article
                    key={`${image}-${index}`}
                    className={`aspect-square border ${
                      index === 0 ? "border-2 border-brand-bright" : "border-border/30"
                    } bg-bg-deep`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        sizes="(max-width: 1024px) 33vw, 20vw"
                        className={`object-contain p-2 sm:p-3 ${
                          index === 0 ? "opacity-85" : "opacity-60 transition-opacity hover:opacity-100"
                        }`}
                      />
                    </div>
                  </article>
                ))}
              </div>
              <p className="technical-label text-[10px] text-text-muted">
                {Math.min(3, product.images.length)} of {product.images.length} views
              </p>
            </section>

            <ProductDetailForm product={product} />
          </div>
        </section>

        <section className="bg-bg-deep py-32">
          <div className="frame-container">
            <h2 className="display-kicker text-4xl leading-none sm:text-5xl md:text-6xl">THE SPECS</h2>
            <p className="mt-4 text-text-muted">Built to last. Engineered to display.</p>

            <div className="mt-10 grid grid-cols-2 gap-px border border-border/20 bg-border/20 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
              {product.specs.map((spec) => (
                <article key={spec.label} className="bg-bg-base p-9">
                  <p className="technical-label text-[10px] text-text-muted">{spec.label}</p>
                  <p className="mt-2 text-xl font-semibold">{spec.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RelatedProductsSection related={related} />
      </main>

      <SiteFooter />
    </>
  );
}
