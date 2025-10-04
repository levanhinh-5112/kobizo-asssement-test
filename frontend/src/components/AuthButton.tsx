"use client";

import { useAuth } from '@/hooks/useAuth';
import { fetchOutOfStockProducts } from '@/lib/api';
import Link from 'next/link';
import useSWR from 'swr';

export default function AuthButton() {
  const { user, signout, isUserAdmin } = useAuth();

  const { data: outOfStockCount, error: outOfStockError } = useSWR(
    isUserAdmin() ? '/out-of-stock-count' : null,
    () => fetchOutOfStockProducts(),
    { refreshInterval: 60000 }
  );

  return (
    <div className="flex gap-2 items-center">
      {user ? (
        <>
          <button
            onClick={signout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
          {isUserAdmin() && (
            <>
              <Link
                href="/products"
                className="px-4 py-2 bg-purple-500 text-white rounded"
              >
                Product List for Admin
              </Link>
              <span className="text-sm">
                Out of Stock:{" "}
                {outOfStockError ? "Error" : outOfStockCount ?? "Loading..."}
              </span>
            </>
          )}
        </>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login
        </Link>
      )}
    </div>
  );
}