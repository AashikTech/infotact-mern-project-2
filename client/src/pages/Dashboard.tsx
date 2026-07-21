import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const location = useLocation();

  useEffect(() => {
    api.get('/products').then(res => setStats(prev => ({ ...prev, products: res.data.pagination.total })));
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) { logout(); }
  };

  const navItems = [
    { path: '/admin', label: 'Products' },
    { path: '/admin/search', label: 'Search' },
    { path: '/admin/users', label: 'Users' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Navbar */}
      <nav className="navbar-elegant">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--color-black)' }}>
            Admin
          </h1>
          <div className="flex items-center gap-8">
            <span className="text-sm" style={{ color: 'var(--color-gray)' }}>
              {user?.name}
            </span>
            <button onClick={handleLogout} className="btn-elegant btn-ghost-elegant text-xs">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--color-black)' }}>Dashboard</h2>
          <div className="w-16 h-px" style={{ background: 'var(--color-gold)' }}></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="stat-card-elegant" style={{ animation: 'fadeInUp 0.5s ease' }}>
            <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--color-silver)' }}>Total Products</p>
            <p className="font-display text-4xl" style={{ color: 'var(--color-black)' }}>{stats.products}</p>
          </div>
          <div className="stat-card-elegant" style={{ animation: 'fadeInUp 0.5s ease', animationDelay: '0.1s', opacity: 0 }}>
            <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--color-silver)' }}>Total Orders</p>
            <p className="font-display text-4xl" style={{ color: 'var(--color-black)' }}>{stats.orders}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="btn-elegant text-xs"
              style={{
                background: location.pathname === item.path ? 'var(--color-black)' : 'transparent',
                color: location.pathname === item.path ? 'var(--color-white)' : 'var(--color-gray)',
                border: `1px solid ${location.pathname === item.path ? 'var(--color-black)' : 'var(--color-light)'}`,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="card-elegant p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
