"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransitionLink } from "@/components/layout/page-transition";
import { catalogSortOptions, type CatalogQuery } from "@/lib/shop/catalog";

const selectClassName =
  "machined-field h-10 w-full cursor-pointer px-2 py-1 text-[11px] text-text-primary outline-none transition-colors focus-visible:border-brand-bright disabled:cursor-not-allowed disabled:opacity-70";

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
        <label htmlFor="catalog-status" className="technical-label mb-2 block text-[10px] text-text-muted">
          Availability
        </label>
        <select
          id="catalog-status"
          name="status"
          className={selectClassName}
          defaultValue={query.status ?? "all"}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="preorder">Pre-Order</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div className="min-inline-safe w-full sm:w-[calc(50%-0.5rem)] lg:w-44">
        <label htmlFor="catalog-brand" className="technical-label mb-2 block text-[10px] text-text-muted">
          Brand
        </label>
        <select id="catalog-brand" name="brand" className={selectClassName} defaultValue={query.brand ?? ""}>
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="min-inline-safe w-full sm:w-[calc(50%-0.5rem)] lg:w-48">
        <label htmlFor="catalog-sort" className="technical-label mb-2 block text-[10px] text-text-muted">
          Sort
        </label>
        <select id="catalog-sort" name="sort" className={selectClassName} defaultValue={query.sort}>
          {catalogSortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
