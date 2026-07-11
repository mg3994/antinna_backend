export interface ProductDto {
  sku: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  availability: string;
  url: string;
  imageUrl?: string;
}
