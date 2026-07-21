import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Product { _id: string; name: string; description: string; price: number; category: string; stock: number; imageUrl: string; }

const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Sports & Outdoors', 'Books', 'Toys & Games'];

const getGridCols = () => {
  if (typeof window === 'undefined') return 'repeat(4, 1fr)';
  const w = window.innerWidth;
  if (w < 480) return 'repeat(1, 1fr)';
  if (w < 768) return 'repeat(2, 1fr)';
  if (w < 1024) return 'repeat(3, 1fr)';
  return 'repeat(4, 1fr)';
};

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
  const [gridCols, setGridCols] = useState(getGridCols());

  useEffect(() => {
    const handleResize = () => setGridCols(getGridCols());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="min-h-screen bg-[#fafaf8]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>ShopHub</h1>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500">Hello, <span className="font-semibold text-gray-900">{user?.name}</span></span>
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="text-sm font-medium">{cartCount}</span>
            </div>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="text-sm text-gray-500 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Our Collection</h2>
          <div className="w-16 h-px bg-[#c9a96e] mx-auto mt-3"></div>
        </div>

        {/* SEARCH */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search..." className="input flex-1" />
            <button onClick={handleSearch} className="btn btn-dark">Search</button>
            {searchResults && <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="btn btn-outline">Clear</button>}
          </div>
        </div>

        {/* CATEGORIES */}
        {!searchResults && (
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className="px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all" style={{ background: selectedCategory === c ? '#1a1a1a' : 'transparent', color: selectedCategory === c ? 'white' : '#666', border: `1px solid ${selectedCategory === c ? '#1a1a1a' : '#e5e5e5'}` }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {/* PRODUCTS GRID */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '24px', width: '100%' }}>
            {[1,2,3,4].map(i => <div key={i} className="bg-gray-100 animate-pulse" style={{ height: '360px' }} />)}
          </div>
        ) : display.length === 0 ? (
          <p className="text-center text-gray-400 text-lg py-20" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>No products found</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '24px', width: '100%' }}>
            {display.map(p => (
              <div key={p._id} className="product-card">
                <div className="product-img-wrapper">
                  <img 
                    src={p.imageUrl || `https://placehold.co/400x300/2c3e50/white?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}&v=${p._id}`} 
                    alt={p.name} 
                    onError={e => { 
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x300/7f8c8d/white?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}&v=${p._id}`; 
                    }} 
                  />
                </div>
                <div className="product-info">
                  <span className="category-tag mb-2 inline-block w-fit">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="product-bottom">
                    <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>${p.price}</span>
                    <button onClick={() => addToCart(p._id)} disabled={p.stock === 0} className="btn btn-outline btn-sm">{p.stock === 0 ? 'Sold Out' : 'Add to Cart'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!searchResults && (
          <div className="flex justify-center gap-4 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-outline btn-sm disabled:opacity-30">← Prev</button>
            <span className="flex items-center text-sm text-gray-500">Page {page} of {Math.ceil(total/8)}</span>
            <button onClick={() => setPage(p => p+1)} disabled={page*8>=total} className="btn btn-outline btn-sm disabled:opacity-30">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
