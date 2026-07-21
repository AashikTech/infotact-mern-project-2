import { useEffect, useState } from 'react';
import api from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    const res = await api.get('/auth/users');
    setUsers(res.data.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/create-admin', form);
      setForm({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create admin');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-2xl" style={{ color: 'var(--color-black)' }}>Users</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-elegant btn-gold text-xs">
          {showForm ? 'Cancel' : '+ Add Admin'}
        </button>
      </div>

      {showForm && (
        <div className="card-elegant p-6 mb-8" style={{ animation: 'fadeInUp 0.4s ease' }}>
          <h3 className="font-display text-lg mb-4" style={{ color: 'var(--color-black)' }}>Create Admin</h3>
          {error && (
            <div className="mb-4 p-3 text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleCreateAdmin} className="flex gap-3">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="input-elegant flex-1" required />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="input-elegant flex-1" required />
            <div className="relative flex-1">
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" type={showPassword ? 'text' : 'password'} className="input-elegant pr-10" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-silver)' }}>
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>
            <button type="submit" className="btn-elegant btn-gold">Create</button>
          </form>
        </div>
      )}

      <div className="card-elegant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--color-black)' }}>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Name</th>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Email</th>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Role</th>
              <th className="text-left py-4 px-6 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-silver)' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-b" style={{ borderColor: 'var(--color-light)', animation: `fadeIn 0.3s ease ${index * 0.05}s` }}>
                <td className="py-4 px-6 font-medium">{user.name}</td>
                <td className="py-4 px-6" style={{ color: 'var(--color-gray)' }}>{user.email}</td>
                <td className="py-4 px-6">
                  <span className="category-tag" style={{ borderColor: user.role === 'admin' ? 'var(--color-gold)' : 'var(--color-light)', color: user.role === 'admin' ? 'var(--color-gold)' : 'var(--color-gray)' }}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm" style={{ color: 'var(--color-silver)' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
