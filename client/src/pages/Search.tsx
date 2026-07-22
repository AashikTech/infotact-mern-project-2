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
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Search & Edit</h2>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search products..." className="input" style={{ paddingLeft: '40px' }} />
        </div>
        <button onClick={handleSearch} disabled={loading} className="btn btn-primary">{loading ? 'Searching...' : 'Search'}</button>
      </div>

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map(r => (
            <div key={r._id} className="card" style={{ padding: '16px' }}>
              {editId === r._id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: +e.target.value})} className="input" placeholder="Price" />
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: +e.target.value})} className="input" placeholder="Stock" />
                    <input value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="input" placeholder="Category" />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleSave(r._id)} className="btn btn-primary btn-sm">Save</button>
                    <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{r.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{r.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                      <span style={{ fontWeight: '600' }}>${r.price.toFixed(2)}</span>
                      <span className="category-tag">{r.category}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Stock: {r.stock}</span>
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
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No products found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
