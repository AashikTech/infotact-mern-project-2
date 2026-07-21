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

const categories = [
  { name: 'All', icon: '🏷️', color: 'from-gray-500 to-gray-600' },
  { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-blue-600' },
  { name: 'Clothing', icon: '👕', color: 'from-red-500 to-red-600' },
  { name: 'Home & Kitchen', icon: '🏠', color: 'from-green-500 to-green-600' },
  { name: 'Sports & Outdoors', icon: '⚽', color: 'from-orange-500 to-orange-600' },
  { name: 'Books', icon: '📚', color: 'from-purple-500 to-purple-600' },
  { name: 'Toys & Games', icon: '🎮', color: 'from-cyan-500 to-cyan-600' },
];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Navbar */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold gradient-text">ShopHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, <span className="font-semibold">{user?.name}</span></span>
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold">{cartCount}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost text-sm">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="glass-card p-6 mb-8">
          <div className="flex gap-3">
            <div className="search-container flex-1">
              <svg className="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for products..."
                className="input-glass pl-12"
              />
            </div>
            <button onClick={handleSearch} disabled={isLoading} className="btn btn-primary">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
            {searchResults && (
              <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="btn btn-outline">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        {!searchResults && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.name
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            {searchResults ? `Search Results (${searchResults.length})` : selectedCategory}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="h-48 shimmer"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 shimmer rounded w-3/4"></div>
                  <div className="h-3 shimmer rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <div key={product._id} className="product-card card-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.imageUrl || `https://placehold.co/400x400/95a5a6/white?text=${encodeURIComponent(product.name.substring(0, 10))}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/400x400/95a5a6/white?text=${encodeURIComponent(product.name.substring(0, 10))}`;
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`category-badge category-${product.category.toLowerCase().replace(/[^a-z]/g, '')}`}>
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="price-tag">${product.price}</span>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock === 0}
                      className="btn btn-primary px-4 py-2 text-sm"
                    >
                      {product.stock === 0 ? 'Out of Stock' : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!searchResults && (
          <div className="flex justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex items-center gap-2 px-6 py-2 glass-card">
              <span className="font-semibold text-indigo-600">{page}</span>
              <span className="text-gray-400">of</span>
              <span className="font-semibold">{Math.ceil(total / 8)}</span>
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 8 >= total}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
