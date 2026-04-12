import type { Product, ProductStatus } from "@/lib/types";

export type CatalogSortKey = "newest" | "price-asc" | "price-desc" | "name-asc";

export type CatalogQuery = {
  status?: ProductStatus;
  q?: string;
  brand?: string;
  sort: CatalogSortKey;
};

export const catalogSortOptions: Array<{ label: string; value: CatalogSortKey }> = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
];

export function normalizeCatalogQuery(params: {
  status?: string;
  q?: string;
  brand?: string;
  sort?: string;
}): CatalogQuery {
  const status =
    params.status === "available" ||
    params.status === "preorder" ||
    params.status === "unavailable"
      ? params.status
      : undefined;

  const sort =
    params.sort === "price-asc" ||
    params.sort === "price-desc" ||
    params.sort === "name-asc" ||
    params.sort === "newest"
      ? params.sort
      : "newest";

  return {
    status,
    q: params.q?.trim() || undefined,
    brand: params.brand?.trim() || undefined,
    sort,
  };
}

export function getCatalogBrands(products: Product[]): string[] {
  return Array.from(new Set(products.map((product) => product.brand))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export function applyCatalogQuery(products: Product[], query: CatalogQuery): Product[] {
  const filtered = products.filter((product) => {
    const queryText = query.q?.toLowerCase();
    const hasQuery =
      !queryText ||
      product.name.toLowerCase().includes(queryText) ||
      product.brand.toLowerCase().includes(queryText) ||
      product.description.toLowerCase().includes(queryText);

    const hasBrand =
      !query.brand || product.brand.toLowerCase() === query.brand.toLowerCase();

    return hasQuery && hasBrand;
  });

  if (query.sort === "price-asc") {
    return [...filtered].sort((a, b) => a.price - b.price);
  }

  if (query.sort === "price-desc") {
    return [...filtered].sort((a, b) => b.price - a.price);
  }

  if (query.sort === "name-asc") {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
}
