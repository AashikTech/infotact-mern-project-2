import { useState } from 'react';
import api from '../lib/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Semantic Search</h2>
      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products (e.g. warm winter jackets)..."
          className="flex-1 p-2 border rounded"
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r: any) => (
            <div key={r._id} className="p-4 border rounded">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-sm text-gray-600">{r.description}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="font-medium">${r.price}</span>
                <span className="text-gray-500">{r.category}</span>
                {r.score && <span className="text-green-600">Score: {r.score.toFixed(3)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <p className="text-gray-500">No results found. (Vector search requires Atlas index configuration)</p>
      )}
    </div>
  );
};

export default Search;
