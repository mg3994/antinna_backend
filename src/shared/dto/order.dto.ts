export interface OrderItemDto {
  itemKey: string;
  orderQuantity: number;
  price: number;
  currency: string;
  name: string;
  sku: string;
  url: string;
  selectedVariants?: Record<string, string>;
  addOns?: OrderItemDto[];
}

export interface CreateOrderDto {
  buyerEmail: string;
  items: OrderItemDto[];
  totalPrice: number;
  priceCurrency: string;
  addressDetails?: any;
}
