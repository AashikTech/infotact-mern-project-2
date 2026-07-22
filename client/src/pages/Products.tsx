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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Products</h2>
          {cache && <span className={`badge ${cache === 'HIT' ? 'badge-success' : 'badge-warning'}`}>Cache: {cache}</span>}
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary btn-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add Product
        </button>
      </div>

      {/* ADD FORM */}
      {showAdd && (
        <div className="card p-5 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>New Product</h3>
          <form onSubmit={add} className="grid grid-cols-2 gap-3">
            <input value={newP.name} onChange={e => setNewP({...newP, name: e.target.value})} placeholder="Name" className="input" required />
            <input type="number" value={newP.price||''} onChange={e => setNewP({...newP, price: +e.target.value})} placeholder="Price" className="input" required />
            <input type="number" value={newP.stock||''} onChange={e => setNewP({...newP, stock: +e.target.value})} placeholder="Stock" className="input" required />
            <select value={newP.category} onChange={e => setNewP({...newP, category: e.target.value})} className="input">{cats.map(c=><option key={c}>{c}</option>)}</select>
            <input value={newP.imageUrl} onChange={e => setNewP({...newP, imageUrl: e.target.value})} placeholder="Image URL" className="input col-span-2" />
            <textarea value={newP.description} onChange={e => setNewP({...newP, description: e.target.value})} placeholder="Description" className="input col-span-2" rows={2} required />
            <div className="col-span-2 flex gap-2">
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
                <td>
                  {editId === p._id ? (
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input text-sm py-1" />
                  ) : <span className="font-medium">{p.name}</span>}
                </td>
                <td><span className="category-tag">{p.category}</span></td>
                <td>
                  {editId === p._id ? (
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: +e.target.value})} className="input text-sm py-1 w-24" />
                  ) : <span className="font-medium">${p.price.toFixed(2)}</span>}
                </td>
                <td>
                  {editId === p._id ? (
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: +e.target.value})} className="input text-sm py-1 w-20" />
                  ) : <span className={p.stock === 0 ? 'badge badge-danger' : ''}>{p.stock}</span>}
                </td>
                <td>
                  {editId === p._id ? (
                    <div className="flex gap-2">
                      <button onClick={() => save(p._id)} className="btn btn-primary btn-sm">Save</button>
                      <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
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
      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {Math.ceil(total/10)}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn btn-outline btn-sm disabled:opacity-40">← Prev</button>
          <button onClick={() => setPage(p => p+1)} disabled={page*10>=total} className="btn btn-outline btn-sm disabled:opacity-40">Next →</button>
        </div>
      </div>
    </div>
  );
}
