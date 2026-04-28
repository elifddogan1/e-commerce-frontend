export interface OrderItemDTO {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ShipmentDTO {
  id: string;
  orderId: string;
  warehouseBlock?: string;
  modeOfShipment?: string;
  trackingNumber?: string;
  status: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface PaymentDTO {
  id: string;
  orderId: string;
  method: string;
  providerRef?: string;
  amount: number;
  status: string;
  paidAt?: string;
}

export interface OrderDTO {
  id: string;
  userId: string;
  storeId: string;
  shippingAddressId: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: OrderItemDTO[];
  createdAt: string;
}
