'use client';

import { Fragment, useState } from 'react';

import Link from 'next/link';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

import { useEventStore } from '@/lib/store/event-store';
import { cx } from '@/lib/utils';

const getEventDate = (dateOfEvent: string) => {
  const date = dateOfEvent.split('T')[0];

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date;
};

export default function EventsList() {
  const { events, loading } = useEventStore();

  return (
    <>
      {!loading &&
        events
          ?.filter((item) => item.status !== 'completed')
          .map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 p-6">
                <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                  {item.name}
                </div>
                <span
                  className={cx(
                    item?.status === 'pending'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-green-100 dark:bg-green-900',
                    'inline-flex items-center rounded-full px-2 mr-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset',
                  )}
                >
                  {item.status}
                </span>
                <Menu as="div" className="relative ml-auto">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Open options</span>
                    <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
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
                    <MenuItems className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <p
                            className={cx(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm',
                            )}
                            // onClick={() => {
                            //   setEventToEdit(item);
                            //   setEventSlideout(true);
                            // }}
                          >
                            Edit
                          </p>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <p
                            className={cx(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm',
                            )}
                            // onClick={() => {
                            //   setDeleteEventConfirmShow(true);
                            //   setEventToDelete(item);
                            // }}
                          >
                            Delete
                          </p>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
              <a href={item.status === 'pending' ? `/${item.id}` : `/${item.id}/ongoing`}>
                <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500 dark:text-gray-300">Date</dt>
                    <dd className="text-gray-700 dark:text-gray-400">
                      <time dateTime={item.scheduled_at}>{getEventDate(item.scheduled_at)}</time>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500 dark:text-gray-300">Venue</dt>
                    <dd className="text-gray-700 dark:text-gray-400">{item.venue}</dd>
                  </div>
                </dl>
              </a>
            </li>
          ))}

      {events && events?.filter((item) => item.status === 'completed').length > 0 && (
        <div className="border-t border-gray-200 pb-5 mt-10 dark:border-zinc-700">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-zinc-200 pt-3">
            Completed events
          </h3>
        </div>
      )}

      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
      >
        {!loading &&
          events
            ?.filter((item) => item.status === 'completed')
            .map((item) => (
              <Link key={item.id} href={`/${item.id}/final`}>
                <li
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 p-6">
                    <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                      {item.name}
                    </div>
                    <span className="inline-flex items-center rounded-full px-2 mr-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 ring-1 ring-inset dark:ring-zinc-700">
                      {item.status}
                    </span>
                  </div>
                  <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500 dark:text-gray-300">Date</dt>
                      <dd className="text-gray-700 dark:text-gray-400">
                        <time dateTime={item.scheduled_at}>
                          {format(parseISO(item.scheduled_at), 'LLLL d, yyyy')}
                        </time>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500 dark:text-gray-300">Venue</dt>
                      <dd className="text-gray-700 dark:text-gray-400">{item.venue}</dd>
                    </div>
                  </dl>
                </li>
              </Link>
            ))}
      </ul>
    </>
  );
}
