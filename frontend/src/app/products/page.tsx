import { fetchProducts } from '@/lib/api';
import ProductsPage from './ProductPage';
import { cookies } from 'next/headers';

export default async function ProductsServerPage() {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get('access_token')?.value;
  const initialProducts = await fetchProducts(void 0, access_token);

  return <ProductsPage initialProducts={initialProducts} />;
}