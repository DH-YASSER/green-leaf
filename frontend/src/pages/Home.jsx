import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShoppingBasket,
  Users,
  CheckCircle,
  ArrowRight,
  Leaf,
  Beef,
  Droplets,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Star,
  Layers,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';

import heroLeaf from '../assets/hero_leaf.png';
import supplierImg from '../assets/supplier.png';
import restaurantImg from '../assets/restaurant.png';

/* ── Number counter component ── */
const CountStat = ({ value, suffix = '', label }) => {
  const numRef = useRef(null);
  const counted = useRef(false);
  
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const end = parseInt(value);
          const duration = 1500;
          const step = (end / duration) * 16;
          const tick = () => {
            start += step;
            if (start >= end) { el.textContent = end + suffix; return; }
            el.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(tick);
          };
          tick();
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);

  return (
    <div className="text-center p-6 border-r border-white/5 last:border-0 md:border-r">
      <span ref={numRef} className="block text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
        0{suffix}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mt-3 block">
        {label}
      </span>
    </div>
  );
};

const Home = () => {
  const [activeProcessTab, setActiveProcessTab] = useState('restaurant');

  // Hook up Awwwards-style scroll reveal observer
  useEffect(() => {
    const items = document.querySelectorAll('.reveal-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          } else {
            entry.target.classList.remove('reveal-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );
    
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text selection:bg-brand-primary/30 selection:text-white">
      
      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="glass-nav-dark fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-none bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors duration-300">
                <Leaf className="h-4 w-4 text-brand-primary" />
              </div>
              <span className="font-heading text-base font-bold tracking-[0.1em] text-white">
                GREEN<span className="text-brand-primary">LEAF</span>
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-10">
              <Link
                to="/browse"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300"
              >
                Catalogue
              </Link>
              <a
                href="#process"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300"
              >
                Process
              </a>
              <a
                href="#categories"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300"
              >
                Categories
              </a>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/register/restaurant"
                className="bg-brand-primary hover:bg-brand-secondary text-brand-bg px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all btn-sharp"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO SECTION (Dark Premium) ═══════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-saffron/3 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 py-20 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-7 flex flex-col justify-center reveal-item">
              <div>
                <span className="inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-8">
                  <span className="w-12 h-px bg-brand-primary"></span>
                  Premium B2B Sourcing
                </span>
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight mb-8">
                <span className="text-white block">Sourcing</span>
                <span className="text-white block">Fresh.</span>
                <span className="text-gradient block">Directly.</span>
              </h1>

              <p className="text-[14px] sm:text-base text-zinc-400 font-normal leading-relaxed max-w-lg mb-10">
                Skip the distributors. Connect your restaurant kitchen directly with verified Moroccan farms and agricultural cooperatives. Secure, automated, and delivered in 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register/restaurant"
                  className="group inline-flex items-center justify-center gap-3 bg-brand-primary text-brand-bg px-8 py-4.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-secondary transition-all btn-sharp"
                >
                  Start Ordering
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register/fournisseur"
                  className="inline-flex items-center justify-center gap-3 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 px-8 py-4.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all btn-sharp bg-white/[0.01]"
                >
                  Become a Supplier
                </Link>
              </div>
            </div>

            {/* Right side - Stacked Product Cards Showcase */}
            <div className="lg:col-span-5 flex justify-center reveal-item delay-200">
              <div className="relative w-full max-w-[420px]">
                {/* Glow behind cards */}
                <div className="absolute inset-0 bg-brand-primary/10 blur-[80px] rounded-full scale-75"></div>
                
                {/* Card Stack */}
                <div className="relative space-y-4">
                  {/* Product Card 1 */}
                  <div className="bg-brand-surface/80 border border-white/10 p-4 shadow-luxury backdrop-blur-sm flex gap-4 items-center animate-float">
                    <div className="w-20 h-20 shrink-0 border border-white/5 overflow-hidden zoom-container">
                      <img 
                        src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=200&auto=format&fit=crop" 
                        alt="Fresh Moroccan vegetables" 
                        className="w-full h-full object-cover zoom-image" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.2em] bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5">Vegetables</span>
                        <span className="text-[9px] font-bold text-brand-saffron flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-brand-saffron" /> 4.8
                        </span>
                      </div>
                      <p className="font-heading text-xs font-bold uppercase tracking-wide text-white truncate">Tomates Côtelées Extra</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Atlas Prime · Casablanca</p>
                      <p className="text-[11px] font-bold text-brand-primary mt-1">8.50 MAD / Kg</p>
                    </div>
                  </div>

                  {/* Product Card 2 */}
                  <div className="bg-brand-surface/80 border border-white/10 p-4 shadow-luxury backdrop-blur-sm flex gap-4 items-center animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-20 h-20 shrink-0 border border-white/5 overflow-hidden zoom-container">
                      <img 
                        src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=200&auto=format&fit=crop" 
                        alt="Premium Saffron spice" 
                        className="w-full h-full object-cover zoom-image" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-black text-brand-saffron uppercase tracking-[0.2em] bg-brand-saffron/10 border border-brand-saffron/20 px-2 py-0.5">Spices</span>
                        <span className="text-[9px] font-bold text-brand-saffron flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-brand-saffron" /> 4.9
                        </span>
                      </div>
                      <p className="font-heading text-xs font-bold uppercase tracking-wide text-white truncate">Safran Pur de Taliouine</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Épices Fassi · Fes</p>
                      <p className="text-[11px] font-bold text-brand-primary mt-1">32.00 MAD / Gram</p>
                    </div>
                  </div>

                  {/* Product Card 3 */}
                  <div className="bg-brand-surface/80 border border-white/10 p-4 shadow-luxury backdrop-blur-sm flex gap-4 items-center animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-20 h-20 shrink-0 border border-white/5 overflow-hidden zoom-container">
                      <img 
                        src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=200&auto=format&fit=crop" 
                        alt="Premium butchery meats" 
                        className="w-full h-full object-cover zoom-image" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em] bg-rose-400/10 border border-rose-400/20 px-2 py-0.5">Meats</span>
                        <span className="text-[9px] font-bold text-brand-saffron flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-brand-saffron" /> 4.6
                        </span>
                      </div>
                      <p className="font-heading text-xs font-bold uppercase tracking-wide text-white truncate">Bœuf Haché Premium</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Boucherie Gourmet · Rabat</p>
                      <p className="text-[11px] font-bold text-brand-primary mt-1">85.00 MAD / Kg</p>
                    </div>
                  </div>

                  {/* Browse CTA overlay at bottom */}
                  <Link 
                    to="/browse"
                    className="block w-full py-3 text-center bg-white/[0.03] border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white hover:border-brand-primary/30 transition-all btn-sharp"
                  >
                    Browse All 350+ Suppliers →
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Bottom edge border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5"></div>
      </section>

      {/* ═══════════════════════ INFINITE SCROLLING TICKER ═══════════════════════ */}
      <section className="bg-brand-surface border-b border-white/5 py-6 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-16 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary">
          <span>* MOROCCO'S FINEST AGRICULTURAL HUB</span>
          <span>* DIRECT FARM TO KITCHEN</span>
          <span>* 100% VERIFIED REGIONAL SUPPLIERS</span>
          <span>* 24-HOUR FRESHNESS GUARANTEE</span>
          <span>* ZERO MIDDLEMAN COMMISSIONS</span>
          <span>* DIRECT ESCROW DH PAYMENTS</span>
          
          <span>* MOROCCO'S FINEST AGRICULTURAL HUB</span>
          <span>* DIRECT FARM TO KITCHEN</span>
          <span>* 100% VERIFIED REGIONAL SUPPLIERS</span>
          <span>* 24-HOUR FRESHNESS GUARANTEE</span>
          <span>* ZERO MIDDLEMAN COMMISSIONS</span>
          <span>* DIRECT ESCROW DH PAYMENTS</span>
        </div>
      </section>

      {/* ═══════════════════════ PRODUCER SECTION (Light Theme Contrast) ═══════════════════════ */}
      <section className="py-32 bg-white text-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Image */}
            <div className="lg:col-span-5 order-2 lg:order-1 reveal-item">
              <div className="relative border border-zinc-200 p-3 bg-zinc-50 shadow-luxury-light">
                <div className="zoom-container aspect-[4/5] bg-zinc-100 border border-zinc-200">
                  <img 
                    src={supplierImg} 
                    alt="Fresh organic ingredients on slate" 
                    className="w-full h-full object-cover zoom-image"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Copy */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center reveal-item delay-200">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-4 block">
                FOR MOROCCAN SUPPLIERS
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-zinc-900 tracking-tight mb-8 leading-tight">
                EXPAND YOUR MARKET.<br/>SELL AT YOUR PRICE.
              </h2>
              <p className="text-[14px] sm:text-[15px] text-zinc-600 leading-relaxed mb-10 max-w-xl">
                Tired of wholesale middlemen squeezing your margins? List your crops, vegetables, meats, or spices directly. Set your prices, specify your minimum order volumes, and choose your delivery areas. We handle invoicing and payment escrow so you get paid immediately.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12 border-t border-zinc-200 pt-8">
                <div>
                  <h4 className="font-heading text-[12px] font-bold uppercase tracking-wider text-zinc-900 mb-2">Direct Channel</h4>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">No intermediary costs. Keep 100% of your listed product prices.</p>
                </div>
                <div>
                  <h4 className="font-heading text-[12px] font-bold uppercase tracking-wider text-zinc-900 mb-2">Instant Invoicing</h4>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">Generate official commercial receipts automatically with every order.</p>
                </div>
              </div>

              <div>
                <Link
                  to="/register/fournisseur"
                  className="inline-flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all btn-sharp"
                >
                  Create Supplier Account
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════ RESTAURANT SECTION (Dark Theme Alt Contrast) ═══════════════════════ */}
      <section className="py-32 bg-brand-surface text-white relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center reveal-item">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-4 block">
                FOR CHEFS & RESTAURANTS
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-white tracking-tight mb-8 leading-tight">
                UNCOMPROMISING FRESHNESS.<br/>WHOLESALE PRICING.
              </h2>
              <p className="text-[14px] sm:text-[15px] text-zinc-400 leading-relaxed mb-10 max-w-xl">
                Browse hundreds of local producers across Morocco's key agricultural regions. Filter products by category, origin, minimum order, or vendor rating. Discuss specific logistics requirements via in-app chat, verify quality upon arrival, and track order progress in real-time.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12 border-t border-white/5 pt-8">
                <div>
                  <h4 className="font-heading text-[12px] font-bold uppercase tracking-wider text-white mb-2">Detailed Catalogue</h4>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">Browse live inventories, check batch photos, and compare regional prices.</p>
                </div>
                <div>
                  <h4 className="font-heading text-[12px] font-bold uppercase tracking-wider text-white mb-2">Secure Transactions</h4>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">Payments are held securely in escrow until order receipt is confirmed.</p>
                </div>
              </div>

              <div>
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-secondary text-brand-bg px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all btn-sharp"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
                    <div className="lg:col-span-5 reveal-item delay-200">
              <div className="relative border border-white/10 p-3 bg-brand-bg/50 shadow-luxury">
                <div className="zoom-container aspect-[4/5] bg-zinc-900 border border-white/5">
                  <img 
                    src={restaurantImg} 
                    alt="Chef plating food in kitchen" 
                    className="w-full h-full object-cover zoom-image"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ═══════════════════════ HOW IT WORKS / PROCESS (Light Theme) ═══════════════════════ */}
      <section id="process" className="py-32 bg-zinc-50 text-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 reveal-item">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-4 block">
                PLATFORM WORKFLOW
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-zinc-900 tracking-tight">
                HOW GREENLEAF WORKS
              </h2>
            </div>
            
            {/* Custom Tab Selector */}
            <div className="flex bg-zinc-200/60 p-1 border border-zinc-200 mt-8 md:mt-0">
              <button
                onClick={() => setActiveProcessTab('restaurant')}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  activeProcessTab === 'restaurant'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                For Restaurants
              </button>
              <button
                onClick={() => setActiveProcessTab('supplier')}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  activeProcessTab === 'supplier'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                For Suppliers
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 reveal-item delay-200">
            {activeProcessTab === 'restaurant' ? (
              <>
                {/* Restaurant Step 1 */}
                <div className="bg-white border border-zinc-200 p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">01 / SELECT</span>
                    <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <ShoppingBasket className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-bold uppercase tracking-wider text-zinc-900 mb-4">Browse Catalogues</h3>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">Search live inventories from verified farms. Add items to your cart, and review min order thresholds.</p>
                </div>
                {/* Restaurant Step 2 */}
                <div className="bg-white border border-zinc-200 p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">02 / INTERACT</span>
                    <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-bold uppercase tracking-wider text-zinc-900 mb-4">Direct Chat & Order</h3>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">Discuss batch qualities or shipping arrangements in real-time, submit your purchase order directly.</p>
                </div>
                {/* Restaurant Step 3 */}
                <div className="bg-white border border-zinc-200 p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">03 / CONFIRM & INVOICE</span>
                    <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-bold uppercase tracking-wider text-zinc-900 mb-4">Escrow Release</h3>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">Once delivered and checked, confirm receipt to release payment. Instantly print a professional PDF invoice.</p>
                </div>
              </>
            ) : (
              <>
                {/* Supplier Step 1 */}
                <div className="bg-white border border-zinc-200 p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">01 / LIST PRODUCTS</span>
                    <div className="w-10 h-10 bg-zinc-100 text-zinc-900 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-bold uppercase tracking-wider text-zinc-900 mb-4">Upload Inventory</h3>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">Add details, prices per kg, stock quantities, and high-quality harvest images to your profile.</p>
                </div>
                {/* Supplier Step 2 */}
                <div className="bg-white border border-zinc-200 p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">02 / PROCESS ORDERS</span>
                    <div className="w-10 h-10 bg-zinc-100 text-zinc-900 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-bold uppercase tracking-wider text-zinc-900 mb-4">Manage Statuses</h3>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">Receive instant order notifications. Accept or reject, dispatch with local logistics, and update status.</p>
                </div>
                {/* Supplier Step 3 */}
                <div className="bg-white border border-zinc-200 p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">03 / SECURE PAYOUTS</span>
                    <div className="w-10 h-10 bg-zinc-100 text-zinc-900 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-bold uppercase tracking-wider text-zinc-900 mb-4">Withdraw Revenue</h3>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">Funds are automatically deposited in your wallet once delivery is complete. Export statements easily.</p>
                </div>
              </>
            )}
          </div>
          
        </div>
      </section>

      {/* ═══════════════════════ CATEGORIES SECTION (Dark Theme) ═══════════════════════ */}
      <section id="categories" className="py-32 bg-brand-bg relative dot-grid">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24 reveal-item">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-4 block">
              SUPPLY RANGE
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
              AGRICULTURAL CATEGORIES
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 reveal-item delay-200">
            {[
              { icon: Leaf, title: 'Vegetables', desc: 'Fresh regional potatoes, carrots, onions, and select herbs' },
              { icon: Beef, title: 'Meats', desc: 'Premium quality local halal beef, lamb, and poultry batches' },
              { icon: Droplets, title: 'Beverages', desc: 'Moroccan mineral water, natural juices, and soda volumes' },
              { icon: Sparkles, title: 'Spices', desc: 'Premium saffron of Taliouine, pure cumin, and local blends' },
              { icon: ShoppingBasket, title: 'Dry Goods', desc: 'Coarse couscous grains, baking flour, and essential pulses' },
            ].map(({ icon: Icon, title, desc }) => (
              <Link
                key={title}
                to="/browse"
                className="group bg-brand-surface border border-white/5 p-8 hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between aspect-square"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white mb-3 flex items-center justify-between">
                    {title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary" />
                  </h3>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA (Dark Premium) ═══════════════════════ */}
      <section className="py-32 bg-brand-surface relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/[0.04] rounded-full blur-[140px]"></div>
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10 reveal-item">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-6 block">
              FAST ONBOARDING
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-white tracking-tight mb-8">
              READY TO INTEGRATE YOUR SUPPLY CHAIN?
            </h2>
            <p className="text-zinc-400 text-[13px] sm:text-[14px] leading-relaxed mb-12 max-w-xl mx-auto">
              Join hundreds of restaurant kitchens and regional producers already connected. Standardized billing, no commission, direct local pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/restaurant"
              className="group inline-flex items-center justify-center gap-3 bg-brand-primary text-brand-bg px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-secondary transition-all btn-sharp"
            >
              Register Restaurant
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register/fournisseur"
              className="inline-flex items-center justify-center gap-3 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all btn-sharp bg-white/[0.01]"
            >
              Register Supplier
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="bg-brand-bg border-t border-white/5 pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-12 mb-20">
            
            {/* Brand (Col 1-4) */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-brand-primary" />
                </div>
                <span className="font-heading text-sm font-bold tracking-[0.1em] text-white uppercase">
                  Green<span className="text-brand-primary">Leaf</span>
                </span>
              </div>
              <p className="text-[12px] text-zinc-400 leading-relaxed mb-8 max-w-sm">
                Morocco's premier B2B marketplace connecting restaurants directly with agricultural cooperatives and wholesale suppliers.
              </p>
              
              {/* Newsletter form with neon border feedback */}
              <form onSubmit={(e) => e.preventDefault()} className="max-w-xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Subscribe to updates</span>
                <div className="flex border border-white/10 focus-within:border-brand-primary transition-colors">
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="bg-transparent border-0 px-4 py-3 text-[11px] font-bold tracking-wider text-white placeholder-zinc-600 focus:outline-none focus:ring-0 w-full"
                  />
                  <button type="submit" className="px-4 text-brand-primary hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Regions links (Col 5-6) */}
            <div className="lg:col-span-2">
              <h4 className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-6">
                TOP REGIONS
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '#', label: 'Casablanca-Settat' },
                  { to: '#', label: 'Souss-Massa (Agadir)' },
                  { to: '#', label: 'Marrakech-Safi' },
                  { to: '#', label: 'Fès-Meknès' },
                  { to: '#', label: 'Tanger-Tétouan' },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-[12px] text-zinc-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories links (Col 7-8) */}
            <div className="lg:col-span-2">
              <h4 className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-6">
                CATEGORIES
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '#', label: 'Fresh Vegetables' },
                  { to: '#', label: 'Organic Fruits' },
                  { to: '#', label: 'Prime Meats' },
                  { to: '#', label: 'Spices & Herbs' },
                  { to: '#', label: 'Dairy & Eggs' },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-[12px] text-zinc-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


            {/* Company Links (Col 9-10) */}
            <div className="lg:col-span-2">
              <h4 className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-6">
                COMPANY
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '#', label: 'About Us' },
                  { to: '#', label: 'Contact Support' },
                  { to: '#', label: 'Terms of Service' },
                  { to: '#', label: 'Privacy Policy' },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-[12px] text-zinc-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Demo credentials (Col 11-12) */}
            <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-4">
              <h4 className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-6">
                DEMO ACCESS DETAILS
              </h4>
              <ul className="space-y-3 text-[12px] text-zinc-400">
                <li><span className="text-zinc-300 font-semibold">Restaurant:</span> restaurant@demo.com</li>
                <li><span className="text-zinc-300 font-semibold">Supplier:</span> fournisseur@demo.com</li>
                <li><span className="text-zinc-300 font-semibold">Admin:</span> admin@demo.com</li>
                <li className="text-brand-primary text-[10px] uppercase tracking-[0.25em] font-bold pt-2 border-t border-white/5">
                  Password: demo123
                </li>
              </ul>
            </div>
            
          </div>

          {/* Bottom Bar */}
          <div className="h-px bg-white/5 mb-8"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-zinc-500 font-medium tracking-wide">
              &copy; 2026 GREENLEAF MOROCCO. ALL RIGHTS RESERVED.
            </p>
            <Link
              to="/admin/login"
              className="text-[10px] text-zinc-400 hover:text-brand-primary transition-colors font-semibold uppercase tracking-[0.2em]"
            >
              Staff Portal Access
            </Link>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default Home;
