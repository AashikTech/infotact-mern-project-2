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
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/products?page=${page}&limit=10`);
      setProducts(res.data.data);
      setTotal(res.data.pagination.total);
      setCacheStatus(res.headers['x-cache'] === 'HIT' ? 'HIT' : 'MISS');
    } finally {
      setIsLoading(false);
    }
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold gradient-text">Products</h2>
          {cacheStatus && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${cacheStatus === 'HIT' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              Cache: {cacheStatus}
            </span>
          )}
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-success">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="glass-card p-6 mb-6 card-animate">
          <h3 className="font-bold text-lg mb-4 gradient-text">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
            <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name" className="input-glass" required />
            <input type="number" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} placeholder="Price" className="input-glass" required />
            <input type="number" value={newProduct.stock || ''} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} placeholder="Stock" className="input-glass" required />
            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="input-glass">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} placeholder="Image URL (optional)" className="input-glass col-span-2" />
            <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description" className="input-glass col-span-2" rows={2} required />
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn btn-success">Add Product</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <th className="text-left py-4 px-6 font-semibold">Name</th>
              <th className="text-left py-4 px-6 font-semibold">Category</th>
              <th className="text-left py-4 px-6 font-semibold">Price</th>
              <th className="text-left py-4 px-6 font-semibold">Stock</th>
              <th className="text-left py-4 px-6 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input-glass py-2 px-3 text-sm" />
                  ) : <span className="font-medium">{p.name}</span>}
                </td>
                <td className="py-4 px-6">
                  <span className={`category-badge category-${p.category.toLowerCase().replace(/[^a-z]/g, '')}`}>
                    {p.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="input-glass py-2 px-3 text-sm w-24" />
                  ) : <span className="price-tag text-sm py-1 px-3">${p.price}</span>}
                </td>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})} className="input-glass py-2 px-3 text-sm w-20" />
                  ) : <span className="font-medium">{p.stock}</span>}
                </td>
                <td className="py-4 px-6">
                  {editingId === p._id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(p._id)} className="btn btn-success px-3 py-1 text-xs">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn btn-outline px-3 py-1 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="btn btn-primary px-3 py-1 text-xs">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="btn btn-danger px-3 py-1 text-xs">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-outline disabled:opacity-50">Previous</button>
        <div className="flex items-center gap-2 px-6 py-2 glass-card">
          <span className="font-semibold text-indigo-600">{page}</span>
          <span className="text-gray-400">of</span>
          <span className="font-semibold">{Math.ceil(total/10)}</span>
        </div>
        <button onClick={() => setPage(p => p+1)} disabled={page*10>=total} className="btn btn-outline disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Products;
