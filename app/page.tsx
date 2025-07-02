'use client';

import { useState } from 'react';

type ResponseType = {
  summary: string;
  citations?: string[];
  recommendations?: string[];
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">RegIntel Prototype</h1>

      <input
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Ask a regulatory question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || query.trim() === ''}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {response && (
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Summary</h2>
            <p>{resp
