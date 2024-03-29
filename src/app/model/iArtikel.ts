import { iCategory } from "./iCategory";

export interface iArtikel {
  id?: number;
  name: string;
  description: string;
  price: number;
  mwst: number;
  brand: string;
  model: string;
  sku: string;
  ean: string;
  availability: string;
  weight: number;
  menge: number;
  dimensions: string;
  liferant: number;
  images: string;
  relatedProducts: string;
  reviews: string;
  rating: number;
  categories: iCategory[];
}
