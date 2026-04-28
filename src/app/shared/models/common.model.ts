export interface SortObject {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject;
  unpaged: boolean;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}
