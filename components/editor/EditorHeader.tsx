'use client';

import { Fragment } from 'react';

import Image from 'next/image';

import { ListboxOption } from '../ui/listbox';
import { Listbox, ListboxButton, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

import logoTriviaLynxDark from '@/assets/logos/trivialynx-logo-dark.svg';
import logoTriviaLynx from '@/assets/logos/trivialynx-logo.svg';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Event } from '@/lib/store/event-store';

interface EditorHeaderProps {
  event: Event;
}

export default function EditorHeader({ event }: EditorHeaderProps) {
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

        <div className="flex lg:gap-x-6 text-base font-medium">
          <p>{event?.name}</p>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}
