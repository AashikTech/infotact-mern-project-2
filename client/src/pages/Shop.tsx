import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Product { _id: string; name: string; description: string; price: number; category: string; stock: number; imageUrl: string; }

const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Sports & Outdoors', 'Books', 'Toys & Games'];

export default function Shop() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const cat = selectedCategory !== 'All' ? `&category=${selectedCategory}` : '';
    const res = await api.get(`/products?page=${page}&limit=8${cat}`);
    setProducts(res.data.data);
    setTotal(res.data.pagination.total);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page, selectedCategory]);
  useEffect(() => { setPage(1); }, [selectedCategory]);

  const handleSearch = async () => {
    if (!searchQuery) { setSearchResults(null); return; }
    setLoading(true);
    const res = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchResults(res.data.data);
    setLoading(false);
  };

  const addToCart = async (id: string) => {
    await api.post('/cart/add', { productId: id, quantity: 1 });
    setCartCount(c => c + 1);
  };

  const display = searchResults || products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">ShopHub</h1>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">Hello, <span className="font-semibold">{user?.name}</span></span>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Cart: {cartCount}</span>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6">All Products</h2>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="flex gap-3 max-w-xl">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search products..." className="input flex-1" />
            <button onClick={handleSearch} className="btn btn-dark">Search</button>
            {searchResults && <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="btn btn-outline">Clear</button>}
          </div>
        </div>

        {/* CATEGORIES */}
        {!searchResults && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className="px-4 py-2 text-sm rounded-lg transition-all" style={{ background: selectedCategory === c ? '#333' : 'white', color: selectedCategory === c ? 'white' : '#666', border: '1px solid #ddd' }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {loading ? (
          <div className="products-grid">
            {[1,2,3,4].map(i => <div key={i} className="bg-gray-200 animate-pulse rounded-lg" style={{ height: '300px' }} />)}
          </div>
        ) : display.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No products found</p>
        ) : (
          <div className="products-grid">
            {display.map(p => (
              <div key={p._id} className="product-card">
                <div className="product-img-wrapper">
                  <img src={p.imageUrl || `https://placehold.co/400x300/ddd/999?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}`} alt={p.name} onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/ddd/999?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}`; }} />
                </div>
                <div className="product-info">
                  <span className="category-tag">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="product-bottom">
                    <span className="text-lg font-bold">${p.price}</span>
                    <button onClick={() => addToCart(p._id)} disabled={p.stock === 0} className="btn btn-outline btn-sm">{p.stock === 0 ? 'Sold Out' : 'Add to Cart'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!searchResults && (
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-outline btn-sm disabled:opacity-50">← Prev</button>
            <span className="flex items-center text-sm text-gray-500">Page {page} of {Math.ceil(total/8)}</span>
            <button onClick={() => setPage(p => p+1)} disabled={page*8>=total} className="btn btn-outline btn-sm disabled:opacity-50">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
