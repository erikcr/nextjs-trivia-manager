import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/utils/Provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const metadata: Metadata = {
  title: "TriviaLynx",
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
      url: '/favicon-dark.png',
      media: '(prefers-color-scheme: dark)',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={classNames(
          inter.className,
          "h-full bg-gray-50 dark:bg-zinc-900"
        )}
      >
        <Provider>
          <div>{children}</div>
        </Provider>
      </body>
    </html>
  );
}
