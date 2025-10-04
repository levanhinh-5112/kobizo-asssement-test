"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { login } from '@/lib/api';
import { User } from '@/types';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { data, error } = useSWR<User | null>('user', async () => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');
    if (!access_token || !refresh_token) return null;
    const decoded = JSON.parse(atob(access_token.split('.')[1])) as { id: string; role: string };
    return { access_token, refresh_token, expires: parseInt(Cookies.get('expires') || '900000'), userId: decoded.id, role: decoded.role };
  });

  useEffect(() => {
    if (data !== void 0) {
      setUser(data);
    }
  }, [data]);

  const signin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      Cookies.set('access_token', response.access_token, { secure: true, sameSite: 'strict', expires: response.expires / (1000 * 3600 * 24) });
      Cookies.set('refresh_token', response.refresh_token, { secure: true, sameSite: 'strict', expires: 7 });
      Cookies.set('expires', response.expires.toString(), { secure: true, sameSite: 'strict', expires: response.expires / (1000 * 3600 * 24) });
      setUser({ access_token: response.access_token, refresh_token: response.refresh_token, expires: response.expires, userId: response.userId, role: response.role });
      router.push('/products');
    } catch (error) {
      console.error('Signin Error:', error);
      throw error;
    }
  };

  const signout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('expires');
    setUser(null);
    router.push('/');
  };

    // Express Role
  const isUserAdmin = () => user?.role == '15813709-24e6-4868-b913-022dc9b31d8e';

  return { user, signin, signout, isLoading: data === void 0 && !error, isUserAdmin };
};