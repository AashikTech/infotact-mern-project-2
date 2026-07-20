import { useState } from 'react';
import api from '../lib/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, stock: 0, category: '' });

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

  const handleEdit = (product: any) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
  };

  const handleSave = async (id: string) => {
    try {
      await api.put(`/products/${id}`, editForm);
      setEditingId(null);
      // Update results
      setResults(results.map(r => r._id === id ? { ...r, ...editForm } : r));
      alert('Product updated!');
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Search & Edit Products</h2>
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
              {editingId === r._id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Product name"
                  />
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-32 p-2 border rounded"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                      className="w-32 p-2 border rounded"
                      placeholder="Stock"
                    />
                    <input
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      className="flex-1 p-2 border rounded"
                      placeholder="Category"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(r._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-gray-600">{r.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-4 text-sm">
                      <span className="font-medium">${r.price}</span>
                      <span className="text-gray-500">{r.category}</span>
                      <span className="text-blue-600">Stock: {r.stock}</span>
                      {r.score && <span className="text-green-600">Score: {r.score.toFixed(3)}</span>}
                    </div>
                    <button
                      onClick={() => handleEdit(r)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <p className="text-gray-500">No products found for "{query}"</p>
      )}
    </div>
  );
};

export default Search;
