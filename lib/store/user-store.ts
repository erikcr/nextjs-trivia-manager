import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { createClient } from '@/lib/supabase/client';

interface UserState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  initializeUser: () => Promise<void | (() => void)>;
}

const supabase = createClient();

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  initializeUser: async () => {
    try {
      set({ loading: true, error: null });
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      set({ user: session?.user || null });

      // Set up real-time auth subscription
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },
}));
