import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Product { _id: string; name: string; description: string; price: number; category: string; stock: number; imageUrl: string; }
const cats = ['Electronics', 'Clothing', 'Home & Kitchen', 'Sports & Outdoors', 'Books', 'Toys & Games'];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cache, setCache] = useState<'HIT'|'MISS'|null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editId, setEditId] = useState<string|null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, stock: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ name: '', description: '', price: 0, category: 'Electronics', stock: 0, imageUrl: '' });

  const fetch = async () => {
    const res = await api.get(`/products?page=${page}&limit=10`);
    setProducts(res.data.data);
    setTotal(res.data.pagination.total);
    setCache(res.headers['x-cache'] === 'HIT' ? 'HIT' : 'MISS');
  };

  useEffect(() => { fetch(); }, [page]);

  const save = async (id: string) => { await api.put(`/products/${id}`, editForm); setEditId(null); fetch(); };
  const add = async (e: React.FormEvent) => { e.preventDefault(); await api.post('/products', newP); setShowAdd(false); setNewP({ name: '', description: '', price: 0, category: 'Electronics', stock: 0, imageUrl: '' }); fetch(); };
  const del = async (id: string) => { if (confirm('Delete this product?')) { await api.delete(`/products/${id}`); fetch(); } };

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Products</h2>
          {cache && <span className={`badge ${cache === 'HIT' ? 'badge-success' : 'badge-warning'}`}>Cache: {cache}</span>}
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary btn-sm">
          <svg style={{width:'16px',height:'16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add Product
        </button>
      </div>

      {/* ADD FORM */}
      {showAdd && (
        <div className="card animate-fade-in" style={{ padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>New Product</h3>
          <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input value={newP.name} onChange={e => setNewP({...newP, name: e.target.value})} placeholder="Name" className="input" required />
            <input type="number" value={newP.price||''} onChange={e => setNewP({...newP, price: +e.target.value})} placeholder="Price" className="input" required />
            <input type="number" value={newP.stock||''} onChange={e => setNewP({...newP, stock: +e.target.value})} placeholder="Stock" className="input" required />
            <select value={newP.category} onChange={e => setNewP({...newP, category: e.target.value})} className="input">{cats.map(c=><option key={c}>{c}</option>)}</select>
            <input value={newP.imageUrl} onChange={e => setNewP({...newP, imageUrl: e.target.value})} placeholder="Image URL" className="input" style={{ gridColumn: 'span 2' }} />
            <textarea value={newP.description} onChange={e => setNewP({...newP, description: e.target.value})} placeholder="Description" className="input" rows={2} required style={{ gridColumn: 'span 2' }} />
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary">Add Product</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: '500' }}>
                  {editId === p._id ? (
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input" style={{ padding: '6px 10px', fontSize: '13px' }} />
                  ) : p.name}
                </td>
                <td><span className="category-tag">{p.category}</span></td>
                <td>
                  {editId === p._id ? (
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: +e.target.value})} className="input" style={{ padding: '6px 10px', fontSize: '13px', width: '96px' }} />
                  ) : <span style={{ fontWeight: '500' }}>${p.price.toFixed(2)}</span>}
                </td>
                <td>
                  {editId === p._id ? (
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: +e.target.value})} className="input" style={{ padding: '6px 10px', fontSize: '13px', width: '80px' }} />
                  ) : <span className={p.stock === 0 ? 'badge badge-danger' : ''}>{p.stock}</span>}
                </td>
                <td>
                  {editId === p._id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => save(p._id)} className="btn btn-primary btn-sm">Save</button>
                      <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditId(p._id); setEditForm({name:p.name,price:p.price,stock:p.stock}); }} className="btn btn-outline btn-sm">Edit</button>
                      <button onClick={() => del(p._id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Page {page} of {Math.ceil(total/10)}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn btn-outline btn-sm" style={{ opacity: page===1 ? 0.4 : 1 }}>← Prev</button>
          <button onClick={() => setPage(p => p+1)} disabled={page*10>=total} className="btn btn-outline btn-sm" style={{ opacity: page*10>=total ? 0.4 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
