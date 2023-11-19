"use client";

import { useChat } from "ai/react";

export default function TriviaAI() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            TriviaAI
          </h1>
        </div>
      </header>

      <main>
        {/* Your content */}
        <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
          {messages.map((m) => (
            <div key={m.id}>
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <label>
              Say something...
              <input
                className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
                value={input}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Send</button>
          </form>
        </div>
      </main>
    </>
  );
}
