import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getProductBySlug, getRelatedProducts } from "@/lib/mock-data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product.slug);
  const primaryCta = product.status === "preorder" ? "Pre-Order Now" : "Order Now";
  const preorderCopy = `Estimated delivery ${product.deliveryDays}-${product.deliveryDays + 3} working days`;

  const backgroundPatterns: Record<string, string | undefined> = {
    "carbon-grid": "repeating-linear-gradient(45deg, rgba(245,245,245,0.14) 0 1px, transparent 1px 4px)",
    "race-line": "linear-gradient(135deg, transparent 44%, rgba(245,245,245,0.18) 45%, transparent 46%)",
    atlas: "repeating-linear-gradient(90deg, rgba(245,245,245,0.14) 0 1px, transparent 1px 6px)",
    monolith: undefined,
  };

  return (
    <>
      <SiteHeader />

      <main className="pb-24">
        <section className="frame-container py-12">
          <nav className="technical-label mb-12 text-[10px] text-text-muted">
            <Link href="/" className="hover:text-text-primary">
              Home
            </Link>{" "}
            &gt;{" "}
            <Link href="/shop" className="hover:text-text-primary">
              Shop
            </Link>{" "}
            &gt; <span className="text-text-primary">{product.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-10">
            <section className="space-y-4 lg:col-span-6">
              <article className="relative aspect-4/5 border border-[#544342]/30 bg-[#0f0f0f] p-8">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </article>

              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <article
                    key={`${image}-${index}`}
                    className={`aspect-square border ${
                      index === 0 ? "border-2 border-brand" : "border-[#544342]/30"
                    } bg-[#0f0f0f]`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`h-full w-full object-cover ${
                        index === 0 ? "opacity-85" : "opacity-60 transition-opacity hover:opacity-100"
                      }`}
                    />
                  </article>
                ))}
              </div>
            </section>

            <section className="lg:col-span-4">
              <div className="mb-8">
                <p className="technical-label text-[10px] text-text-muted">{product.brand}</p>
                <h1 className="display-kicker mt-3 text-6xl leading-none md:text-8xl">{product.name}</h1>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-text-muted">Model Years: {product.years}</p>
                <div className="mt-4 flex items-center gap-4">
                  <StatusBadge status={product.status} />
                  <p className="text-2xl font-semibold">Rs. {product.price.toLocaleString("en-PK")}</p>
                </div>
              </div>

              <form action="/checkout" className="space-y-7">
                <input type="hidden" name="slug" value={product.slug} />

                <div>
                  <p className="technical-label text-[10px] text-text-muted">Background Design</p>
                  <div className="mt-3 flex gap-3">
                    {product.backgrounds.map((background, index) => (
                      <label key={background.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="background"
                          value={background.value}
                          defaultChecked={index === 0}
                          className="peer sr-only"
                        />
                        <span
                          className="block h-10 w-10 border border-border-dark/40 peer-checked:border-brand"
                          style={{
                            backgroundColor: background.swatch,
                            backgroundImage: backgroundPatterns[background.value],
                          }}
                          title={background.label}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="technical-label text-[10px] text-text-muted" htmlFor="notes">
                    Special Instructions
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Add custom text or delivery notes..."
                    className="machined-field mt-3 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  {product.status === "unavailable" ? (
                    <Link
                      href={`/contact?intent=notify&product=${product.slug}`}
                      className="display-kicker inline-flex w-full justify-center border border-border-dark bg-bg-surface px-6 py-4 text-xl text-text-muted"
                    >
                      Notify Me
                    </Link>
                  ) : (
                    <button
                      type="submit"
                      className="display-kicker w-full border border-brand bg-brand px-6 py-4 text-xl transition-colors hover:bg-brand-mid"
                    >
                      {primaryCta} — Rs. 5,000
                    </button>
                  )}

                  {product.status === "preorder" ? (
                    <p className="text-center text-[10px] uppercase tracking-[0.16em] text-[#f5c4c1]">{preorderCopy}</p>
                  ) : null}

                  {product.status === "unavailable" ? (
                    <p className="text-center text-[10px] uppercase tracking-[0.16em] text-text-muted">
                      This model is currently unavailable. Use notify to capture interest.
                    </p>
                  ) : null}

                  <Link
                    href="https://wa.me/923001234567"
                    className="display-kicker inline-flex w-full items-center justify-center border border-border-dark px-6 py-4 text-lg transition-colors hover:bg-bg-surface"
                  >
                    Ask a Question on WhatsApp
                  </Link>
                </div>

                <div className="flex justify-between border-t border-border-dark/20 pt-5 text-[10px] uppercase tracking-[0.12em] text-text-muted">
                  <span>Nationwide Delivery</span>
                  <span>Secure Payment</span>
                  <span>Handcrafted to Order</span>
                </div>
              </form>
            </section>
          </div>
        </section>

        <section className="bg-bg-recessed py-24">
          <div className="frame-container">
            <h2 className="display-kicker text-5xl leading-none md:text-6xl">THE SPECS</h2>

            <div className="mt-10 grid grid-cols-2 gap-px border border-border-dark/20 bg-border-dark/20 md:grid-cols-5">
              {product.specs.map((spec) => (
                <article key={spec.label} className="bg-bg-base p-7">
                  <p className="technical-label text-[10px] text-text-muted">{spec.label}</p>
                  <p className="mt-2 text-xl font-semibold">{spec.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="frame-container py-20">
          <h2 className="display-kicker text-5xl leading-none md:text-6xl">YOU MIGHT ALSO LIKE</h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {related.map((item) => (
              <article key={item.id} className="group">
                <div className="relative mb-5 aspect-4/5 overflow-hidden bg-bg-recessed">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
                    <span className="display-kicker border border-bg-base bg-text-primary px-6 py-2 text-xs text-bg-base">
                      VIEW FRAME
                    </span>
                  </div>
                </div>

                <h3 className="display-kicker text-3xl leading-none">{item.name}</h3>
                <p className="mt-1 text-sm text-text-muted">Rs. {item.price.toLocaleString("en-PK")}</p>
                <Link href={`/shop/${item.slug}`} className="sr-only">
                  View {item.name}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
