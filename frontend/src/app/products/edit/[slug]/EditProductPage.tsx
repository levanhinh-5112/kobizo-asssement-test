"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';
import { updateProduct, fetchProductBySlug } from '@/lib/api';
import { Product } from '@/types';

interface EditProductPageProps {
  initialProduct: Product;
}

export default function EditProductPage({ initialProduct }: EditProductPageProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [product, setProduct] = useState<Partial<Product>>(initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: fetchedProduct = initialProduct, error: fetchError } = useSWR(
    `/products/${initialProduct.slug}`,
    () => fetchProductBySlug(initialProduct.slug),
    { fallbackData: initialProduct }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateProduct(initialProduct.slug, product);
      await Promise.all([
        mutate(`/products/${initialProduct.slug}`),
        mutate((key: string) => key.startsWith('/products?page=')),
        mutate('/out-of-stock-count', void 0)
      ])
      setSuccess('Succeeded to update product.');
    } catch (err) {
      console.error('Update Product Error:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchError) {
    return <div className="container mx-auto py-8 text-red-500">Error loading product: {fetchError.message}</div>;
  }

  const handleBackNavigation = () => {
      router.push('/products');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name || fetchedProduct.name || ''}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={product.slug || fetchedProduct.slug || ''}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full disabled:text-gray-500/40"
            required
            disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price || fetchedProduct.price || ''}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description || fetchedProduct.description || ''}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            value={product.stock_quantity || fetchedProduct.stock_quantity || 0}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div className='flex gap-x-2'>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
            disabled={isSubmitting}
            onClick={handleBackNavigation}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}