import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { UserPlus, User, Building, MapPin, Mail, Lock, AlertCircle, Phone, Leaf } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-16 relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-saffron/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-10 lg:p-12 shadow-luxury border border-slate-100 relative z-10">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-md">
                            <Leaf className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-black text-brand-primary">
                            Green<span className="text-brand-accent">Leaf</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Créez votre compte</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">Rejoignez Green Leaf Morocco</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selector */}
                    <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-2xl gap-1">
                        <button
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.role === 'restaurant' ? 'bg-white shadow text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setFormData({ ...formData, role: 'restaurant' })}
                        >
                            <User className="w-4 h-4" />
                            Restaurant
                        </button>
                        <button
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.role === 'fournisseur' ? 'bg-white shadow text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setFormData({ ...formData, role: 'fournisseur' })}
                        >
                            <Building className="w-4 h-4" />
                            Fournisseur
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Nom complet / Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                                placeholder="Yassine El Amrani"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Email professionnel</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                                    placeholder="contact@entreprise.ma"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">
                                    {formData.role === 'restaurant' ? 'Nom du Restaurant' : 'Nom de l\'Entreprise'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                                    placeholder={formData.role === 'restaurant' ? 'Le Bistro Vert' : 'Atlas Fruits & Légumes'}
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Ville / City</label>
                                <select
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                >
                                    <option value="casablanca">Casablanca</option>
                                    <option value="rabat">Rabat</option>
                                    <option value="marrakech">Marrakech</option>
                                    <option value="fes">Fes</option>
                                    <option value="tanger">Tangier</option>
                                    <option value="agadir">Agadir</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Téléphone / Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                <input
                                    type="tel"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                                    placeholder="+212 600-000000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Adresse physique / Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                                    placeholder="Zone Industrielle ou Boulevard principal"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:bg-white font-bold transition-all outline-none text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/10 disabled:opacity-75 transition-all btn-premium"
                    >
                        {loading ? 'Création...' : 'S\'inscrire / Register'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="text-brand-secondary font-black hover:underline">Se connecter</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
