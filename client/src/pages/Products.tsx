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
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    imageUrl: '',
  });

  const fetchProducts = async () => {
    const res = await api.get(`/products?page=${page}&limit=10`);
    setProducts(res.data.data);
    setTotal(res.data.pagination.total);
    const cache = res.headers['x-cache'];
    setCacheStatus(cache === 'HIT' ? 'HIT' : 'MISS');
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
      alert('Product added successfully!');
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded text-sm font-medium ${
            cacheStatus === 'HIT' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            Cache: {cacheStatus}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span>
            Add Product
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-3">
            <input
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product Name"
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              value={newProduct.price || ''}
              onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              placeholder="Price"
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              value={newProduct.stock || ''}
              onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
              placeholder="Stock"
              className="p-2 border rounded"
              required
            />
            <select
              value={newProduct.category}
              onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              className="p-2 border rounded"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              value={newProduct.imageUrl}
              onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              placeholder="Image URL (optional)"
              className="p-2 border rounded col-span-2"
            />
            <textarea
              value={newProduct.description}
              onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Description"
              className="p-2 border rounded col-span-2"
              rows={2}
              required
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Add Product
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Category</th>
            <th className="text-left py-2">Price</th>
            <th className="text-left py-2">Stock</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className={`border-b ${cacheStatus === 'HIT' ? 'bg-green-50' : ''}`}>
              <td className="py-2">
                {editingId === p._id ? (
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border p-1 rounded" />
                ) : p.name}
              </td>
              <td className="py-2">{p.category}</td>
              <td className="py-2">
                {editingId === p._id ? (
                  <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="border p-1 rounded w-20" />
                ) : `$${p.price}`}
              </td>
              <td className="py-2">
                {editingId === p._id ? (
                  <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})} className="border p-1 rounded w-16" />
                ) : p.stock}
              </td>
              <td className="py-2">
                {editingId === p._id ? (
                  <>
                    <button onClick={() => handleSave(p._id)} className="text-green-600 mr-2">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-600">Cancel</button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-4">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span className="px-3 py-1">Page {page} of {Math.ceil(total/10)}</span>
        <button onClick={() => setPage(p => p+1)} disabled={page*10>=total} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Products;
