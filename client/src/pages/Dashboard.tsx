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
    <div className="min-h-screen bg-[#fafaf8]">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Admin</h1>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="text-sm text-gray-500 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</h2>
        <div className="w-12 h-px bg-[#c9a96e] mb-8"></div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-2">Total Products</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{stats.products}</p>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-2">Total Orders</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{stats.orders}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          {nav.map(n => (
            <Link key={n.path} to={n.path} className="btn text-xs" style={{ background: location.pathname === n.path ? '#1a1a1a' : 'transparent', color: location.pathname === n.path ? 'white' : '#666', border: `1px solid ${location.pathname === n.path ? '#1a1a1a' : '#e5e5e5'}` }}>
              {n.label}
            </Link>
          ))}
        </div>

        <div className="bg-white border border-gray-200 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
