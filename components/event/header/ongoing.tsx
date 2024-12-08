'use client';

import { Button } from '../../ui/button';

import { useEventStore } from '@/lib/store/event-store';

export default function EventHeaderOngoing() {
  const {
    currentEvent,
    endEvent,
  } = useEventStore();

  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
      <Button
        onClick={endEvent}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        disabled={!currentEvent?.id}
      >
        End Event
      </Button>
    </div>
  );
}
