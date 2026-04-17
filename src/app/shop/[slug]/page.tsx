import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Package, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getProductBySlug, getRelatedProducts } from "@/lib/shop/data";
import { WHATSAPP_LINK } from "@/lib/content/copy-constants";

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
      <main id="main-content" className="pb-24">
        <section className="frame-container pt-16 pb-20">
          <nav className="mb-10 border-b border-border/20 pb-4 text-xs uppercase tracking-widest text-text-muted">
            <Link href="/" className="hover:text-text-primary">
              Home
            </Link>{" "}
            &gt;{" "}
            <Link href="/shop" className="hover:text-text-primary">
              Shop
            </Link>{" "}
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

            <section className="lg:col-span-4">
              <div className="mb-8 border-b border-border/20 pb-6">
                <p className="technical-label text-[10px] text-text-muted">{product.brand}</p>
                <h1 className="display-kicker mt-3 text-4xl leading-none sm:text-5xl md:text-8xl">{product.name}</h1>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-text-muted">Model Years: {product.years}</p>
                <div className="mt-4 flex items-center gap-4">
                  <StatusBadge status={product.status} />
                  <p className="text-3xl font-bold text-text-primary">Rs. {product.price.toLocaleString("en-PK")}</p>
                </div>
              </div>

              <form action="/checkout" className="space-y-7">
                <Input type="hidden" name="slug" value={product.slug} className="hidden" />

                <div>
                  <p className="technical-label mb-2 text-[10px] text-text-muted">Choose your background</p>
                  <p className="technical-label text-[10px] text-text-muted">Background Design</p>
                  <RadioGroup name="background" defaultValue={product.backgrounds[0]?.value} className="mt-3 flex flex-wrap gap-3">
                    {product.backgrounds.map((background) => (
                      <RadioGroupItem
                        key={background.value}
                        value={background.value}
                        className="h-12 w-12 border border-border/40 p-0 data-checked:border-brand min-touch-target"
                        style={{
                          backgroundColor: background.swatch,
                          backgroundImage: backgroundPatterns[background.value],
                        }}
                        title={background.label}
                        aria-label={background.label}
                      />
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <label className="technical-label text-[10px] text-text-muted" htmlFor="notes">
                    Special Instructions
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Add custom text or delivery notes..."
                    className="machined-field mt-3 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  {product.status === "unavailable" ? (
                    <Button
                      render={<Link href={`/contact?intent=notify&product=${product.slug}`} />}
                      variant="muted"
                      className="display-kicker w-full justify-center py-5 text-xl"
                    >
                      Notify Me
                    </Button>
                  ) : (
                    <Button type="submit" variant="brand" className="display-kicker w-full py-6 text-2xl min-touch-target">
                      {primaryCta} — Rs. 5,000
                    </Button>
                  )}

                  {product.status === "preorder" ? (
                    <p className="text-center text-[10px] uppercase tracking-[0.16em] text-text-accent">{preorderCopy}</p>
                  ) : null}

                  {product.status === "unavailable" ? (
                    <p className="text-center text-[10px] uppercase tracking-[0.16em] text-text-muted">
                      This model is currently unavailable. Use notify to capture interest.
                    </p>
                  ) : null}

                  <Button
                    render={<Link href={WHATSAPP_LINK} />}
                    variant="outline"
                    size="lg"
                    className="display-kicker w-full text-lg"
                  >
                    Ask a Question on WhatsApp
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-border/20 pt-5 text-[10px] uppercase tracking-[0.12em] text-text-muted">
                  <div className="flex items-center justify-center gap-2 min-inline-safe">
                    <Package size={14} strokeWidth={1.5} />
                    <span>Nationwide Delivery</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 min-inline-safe">
                    <Clock3 size={14} strokeWidth={1.5} />
                    <span>7-10 Days</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 min-inline-safe">
                    <ShieldCheck size={14} strokeWidth={1.5} />
                    <span>Secure Payment</span>
                  </div>
                </div>
              </form>
            </section>
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

        {related.length > 0 ? (
          <section className="frame-container py-28">
            <h2 className="display-kicker text-4xl leading-none sm:text-5xl md:text-6xl">YOU MIGHT ALSO LIKE</h2>
            <p className="mt-4 text-text-muted">Other frames you might obsess over.</p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {related.map((item) => (
                <article key={item.id} className="group">
                  <div className="relative mb-5 aspect-4/5 overflow-hidden bg-bg-deep">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-6 transition duration-700"
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
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
