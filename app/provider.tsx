'use client';

import { useEffect, useState } from 'react';

import { ThemeProvider } from 'next-themes';

import { useAuth } from '@/lib/hooks/use-auth';

type Props = {
  children: string | React.JSX.Element | React.JSX.Element[];
};

const Provider = ({ children }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Initialize auth
  useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <>{children}</>
    </ThemeProvider>
  );
};

export default Provider;
