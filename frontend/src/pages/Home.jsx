import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShoppingBasket,
  Users,
  CheckCircle,
  Calendar,
  ArrowRight,
  Leaf,
  Beef,
  Droplets,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-slate-800">
      {/* Navbar with blur effect */}
      <nav className="glass sticky top-0 z-50 border-b border-brand-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-md shadow-brand-primary/20 group-hover:rotate-12 transition-transform duration-300">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight text-brand-primary">
                  Green<span className="text-brand-accent">Leaf</span>
                </span>
              </Link>
              {/* Navigation links */}
              <div className="hidden md:flex md:ml-12 space-x-8">
                <Link to="/browse" className="text-brand-primary/80 hover:text-brand-primary font-bold text-sm transition-colors uppercase tracking-wider">
                  Browse Suppliers / Fournisseurs
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-brand-primary hover:text-brand-secondary px-4 py-2 text-sm font-black uppercase tracking-wider">
                Login / Connexion
              </Link>
              <Link
                to="/register/restaurant"
                className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all btn-premium"
              >
                Join Now / Rejoindre
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-b from-brand-highlight/30 to-brand-bg">
        {/* Geometric Background Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-saffron/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-xs font-black uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Morocco B2B Fresh Food Marketplace
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-primary tracking-tight leading-none mb-6">
                Direct Connection with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent">Moroccan Suppliers</span>
              </h1>
              <p className="max-w-2xl mx-auto lg:mx-0 text-lg text-slate-600 font-medium leading-relaxed mb-10">
                Connect your restaurant directly with verified agricultural producers, fresh butchers, and beverage distributors across Morocco. Secure sourcing, optimized pricing, and reliable logistics.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  to="/register/restaurant"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-sm font-black rounded-2xl shadow-xl shadow-brand-primary/10 text-white bg-brand-primary hover:bg-brand-secondary hover:-translate-y-0.5 transition-all duration-300 btn-premium uppercase tracking-widest gap-2"
                >
                  Restaurant Registration
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register/fournisseur"
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-black rounded-2xl shadow-sm text-brand-primary bg-white border border-brand-primary/10 hover:bg-brand-highlight/20 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest"
                >
                  Supplier Registration
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              {/* Luxury Card Mockup */}
              <div className="w-full max-w-sm rounded-[2.5rem] bg-white p-6 shadow-luxury border border-slate-100 relative group overflow-hidden animate-float">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-saffron/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase text-brand-terracotta tracking-wider bg-brand-terracotta/10 px-3 py-1 rounded-xl">
                    Supplier Profile
                  </span>
                  <VerifiedCheck />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center text-white font-black text-xl shadow-md">
                    AP
                  </div>
                  <div>
                    <h3 className="font-black text-brand-primary text-lg">Atlas Prime Maraîcher</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">📍 Casablanca, Morocco</p>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Products</span>
                    <span className="font-bold text-slate-700">Tomates, Pommes de terre...</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Min. Order</span>
                    <span className="font-bold text-brand-secondary">500 DH</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Rating</span>
                    <span className="font-bold text-brand-saffron">★ 4.8 (24 reviews)</span>
                  </div>
                </div>
                <Link
                  to="/browse"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-brand-bg hover:bg-brand-highlight/30 text-brand-primary rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Order Fresh Ingredients
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight mb-4">
              Explore Our Product Categories
            </h2>
            <p className="text-slate-500 font-bold max-w-lg mx-auto uppercase text-xs tracking-widest">
              Moroccan Gastronomic Supply Chain / Chaîne d'Approvisionnement
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Vegetables */}
            <Link
              to="/browse"
              className="group bg-brand-bg rounded-3xl p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border border-brand-primary/5 hover:border-brand-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-brand-primary">Vegetables</h3>
              <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                Fresh tomatoes, potatoes, onions, and field legumes.
              </p>
            </Link>

            {/* Meats */}
            <Link
              to="/browse"
              className="group bg-brand-bg rounded-3xl p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border border-brand-primary/5 hover:border-brand-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                <Beef className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-brand-primary">Meats</h3>
              <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                Local halal beef, tender lamb, and poultry.
              </p>
            </Link>

            {/* Beverages */}
            <Link
              to="/browse"
              className="group bg-brand-bg rounded-3xl p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border border-brand-primary/5 hover:border-brand-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-brand-primary">Beverages</h3>
              <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                Mineral water, soft drinks, and local juices.
              </p>
            </Link>

            {/* Spices */}
            <Link
              to="/browse"
              className="group bg-brand-bg rounded-3xl p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border border-brand-primary/5 hover:border-brand-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-brand-primary">Spices</h3>
              <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                Safran of Taliouine, cumin, and tailor-made blends.
              </p>
            </Link>

            {/* Dry Goods */}
            <Link
              to="/browse"
              className="group bg-brand-bg rounded-3xl p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border border-brand-primary/5 hover:border-brand-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBasket className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-brand-primary">Dry Goods</h3>
              <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                Couscous, flour, rice, and pantry essentials.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight mb-4">
              How Green Leaf Works
            </h2>
            <p className="text-slate-500 font-bold max-w-lg mx-auto uppercase text-xs tracking-widest">
              Simple. Automated. Trusted.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-secondary flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-primary mb-3">1. Register / S'inscrire</h3>
              <p className="text-sm text-slate-500 font-medium">
                Create a professional account as a restaurant buyer or Moroccan supplier. Specify your company and address.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-secondary flex items-center justify-center mb-6">
                <ShoppingBasket className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-primary mb-3">2. Order / Commander</h3>
              <p className="text-sm text-slate-500 font-medium">
                Browse catalogue items, filter by Moroccan cities, review discount promotions, and submit orders directly.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-secondary flex items-center justify-center mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-primary mb-3">3. Delivery / Livrer</h3>
              <p className="text-sm text-slate-500 font-medium">
                Coordinate via in-app messages. Enjoy prompt regional delivery and track statuses through your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-4 p-6 bg-brand-bg rounded-3xl">
              <ShieldCheck className="w-12 h-12 text-brand-secondary shrink-0" />
              <div>
                <h4 className="font-black text-brand-primary">Verified Producers</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Every supplier undergoes strict quality checks.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-brand-bg rounded-3xl">
              <TrendingUp className="w-12 h-12 text-brand-secondary shrink-0" />
              <div>
                <h4 className="font-black text-brand-primary">Direct Pricing</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Zero agent commission. Purchase at local source price.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-brand-bg rounded-3xl">
              <MessageSquare className="w-12 h-12 text-brand-secondary shrink-0" />
              <div>
                <h4 className="font-black text-brand-primary">In-app Chat</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Chat directly with farmers & warehouse operators.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-brand-bg rounded-3xl">
              <CheckCircle className="w-12 h-12 text-brand-secondary shrink-0" />
              <div>
                <h4 className="font-black text-brand-primary">Smart Invoicing</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">All orders generated as neat commercial records.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-secondary via-brand-primary to-brand-primary opacity-60"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
            Ready to Streamline Your Restaurant Supply?
          </h2>
          <p className="max-w-2xl mx-auto text-brand-highlight font-medium text-lg mb-10 leading-relaxed">
            Rejoignez des centaines de restaurateurs et producteurs marocains sur Green Leaf. Profitez de prix compétitifs sans intermédiaires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/restaurant"
              className="bg-brand-accent hover:bg-brand-accent/90 text-brand-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/20 btn-premium"
            >
              Sign Up as Restaurant
            </Link>
            <Link
              to="/register/fournisseur"
              className="border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
            >
              Sign Up as Supplier
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-bg border-t border-brand-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-4">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-brand-primary flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black text-brand-primary">GreenLeaf</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Plateforme marocaine de mise en relation directe B2B entre professionnels de la restauration et producteurs agroalimentaires.
              </p>
            </div>

            <div>
              <h4 className="font-black text-brand-primary text-sm uppercase tracking-wider mb-6">Restaurants</h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500">
                <li><Link to="/register/restaurant" className="hover:text-brand-secondary transition-colors">Register Account</Link></li>
                <li><Link to="/login" className="hover:text-brand-secondary transition-colors">Login</Link></li>
                <li><Link to="/browse" className="hover:text-brand-secondary transition-colors">Search Ingredients</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-brand-primary text-sm uppercase tracking-wider mb-6">Suppliers</h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500">
                <li><Link to="/register/fournisseur" className="hover:text-brand-secondary transition-colors">Create Supplier Profile</Link></li>
                <li><Link to="/login" className="hover:text-brand-secondary transition-colors">Supplier Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-brand-primary text-sm uppercase tracking-wider mb-6">Demo Credentials</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-400">
                <li><strong className="text-slate-600">Restaurant:</strong> restaurant@demo.com</li>
                <li><strong className="text-slate-600">Supplier:</strong> fournisseur@demo.com</li>
                <li><strong className="text-slate-600">Admin:</strong> admin@demo.com</li>
                <li className="text-brand-terracotta text-[10px] uppercase font-black tracking-widest mt-2">Password: demo123</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-primary/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
            <p>&copy; 2026 Green Leaf Morocco. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/admin/login" className="hover:text-brand-secondary transition-colors">Staff Access</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// SVG Helper components
const VerifiedCheck = () => (
  <div className="flex items-center gap-1 text-[10px] font-black text-brand-secondary bg-brand-accent/10 rounded-full px-2.5 py-1">
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
    VERIFIED
  </div>
);

export default Home;
