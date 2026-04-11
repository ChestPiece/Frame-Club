import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen bg-bg-base lg:grid-cols-[1.05fr_1fr]">
      <section className="flex items-center border-b border-border-dark bg-bg-recessed p-8 lg:border-b-0 lg:border-r lg:p-14">
        <div className="max-w-xl">
          <p className="technical-label text-[10px] text-text-muted">Admin Access</p>
          <h1 className="display-kicker mt-4 text-6xl leading-none md:text-8xl">ADMIN CORE</h1>
          <p className="mt-6 text-sm leading-relaxed text-text-muted">
            Protected operational console for orders, status updates, and inventory control.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-[#f5c4c1]">Auth wiring with Supabase is the next integration step.</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-8 lg:p-14">
        <article className="w-full max-w-md border border-border-dark bg-bg-surface p-8 md:p-10">
          <p className="technical-label text-[10px] text-text-muted">Sign In</p>
          <h2 className="display-kicker mt-3 text-5xl leading-none">OPERATOR LOGIN</h2>

          <form className="mt-7 space-y-4">
            <input placeholder="ADMIN EMAIL" className="machined-field" />
            <input type="password" placeholder="PASSWORD" className="machined-field" />

            <Link
              href="/admin"
              className="display-kicker inline-flex w-full items-center justify-center border border-brand bg-brand px-5 py-4 text-sm text-text-primary transition-colors hover:bg-brand-mid"
            >
              ENTER ADMIN
            </Link>
          </form>
        </article>
      </section>
    </main>
  );
}
