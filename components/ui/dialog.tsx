import type React from 'react';

import { Text } from './text';
import * as Headless from '@headlessui/react';

import { cx } from '@/lib/utils';

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

export function Dialog({
  open,
  onClose,
  size = 'lg',
  className,
  children,
  ...props
}: { size?: keyof typeof sizes; className?: string; children: React.ReactNode } & Omit<
  Headless.DialogProps,
  'className'
>) {
  return (
    <Headless.Transition appear show={open} {...props}>
      <Headless.Dialog onClose={onClose}>
        <Headless.DialogBackdrop
          transition
          className="fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 transition duration-100 focus:outline-0 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-zinc-950/50 sm:px-6 sm:py-8 lg:px-8 lg:py-16"
        />

        <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
          <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
            <Headless.DialogPanel
              transition
              className={cx(
                className,
                sizes[size],
                'text-tremor-content row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-[--gutter] shadow-lg ring-1 ring-zinc-950/10 [--gutter:theme(spacing.8)] dark:bg-zinc-900 dark:ring-white/10 sm:mb-auto sm:rounded-2xl forced-colors:outline',
                'transition duration-100 data-[closed]:translate-y-12 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in sm:data-[closed]:translate-y-0 sm:data-[closed]:data-[enter]:scale-95',
              )}
            >
              {children}
            </Headless.DialogPanel>
          </div>
        </div>
      </Headless.Dialog>
    </Headless.Transition>
  );
}

export function DialogTitle({
  className,
  ...props
}: { className?: string } & Omit<Headless.DialogTitleProps, 'className'>) {
  return (
    <Headless.DialogTitle
      {...props}
      className={cx(
        className,
        'text-balance text-lg/6 font-semibold text-zinc-950 dark:text-white sm:text-base/6',
      )}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps<typeof Text>, 'className'>) {
  return (
    <Headless.Description as={Text} {...props} className={cx(className, 'mt-2 text-pretty')} />
  );
}

export function DialogBody({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cx(className, 'mt-6')} />;
}

export function DialogActions({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cx(
        className,
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto',
      )}
    />
  );
}
