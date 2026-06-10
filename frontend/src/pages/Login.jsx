import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Leaf, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('restaurant'); // 'restaurant' or 'fournisseur'
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-saffron/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-luxury border border-slate-100 relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-md">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black text-brand-primary">
              Green<span className="text-brand-accent">Leaf</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-brand-primary tracking-tight">
            Welcome Back / Bienvenue
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Sign in to manage your professional orders
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-2xl gap-1 mb-8">
          <button
            type="button"
            onClick={() => handleTabChange('restaurant')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'restaurant'
                ? 'bg-white shadow text-brand-primary'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Restaurant
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('fournisseur')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'fournisseur'
                ? 'bg-white shadow text-brand-primary'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Supplier
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="contact@restaurant.ma"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">
                Password / Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-xs font-black uppercase tracking-tight">{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <label className="flex items-center cursor-pointer">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-primary focus:ring-brand-accent border-slate-200 rounded mr-2"
              />
              Remember me
            </label>
            <span className="text-brand-terracotta hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/10 disabled:opacity-75 transition-all btn-premium"
          >
            {loading ? 'Signing in...' : 'Sign in / Se connecter'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          Don't have an account?{' '}
          <Link
            to={`/register/${activeTab}`}
            className="text-brand-secondary font-black hover:underline"
          >
            Register Now
          </Link>
        </p>

        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest">
          <Link to="/admin/login" className="text-slate-400 hover:text-slate-600">
            Staff access portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;