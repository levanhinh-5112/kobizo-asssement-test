"use client";

   import { useAuth } from '@/hooks/useAuth';
   import AuthButton from '@/components/AuthButton';

   export default function ClientLayout({ children }: { children: React.ReactNode }) {
     const { user } = useAuth();

     return (
       <>
         <nav className="bg-gray-800 text-white p-4">
           <div className="container mx-auto flex justify-between">
             <a href="/" className="text-xl font-bold">My App</a>
             <AuthButton />
           </div>
         </nav>
         <main>{children}</main>
       </>
     );
   }