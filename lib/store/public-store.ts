
import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database.types';

type Tables = Database['public']['Tables'];
type Event = Tables['event']['Row'];
type Team = Tables['team']['Row'] & { total_score: number };

interface PublicStoreState {
  event: Event | null;
  teams: Team[];
  loading: boolean;
  error: Error | null;
  subscription: any | null;

  // Basic setters
  setEvent: (event: Event | null) => void;
  setTeams: (teams: Team[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setSubscription: (subscription: any | null) => void;

  // Fetch operations
  fetchPublicEvent: (eventId: string) => Promise<void>;
  fetchPublicTeamScores: (eventId: string) => Promise<void>;
  
  // Real-time subscriptions
  subscribeToScores: (eventId: string) => void;
  unsubscribeFromScores: () => void;
}

const supabase = createClient();

export const usePublicStore = create<PublicStoreState>((set, get) => ({
  event: null,
  teams: [],
  loading: false,
  error: null,
  subscription: null,

  // Basic setters
  setEvent: (event) => set({ event }),
  setTeams: (teams) => set({ teams }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSubscription: (subscription) => set({ subscription }),

  // Fetch public event data
  fetchPublicEvent: async (eventId) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      set({ event: data });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch team scores for the event
  fetchPublicTeamScores: async (eventId) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('team')
        .select(`
          *,
          responses!inner(
            is_correct,
            question!inner(points)
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      // Calculate total scores for each team
      // const teamsWithScores = data.map(team => {
      //   const total_score = team.responses.reduce((sum, response) => {
      //     return sum + (response.is_correct === 'correct' ? response.question.points : 0);
      //   }, 0);
        
      //   return { ...team, total_score };
      // });

      set({ teams: data });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  // Subscribe to real-time score updates
  subscribeToScores: (eventId) => {
    const subscription = supabase
      .channel(`public-scores:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'response',
        },
        () => {
          // Refresh scores when responses change
          get().fetchPublicTeamScores(eventId);
        }
      )
      .subscribe();

    set({ subscription });
  },

  // Cleanup subscription
  unsubscribeFromScores: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null });
    }
  },
}));