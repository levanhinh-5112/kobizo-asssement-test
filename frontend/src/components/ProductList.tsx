import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const { isUserAdmin } = useAuth();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-lg font-bold">${product.price}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
          {
            isUserAdmin() && (
            <button
              onClick={() => router.push(`/products/edit/${product.slug}`)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Edit
            </button>
            )
          }
        </div>
      ))}
    </div>
  );
}