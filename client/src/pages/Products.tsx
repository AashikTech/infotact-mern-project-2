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
  const add = async (e: React.FormEvent) => { e.preventDefault(); await api.post('/products', newP); setShowAdd(false); fetch(); };
  const del = async (id: string) => { if (confirm('Delete?')) { await api.delete(`/products/${id}`); fetch(); } };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Products</h2>
          {cache && <span className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded">Cache: {cache}</span>}
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn btn-gold text-sm">+ Add</button>
      </div>

      {showAdd && (
        <div className="bg-white border p-6 mb-6 rounded-lg">
          <form onSubmit={add} className="grid grid-cols-2 gap-4">
            <input value={newP.name} onChange={e => setNewP({...newP, name: e.target.value})} placeholder="Name" className="input" required />
            <input type="number" value={newP.price||''} onChange={e => setNewP({...newP, price: +e.target.value})} placeholder="Price" className="input" required />
            <input type="number" value={newP.stock||''} onChange={e => setNewP({...newP, stock: +e.target.value})} placeholder="Stock" className="input" required />
            <select value={newP.category} onChange={e => setNewP({...newP, category: e.target.value})} className="input">{cats.map(c=><option key={c}>{c}</option>)}</select>
            <input value={newP.imageUrl} onChange={e => setNewP({...newP, imageUrl: e.target.value})} placeholder="Image URL" className="input col-span-2" />
            <textarea value={newP.description} onChange={e => setNewP({...newP, description: e.target.value})} placeholder="Description" className="input col-span-2" rows={2} required />
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn btn-gold">Add</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table>
          <thead><tr className="bg-gray-100">
            <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{editId===p._id ? <input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} className="input py-1 px-2 text-sm" /> : p.name}</td>
                <td><span className="category-tag">{p.category}</span></td>
                <td>{editId===p._id ? <input type="number" value={editForm.price} onChange={e=>setEditForm({...editForm,price:+e.target.value})} className="input py-1 px-2 text-sm w-20" /> : `$${p.price}`}</td>
                <td>{editId===p._id ? <input type="number" value={editForm.stock} onChange={e=>setEditForm({...editForm,stock:+e.target.value})} className="input py-1 px-2 text-sm w-16" /> : p.stock}</td>
                <td>
                  {editId===p._id ? (
                    <div className="flex gap-2"><button onClick={()=>save(p._id)} className="btn btn-gold btn-sm">Save</button><button onClick={()=>setEditId(null)} className="btn btn-outline btn-sm">Cancel</button></div>
                  ) : (
                    <div className="flex gap-2"><button onClick={()=>{setEditId(p._id);setEditForm({name:p.name,price:p.price,stock:p.stock})}} className="btn btn-dark btn-sm">Edit</button><button onClick={()=>del(p._id)} className="btn btn-sm text-red-600">Delete</button></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn btn-outline btn-sm disabled:opacity-50">← Prev</button>
        <span className="flex items-center text-sm text-gray-500">Page {page} / {Math.ceil(total/10)}</span>
        <button onClick={()=>setPage(p=>p+1)} disabled={page*10>=total} className="btn btn-outline btn-sm disabled:opacity-50">Next →</button>
      </div>
    </div>
  );
}
