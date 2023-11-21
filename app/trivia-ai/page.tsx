"use client";

import { useEffect, useState } from "react";
import { useChat } from "ai/react";
import Sidebar from "@/components/Sidebar";

type TriviaItem = {
  question: string;
  answer: string;
};

export default function TriviaAI() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [response, setResponse] = useState<TriviaItem[]>([]);

  useEffect(() => {
    messages.map((item) => {
      if (item.role === "assistant") {
        let content = JSON.parse(item.content);
        setResponse(content);
      }
    });
  }, [messages]);

  return (
    <div>
      <Sidebar />

      <main className="lg:pl-72">
        <div className="xl:pr-96">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            {/* Main area */}
          </div>
        </div>
      </main>

      <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
        {/* Secondary column (hidden on smaller screens) */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="chat-input"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Chat
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="chat-input"
              id="chat-input"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="A trivia topic"
              value={input}
              onChange={handleInputChange}
            />
          </div>
        </form>

        <ul role="list" className="mt-4">
          {response.map((item, index) => (
            <li key={index}>
              <div className="pb-4">
                <div className="relative flex">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center">
                      <input
                        id="comments"
                        aria-describedby="comments-description"
                        name="comments"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-700">{item.question}</p>
                      <p className="text-sm text-gray-950">{item.answer} </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
