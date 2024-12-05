'use client';

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { RoundsWithQuestions } from '@/lib/types/app.types';
import { Tables } from '@/lib/types/database.types';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface RoundNavigationProps {
  rounds: RoundsWithQuestions | undefined;
  activeRound: Tables<'round'> | null;
  setActiveRound: (round: Tables<'round'>) => void;
  setRoundToEdit: (round: Tables<'round'>) => void;
  setRoundSlideoutOpen: (open: boolean) => void;
}

export default function RoundNavigation({
  rounds,
  activeRound,
  setActiveRound,
  setRoundToEdit,
  setRoundSlideoutOpen,
}: RoundNavigationProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
      {/* Desktop Round Navigation */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 justify-between">
            <div className="flex px-2 lg:px-0">
              <div className="flex items-center">
                {rounds?.map((item) => (
                  <div key={item.id} className="inline-flex rounded-md shadow-sm mr-4">
                    <button
                      className={classNames(
                        activeRound?.id === item.id
                          ? 'bg-primary hover:bg-primary-hover text-white dark:bg-primary-dark dark:hover:bg-primary-dark-hover'
                          : 'ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700',
                        'relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:z-10'
                      )}
                      onClick={() => setActiveRound(item)}
                    >
                      {item.name}
                    </button>

                    <button
                      type="button"
                      className={classNames(
                        activeRound?.id === item.id
                          ? 'bg-primary hover:bg-primary-hover text-white dark:bg-primary-dark dark:hover:bg-primary-dark-hover'
                          : 'ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700',
                        'relative -ml-px inline-flex items-center rounded-r-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:z-10'
                      )}
                      onClick={() => {
                        setRoundToEdit(item);
                        setRoundSlideoutOpen(true);
                      }}
                    >
                      <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setRoundSlideoutOpen(true)}
                  className="relative inline-flex items-center gap-x-1.5 rounded-md bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Add Round
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Round Navigation */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
          {rounds?.map((item) => (
            <span key={item.id} className="isolate inline-flex rounded-md my-1 w-full">
              <button
                type="button"
                className={classNames(
                  activeRound?.id === item.id
                    ? 'bg-primary hover:bg-primary-hover text-white dark:bg-primary-dark dark:hover:bg-primary-dark-hover'
                    : 'ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700',
                  'relative -ml-px inline-flex grow items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:z-10'
                )}
                onClick={() => setActiveRound(item)}
              >
                {item.name}
              </button>
              <button
                type="button"
                className={classNames(
                  activeRound?.id === item.id
                    ? 'bg-primary hover:bg-primary-hover text-white dark:bg-primary-dark dark:hover:bg-primary-dark-hover'
                    : 'ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700',
                  'relative -ml-px inline-flex items-center rounded-r-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:z-10'
                )}
                onClick={() => {
                  setRoundToEdit(item);
                  setRoundSlideoutOpen(true);
                }}
              >
                <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={() => setRoundSlideoutOpen(true)}
            className="mt-2 relative inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Add Round
          </button>
        </div>
      </div>
    </nav>
  );
}
