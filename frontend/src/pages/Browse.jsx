import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAppStore } from '../store/appStore';
import Logo from '../components/Logo';
import FournisseurCard from '../components/FournisseurCard';
import CartBadge from '../components/CartBadge';
import FilterSidebar from '../components/FilterSidebar';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import {
  SlidersHorizontal, X, ArrowRight, ChevronLeft, ChevronRight,
  Sun, Moon, Globe, Search, ShoppingBasket, ShoppingCart,
} from 'lucide-react';

// ─── THEME TOKENS (mirrors RestaurantApp / Cart design system) ────────────
// Legacy var names (--bg, --sulu, --textLow, ...) are kept as aliases so
// FournisseurCard / FilterSidebar / CartBadge (not included in this pass)
// keep working unchanged, but now resolve to the new dashboard palette.
const THEMES = {
  dark: {
    '--page-bg':        '#0A0E12',
    '--surface':        '#141B1F',
    '--surface-alt':    '#0D2B24',
    '--hover':          'rgba(255, 255, 255, 0.04)',
    '--subtle':         'rgba(76, 175, 80, 0.15)',
    '--border':         'rgba(255, 255, 255, 0.06)',
    '--border-strong':  'rgba(76, 175, 80, 0.20)',
    '--text-1':         '#E8E8E8',
    '--text-2':         'rgba(232,232,232,0.70)',
    '--text-3':         'rgba(232,232,232,0.40)',
    '--accent':         '#4CAF50',
    '--accent-text':    '#FFFFFF',
    '--danger-bg':      'rgba(244, 67, 54, 0.12)',
    '--danger-text':    'rgba(244, 67, 54, 0.90)',
    '--danger-border':  'rgba(244, 67, 54, 0.90)',
    '--input-bg':       'rgba(255, 255, 255, 0.04)',
    '--shadow':         '0 24px 64px rgba(0,0,0,0.55)',
    '--img-filter':     'brightness(0.60) saturate(0.75)',

    // legacy aliases
    '--bg': '#0A0E12', '--bg2': '#141B1F', '--bg3': '#0D2B24',
    '--text': '#E8E8E8', '--textMid': 'rgba(232,232,232,0.70)', '--textLow': 'rgba(232,232,232,0.40)',
    '--sulu': '#4CAF50', '--suluLo': 'rgba(76, 175, 80, 0.15)', '--suluMd': 'rgba(76, 175, 80, 0.20)',
    '--silver': 'rgba(232,232,232,0.70)', '--silverLo': 'rgba(255, 255, 255, 0.04)', '--silverMd': 'rgba(255, 255, 255, 0.10)',
    '--border2': 'rgba(76, 175, 80, 0.20)', '--navBg': 'rgba(10,14,18,0.92)', '--inputBg': 'rgba(255, 255, 255, 0.04)',
    '--danger': 'rgba(244, 67, 54, 0.90)', '--dangerLo': 'rgba(244, 67, 54, 0.12)',
    '--heroFilter': 'brightness(0.60) saturate(0.75)', '--imgFilter': 'brightness(0.60) saturate(0.75)',
  },
  light: {
    '--page-bg':        '#F8FAFB',
    '--surface':        '#FAF9F6',
    '--surface-alt':    '#E8F5E9',
    '--hover':          'rgba(0, 0, 0, 0.02)',
    '--subtle':         'rgba(45,155,79,0.10)',
    '--border':         'rgba(0, 0, 0, 0.08)',
    '--border-strong':  'rgba(0, 0, 0, 0.12)',
    '--text-1':         '#1A1A1A',
    '--text-2':         'rgba(26,26,26,0.65)',
    '--text-3':         'rgba(26,26,26,0.45)',
    '--accent':         '#2D9B4F',
    '--accent-text':    '#F5F5F5',
    '--danger-bg':      'rgba(220,53,69,0.12)',
    '--danger-text':    'rgba(220,53,69,0.95)',
    '--danger-border':  'rgba(220,53,69,0.95)',
    '--input-bg':       '#FFFFFF',
    '--shadow':         '0 24px 64px rgba(0,0,0,0.15)',
    '--img-filter':     'none',

    // legacy aliases
    '--bg': '#F8FAFB', '--bg2': '#FAF9F6', '--bg3': '#E8F5E9',
    '--text': '#1A1A1A', '--textMid': 'rgba(26,26,26,0.65)', '--textLow': 'rgba(26,26,26,0.45)',
    '--sulu': '#2D9B4F', '--suluLo': 'rgba(45,155,79,0.10)', '--suluMd': 'rgba(45,155,79,0.18)',
    '--silver': 'rgba(26,26,26,0.65)', '--silverLo': 'rgba(0, 0, 0, 0.02)', '--silverMd': 'rgba(0, 0, 0, 0.10)',
    '--border2': 'rgba(0, 0, 0, 0.12)', '--navBg': 'rgba(248,250,251,0.92)', '--inputBg': '#FFFFFF',
    '--danger': 'rgba(220,53,69,0.95)', '--dangerLo': 'rgba(220,53,69,0.12)',
    '--heroFilter': 'none', '--imgFilter': 'none',
  },
};

