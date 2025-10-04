import { cookies } from 'next/headers';
import { fetchProductBySlug } from '@/lib/api';
import EditProductPage from './EditProductPage';

export default async function ProductEditServerPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get('access_token')?.value;
  const product = await fetchProductBySlug(params.slug, access_token);
  return <EditProductPage initialProduct={product} />;
}