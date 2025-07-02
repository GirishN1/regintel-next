'use client';

import { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">RegIntel Prototype</h1>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter your regulatory query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="mt-2">{response.summary}</p>

          {response.citations?.length > 0 && (
            <>
              <h3 className="mt-4 font-medium">Citations</h3>
              <ul className="list-disc list-inside">
                {response.citations.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {response.recommendations?.length > 0 && (
            <>
              <h3 className="mt-4 font-medium">Recommendations</h3>
              <ul className="list-disc list-inside">
                {response.recommendations.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </main>
  );
}
