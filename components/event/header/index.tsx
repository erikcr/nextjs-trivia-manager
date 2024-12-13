'use client';

import Image from 'next/image';

import EventHeaderPending from './pending';

import logoTriviaLynxDark from '@/assets/logos/trivialynx-logo-dark.svg';
import logoTriviaLynx from '@/assets/logos/trivialynx-logo.svg';
import { useEventStore } from '@/lib/store/event-store';
import EventHeaderOngoing from './ongoing';

export default function EventHeader() {
  const { currentEvent } = useEventStore();

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
      <nav
        className="mx-auto flex items-center justify-between p-3 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/events" className="-m-1 p-1">
            <span className="sr-only">TriviaLynx</span>
            <Image
              className="hidden dark:block h-6 w-auto"
              src={logoTriviaLynxDark}
              alt="TriviaLynx"
            />
            <Image className="block dark:hidden h-6 w-auto" src={logoTriviaLynx} alt="TriviaLynx" />
          </a>
        </div>

        <div className="flex lg:gap-x-12 text-xl">
          <p>{currentEvent?.name}</p>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          {currentEvent?.status === 'pending' && <EventHeaderPending />}

          {currentEvent?.status === 'ongoing' && <EventHeaderOngoing />}
        </div>
      </nav>
    </header>
  );
}
