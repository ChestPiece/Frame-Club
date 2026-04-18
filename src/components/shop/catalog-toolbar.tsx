"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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

type CatalogToolbarProps = {
  query: CatalogQuery;
  brands: string[];
};

function buildShopPath(fd: FormData) {
  const params = new URLSearchParams();
  const q = String(fd.get("q") ?? "").trim();
  const status = String(fd.get("status") ?? "");
  const brand = String(fd.get("brand") ?? "").trim();
  const sort = String(fd.get("sort") ?? "newest");
  if (q) params.set("q", q);
  if (status && status !== "all") params.set("status", status);
  if (brand) params.set("brand", brand);
  if (sort && sort !== "newest") params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function CatalogToolbar({ query, brands }: CatalogToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [status, setStatus] = React.useState(query.status ?? "all");
  const [brand, setBrand] = React.useState(query.brand ?? "");
  const [sort, setSort] = React.useState<CatalogSortKey>(query.sort ?? "newest");
  const brandSelectValue = brand || "__all__";

  React.useEffect(() => {
    setStatus(query.status ?? "all");
    setBrand(query.brand ?? "");
    setSort(query.sort ?? "newest");
  }, [query.status, query.brand, query.sort]);

  return (
    <form
      className="mt-10 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const path = buildShopPath(new FormData(e.currentTarget));
        startTransition(() => {
          router.push(path);
        });
      }}
    >
      <input type="hidden" name="status" value={status} readOnly />
      <input type="hidden" name="brand" value={brand} readOnly />
      <input type="hidden" name="sort" value={sort} readOnly />

      <div className="min-inline-safe w-full lg:min-w-48 lg:flex-1 lg:max-w-md">
        <label htmlFor="catalog-q" className="technical-label mb-2 block text-[10px] text-text-muted">
          Search
        </label>
        <Input
          id="catalog-q"
          name="q"
          type="search"
          placeholder="Model or brand"
          autoComplete="off"
          defaultValue={query.q ?? ""}
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

      <div className="min-inline-safe w-full sm:w-[calc(50%-0.5rem)] lg:w-48">
        <p id="catalog-sort-label" className="technical-label mb-2 block text-[10px] text-text-muted">
          Sort
        </p>
        <Select value={sort} onValueChange={(v) => setSort(parseSortKey(String(v ?? "")))}>
          <SelectTrigger id="catalog-sort" className="h-10 w-full" aria-labelledby="catalog-sort-label">
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
  );
}
