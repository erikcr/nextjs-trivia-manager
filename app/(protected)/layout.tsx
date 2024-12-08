'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, error, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-base text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary dark:text-primary-dark">Error</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/signin');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary dark:text-primary-dark">Unauthorized</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Please sign in to access this page</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
