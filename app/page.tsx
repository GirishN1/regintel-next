'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
      const data = await res.json();

      setResponse(data.summary || 'No summary received.');
    } catch (err: any) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">RegIntel Prototype</h1>
      <p className="text-gray-600 mb-4">This is your rebuilt version. All is good now.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a regulatory question..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 border border-green-400 bg-green-50 rounded">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 border border-red-400 bg-red-50 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </main>
  );
}
