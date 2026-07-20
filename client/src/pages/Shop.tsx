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

const Shop = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);

  const fetchProducts = async () => {
    const res = await api.get(`/products?page=${page}&limit=8`);
    setProducts(res.data.data);
    setTotal(res.data.pagination.total);
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.data);
    } catch (err) {
      console.error('Search failed');
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      setCartCount(prev => prev + 1);
      alert('Added to cart!');
    } catch (err) {
      alert('Please login to add items');
    }
  };

  const displayProducts = searchResults || products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">ShopHub</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, {user?.name}</span>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">Cart: {cartCount}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>
      </nav>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products (e.g. warm winter jackets)..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          {searchResults && (
            <button
              onClick={() => { setSearchResults(null); setSearchQuery(''); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-6">
          {searchResults ? `Search Results (${searchResults.length})` : 'All Products'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                <h3 className="font-semibold mt-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-green-600">${product.price}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{product.stock} in stock</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {Math.ceil(total / 8)}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * 8 >= total}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
