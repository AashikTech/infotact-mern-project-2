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
      {/* NAVBAR - Full Width */}
      <nav className="navbar" style={{ width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>ShopHub</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Hi, <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</span></span>
            <div style={{ position: 'relative' }}>
              <button style={{ padding: '8px', borderRadius: '12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </button>
              {cartCount > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>{cartCount}</span>}
            </div>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="btn btn-secondary btn-sm">Logout</button>
          </div>
        </div>
      </nav>

      {/* CONTENT - Centered */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>All Products</h1>
          <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-secondary)' }}>Browse our collection</p>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', maxWidth: '576px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search products..." className="input" style={{ paddingLeft: '40px' }} />
            </div>
            <button onClick={handleSearch} className="btn btn-primary">Search</button>
            {searchResults && <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="btn btn-outline">Clear</button>}
          </div>
        </div>

        {/* CATEGORIES */}
        {!searchResults && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '9999px', transition: 'all 0.2s', background: selectedCategory === c ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'var(--surface)', color: selectedCategory === c ? 'white' : 'var(--text-secondary)', border: `1px solid ${selectedCategory === c ? 'transparent' : 'var(--border)'}`, cursor: 'pointer' }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {loading ? (
          <div className="product-grid">
            {[1,2,3,4].map(i => <div key={i} className="product-card"><div className="img-wrapper" style={{ background: '#e2e8f0' }} /><div className="info"><div className="h-4 rounded mb-2" style={{ background: '#e2e8f0', width: '60%' }} /><div className="h-3 rounded" style={{ background: '#e2e8f0', width: '80%' }} /></div></div>)}
          </div>
        ) : display.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <p style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-secondary)' }}>No products found</p>
            <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-muted)' }}>Try a different search or category</p>
          </div>
        ) : (
          <div className="product-grid">
            {display.map(p => (
              <div key={p._id} className="product-card">
                <div className="img-wrapper">
                  <img src={p.imageUrl || `https://placehold.co/400x300/f1f5f9/64748b?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}`} alt={p.name} onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f1f5f9/64748b?text=${encodeURIComponent(p.name.split(' ').slice(0,2).join(' '))}`; }} />
                  {p.stock === 0 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>Out of Stock</span></div>}
                </div>
                <div className="info">
                  <span className="category-tag" style={{ marginBottom: '8px', display: 'inline-block', width: 'fit-content' }}>{p.category}</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Showing {((page-1)*8)+1}-{Math.min(page*8, total)} of {total}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-outline btn-sm" style={{ opacity: page===1 ? 0.4 : 1 }}>← Prev</button>
              <button onClick={() => setPage(p => p+1)} disabled={page*8>=total} className="btn btn-outline btn-sm" style={{ opacity: page*8>=total ? 0.4 : 1 }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
