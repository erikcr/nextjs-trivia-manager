import { useState } from 'react';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  loading?: boolean;
}

export default function TopicInput({ onSubmit, loading = false }: TopicInputProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    onSubmit(topic.trim());
    setTopic('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What kind of questions would you like to generate?
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Describe the topic, theme, or specific requirements for the questions.
        </p>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="E.g., Easy science questions about space exploration"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:focus:border-primary-dark dark:focus:ring-primary-dark"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary dark:bg-primary-dark hover:bg-primary-hover dark:hover:bg-primary-dark-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            'Generate Questions'
          )}
        </button>
      </div>
    </form>
  );
}
