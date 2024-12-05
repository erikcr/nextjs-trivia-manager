'use client';

import { Fragment } from 'react';

import Image from 'next/image';

import { ListboxOption } from '../ui/listbox';
import { Listbox, ListboxButton, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

import logoTriviaLynxDark from '@/assets/logos/trivialynx-logo-dark.svg';
import logoTriviaLynx from '@/assets/logos/trivialynx-logo.svg';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Tables } from '@/lib/types/database.types';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface EditorHeaderProps {
  event: Tables<'event'> | null;
}

export default function EditorHeader({ event }: EditorHeaderProps) {
  return (
    <header className="bg-white dark:bg-zinc-900">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">TriviaLynx</span>
            <Image
              className="hidden dark:block h-8 w-auto"
              src={logoTriviaLynxDark}
              alt="TriviaLynx"
            />
            <Image className="block dark:hidden h-8 w-auto" src={logoTriviaLynx} alt="TriviaLynx" />
          </a>
        </div>

        <div className="flex lg:gap-x-12 text-xl">
          <p>{event?.name}</p>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}
