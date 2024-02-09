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
          "h-full bg-gray-50 dark:bg-gray-700"
        )}
      >
        {/* <Provider> */}
          <div>{children}</div>
        {/* </Provider> */}
      </body>
    </html>
  );
}
