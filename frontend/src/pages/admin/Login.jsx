import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { Leaf, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/admin/login', form);
      const { user, token } = response.data;

      // Update global Zustand store (also persists to localStorage)
      login(user, token);

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center py-20 px-6 relative overflow-hidden grain-overlay">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-brand-surface border border-white/[0.06] p-10 relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="h-9 w-9 bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-brand-primary" />
            </div>
            <span className="font-heading text-base font-bold tracking-tight text-white uppercase">
              Green<span className="text-brand-primary">Leaf</span>
            </span>
          </Link>

          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-brand-accent" />
            <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-white">
              Admin Access
            </h2>
          </div>
          <p className="text-xs text-white/30 font-medium tracking-wide">
            Restricted area — authorized personnel only
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@greenleaf.ma"
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-brand-terracotta/10 border border-brand-terracotta/20 text-brand-terracotta flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-xs font-bold uppercase tracking-wide leading-relaxed">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-sharp w-full bg-brand-primary text-brand-bg py-4.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-brand-accent disabled:opacity-55"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/[0.06]">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">
            ← Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
