import { useEffect, useState } from 'react';
import api from '../lib/api';

interface User { _id: string; name: string; email: string; role: string; createdAt: string; }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/auth/users').then(r => setUsers(r.data.data)); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/create-admin', form);
      setForm({ name: '', email: '', password: '' });
      setShowForm(false);
      api.get('/auth/users').then(r => setUsers(r.data.data));
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Users</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-gold text-sm">{showForm ? 'Cancel' : '+ Add Admin'}</button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border p-4 rounded-lg mb-6">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}
          <form onSubmit={handleCreate} className="flex gap-3">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="input flex-1" required />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" type="email" className="input flex-1" required />
            <div className="relative flex-1">
              <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" type={showPassword ? 'text' : 'password'} className="input pr-10" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? '👁️' : '👁️‍🗨️'}</button>
            </div>
            <button type="submit" className="btn btn-gold">Create</button>
          </form>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table>
          <thead><tr className="bg-gray-100"><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="category-tag">{u.role}</span></td>
                <td className="text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
