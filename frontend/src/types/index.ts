export interface FetchProductsRequest {
  page: number
  limit: number
  name?: string
}

export interface ProductResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total_count: number;
  page: number;
  limit: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  stock_quantity: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  published_date: string;
}

export interface User {
  userId: string;
  access_token: string;
  refresh_token: string;
  expires: number;
  role: string;
}