const CATEGORIES = ['legumes', 'viandes', 'epices', 'secs', 'boissons'];
const CATEGORY_LABELS = {
  legumes: 'Légumes', viandes: 'Viandes', epices: 'Épices', secs: 'Épicerie sèche', boissons: 'Boissons',
};
const SORT_OPTIONS = [
  { value: 'top-rated',  label: 'Mieux notés' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest',     label: 'Plus récents' },
];

const GlobalStyles = ({ theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    * { -webkit-font-smoothing: antialiased; }

    :root {
      ${Object.entries(THEMES[theme]).map(([k, v]) => `${k}: ${v};`).join('\n      ')}
    }

    html, body { overflow: auto !important; height: auto !important; }
    body {
      background: var(--page-bg); color: var(--text-1);
      font-family: 'Inter', system-ui, sans-serif;
      transition: background 0.3s, color 0.3s;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .bp-spin { animation: spin 0.9s linear infinite; }

    @keyframes flyToCart {
      0%   { transform: translate(0,0) scale(1); opacity: 1; }
      60%  { transform: translate(var(--fly-x),var(--fly-y)) scale(0.5); opacity: 0.8; }
      100% { transform: translate(var(--fly-x),var(--fly-y)) scale(0); opacity: 0; }
    }
    .bp-fly { animation: flyToCart 0.65s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }

    @keyframes cartBump { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 70%{transform:scale(0.9)} 100%{transform:scale(1)} }
    .bp-cart-bump { animation: cartBump 0.4s ease forwards; }

    @keyframes bp-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

    /* ── Nav link ── */
    .bp-nav-link {
      font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
      color: var(--text-2); text-decoration: none; transition: color .15s;
    }
    .bp-nav-link:hover { color: var(--text-1); }

    /* ── Icon btn (matches r-icon-btn) ── */
    .bp-icon-btn {
      width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--border-strong);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      background: var(--surface); cursor: pointer; color: var(--text-2); transition: all .15s;
    }
    .bp-icon-btn:hover { background: var(--hover); color: var(--text-1); }
    .bp-icon-btn.wide { width: auto; gap: 6px; padding: 0 12px; font-size: 11px; font-weight: 600; }

    /* ── Buttons ── */
    .bp-btn {
      display: inline-flex; align-items: center; gap: 8px; border: none; cursor: pointer;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      border-radius: 10px; padding: 11px 20px; text-decoration: none;
      transition: opacity .15s, background .15s, color .15s, border-color .15s, transform .15s;
      white-space: nowrap;
    }
    .bp-btn:disabled { opacity: .4; cursor: not-allowed; }
    .bp-btn-primary { background: var(--accent); color: var(--accent-text); }
    .bp-btn-primary:hover:not(:disabled) { opacity: .88; }
    .bp-btn-ghost { background: var(--surface); color: var(--text-2); border: 1.5px solid var(--border-strong); }
    .bp-btn-ghost:hover:not(:disabled) { background: var(--hover); color: var(--text-1); }

    /* ── Search input ── */
    .bp-search {
      width: 100%; background: var(--input-bg); border: 1.5px solid var(--border-strong);
      outline: none; padding: 11px 14px 11px 38px; border-radius: 10px;
      font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text-1);
      transition: border-color .15s;
    }
    .bp-search::placeholder { color: var(--text-3); }
    .bp-search:focus { border-color: var(--accent); }

    /* ── Category pills ── */
    .bp-cat-pill {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer;
      padding: 8px 16px; border-radius: 99px; border: 1.5px solid var(--border-strong);
      background: var(--surface); color: var(--text-2); transition: all .15s; white-space: nowrap;
    }
    .bp-cat-pill:hover { background: var(--hover); color: var(--text-1); }
    .bp-cat-pill.on { border-color: var(--accent); background: var(--subtle); color: var(--accent); }

    /* ── Sort dropdown ── */
    .bp-sort {
      background: var(--input-bg); border: 1.5px solid var(--border-strong); border-radius: 10px;
      outline: none; padding: 10px 34px 10px 14px;
      font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text-2);
      cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999' opacity='.6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center;
      transition: border-color .15s;
    }
    .bp-sort:focus { border-color: var(--accent); }
    .bp-sort option { background: var(--surface); color: var(--text-1); }

    /* ── Drawer ── */
    .bp-drawer { position: fixed; inset: 0; z-index: 100; display: flex; pointer-events: none; }
    .bp-drawer.open { pointer-events: all; }
    .bp-drawer-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(2px); opacity: 0; transition: opacity .28s; pointer-events: none; }
    .bp-drawer.open .bp-drawer-backdrop { opacity: 1; pointer-events: all; }
    .bp-drawer-panel {
      position: relative; width: 340px; max-width: 90vw; background: var(--surface);
      border-right: 1px solid var(--border); border-radius: 0 18px 18px 0;
      padding: 28px 24px; overflow-y: auto;
      transform: translateX(-100%); transition: transform .3s ease;
      box-shadow: var(--shadow);
    }
    .bp-drawer.open .bp-drawer-panel { transform: translateX(0); }

    /* ── Pagination ── */
    .bp-page-btn {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      background: var(--surface); border: 1.5px solid var(--border-strong); color: var(--text-2);
      padding: 9px 16px; border-radius: 10px; cursor: pointer; transition: all .15s;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .bp-page-btn:hover:not(:disabled) { background: var(--hover); color: var(--text-1); }
    .bp-page-btn:disabled { opacity: .35; cursor: not-allowed; }
    .bp-page-btn.current { background: var(--accent); border-color: var(--accent); color: var(--accent-text); font-weight: 600; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }

    @media (max-width: 768px) {
      .bp-browse-grid { grid-template-columns: repeat(2,1fr) !important; }
      .bp-browse-header-row { flex-direction: column !important; align-items: stretch !important; gap: 14px !important; }
    }
  `}</style>
);

// ─── NAVBAR with cart icon ─────────────────────────────────────────────────
const Navbar = ({ theme, onTheme, lang, onLang, scrolled, cartRef, cartBump }) => {
  const totalItems = useCartStore(s => s.totalItems());
  const { isAuthenticated, user } = useAuthStore();
  const role = user?.role?.toLowerCase() || '';

  const getDashboardPath = () => {
    if (role === 'admin') return '/gl/c0ns0le';
    if (role === 'fournisseur') return '/fournisseur/dashboard';
    return '/restaurant/dashboard';
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'var(--navBg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: 68 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="bp-icon-btn" onClick={onTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className="bp-icon-btn wide" onClick={onLang}>
              <Globe size={13} /> {lang === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>

          <Logo />

          <div style={{ display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'flex-end' }}>
            <Link to="/" className="bp-nav-link">{lang === 'fr' ? 'Accueil' : 'Home'}</Link>

            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="bp-nav-link" style={{ color: 'var(--accent)' }}>
                {lang === 'fr' ? 'Mon espace' : 'Dashboard'}
              </Link>
            ) : (
              <Link to="/login" className="bp-nav-link">{lang === 'fr' ? 'Connexion' : 'Sign in'}</Link>
            )}

            {/* Cart icon */}
            <Link
              to="/cart"
              ref={cartRef}
              className={`bp-icon-btn${cartBump ? ' bp-cart-bump' : ''}`}
              style={{ position: 'relative', textDecoration: 'none' }}
            >
              <ShoppingCart size={16} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: 'var(--accent)', color: 'var(--accent-text)',
                  fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
                  width: 17, height: 17, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link to="/register/restaurant" className="bp-btn bp-btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}>
                {lang === 'fr' ? 'Rejoindre' : 'Join'} <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const CategoryRail = ({ selected, onChange }) => (
  <div style={{ overflow: 'hidden', position: 'relative' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(to right, var(--page-bg), transparent)', zIndex: 2, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(to left, var(--page-bg), transparent)', zIndex: 2, pointerEvents: 'none' }} />
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 2 }}>
      <button className={`bp-cat-pill${selected.length === 0 ? ' on' : ''}`} onClick={() => onChange([])}>Tous</button>
      {CATEGORIES.map(cat => (
        <button key={cat} className={`bp-cat-pill${selected.includes(cat) ? ' on' : ''}`}
          onClick={() => onChange(selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat])}>
          {CATEGORY_LABELS[cat] || cat}
        </button>
      ))}
    </div>
  </div>
);

const FilterBar = ({ filters, onChange, total, lang }) => {
  const l = { fr: { found: 'produits', verified: 'Vérifiés' }, en: { found: 'products', verified: 'Verified only' } }[lang];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '8px 14px', background: 'var(--subtle)', borderRadius: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{total}</span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{l.found}</span>
        </div>
        <button onClick={() => onChange({ verifiedOnly: !filters.verifiedOnly })}
          style={{
            padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            border: `1.5px solid ${filters.verifiedOnly ? 'var(--accent)' : 'var(--border-strong)'}`,
            background: filters.verifiedOnly ? 'var(--subtle)' : 'var(--surface)',
            color: filters.verifiedOnly ? 'var(--accent)' : 'var(--text-2)',
            transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
          }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: filters.verifiedOnly ? 'var(--accent)' : 'var(--text-3)', transition: 'background .15s' }} />
          {l.verified}
        </button>
      </div>
      <select className="bp-sort" value={filters.sortBy} onChange={e => onChange({ sortBy: e.target.value, page: 1 })}>
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{ border: '1.5px solid var(--border)', background: 'var(--surface)', borderRadius: 14, overflow: 'hidden' }}>
    <div style={{ height: 150, background: 'var(--hover)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, var(--border-strong) 50%, transparent 100%)', animation: 'bp-shimmer 1.4s ease infinite' }} />
    </div>
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 12, width: '60%', background: 'var(--hover)', borderRadius: 4 }} />
      <div style={{ height: 9, width: '40%', background: 'var(--hover)', borderRadius: 4 }} />
      <div style={{ height: 9, width: '80%', background: 'var(--hover)', borderRadius: 4 }} />
    </div>
  </div>
);

const EmptyState = ({ onReset, lang }) => (
  <div style={{ textAlign: 'center', padding: '72px 24px', border: '1.5px solid var(--border)', background: 'var(--surface)', borderRadius: 16 }}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--subtle)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ShoppingBasket size={22} color="var(--accent)" strokeWidth={1.6} />
    </div>
    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.3px', marginBottom: 8 }}>
      {lang === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
    </h3>
    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
      {lang === 'fr' ? 'Élargissez vos filtres pour découvrir plus de fournisseurs.' : 'Try broadening your filters to discover more suppliers.'}
    </p>
    <button onClick={onReset} className="bp-btn bp-btn-primary" style={{ margin: '0 auto' }}>
      {lang === 'fr' ? 'Réinitialiser les filtres' : 'Reset all filters'} <ArrowRight size={14}/>
    </button>
  </div>
);

// ─── FLYING DOT ───────────────────────────────────────────────────────────────
const FlyingDot = ({ origin, cartRef, onDone }) => {
  const [style, setStyle] = useState({
    position: 'fixed',
    width: 12, height: 12,
    borderRadius: '50%',
    background: '#4CAF50',
    zIndex: 9999,
    pointerEvents: 'none',
    left: origin.x - 6,
    top: origin.y - 6,
  });

  useEffect(() => {
    if (!cartRef.current) { onDone(); return; }
    const cartRect = cartRef.current.getBoundingClientRect();
    const dx = (cartRect.left + cartRect.width / 2) - origin.x;
    const dy = (cartRect.top + cartRect.height / 2) - origin.y;
    setStyle(s => ({
      ...s,
      '--fly-x': `${dx}px`,
      '--fly-y': `${dy}px`,
    }));
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, []);

  return <div className="bp-fly" style={style} />;
};

// ─── MAIN BROWSE ──────────────────────────────────────────────────────────────
const Browse = () => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const { isAuthenticated, user } = useAuthStore();
  const role = user?.role?.toLowerCase() || '';


  const [products, setProducts]         = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [search, setSearch]             = useState('');
  const [flyDots, setFlyDots]           = useState([]);
  const [cartBump, setCartBump]         = useState(false);
  const searchTimeout = useRef(null);
  const cartRef       = useRef(null);

  const [filters, setFilters] = useState({
    category: [], city: '', minPrice: 0, maxPrice: 1000,
    minRating: 0, verifiedOnly: false, sortBy: 'top-rated',
    page: 1, limit: 9, search: '',
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const fetchProducts = async (f = filters) => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.get('/api/products', {
        params: { ...f, category: f.category.join(',') },
      });
      setProducts(data.products || []);
      setFournisseurs(data.fournisseurs || []);
      setTotal(data.total || data.products?.length || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger le catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(filters); }, [filters]);

  const handleFilterChange = (patch) => setFilters(prev => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => handleFilterChange({ search: val }), 380);
  };
  const resetFilters = () => {
    setSearch('');
    setFilters({ category: [], city: '', minPrice: 0, maxPrice: 1000, minRating: 0, verifiedOnly: false, sortBy: 'top-rated', page: 1, limit: 9, search: '' });
  };

  // Called by FournisseurCard when item added
  const handleCartAdd = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const id = Date.now();
    setFlyDots(prev => [...prev, { id, origin }]);
    // bump cart icon
    setCartBump(true);
    setTimeout(() => setCartBump(false), 450);
  };

  const totalPages = Math.ceil(total / filters.limit) || 1;
  const activeFilterCount = [
    filters.city !== '',
    filters.minPrice > 0, filters.maxPrice < 1000,
    filters.minRating > 0, filters.verifiedOnly, filters.search !== '',
  ].filter(Boolean).length;

  return (
    <>
      <GlobalStyles theme={theme} />

      {/* Flying dots */}
      {flyDots.map(dot => (
        <FlyingDot key={dot.id} origin={dot.origin} cartRef={cartRef}
          onDone={() => setFlyDots(prev => prev.filter(d => d.id !== dot.id))} />
      ))}

      <Navbar theme={theme} onTheme={toggleTheme}
              lang={lang} onLang={toggleLang}
              scrolled={scrolled} cartRef={cartRef} cartBump={cartBump} />

      {/* Page header */}
      <header style={{ paddingTop: 92, paddingBottom: 0, background: 'var(--page-bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 28, marginBottom: 20 }}>
            <Link to="/" className="bp-nav-link" style={{ fontSize: 12 }}>
              {lang === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>/</span>
            <span style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 600 }}>
              {lang === 'fr' ? 'Catalogue' : 'Catalogue'}
            </span>
          </div>

          {/* Heading block */}
          <div className="bp-browse-header-row" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                {lang === 'fr' ? 'Approvisionnement direct' : 'Direct sourcing'}
              </div>
              <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-1)', lineHeight: 1.1 }}>
                {lang === 'fr'
                  ? <>Catalogue <span style={{ color: 'var(--accent)' }}>fournisseurs</span></>
                  : <>Supplier <span style={{ color: 'var(--accent)' }}>catalogue</span></>}
              </h1>
            </div>

            {/* Search + Filter controls */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ position: 'relative', width: 220 }}>
                <Search size={14} color="var(--text-3)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input className="bp-search" type="text"
                  placeholder={lang === 'fr' ? 'Rechercher…' : 'Search…'}
                  value={search} onChange={e => handleSearch(e.target.value)} />
                {search && (
                  <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
                    <X size={13} />
                  </button>
                )}
              </div>
              <button onClick={() => setDrawerOpen(true)} className="bp-btn bp-btn-ghost" style={{ flexShrink: 0 }}>
                <SlidersHorizontal size={14} />
                {lang === 'fr' ? 'Filtres' : 'Filters'}
                {activeFilterCount > 0 && (
                  <span style={{ background: 'var(--accent)', color: 'var(--accent-text)', fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Category rail */}
          <div style={{ paddingBottom: 20 }}>
            <CategoryRail selected={filters.category} onChange={cat => handleFilterChange({ category: cat })} />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px 90px' }}>
        <FilterBar filters={filters} onChange={handleFilterChange} total={total} lang={lang} />

        <section style={{ padding: '28px 0 0', minWidth: 0 }}>
          {loading ? (
            <div className="bp-browse-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div style={{ padding: '56px 24px', border: '1.5px solid var(--border)', background: 'var(--surface)', borderRadius: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--danger-text)', marginBottom: 20, lineHeight: 1.6 }}>{error}</p>
              <button onClick={() => fetchProducts()} className="bp-btn bp-btn-primary" style={{ margin: '0 auto' }}>
                {lang === 'fr' ? 'Réessayer' : 'Retry'} <ArrowRight size={14}/>
              </button>
            </div>
          ) : products.length === 0 ? (
            <EmptyState onReset={resetFilters} lang={lang} />
          ) : (
            <>
              <div className="bp-browse-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {products.map(product => (
                  <FournisseurCard
                    key={product.id}
                    product={product}
                    fournisseur={fournisseurs.find(f => f.id === product.fournisseur_id) || {}}
                    onCartAdd={handleCartAdd}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 44, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
                  <button className="bp-page-btn" disabled={filters.page <= 1} onClick={() => handleFilterChange({ page: filters.page - 1 })}>
                    <ChevronLeft size={13}/>{lang === 'fr' ? 'Précédent' : 'Previous'}
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pg = filters.page <= 3 ? i + 1 : filters.page - 2 + i;
                    if (pg < 1 || pg > totalPages) return null;
                    return (
                      <button key={pg} className={`bp-page-btn${pg === filters.page ? ' current' : ''}`}
                        onClick={() => handleFilterChange({ page: pg })} style={{ minWidth: 40, justifyContent: 'center' }}>
                        {pg}
                      </button>
                    );
                  })}
                  <button className="bp-page-btn" disabled={filters.page >= totalPages} onClick={() => handleFilterChange({ page: filters.page + 1 })}>
                    {lang === 'fr' ? 'Suivant' : 'Next'}<ChevronRight size={13}/>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Filters drawer (desktop + mobile) */}
      <div className={`bp-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="bp-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
        <div className="bp-drawer-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>
              {lang === 'fr' ? 'Filtres' : 'Filters'}
            </span>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="bp-nav-link" style={{ fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                </button>
              )}
              <button onClick={() => setDrawerOpen(false)} className="bp-icon-btn" style={{ width: 32, height: 32 }}>
                <X size={14}/>
              </button>
            </div>
          </div>
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </div>
      </div>
    </>
  );
};

export default Browse;