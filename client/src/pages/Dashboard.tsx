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
    { path: '/admin', label: 'Products', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { path: '/admin/search', label: 'Search', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
    { path: '/admin/users', label: 'Users', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Admin</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.name}</span>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="btn btn-ghost btn-sm">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="stat-card">
            <p className="label">Total Products</p>
            <p className="value">{stats.products}</p>
          </div>
          <div className="stat-card">
            <p className="label">Total Orders</p>
            <p className="value">{stats.orders}</p>
          </div>
        </div>

        {/* NAV TABS */}
        <div className="flex gap-2 mb-8">
          {nav.map(n => (
            <Link key={n.path} to={n.path} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all" style={{ background: location.pathname === n.path ? 'var(--primary)' : 'var(--surface)', color: location.pathname === n.path ? 'white' : 'var(--text-secondary)', border: `1px solid ${location.pathname === n.path ? 'var(--primary)' : 'var(--border)'}` }}>
              {n.icon}
              {n.label}
            </Link>
          ))}
        </div>

        {/* CONTENT */}
        <div className="card p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
