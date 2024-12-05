'use client';

import { Fragment } from 'react';

import Image from 'next/image';

import { ListboxOption } from '../ui/listbox';
import { Listbox, ListboxButton, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { PlayIcon } from '@heroicons/react/24/outline';

import logoTriviaLynxDark from '@/assets/logos/trivialynx-logo-dark.svg';
import logoTriviaLynx from '@/assets/logos/trivialynx-logo.svg';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Event } from '@/lib/store/event-store';

interface EditorHeaderProps {
  event: Event;
  onStartEvent?: () => void;
}

export default function EditorHeader({ event, onStartEvent }: EditorHeaderProps) {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-4"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1 p-1">
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
          <p>{event?.name}</p>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <Button 
            onClick={onStartEvent}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            disabled={!event?.id}
          >
            <PlayIcon className="h-5 w-5" aria-hidden="true" />
            Start Event
          </Button>
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}
