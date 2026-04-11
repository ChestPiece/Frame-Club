import type { Product, ProductStatus } from "@/lib/types";

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "porsche-911-gt2-rs",
    name: "911 GT2 RS",
    brand: "Porsche",
    description:
      "Track-bred precision framed with custom background treatments and spec plate finishing.",
    images: [
      "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg",
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
      "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg",
    ],
    price: 5000,
    status: "available",
    deliveryDays: 7,
    years: "2017-2019",
    specs: [
      { label: "Engine", value: "3.8L Flat-6 Twin Turbo" },
      { label: "Power", value: "700 HP" },
      { label: "Top Speed", value: "340 km/h" },
      { label: "Production", value: "1000 Units" },
      { label: "Years", value: "2017-2019" },
    ],
    backgrounds: [
      { label: "Carbon Grid", value: "carbon-grid", swatch: "#262121" },
      { label: "Race Line", value: "race-line", swatch: "#380306" },
      { label: "Monolith", value: "monolith", swatch: "#2a2a2a" },
      { label: "Atlas", value: "atlas", swatch: "#1b262e" },
    ],
  },
  {
    id: "p2",
    slug: "ferrari-f40",
    name: "F40",
    brand: "Ferrari",
    description: "An icon from Maranello presented with archival visual treatment.",
    images: [
      "https://images.pexels.com/photos/971434/pexels-photo-971434.jpeg",
      "https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg",
    ],
    price: 5000,
    status: "preorder",
    deliveryDays: 10,
    years: "1987-1992",
    specs: [
      { label: "Engine", value: "2.9L Twin-Turbo V8" },
      { label: "Power", value: "471 HP" },
      { label: "Top Speed", value: "324 km/h" },
      { label: "Production", value: "1311 Units" },
      { label: "Years", value: "1987-1992" },
    ],
    backgrounds: [
      { label: "Carbon Grid", value: "carbon-grid", swatch: "#262121" },
      { label: "Race Line", value: "race-line", swatch: "#380306" },
      { label: "Monolith", value: "monolith", swatch: "#2a2a2a" },
      { label: "Atlas", value: "atlas", swatch: "#1b262e" },
    ],
  },
  {
    id: "p3",
    slug: "nissan-gt-r-r34",
    name: "GT-R R34",
    brand: "Nissan",
    description: "Legendary skyline profile with custom spec layout and finish.",
    images: [
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
    ],
    price: 5000,
    status: "available",
    deliveryDays: 7,
    years: "1999-2002",
    specs: [
      { label: "Engine", value: "2.6L RB26DETT" },
      { label: "Power", value: "280 HP" },
      { label: "Top Speed", value: "250 km/h" },
      { label: "Production", value: "11,578 Units" },
      { label: "Years", value: "1999-2002" },
    ],
    backgrounds: [
      { label: "Carbon Grid", value: "carbon-grid", swatch: "#262121" },
      { label: "Race Line", value: "race-line", swatch: "#380306" },
      { label: "Monolith", value: "monolith", swatch: "#2a2a2a" },
      { label: "Atlas", value: "atlas", swatch: "#1b262e" },
    ],
  },
  {
    id: "p4",
    slug: "mclaren-p1",
    name: "P1",
    brand: "McLaren",
    description: "Hybrid hypercar statement piece, built to order and framed by hand.",
    images: [
      "https://images.pexels.com/photos/305070/pexels-photo-305070.jpeg",
      "https://images.pexels.com/photos/3671259/pexels-photo-3671259.jpeg",
    ],
    price: 5000,
    status: "unavailable",
    deliveryDays: 14,
    years: "2013-2015",
    specs: [
      { label: "Engine", value: "3.8L Twin-Turbo V8 + Hybrid" },
      { label: "Power", value: "903 HP" },
      { label: "Top Speed", value: "350 km/h" },
      { label: "Production", value: "375 Units" },
      { label: "Years", value: "2013-2015" },
    ],
    backgrounds: [
      { label: "Carbon Grid", value: "carbon-grid", swatch: "#262121" },
      { label: "Race Line", value: "race-line", swatch: "#380306" },
      { label: "Monolith", value: "monolith", swatch: "#2a2a2a" },
      { label: "Atlas", value: "atlas", swatch: "#1b262e" },
    ],
  },
  {
    id: "p5",
    slug: "bugatti-chiron",
    name: "Chiron",
    brand: "Bugatti",
    description: "Grand touring excess translated into a precision-crafted wall piece.",
    images: [
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
      "https://images.pexels.com/photos/159293/car-vehicle-luxury-sport-159293.jpeg",
    ],
    price: 5000,
    status: "preorder",
    deliveryDays: 12,
    years: "2016-present",
    specs: [
      { label: "Engine", value: "8.0L Quad-Turbo W16" },
      { label: "Power", value: "1500 HP" },
      { label: "Top Speed", value: "420 km/h" },
      { label: "Production", value: "500 Units" },
      { label: "Years", value: "2016-present" },
    ],
    backgrounds: [
      { label: "Carbon Grid", value: "carbon-grid", swatch: "#262121" },
      { label: "Race Line", value: "race-line", swatch: "#380306" },
      { label: "Monolith", value: "monolith", swatch: "#2a2a2a" },
      { label: "Atlas", value: "atlas", swatch: "#1b262e" },
    ],
  },
  {
    id: "p6",
    slug: "land-rover-defender-90",
    name: "Defender 90",
    brand: "Land Rover",
    description: "Off-road heritage edition with rugged typography and spec plaque.",
    images: [
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg",
      "https://images.pexels.com/photos/248747/pexels-photo-248747.jpeg",
    ],
    price: 5000,
    status: "available",
    deliveryDays: 8,
    years: "2020-present",
    specs: [
      { label: "Engine", value: "3.0L I6 Mild-Hybrid" },
      { label: "Power", value: "395 HP" },
      { label: "Top Speed", value: "191 km/h" },
      { label: "Production", value: "Ongoing" },
      { label: "Years", value: "2020-present" },
    ],
    backgrounds: [
      { label: "Carbon Grid", value: "carbon-grid", swatch: "#262121" },
      { label: "Race Line", value: "race-line", swatch: "#380306" },
      { label: "Monolith", value: "monolith", swatch: "#2a2a2a" },
      { label: "Atlas", value: "atlas", swatch: "#1b262e" },
    ],
  },
];

export function getProducts(status?: ProductStatus) {
  if (!status) return PRODUCTS;
  return PRODUCTS.filter((product) => product.status === status);
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string) {
  return PRODUCTS.filter((product) => product.slug !== slug).slice(0, 3);
}

export function buildMockOrderId() {
  const randomPart = Math.floor(Math.random() * 9000 + 1000).toString();
  return `FC-${Date.now()}-${randomPart}`;
}
