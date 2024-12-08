'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import EventPageOngoing from './components/ongoing';
import EventPagePending from './components/pending';

import EventHeader from '@/components/event/header';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/lib/store/event-store';
import { useRoundStore } from '@/lib/store/round-store';

export default function EventPage() {
  const { eventId } = useParams();
  const router = useRouter();

  // Store
  const { currentEvent, fetchEvent, loading: eventLoading } = useEventStore();
  const { activeRound, fetchRounds, fetchQuestions } = useRoundStore();
  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId as string);
      fetchRounds(eventId as string);
    }
  }, [eventId]);

  useEffect(() => {
    if (activeRound) {
      fetchQuestions(activeRound.id);
    }
  }, [activeRound]);

  if (eventLoading) {
    return <div className="flex h-screen items-center justify-center">Loading</div>;
  }

  if (!currentEvent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary dark:text-primary-dark">404</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Event not found</p>
          <Button
            onClick={() => router.push('/events')}
            className="mt-4"
            variant="default"
            size="sm"
          >
            Go back to events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EventHeader />

      {currentEvent.status === 'pending' ? (
        <EventPagePending />
      ) : currentEvent.status === 'ongoing' ? (
        <EventPageOngoing />
      ) : (
        <></>
      )}
    </div>
  );
}
