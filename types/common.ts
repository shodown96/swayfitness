export interface FilterParams {
  page?: number;
  pageSize?: number;
  search: string;
  type?: string;
  status?: string;
  amount?: number;
}

export interface Pagination {
  totalPages: number;
  currentPage: number;
  total: number;
}


export interface PaginatedData<T = any> extends Pagination {
  items: T[];
  pageSize: number;
}

export interface PageIDParams {
  params: Promise<{
    id: string
  }>,
}

export interface APIRouteIDParams {
  params: Promise<{
    id: string
  }>,
}

export interface PageSlugParams {
  params: Promise<{
    slug: string
  }>,
}

export interface PageSearchParams {
  searchParams: Promise<{
    id: string
  }>,
}

export interface Option {
  value: any;
  label: string;
}


export interface TourState {
  overview?: boolean,
  post?: boolean,
  product?: boolean
}

// export type { File as DBFile } from '@prisma/client';
