'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.result?.choices?.[0]?.message?.content || 'No response');
      } else {
        setError(data.error || 'Failed to get response');
      }
    } catch (err: any) {
      setError('Request failed.');
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RegIntel Prototype</h1>
      <p className="mb-4 text-gray-600">Test a regulation-related query below:</p>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your regulation question..."
        className="w-full border p-2 mb-4 rounded"
        rows={4}
      />

      <button
        onClick={handleQuery}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Thinking...' : 'Submit'}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          {response}
        </div>
      )}
    </main>
  );
}
