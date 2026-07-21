import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password, 'customer');
      navigate('/shop');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <div className="w-full max-w-md mx-4" style={{ animation: 'scaleIn 0.6s ease' }}>
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--color-gold)' }}>Join Us</h1>
          <div className="w-16 h-px mx-auto" style={{ background: 'var(--color-gold)' }}></div>
        </div>

        <div className="p-10" style={{ background: 'var(--color-white)', border: '1px solid var(--color-light)' }}>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--color-black)' }}>Create Account</h2>
            <p className="text-sm" style={{ color: 'var(--color-silver)', fontStyle: 'italic' }}>
              Register as a customer
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', animation: 'fadeIn 0.3s ease' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--color-gray)' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-elegant" placeholder="John Doe" required />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--color-gray)' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-elegant" placeholder="your@email.com" required />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--color-gray)' }}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-elegant pr-12" placeholder="••••••••" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-silver)' }}>
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-elegant btn-gold w-full">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider-elegant my-8">or</div>

          <div className="text-center">
            <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
