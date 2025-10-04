"use client";

import { useState } from 'react';
import useSWR from 'swr';
import ProductList from '@/components/ProductList';
import { fetchProducts } from '@/lib/api';
import { Product, ProductResponse } from '@/types';

interface ProductsPageProps {
  initialProducts: ProductResponse;
}

export default function ProductsPage({ initialProducts }: ProductsPageProps) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const { data: productResponse = initialProducts } = useSWR(
    `/products?page=${page}&filter=${filter}`,
    () => fetchProducts({page, limit: 2, name: filter}),
    { fallbackData: initialProducts }
  );
  const products = productResponse.data;
  console.log(productResponse)
  const totalPage = Math.ceil(productResponse.meta.total_count / 2);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>
      <ProductList products={products} />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={page === totalPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}