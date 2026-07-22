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
    { path: '/admin', label: 'Products', icon: <svg style={{width:'16px',height:'16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { path: '/admin/search', label: 'Search', icon: <svg style={{width:'16px',height:'16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
    { path: '/admin/users', label: 'Users', icon: <svg style={{width:'16px',height:'16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* NAVBAR */}
      <nav className="navbar" style={{ width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Admin Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{user?.name}</span>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="btn btn-secondary btn-sm">Logout</button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {nav.map(n => (
            <Link key={n.path} to={n.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '500', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s', background: location.pathname === n.path ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'var(--surface)', color: location.pathname === n.path ? 'white' : 'var(--text-secondary)', border: `1px solid ${location.pathname === n.path ? 'transparent' : 'var(--border)'}` }}>
              {n.icon}
              {n.label}
            </Link>
          ))}
        </div>

        {/* CONTENT */}
        <div className="card" style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
