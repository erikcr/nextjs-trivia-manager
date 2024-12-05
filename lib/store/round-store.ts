import { create } from 'zustand';
import { Database } from '@/lib/types/database.types';
import { createClient } from '@/lib/supabase/client';
import { useUserStore } from '@/lib/store/user-store';

type Tables = Database['public']['Tables'];
export type Round = Tables['round']['Row'];
export type RoundInsert = Tables['round']['Insert'];
export type RoundUpdate = Tables['round']['Update'];
export type Question = Tables['question']['Row'];
export type QuestionInsert = Tables['question']['Insert'];
export type QuestionUpdate = Tables['question']['Update'];

export interface RoundStoreState {
  rounds: Round[];
  questions: Question[];
  loading: boolean;
  error: Error | null;
  activeRound: Round | null;
  roundToEdit: Round | null;
  questionToEdit: Question | null;
  addRoundLoading: boolean;
  addQuestionLoading: boolean;
  
  // Basic setters
  setRounds: (rounds: Round[]) => void;
  setQuestions: (questions: Question[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setActiveRound: (round: Round | null) => void;
  setRoundToEdit: (round: Round | null) => void;
  setQuestionToEdit: (question: Question | null) => void;
  setAddRoundLoading: (loading: boolean) => void;
  setAddQuestionLoading: (loading: boolean) => void;

  // Round operations
  fetchRounds: (eventId: string) => Promise<void>;
  createRound: (round: Partial<RoundInsert>) => Promise<Round | null>;
  updateRound: (id: string, updates: Partial<RoundUpdate>) => Promise<Round | null>;
  deleteRound: (id: string) => Promise<boolean>;

  // Question operations
  fetchQuestions: (roundId: string) => Promise<void>;
  createQuestion: (question: Partial<QuestionInsert>) => Promise<Question | null>;
  updateQuestion: (id: string, updates: Partial<QuestionUpdate>) => Promise<Question | null>;
  deleteQuestion: (id: string) => Promise<boolean>;

  // Real-time subscriptions
  subscribeToRounds: (eventId: string) => void;
  subscribeToQuestions: (roundId: string) => void;
  unsubscribeFromRounds: () => void;
  unsubscribeFromQuestions: () => void;
}

const supabase = createClient();

export const useRoundStore = create<RoundStoreState>((set, get) => ({
  rounds: [],
  questions: [],
  loading: false,
  error: null,
  activeRound: null,
  roundToEdit: null,
  questionToEdit: null,
  addRoundLoading: false,
  addQuestionLoading: false,

  // Basic setters
  setRounds: (rounds) => set({ rounds }),
  setQuestions: (questions) => set({ questions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setActiveRound: (round) => set({ activeRound: round }),
  setRoundToEdit: (round) => set({ roundToEdit: round }),
  setQuestionToEdit: (question) => set({ questionToEdit: question }),
  setAddRoundLoading: (loading) => set({ addRoundLoading: loading }),
  setAddQuestionLoading: (loading) => set({ addQuestionLoading: loading }),

  // Fetch rounds for an event
  fetchRounds: async (eventId) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('round')
        .select('*')
        .eq('event_id', eventId)
        .order('sequence_number', { ascending: true });

      if (error) throw error;
      set({ rounds: data || [] });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  // Create new round
  createRound: async (round) => {
    try {
      set({ loading: true, error: null, addRoundLoading: true });
      const user = useUserStore.getState().user;
      const currentRounds = get().rounds;
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('round')
        .insert([{ 
          ...round, 
          created_by: user.id, 
          updated_by: user.id,
          sequence_number: (currentRounds?.length || 0) + 1
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Update the rounds array with the new round
      if (data) {
        set({ rounds: [...currentRounds, data] });
      }
      
      return data;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false, addRoundLoading: false });
    }
  },

  // Update round
  updateRound: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('round')
        .update({ ...updates, updated_by: user.id })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Delete round
  deleteRound: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('round')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      set({ error: error as Error });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch questions for a round
  fetchQuestions: async (roundId) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('round_id', roundId)
        .order('sequence_number', { ascending: true });

      if (error) throw error;
      set({ questions: data || [] });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  // Create new question
  createQuestion: async (question) => {
    try {
      set({ loading: true, error: null, addQuestionLoading: true });
      const user = useUserStore.getState().user;
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('question')
        .insert([{ ...question, created_by: user.id, updated_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false, addQuestionLoading: false });
    }
  },

  // Update question
  updateQuestion: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('question')
        .update({ ...updates, updated_by: user.id })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Delete question
  deleteQuestion: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('question')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      set({ error: error as Error });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Subscribe to real-time round updates
  subscribeToRounds: (eventId) => {
    const subscription = supabase
      .channel(`rounds:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'round',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          get().fetchRounds(eventId);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  // Subscribe to real-time question updates
  subscribeToQuestions: (roundId) => {
    const subscription = supabase
      .channel(`questions:${roundId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'question',
          filter: `round_id=eq.${roundId}`,
        },
        () => {
          get().fetchQuestions(roundId);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  // Cleanup subscriptions
  unsubscribeFromRounds: () => {
    supabase.removeAllChannels();
  },

  unsubscribeFromQuestions: () => {
    supabase.removeAllChannels();
  },
}));
