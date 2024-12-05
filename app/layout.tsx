import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import Provider from '@/app/provider';
import { cx } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TriviaLynx',
  description: "Let's get ready to trivia!",
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon.ico',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon-dark.ico',
      media: '(prefers-color-scheme: dark)',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cx(inter.className, 'h-full bg-gray-100 dark:bg-zinc-900')}>
        <Provider>
          <div>{children}</div>
        </Provider>
      </body>
    </html>
  );
}
