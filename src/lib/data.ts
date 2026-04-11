import { createClient } from "@/lib/supabase/server";
import { PRODUCTS } from "@/lib/mock-data";
import type { Product, ProductStatus } from "@/lib/types";

export async function getProducts(status?: ProductStatus): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Fallback to mock data if table is empty (useful for local dev without DB seeded)
    if (!data || data.length === 0) {
      if (!status) return PRODUCTS;
      return PRODUCTS.filter((product) => product.status === status);
    }

    // Map to Product type, assuming DB schema matches
    return data as any as Product[];
  } catch (e) {
    console.warn("Failed to fetch products from Supabase, falling back to mock data", e);
    if (!status) return PRODUCTS;
    return PRODUCTS.filter((product) => product.status === status);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      // Need to fetch backgrounds for this product
      const { data: backgrounds } = await supabase.from("customization_options").select("*").eq("product_id", data.id).eq("type", "background_design");
      
      return {
        ...data,
        backgrounds: backgrounds || []
      } as any as Product;
    }
  } catch (e) {
    console.warn(`Failed to fetch product ${slug} from Supabase, falling back to mock data`, e);
  }
  
  return PRODUCTS.find((product) => product.slug === slug);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("*").neq("slug", slug).limit(3);

    if (error) throw error;
    if (data && data.length > 0) return data as any as Product[];
  } catch (e) {
    console.warn(`Failed to fetch related products for ${slug}, falling back to mock data`);
  }
  
  return PRODUCTS.filter((product) => product.slug !== slug).slice(0, 3);
}