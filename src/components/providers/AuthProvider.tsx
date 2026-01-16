/**
 * Authentication Provider Component
 * Wraps app to provide authentication context
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import { PageLoader } from '@/components/ui';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/reset-password', '/'];

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      
      if (!isAuthenticated && !isPublicRoute) {
        // Redirect to login if trying to access protected route
        router.push('/auth/login');
      } else if (isAuthenticated && pathname.startsWith('/auth/')) {
        // Redirect to dashboard if already authenticated
        router.push('/dashboard');
      } else {
        setIsReady(true);
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Show loader while checking auth
  if (isLoading || !isReady) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
