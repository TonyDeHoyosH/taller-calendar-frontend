'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RolUsuario } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RolUsuario[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
      router.push(user.rol === 'mecanico' ? '/mecanico' : '/cliente');
    }
  }, [isAuthenticated, user, router, allowedRoles, isMounted, pathname]);

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return null;
  }

  return <>{children}</>;
}
