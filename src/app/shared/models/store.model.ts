export interface StoreCreateRequest {
  name: string;
  description: string;
  logoUrl?: string;
}

export interface StoreDTO {
  id: string;
  ownerUserId: string;
  name: string;
  description: string;
  logoUrl?: string;
  status: string;
  approvedAt?: string;
  createdAt: string;
}
