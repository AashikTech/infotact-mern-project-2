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
    const cat = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
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
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>ShopHub</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Hi, <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</span></span>
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </button>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white" style={{ background: 'var(--accent)' }}>{cartCount}</span>}
            </div>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="btn btn-ghost btn-sm">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>All Products</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Browse our collection</p>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search products..." className="input pl-10" />
            </div>
            <button onClick={handleSearch} className="btn btn-primary">Search</button>
            {searchResults && <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="btn btn-outline">Clear</button>}
          </div>
        </div>

        {/* CATEGORIES */}
        {!searchResults && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className="px-4 py-2 text-sm font-medium rounded-full transition-all" style={{ background: selectedCategory === c ? 'var(--primary)' : 'var(--surface)', color: selectedCategory === c ? 'white' : 'var(--text-secondary)', border: `1px solid ${selectedCategory === c ? 'var(--primary)' : 'var(--border)'}` }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {loading ? (
          <div className="product-grid">
            {[1,2,3,4].map(i => <div key={i} className="product-card"><div className="img-wrapper" style={{ background: 'var(--border)' }} /><div className="info"><div className="h-4 rounded mb-2" style={{ background: 'var(--border)', width: '60%' }} /><div className="h-3 rounded" style={{ background: 'var(--border)', width: '80%' }} /></div></div>)}
          </div>
        ) : display.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No products found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search or category</p>
          </div>
        ) : (
          <div className="product-grid">
            {display.map(p => (
              <div key={p._id} className="product-card">
                <div className="img-wrapper">
                  <img src={p.imageUrl || `https://placehold.co/400x300/f3f4f6/6b7280?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}`} alt={p.name} onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f3f4f6/6b7280?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}`; }} />
                  {p.stock === 0 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-medium text-sm">Out of Stock</span></div>}
                </div>
                <div className="info">
                  <span className="category-tag mb-2 w-fit">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="bottom">
                    <span className="price">${p.price.toFixed(2)}</span>
                    <button onClick={() => addToCart(p._id)} disabled={p.stock === 0} className="btn btn-primary btn-sm">{p.stock === 0 ? 'Sold Out' : 'Add to Cart'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!searchResults && total > 0 && (
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Showing {((page-1)*8)+1}-{Math.min(page*8, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-outline btn-sm disabled:opacity-40">← Prev</button>
              <button onClick={() => setPage(p => p+1)} disabled={page*8>=total} className="btn btn-outline btn-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
