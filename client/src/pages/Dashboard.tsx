import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const location = useLocation();

  useEffect(() => { api.get('/products').then(r => setStats(p => ({ ...p, products: r.data.pagination.total }))); }, []);

  const nav = [
    { path: '/admin', label: 'Products' },
    { path: '/admin/search', label: 'Search' },
    { path: '/admin/users', label: 'Users' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">Admin</h1>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold">{stats.products}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold">{stats.orders}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          {nav.map(n => (
            <Link key={n.path} to={n.path} className="btn text-sm" style={{ background: location.pathname === n.path ? '#333' : 'white', color: location.pathname === n.path ? 'white' : '#666', border: '1px solid #ddd' }}>
              {n.label}
            </Link>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
