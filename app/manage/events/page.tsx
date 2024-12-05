'use client';

import { Fragment, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AddEventSlideout from './components/AddEventSlideout';
import EventList from './components/EventList';
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { toast } from 'sonner';

import { AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Event, useEventStore } from '@/lib/store/event-store';
import { cx } from '@/lib/utils';

export default function EventsPage() {
  const router = useRouter();
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } =
    useEventStore();

  // UI State
  const [eventSlideout, setEventSlideout] = useState(false);
  const [addEventLoading, setAddEventLoading] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event>();
  const [eventToDelete, setEventToDelete] = useState<Event>();
  const [deleteEventConfirmShow, setDeleteEventConfirmShow] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = async (formData: FormData) => {
    setAddEventLoading(true);
    const newEvent = await createEvent({
      name: formData.get('event-name') as string,
      scheduled_at: formData.get('event-date') as string,
      description: formData.get('event-description') as string,
      location: formData.get('event-location') as string,
      venue: formData.get('event-venue') as string,
    });

    if (newEvent) {
      toast.success('Event created');
      setEventSlideout(false);
      router.push(`/dashboard/${newEvent.id}/editor`);
    } else {
      toast.error('Failed to create event');
    }
    setAddEventLoading(false);
  };

  const handleUpdateEvent = async (formData: FormData) => {
    if (!eventToEdit) return;

    setAddEventLoading(true);
    const updatedEvent = await updateEvent(eventToEdit.id, {
      name: formData.get('event-name') as string,
      scheduled_at: formData.get('event-date') as string,
      description: formData.get('event-description') as string,
      location: formData.get('event-location') as string,
      venue: formData.get('event-venue') as string,
    });

    if (updatedEvent) {
      toast.success('Event updated');
      setEventSlideout(false);
      setEventToEdit(undefined);
    } else {
      toast.error('Failed to update event');
    }
    setAddEventLoading(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    const success = await deleteEvent(eventToDelete.id);
    if (success) {
      setDeleteEventConfirmShow(false);
      setEventToDelete(undefined);
      toast.success('Event deleted');
    } else {
      toast.error('Failed to delete event');
    }
  };

  const getMinEventDate = () => {
    const dtToday = new Date();

    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let yearStr = dtToday.getFullYear().toString();

    let monthStr = month.toString();
    let dayStr = day.toString();

    if (month < 10) monthStr = '0' + monthStr;
    if (day < 10) dayStr = '0' + dayStr;

    return yearStr + '-' + monthStr + '-' + dayStr;
  };

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
      >
        <li>
          <button
            type="button"
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 dark:border-zinc-700 dark:hover:border-zinc-500 p-12 text-center focus:outline-none"
            onClick={() => {
              setEventSlideout(true);
            }}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              />
            </svg>
            <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-zinc-400">
              Create a new event
            </span>
          </button>
        </li>

        {loading && (
          <li className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 p-6">
              <div className="text-sm font-medium leading-6 text-gray-400 dark:text-gray-200">
                Loading...
              </div>
              <EllipsisHorizontalIcon
                className="h-5 w-5 relative ml-auto text-gray-300 dark:text-gray-200"
                aria-hidden="true"
              />
            </div>
            <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-300 dark:text-gray-300">Date</dt>
                <dd className="text-gray-300 dark:text-gray-400">Loading...</dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-300 dark:text-gray-300">Venue</dt>
                <dd className="text-gray-300 dark:text-gray-400">Loading...</dd>
              </div>
            </dl>
          </li>
        )}
      </ul>

      <EventList />

      <AddEventSlideout
        open={eventSlideout}
        onClose={() => setEventSlideout(false)}
        onSubmit={handleAddEvent}
        loading={addEventLoading}
      />

      {/**
       * Event panel slideout
       */}
      <AlertDialog open={deleteEventConfirmShow}>
        <AlertDialogTitle>Confirm event delete</AlertDialogTitle>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          <p>
            You are about to delete <b>{eventToDelete?.name}</b>. Are you sure?
          </p>
          <p>This will delete all rounds and questions you created for this event.</p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={() => setDeleteEventConfirmShow(false)}>Cancel</Button>
          <Button color="red" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </div>
      </AlertDialog>
    </>
  );
}
