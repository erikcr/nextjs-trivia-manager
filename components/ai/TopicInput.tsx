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
        <label htmlFor="topic" className="block text-sm text-gray-700 dark:text-gray-300">
          What kind of questions would you like to generate?
        </label>
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
          Go
        </button>
      </div>
    </form>
  );
}
