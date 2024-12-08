import { create } from 'zustand';

import { useUserStore } from '@/lib/store/user-store';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database.types';

type Tables = Database['public']['Tables'];

export type EventStatus = Database['public']['Enums']['event_status'];
export type Event = Tables['event']['Row'];
export type EventInsert = Tables['event']['Insert'];
export type EventUpdate = Tables['event']['Update'];

export interface EventStoreState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: Error | null;
  setEvents: (events: Event[]) => void;
  setCurrentEvent: (event: Event | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  fetchEvents: () => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  createEvent: (event: Partial<EventInsert>) => Promise<Event | null>;
  updateEvent: (id: string, updates: Partial<EventUpdate>) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  startEvent: () => Promise<Event | null>;
  endEvent: () => Promise<Event | null>;
}

const supabase = createClient();

export const useEventStore = create<EventStoreState>((set, get) => ({
  events: [],
  currentEvent: null,
  loading: false,
  error: null,

  // Basic setters
  setEvents: (events) => set({ events }),
  setCurrentEvent: (event) => set({ currentEvent: event }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch events
  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');

      const { data, error } = await supabase.from('event').select('*').eq('created_by', user.id);

      if (error) throw error;
      set({ events: data || [] });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch single event
  fetchEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', id)
        .eq('created_by', user.id)
        .single();

      if (error) throw error;
      set({ currentEvent: data, loading: false });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  // Create new event
  createEvent: async (event: Partial<EventInsert>) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');

      // @ts-expect-error
      const newEvent: EventInsert = {
        ...event,
        join_code: Math.floor(Math.random() * 1000000).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user.id,
        updated_by: user.id,
      };

      const { data, error } = await supabase.from('event').insert([newEvent]).select().single();

      if (error) throw error;

      // Update local state
      const events = get().events;
      const createdEvent = data as Event;
      set({ events: [...events, createdEvent] });

      return createdEvent;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Update event
  updateEvent: async (id: string, updates: Partial<EventUpdate>) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');

      const updateData: EventUpdate = {
        ...updates,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('event')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const updatedEvent = data as Event;
      const events = get().events.map((e) => (e.id === id ? updatedEvent : e));
      set({ events });

      return updatedEvent;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Delete event
  deleteEvent: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');

      const { error } = await supabase.from('event').delete().eq('id', id);

      if (error) throw error;

      // Update local state
      const events = get().events.filter((e) => e.id !== id);
      set({ events });

      return true;
    } catch (error) {
      set({ error: error as Error });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Start event
  startEvent: async () => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');
      if (!get().currentEvent) throw new Error('No current event');

      const { data, error } = await supabase
        .from('event')
        .update({ status: 'ongoing' })
        .eq('id', get().currentEvent?.id)
        .select()
        .single();

      if (error) throw error;
      set({ currentEvent: data });
      return data;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  endEvent: async () => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');
      if (!get().currentEvent) throw new Error('No current event');

      const { data, error } = await supabase
        .from('event')
        .update({ status: 'completed' })
        .eq('id', get().currentEvent?.id)
        .select()
        .single();

      if (error) throw error;
      set({ currentEvent: data });
      return data;
    } catch (error) {
      set({ error: error as Error });
      return null;
    } finally {
      set({ loading: false });
    }
  }
}));
