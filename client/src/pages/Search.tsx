import { useState } from 'react';
import api from '../lib/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, stock: 0, category: '' });

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    setResults(res.data.data);
    setLoading(false);
  };

  const handleSave = async (id: string) => {
    await api.put(`/products/${id}`, editForm);
    setEditId(null);
    setResults(results.map(r => r._id === id ? { ...r, ...editForm } : r));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Search & Edit</h2>
      <div className="flex gap-3 mb-6">
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search products..." className="input flex-1" />
        <button onClick={handleSearch} disabled={loading} className="btn btn-dark">{loading ? 'Searching...' : 'Search'}</button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map(r => (
            <div key={r._id} className="bg-white border p-4 rounded-lg">
              {editId === r._id ? (
                <div className="space-y-3">
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input" />
                  <div className="flex gap-3">
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: +e.target.value})} className="input w-32" />
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: +e.target.value})} className="input w-32" />
                    <input value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="input flex-1" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(r._id)} className="btn btn-gold btn-sm">Save</button>
                    <button onClick={() => setEditId(null)} className="btn btn-outline btn-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-gray-500">{r.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="font-medium">${r.price}</span>
                      <span className="category-tag">{r.category}</span>
                      <span>Stock: {r.stock}</span>
                    </div>
                  </div>
                  <button onClick={() => { setEditId(r._id); setEditForm({name:r.name,price:r.price,stock:r.stock,category:r.category}); }} className="btn btn-dark btn-sm">Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {results.length === 0 && query && !loading && <p className="text-gray-400 text-center py-8">No products found</p>}
    </div>
  );
}
