import { SortObject } from './common.model';
import { PageableObject } from './common.model';

export interface CategoryDTO {
  id: string;
  parentId?: string;
  name: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  basePrice: number; // JSON'da "basePrice" olarak geliyor
  isActive: boolean;
  categoryId: string;
  storeId: string;
  variants: ProductVariantDTO[]; // JSON'da "variants" dizisi var
}

export interface ProductVariantDTO {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null; // Senin JSON'da şu an null geliyor
}
export interface PageProductDTO {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  size: number;
  content: ProductDTO[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface VariantCreateRequest {
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  variants: VariantCreateRequest[];
}

export interface ProductUpdateRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  active: boolean;
}

export interface ReviewDTO {
  id: string;
  userId: string;
  maskedUserName: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  orderId: string;
  starRating: number;
  title: string;
  body: string;
  helpfulVotes: number;
  totalVotes: number;
  isVerified: boolean;
  createdAt: string;
}

export interface ProductAnswerDTO {
  id: string;
  questionId: string;
  storeId: string;
  body: string;
  createdAt: string;
}

export interface ProductQuestionDTO {
  id: string;
  productId: string;
  userId: string;
  maskedUserName: string;
  body: string;
  createdAt: string;
  answer?: ProductAnswerDTO;
}
