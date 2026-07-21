import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
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

const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Sports & Outdoors', 'Books', 'Toys & Games'];

const Shop = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const categoryParam = selectedCategory !== 'All' ? `&category=${selectedCategory}` : '';
      const res = await api.get(`/products?page=${page}&limit=8${categoryParam}`);
      setProducts(res.data.data);
      setTotal(res.data.pagination.total);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, selectedCategory]);
  useEffect(() => { setPage(1); }, [selectedCategory]);

  const handleSearch = async () => {
    if (!searchQuery) { setSearchResults(null); return; }
    setIsLoading(true);
    try {
      const res = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.data);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      setCartCount(prev => prev + 1);
    } catch (err) {
      alert('Please login to add items');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) { logout(); }
  };

  const displayProducts = searchResults || products;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Navbar */}
      <nav className="navbar-elegant">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--color-black)' }}>
            ShopHub
          </h1>
          <div className="flex items-center gap-8">
            <span className="text-sm" style={{ color: 'var(--color-gray)' }}>
              Welcome, <span className="font-semibold" style={{ color: 'var(--color-black)' }}>{user?.name}</span>
            </span>
            <div className="flex items-center gap-2 px-4 py-2" style={{ border: '1px solid var(--color-light)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-gold)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-black)' }}>{cartCount}</span>
            </div>
            <button onClick={handleLogout} className="btn-elegant btn-ghost-elegant text-xs">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl mb-3" style={{ color: 'var(--color-black)' }}>
            {searchResults ? 'Search Results' : 'Our Collection'}
          </h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'var(--color-gold)' }}></div>
        </div>

        {/* Search */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search our collection..."
                className="input-elegant pl-12"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-silver)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button onClick={handleSearch} className="btn-elegant btn-dark">Search</button>
            {searchResults && (
              <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="btn-elegant btn-outline-elegant">Clear</button>
            )}
          </div>
        </div>

        {/* Categories */}
        {!searchResults && (
          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300"
                style={{
                  background: selectedCategory === cat ? 'var(--color-black)' : 'transparent',
                  color: selectedCategory === cat ? 'var(--color-white)' : 'var(--color-gray)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--color-black)' : 'var(--color-light)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="shimmer-elegant" style={{ height: '360px' }}></div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-accent text-2xl italic" style={{ color: 'var(--color-silver)' }}>
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => (
              <div
                key={product._id}
                className="product-card-elegant"
                style={{ animation: `fadeInUp 0.5s ease forwards`, animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <div className="relative overflow-hidden" style={{ height: '240px' }}>
                  <img
                    src={product.imageUrl || `https://placehold.co/400x400/f5f3f0/1a1a1a?text=${encodeURIComponent(product.name.substring(0, 8))}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/400x400/f5f3f0/1a1a1a?text=${encodeURIComponent(product.name.substring(0, 8))}`;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="category-tag">{product.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg mb-2" style={{ color: 'var(--color-black)' }}>{product.name}</h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-silver)', fontStyle: 'italic' }}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="price-elegant">${product.price}</span>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock === 0}
                      className="btn-elegant btn-outline-elegant text-xs px-4 py-2"
                    >
                      {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!searchResults && (
          <div className="flex justify-center gap-4 mt-16">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-elegant btn-outline-elegant disabled:opacity-30"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-3 px-8 py-3" style={{ border: '1px solid var(--color-light)' }}>
              <span className="font-display text-lg" style={{ color: 'var(--color-gold)' }}>{page}</span>
              <span style={{ color: 'var(--color-silver)' }}>/</span>
              <span className="font-display text-lg">{Math.ceil(total / 8)}</span>
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 8 >= total}
              className="btn-elegant btn-outline-elegant disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid var(--color-light)' }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-silver)' }}>
          E-Commerce Engine © 2024
        </p>
      </footer>
    </div>
  );
};

export default Shop;
