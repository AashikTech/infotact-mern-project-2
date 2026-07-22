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
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Search & Edit</h2>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search products..." className="input pl-10" />
        </div>
        <button onClick={handleSearch} disabled={loading} className="btn btn-primary">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map(r => (
            <div key={r._id} className="card p-4">
              {editId === r._id ? (
                <div className="space-y-3">
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input" />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: +e.target.value})} className="input" placeholder="Price" />
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: +e.target.value})} className="input" placeholder="Stock" />
                    <input value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="input" placeholder="Category" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(r._id)} className="btn btn-primary btn-sm">Save</button>
                    <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{r.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold">${r.price.toFixed(2)}</span>
                      <span className="category-tag">{r.category}</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stock: {r.stock}</span>
                    </div>
                  </div>
                  <button onClick={() => { setEditId(r._id); setEditForm({name:r.name,price:r.price,stock:r.stock,category:r.category}); }} className="btn btn-outline btn-sm">Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-secondary)' }}>No products found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
