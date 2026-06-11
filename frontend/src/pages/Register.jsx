import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { User, Building, Mail, Lock, AlertCircle, Phone, MapPin, Leaf } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'restaurant', // default to restaurant
    company_name: '',
    city: 'casablanca',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { role: urlRole } = useParams();

  // Initialize role from URL param
  useEffect(() => {
    if (urlRole === 'restaurant' || urlRole === 'fournisseur') {
      setFormData(prev => ({ ...prev, role: urlRole }));
    }
  }, [urlRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/register', formData);
      const { user, token } = response.data;
      login(user, token);

      // Redirect based on role
      if (user.role === 'fournisseur') {
        navigate('/fournisseur/dashboard');
      } else {
        navigate('/restaurant/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      
      if (errors) {
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError(message || 'Une erreur est survenue. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center py-20 px-6 relative overflow-hidden grain-overlay">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-lg bg-brand-surface border border-white/[0.06] p-10 relative z-10">
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
            Create Account
          </h2>
          <p className="mt-2 text-xs text-white/30 font-medium tracking-wide">
            Join the Moroccan B2B Direct Food Network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role selector tab style */}
          <div className="flex p-0.5 bg-white/[0.02] border border-white/10 rounded-sm gap-0.5">
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
                formData.role === 'restaurant'
                  ? 'bg-brand-primary text-brand-bg'
                  : 'text-white/40 hover:text-white'
              }`}
              onClick={() => setFormData({ ...formData, role: 'restaurant' })}
            >
              <User className="w-3.5 h-3.5" />
              Restaurant
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
                formData.role === 'fournisseur'
                  ? 'bg-brand-primary text-brand-bg'
                  : 'text-white/40 hover:text-white'
              }`}
              onClick={() => setFormData({ ...formData, role: 'fournisseur' })}
            >
              <Building className="w-3.5 h-3.5" />
              Supplier
            </button>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                Full Name / Nom complet
              </label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                placeholder="Yassine El Amrani"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                Professional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                  placeholder="contact@enterprise.ma"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Double grid company & city */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                  {formData.role === 'restaurant' ? 'Restaurant Name' : 'Company Name'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                  placeholder={formData.role === 'restaurant' ? 'Le Bistro Vert' : 'Atlas Fruits & Légumes'}
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                  City / Ville
                </label>
                <select
                  required
                  className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white/80 focus:text-white focus:border-brand-primary focus:outline-none transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="casablanca" className="bg-brand-surface text-white">Casablanca</option>
                  <option value="rabat" className="bg-brand-surface text-white">Rabat</option>
                  <option value="marrakech" className="bg-brand-surface text-white">Marrakech</option>
                  <option value="fes" className="bg-brand-surface text-white">Fes</option>
                  <option value="tanger" className="bg-brand-surface text-white">Tangier</option>
                  <option value="agadir" className="bg-brand-surface text-white">Agadir</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                Phone Number / Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                  placeholder="+212 600-000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Physical Address */}
            <div>
              <label className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                Physical Address / Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                  placeholder="Zone Industrielle ou Boulevard principal"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/10 text-sm font-medium text-white focus:border-brand-primary focus:outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            className="w-full bg-brand-primary text-brand-bg py-4.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all btn-premium hover:bg-brand-accent disabled:opacity-55"
          >
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div className="mt-8 text-center text-[11px] font-semibold text-white/30 uppercase tracking-widest">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
