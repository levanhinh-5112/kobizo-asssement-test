import { FetchProductsRequest, Product, User } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
const API_URL = 'http://localhost:3000/api/v1';

export const fetchProducts = async ( request?: FetchProductsRequest, access_token ?: string    ) => {
  const {page, limit, name} =  request || { page : 1, limit: 2};
  const token = access_token || Cookies.get('access_token')
  const response = await axios.get(`${API_URL}/products`, {
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : { }),
    params: { page, limit, filter: name ? JSON.stringify({ name: { _contains: name } }) : void 0 },
  });
  return response.data;
};

export const fetchOutOfStockProducts = async (access_token?: string) => {
  const token = access_token || Cookies.get('access_token');
  const response = await axios.get(`${API_URL}/products`, {
    params: {
      aggregate: JSON.stringify({ count: '*' }),
      filter: JSON.stringify({ stock_quantity: { _eq: 0 } }),
    },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return Number(response.data.data[0].count);
};

export const fetchProductBySlug = async (slug: string, access_token?: string): Promise<Product> => {
  const token = access_token || Cookies.get('access_token');
  const response = await axios.get(`${API_URL}/products/${slug}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const updateProduct = async (slug: string, product: Partial<Product>, access_token?: string): Promise<Product> => {
  const token = access_token || Cookies.get('access_token');
  if (!token) throw new Error('No access token');
  const response = await axios.patch(`${API_URL}/products/${slug}`, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/signin`, { email, password });
  return response.data;
}

export const fetchBlogPosts = async () => {
  const response = await axios.get(`${API_URL}/blog_posts`);
  return response.data;
};

export const fetchBlogPostBySlug = async (slug: string) => {
  const response = await axios.get(`${API_URL}/blog_posts/${slug}`);
  return response.data;
};