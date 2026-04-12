import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { Product, ProductStatus } from "@/lib/types";

type ProductRow = Tables<"products">;
type CustomizationRow = Tables<"customization_options">;

function toProduct(row: ProductRow, backgrounds: CustomizationRow[] = []): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    description: row.description ?? "",
    images: row.images ?? [],
    price: row.price,
    status: (row.status as ProductStatus) ?? "available",
    deliveryDays: row.delivery_days ?? 7,
    years: row.years ?? "",
    specs: Array.isArray(row.specs) ? row.specs as Product["specs"] : [],
    backgrounds: backgrounds.map((bg) => ({
      label: bg.label,
      value: bg.value,
      swatch: bg.swatch ?? bg.value,
    })),
  };
}

export async function getProducts(status?: ProductStatus): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data ?? []).map((row) => toProduct(row));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();

  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw new Error(`Failed to fetch product ${slug}: ${error.message}`);
  }

  const { data: backgrounds, error: backgroundError } = await supabase
    .from("customization_options")
    .select("*")
    .eq("product_id", data.id)
    .eq("type", "background_design");

  if (backgroundError) {
    throw new Error(`Failed to fetch backgrounds for ${slug}: ${backgroundError.message}`);
  }

  return toProduct(data, backgrounds ?? []);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").neq("slug", slug).limit(3);

  if (error) {
    throw new Error(`Failed to fetch related products for ${slug}: ${error.message}`);
  }

  return (data ?? []).map((row) => toProduct(row));
}