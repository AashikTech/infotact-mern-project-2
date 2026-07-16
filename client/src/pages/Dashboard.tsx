import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    api.get('/products').then(res => setStats(prev => ({ ...prev, products: res.data.pagination.total })));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">E-Commerce Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm text-gray-500">Total Products</h3>
            <p className="text-3xl font-bold">{stats.products}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold">{stats.orders}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Products</Link>
          <Link to="/search" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Search</Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
