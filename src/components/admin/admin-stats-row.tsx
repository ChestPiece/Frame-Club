type AdminStats = {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  inProduction: number;
};

type AdminStatsRowProps = {
  stats: AdminStats;
  pipelinePct: number;
};

export function AdminStatsRow({ stats, pipelinePct }: AdminStatsRowProps) {
  return (
    <section className="grid gap-0 md:grid-cols-2 lg:grid-cols-4">
      <article className="border border-border bg-bg-surface p-8">
        <div className="flex items-start justify-between">
          <p className="technical-label text-[10px] text-text-muted">Total Orders</p>
        </div>
        <p className="mt-4 text-4xl font-bold">{stats.totalOrders}</p>
      </article>

      <article className="border border-border border-l-0 bg-bg-surface p-8">
        <div className="flex items-start justify-between">
          <p className="technical-label text-[10px] text-text-muted">Pending Orders</p>
        </div>
        <p className="mt-4 text-4xl font-bold">{stats.pendingOrders}</p>
      </article>

      <article className="border border-border border-l-0 bg-bg-surface p-8">
        <div className="flex items-start justify-between">
          <p className="technical-label text-[10px] text-text-muted">Revenue (paid)</p>
        </div>
        <p className="mt-4 text-3xl font-bold">Rs. {stats.revenue.toLocaleString("en-PK")}</p>
      </article>

      <article className="border border-border border-l-0 bg-bg-surface p-8">
        <div className="flex items-start justify-between">
          <p className="technical-label text-[10px] text-text-muted">Frames In Production</p>
        </div>
        <p className="mt-4 text-4xl font-bold">{stats.inProduction}</p>
        <div className="mt-3 h-1 w-full bg-bg-deep">
          <div className="h-full bg-brand-bright" style={{ width: `${pipelinePct}%` }} />
        </div>
      </article>
    </section>
  );
}
