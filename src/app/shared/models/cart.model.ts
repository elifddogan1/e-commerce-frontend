
export interface CartItemDTO {
  id: string;
  variantId: string;
  variantName: string;
  productName: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  maxAvailableStock: number;
}

export interface CartDTO {
  id: string;
  userId: string;
  items: CartItemDTO[];
  cartTotal: number;
}

export interface AddToCartRequest {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}