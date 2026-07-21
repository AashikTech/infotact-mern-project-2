import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Sports & Outdoors', 'Books', 'Toys & Games'];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cacheStatus, setCacheStatus] = useState<'HIT' | 'MISS' | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, stock: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: 'Electronics', stock: 0, imageUrl: '' });

  const fetchProducts = async () => {
    const res = await api.get(`/products?page=${page}&limit=10`);
    setProducts(res.data.data);
    setTotal(res.data.pagination.total);
    setCacheStatus(res.headers['x-cache'] === 'HIT' ? 'HIT' : 'MISS');
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setEditForm({ name: product.name, price: product.price, stock: product.stock });
  };

  const handleSave = async (id: string) => {
    await api.put(`/products/${id}`, editForm);
    setEditingId(null);
    fetchProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      setShowAddForm(false);
      setNewProduct({ name: '', description: '', price: 0, category: 'Electronics', stock: 0, imageUrl: '' });
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-2xl" style={{ color: 'var(--color-black)' }}>Products</h2>
          {cacheStatus && (
            <span className="text-xs px-3 py-1 tracking-wider uppercase" style={{ background: 'var(--color-cream)', color: 'var(--color-gray)', border: '1px solid var(--color-light)' }}>
              Cache: {cacheStatus}
            </span>
          )}
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-elegant btn-gold text-xs">
          + Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="card-elegant p-8 mb-8" style={{ animation: 'fadeInUp 0.4s ease' }}>
          <h3 className="font-display text-lg mb-6" style={{ color: 'var(--color-black)' }}>Add New Product</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
            <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name" className="input-elegant" required />
            <input type="number" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} placeholder="Price" className="input-elegant" required />
            <input type="number" value={newProduct.stock || ''} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} placeholder="Stock" className="input-elegant" required />
            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="input-elegant">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} placeholder="Image URL" className="input-elegant col-span-2" />
            <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description" className="input-elegant col-span-2" rows={2} required />
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-elegant btn-gold">Add Product</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-elegant btn-outline-elegant">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-elegant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--color-black)' }}>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Name</th>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Category</th>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Price</th>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Stock</th>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p._id} className="border-b" style={{ borderColor: 'var(--color-light)', animation: `fadeIn 0.3s ease ${index * 0.05}s` }}>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input-elegant py-2 px-3 text-sm" />
                  ) : <span className="font-medium">{p.name}</span>}
                </td>
                <td className="py-4 px-6">
                  <span className="category-tag">{p.category}</span>
                </td>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="input-elegant py-2 px-3 text-sm w-24" />
                  ) : <span className="price-elegant">${p.price}</span>}
                </td>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})} className="input-elegant py-2 px-3 text-sm w-20" />
                  ) : <span className="font-medium">{p.stock}</span>}
                </td>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(p._id)} className="btn-elegant btn-gold px-3 py-1 text-xs">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-elegant btn-outline-elegant px-3 py-1 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="btn-elegant btn-dark px-3 py-1 text-xs">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="btn-elegant px-3 py-1 text-xs" style={{ border: '1px solid #991b1b', color: '#991b1b' }}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn-elegant btn-outline-elegant disabled:opacity-30">← Previous</button>
        <div className="flex items-center gap-3 px-6 py-3" style={{ border: '1px solid var(--color-light)' }}>
          <span className="font-display text-lg" style={{ color: 'var(--color-gold)' }}>{page}</span>
          <span style={{ color: 'var(--color-silver)' }}>/</span>
          <span className="font-display text-lg">{Math.ceil(total/10)}</span>
        </div>
        <button onClick={() => setPage(p => p+1)} disabled={page*10>=total} className="btn-elegant btn-outline-elegant disabled:opacity-30">Next →</button>
      </div>
    </div>
  );
};

export default Products;
