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
    setEditForm({ name: product.name, price: product.price, stock: product.stock, category: product.category });
  };

  const handleSave = async (id: string) => {
    try {
      await api.put(`/products/${id}`, editForm);
      setEditingId(null);
      setResults(results.map(r => r._id === id ? { ...r, ...editForm } : r));
    } catch (err) {
      alert('Failed to update product');
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--color-black)' }}>Search & Edit</h2>

      {/* Search Bar */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search products..."
            className="input-elegant pl-12"
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-silver)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={handleSearch} disabled={loading} className="btn-elegant btn-dark">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r: any) => (
            <div key={r._id} className="card-elegant p-6">
              {editingId === r._id ? (
                <div className="space-y-4">
                  <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-elegant" placeholder="Product name" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} className="input-elegant" placeholder="Price" />
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })} className="input-elegant" placeholder="Stock" />
                    <input value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="input-elegant" placeholder="Category" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleSave(r._id)} className="btn-elegant btn-gold">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-elegant btn-outline-elegant">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-lg mb-1" style={{ color: 'var(--color-black)' }}>{r.name}</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-silver)', fontStyle: 'italic' }}>{r.description}</p>
                    <div className="flex gap-6 text-sm">
                      <span className="price-elegant">${r.price}</span>
                      <span className="category-tag">{r.category}</span>
                      <span style={{ color: 'var(--color-gray)' }}>Stock: {r.stock}</span>
                    </div>
                  </div>
                  <button onClick={() => handleEdit(r)} className="btn-elegant btn-dark text-xs">Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <div className="text-center py-12">
          <p className="font-accent text-xl italic" style={{ color: 'var(--color-silver)' }}>No products found</p>
        </div>
      )}
    </div>
  );
};

export default Search;
