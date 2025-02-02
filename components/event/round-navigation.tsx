'use client';

import { Fragment } from 'react';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

import { useEventStore } from '@/lib/store/event-store';
import { useRoundStore } from '@/lib/store/round-store';
import { cx } from '@/lib/utils';

interface RoundNavigationProps {
  setRoundSlideoutOpen?: (open: boolean) => void;
}

export default function RoundNavigation({ setRoundSlideoutOpen }: RoundNavigationProps) {
  const { currentEvent } = useEventStore();
  const { rounds, activeRound, setActiveRound, setRoundToEdit, setResponses } = useRoundStore();

  return (
    <nav>
      <div className="mx-auto max-w-7xl">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold">Rounds</h1>
        </div>
        <div className="relative flex h-14 items-center justify-between">
          <div className="flex w-full items-center justify-between gap-4">
            <Menu as="div" className="relative">
              <MenuButton as={Fragment}>
                <button
                  className={cx(
                    'inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset',
                    'ring-gray-300 dark:ring-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700',
                  )}
                >
                  {activeRound?.name || 'Select Round'}
                  <ChevronDownIcon className={cx('ml-2 size-5')} aria-hidden="true" />
                </button>
              </MenuButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="max-h-[60vh] overflow-y-auto py-1">
                    {rounds?.map((round) => (
                      <MenuItem key={round.id}>
                        <div className="group flex items-center px-4 py-2">
                          <button
                            className={cx(
                              // active
                              //   ? 'bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white'
                              //   : 'text-gray-700 dark:text-gray-300',
                              'flex-1 text-left text-sm',
                            )}
                            onClick={() => {
                              setResponses([]);
                              setActiveRound(round);
                            }}
                          >
                            {round.name}
                          </button>

                          {currentEvent?.status === 'pending' && setRoundSlideoutOpen && (
                            <button
                              onClick={() => {
                                setRoundToEdit(round);
                                setRoundSlideoutOpen(true);
                              }}
                              className={cx(
                                'ml-2 p-1 rounded-md',
                                // active
                                //   ? 'text-gray-700 dark:text-gray-300'
                                //   : 'text-gray-400 dark:text-gray-500',
                                'opacity-0 group-hover:opacity-100 transition-opacity',
                              )}
                            >
                              <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            {currentEvent?.status === 'pending' && setRoundSlideoutOpen && (
              <button
                type="button"
                onClick={() => setRoundSlideoutOpen(true)}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover px-3 py-2 text-sm font-semibold text-white"
              >
                Add Round
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
