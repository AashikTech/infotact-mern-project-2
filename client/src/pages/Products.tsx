import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cacheStatus, setCacheStatus] = useState<'HIT' | 'MISS' | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, stock: 0 });

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <div className={`px-3 py-1 rounded text-sm font-medium ${
          cacheStatus === 'HIT' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          Cache: {cacheStatus}
        </div>
      </div>

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
                  <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
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
