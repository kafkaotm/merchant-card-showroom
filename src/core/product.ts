// Canonical Product shape, shared by mock data, the entity store, and
// the showroom's rendering wiring. Extracted once a third consumer of
// this exact shape appeared (gallery.ts), not speculatively ahead of one.
export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
}
