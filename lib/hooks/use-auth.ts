import { useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useUserStore } from '@/lib/store/user-store';

const supabase = createClient();

export function useAuth() {
  const { setUser } = useUserStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return useUserStore();
}
