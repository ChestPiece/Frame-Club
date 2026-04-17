/**
 * Temporary diecast photography served from `public/Assets/cars/`.
 * Replace with per-product URLs (e.g. Supabase) when production assets are ready.
 */
export const DIECAST_PRODUCT_IMAGES = [
  "/Assets/cars/3_k4c37qatm4qwmk8r_1280x.webp",
  "/Assets/cars/4d292df3-03d4-44d9-a8bb-a16101213194_2jeltasqcmsjddac_1280x.webp",
  "/Assets/cars/framediecast.webp",
] as const;

export function productDiecastImages(): string[] {
  return [...DIECAST_PRODUCT_IMAGES];
}
