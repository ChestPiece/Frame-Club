"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransitionLink } from "@/components/layout/page-transition";
import { cn } from "@/lib/utils";
import { catalogSortOptions, type CatalogQuery, type CatalogSortKey } from "@/lib/shop/catalog";

function parseSortKey(value: string): CatalogSortKey {
  if (
    value === "price-asc" ||
    value === "price-desc" ||
    value === "name-asc" ||
    value === "newest"
  ) {
    return value;
  }
  return "newest";
}

function buildShopPathFromState(
  q: string,
  status: string,
  brand: string,
  sort: CatalogSortKey
) {
  const params = new URLSearchParams();
  const trimmed = q.trim();
  if (trimmed) params.set("q", trimmed);
  if (status && status !== "all") params.set("status", status);
  if (brand) params.set("brand", brand);
  if (sort && sort !== "newest") params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function SortField({
  id,
  sort,
  onSort,
  triggerClassName,
  labelId,
}: {
  id: string;
  sort: CatalogSortKey;
  onSort: (v: CatalogSortKey) => void;
  triggerClassName?: string;
  labelId: string;
}) {
  return (
    <Select value={sort} onValueChange={(v) => onSort(parseSortKey(String(v ?? "")))}>
      <SelectTrigger id={id} className={triggerClassName} aria-labelledby={labelId}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {catalogSortOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type CatalogToolbarProps = {
  query: CatalogQuery;
  brands: string[];
  className?: string;
};

export function CatalogToolbar({ query, brands, className }: CatalogToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [q, setQ] = React.useState(query.q ?? "");
  const [status, setStatus] = React.useState(query.status ?? "all");
  const [brand, setBrand] = React.useState(query.brand ?? "");
  const [sort, setSort] = React.useState<CatalogSortKey>(query.sort ?? "newest");
  const brandSelectValue = brand || "__all__";

  React.useEffect(() => {
    setQ(query.q ?? "");
    setStatus(query.status ?? "all");
    setBrand(query.brand ?? "");
    setSort(query.sort ?? "newest");
  }, [query.q, query.status, query.brand, query.sort]);

  const apply = React.useCallback(() => {
    const path = buildShopPathFromState(q, status, brand, sort);
    startTransition(() => {
      router.push(path);
    });
  }, [router, q, status, brand, sort]);

  const mobileFiltersActive = React.useMemo(
    () =>
      Boolean(
        (query.q && query.q.trim().length > 0) ||
          query.status != null ||
          Boolean(query.brand && query.brand.length > 0)
      ),
    [query.q, query.status, query.brand]
  );

  const [mobileDetailsOpen, setMobileDetailsOpen] = React.useState(mobileFiltersActive);

  React.useEffect(() => {
    setMobileDetailsOpen(mobileFiltersActive);
  }, [mobileFiltersActive]);

  return (
    <div className={cn(className)}>
      {/* Mobile: sort first (above fold), heavy filters in collapsed <details> */}
      <form
        className="flex flex-col gap-3 lg:hidden"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        <div className="min-inline-safe w-full">
          <p id="catalog-sort-label" className="technical-label mb-1 block text-[10px] text-text-muted">
            Sort
          </p>
          <SortField
            id="catalog-sort-mobile"
            sort={sort}
            onSort={setSort}
            triggerClassName="h-9 w-full"
            labelId="catalog-sort-label"
          />
        </div>

        <details
          className="group border border-border bg-bg-deep [&_summary::-webkit-details-marker]:hidden"
          open={mobileDetailsOpen}
          onToggle={(e) => setMobileDetailsOpen(e.currentTarget.open)}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-text-primary transition-colors hover:bg-bg-surface">
            <span className="technical-label text-[10px] text-text-muted">Search &amp; narrow</span>
            <ChevronDown
              className="size-4 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180"
              strokeWidth={1.5}
              aria-hidden
            />
          </summary>
          <div className="flex flex-col gap-3 border-t border-border p-4">
            <div className="min-inline-safe w-full">
              <label htmlFor="catalog-q-mobile" className="technical-label mb-1 block text-[10px] text-text-muted">
                Search
              </label>
              <Input
                id="catalog-q-mobile"
                type="search"
                placeholder="Model or brand"
                autoComplete="off"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-9 w-full px-3 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-inline-safe w-full">
                <p id="catalog-status-label-m" className="technical-label mb-1 block text-[10px] text-text-muted">
                  Availability
                </p>
                <Select value={status} onValueChange={(v) => setStatus((v as string) || "all")}>
                  <SelectTrigger
                    id="catalog-status-mobile"
                    className="h-9 w-full"
                    aria-labelledby="catalog-status-label-m"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="preorder">Pre-Order</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-inline-safe w-full">
                <p id="catalog-brand-label-m" className="technical-label mb-1 block text-[10px] text-text-muted">
                  Brand
                </p>
                <Select
                  value={brandSelectValue}
                  onValueChange={(v) => setBrand(String(v) === "__all__" ? "" : String(v))}
                >
                  <SelectTrigger
                    id="catalog-brand-mobile"
                    className="h-9 w-full"
                    aria-labelledby="catalog-brand-label-m"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All brands</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </details>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="brand" size="default" className="display-kicker min-h-10 flex-1" disabled={pending}>
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            className="display-kicker min-h-10 flex-1"
            render={<TransitionLink href="/shop" />}
          >
            Reset
          </Button>
        </div>
      </form>

      {/* Desktop: full inline toolbar */}
      <form
        className="hidden flex-col gap-3 lg:flex lg:flex-row lg:flex-wrap lg:items-end lg:gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        <div className="min-inline-safe w-full lg:min-w-48 lg:flex-1 lg:max-w-md">
          <label htmlFor="catalog-q-desktop" className="technical-label mb-2 block text-[10px] text-text-muted">
            Search
          </label>
          <Input
            id="catalog-q-desktop"
            type="search"
            placeholder="Model or brand"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 w-full px-3 text-sm"
          />
        </div>

        <div className="min-inline-safe w-full sm:w-[calc(50%-0.5rem)] lg:w-40">
          <p id="catalog-status-label" className="technical-label mb-2 block text-[10px] text-text-muted">
            Availability
          </p>
          <Select value={status} onValueChange={(v) => setStatus((v as string) || "all")}>
            <SelectTrigger id="catalog-status" className="h-10 w-full" aria-labelledby="catalog-status-label">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="preorder">Pre-Order</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-inline-safe w-full sm:w-[calc(50%-0.5rem)] lg:w-44">
          <p id="catalog-brand-label" className="technical-label mb-2 block text-[10px] text-text-muted">
            Brand
          </p>
          <Select
            value={brandSelectValue}
            onValueChange={(v) => setBrand(String(v) === "__all__" ? "" : String(v))}
          >
            <SelectTrigger id="catalog-brand" className="h-10 w-full" aria-labelledby="catalog-brand-label">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-inline-safe w-full lg:w-48">
          <p id="catalog-sort-label-desktop" className="technical-label mb-2 block text-[10px] text-text-muted">
            Sort
          </p>
          <SortField
            id="catalog-sort-desktop"
            sort={sort}
            onSort={setSort}
            triggerClassName="h-10 w-full"
            labelId="catalog-sort-label-desktop"
          />
        </div>

        <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:pb-px">
          <Button type="submit" variant="brand" size="default" className="display-kicker min-touch-target flex-1 lg:flex-none" disabled={pending}>
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            className="display-kicker min-touch-target flex-1 lg:flex-none"
            render={<TransitionLink href="/shop" />}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
