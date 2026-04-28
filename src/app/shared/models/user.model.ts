export interface RoleDTO {
  id: number;
  name: string;
}

export interface AddressDTO {
  id: string;
  userId: string;
  title: string;
  fullName: string;
  street: string;
  district: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface FavoriteItemDTO {
  id: string;
  productId: string;
  productName: string;
  basePrice: number;
  addedAt: string;
}

export interface FavoritesDTO {
  id: string;
  userId: string;
  items: FavoriteItemDTO[];
  createdAt: string;
}
