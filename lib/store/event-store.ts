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
  startEvent: (id: string) => Promise<Event | null>;
  subscribeToEvents: () => void;
  unsubscribeFromEvents: () => void;
  startEventAction: (eventId: string) => Promise<void>;
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
      set({ currentEvent: data });
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
  startEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;

      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('event')
        .update({ status: 'ONGOING' })
        .eq('id', id)
        .eq('created_by', user.id)
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

  startEventAction: async (eventId: string) => {
    set({ loading: true });

    try {
      const { error } = await supabase
        .from('event')
        .update({ status: 'active', started_at: new Date().toISOString() })
        .eq('id', eventId);

      if (error) throw error;

      // Fetch updated event
      const { data: updatedEvent, error: fetchError } = await supabase
        .from('event')
        .select()
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;
      set({ currentEvent: updatedEvent });
    } catch (error) {
      console.error('Error starting event:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Subscribe to real-time events
  subscribeToEvents: () => {
    const user = useUserStore.getState().user;
    if (!user) return;

    const subscription = supabase
      .channel('event_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event',
          filter: `created_by=eq.${user.id}`,
        },
        async (payload) => {
          // Refresh the events list when changes occur
          get().fetchEvents();
        },
      )
      .subscribe();

    // Store subscription for cleanup
    (window as any).eventsSubscription = subscription;
  },

  // Cleanup subscription
  unsubscribeFromEvents: () => {
    const subscription = (window as any).eventsSubscription;
    if (subscription) {
      supabase.removeChannel(subscription);
      (window as any).eventsSubscription = null;
    }
  },
}));
