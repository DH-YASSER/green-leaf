import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('restaurant'); // 'restaurant' or 'fournisseur'
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'restaurant') navigate('/restaurant/dashboard');
      else if (user.role === 'fournisseur') navigate('/fournisseur/dashboard');
      else navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Auto fill demo emails for ease of testing
    if (tab === 'restaurant') {
      setForm({ email: 'restaurant@demo.com', password: 'demo123' });
    } else {
      setForm({ email: 'fournisseur@demo.com', password: 'demo123' });
    }
    setError('');
  };

  // Initialize with restaurant demo credentials on load
  React.useEffect(() => {
    setForm({ email: 'restaurant@demo.com', password: 'demo123' });
  }, []);

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
      const response = await axios.post('/api/auth/login', form);
      const { user, token } = response.data;
      
      // Update global Zustand store
      login(user, token);
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'restaurant') {
        navigate('/restaurant/dashboard');
      } else if (user.role === 'fournisseur') {
        navigate('/fournisseur/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-brand-surface border border-white/[0.06] p-10 relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="h-9 w-9 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-brand-primary" />
            </div>
            <span className="font-heading text-base font-bold tracking-tight text-white uppercase">
              Green<span className="text-brand-primary">Leaf</span>
            </span>
          </Link>
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs text-white/30 font-medium tracking-wide">
            Sign in to manage your professional orders
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex p-0.5 bg-white/[0.02] border border-white/10 rounded-sm gap-0.5 mb-8">
          <button
            type="button"
            onClick={() => handleTabChange('restaurant')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'restaurant'
                ? 'bg-brand-primary text-brand-bg'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Restaurant
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('fournisseur')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'fournisseur'
                ? 'bg-brand-primary text-brand-bg'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Supplier
          </button>
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
                  placeholder="contact@restaurant.ma"
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

          <div className="flex items-center justify-between text-[11px] font-semibold text-white/40">
            <label className="flex items-center cursor-pointer select-none">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-3.5 h-3.5 border border-white/10 peer-checked:border-brand-primary peer-checked:bg-brand-primary/10 flex items-center justify-center mr-2">
                <div className="w-1.5 h-1.5 bg-brand-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              Remember me
            </label>
            <span className="text-brand-terracotta hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-brand-bg py-4.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all btn-premium hover:bg-brand-accent disabled:opacity-55"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] font-semibold text-white/30 uppercase tracking-widest">
          Don't have an account?{' '}
          <Link
            to={`/register/${activeTab}`}
            className="text-brand-primary font-bold hover:underline"
          >
            Register Now
          </Link>
        </p>

        <div className="text-center mt-8 pt-6 border-t border-white/[0.06] text-[10px] font-bold uppercase tracking-widest">
          <Link to="/admin/login" className="text-white/20 hover:text-white transition-colors">
            Staff access portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
