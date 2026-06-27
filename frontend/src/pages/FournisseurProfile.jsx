import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import Logo from '../components/Logo';
import { useAuthStore } from '../store/authStore';
const THEMES = {
  dark: {
    // ─── GRANULAR COMPONENT-LEVEL VARIABLES ─────────────────────────────────
    // Global Page Styles
    '--page-bg':               '#0B0C0C',
    '--page-text':             '#FFFFFF',
    '--text-muted':            'rgba(255,255,255,0.70)',
    '--text-low':              'rgba(255,255,255,0.40)',
    '--page-border':           'rgba(255, 255, 255, 0.08)',
    '--accent-color':          '#81C784',   // green reserved for key actions
    '--accent-gold':           '#E8B86D',

    // Navbar
    '--nav-bg':                'rgba(11,12,12,0.96)',
    '--nav-border':            'rgba(255, 255, 255, 0.08)',
    '--nav-link':              'rgba(255,255,255,0.70)',
    '--nav-link-hover':        '#FFFFFF',
    '--nav-active':            '#81C784',   // key action: active state

    // Sidebar
    '--sidebar-bg':            '#161717',
    '--sidebar-border':        'rgba(255, 255, 255, 0.08)',
    '--sidebar-link':          'rgba(255,255,255,0.70)',
    '--sidebar-link-hover':    '#FFFFFF',
    '--sidebar-active-bg':     'rgba(255, 255, 255, 0.08)',
    '--sidebar-active-text':   '#81C784',   // key action: active state

    // Buttons
    '--btn-primary-bg':        '#81C784',   // key action: primary CTA
    '--btn-primary-text':      '#000000',
    '--btn-primary-hover':     '0.88',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#C7CCC9',
    '--btn-secondary-border':  'rgba(199, 204, 201, 0.30)',
    '--btn-icon-border':       'rgba(255, 255, 255, 0.08)',
    '--btn-icon-text':         '#C7CCC9',
    '--btn-icon-hover-bg':     'rgba(255, 255, 255, 0.08)',

    // Cards & Panels
    '--card-bg':               '#161717',
    '--card-border':           'rgba(255, 255, 255, 0.08)',
    '--card-title':            '#FFFFFF',
    '--card-body':             'rgba(255,255,255,0.70)',
    '--card-hover-bg':         'rgba(255, 255, 255, 0.04)',

    // Inputs
    '--input-bg':              'transparent',
    '--input-border':          'rgba(255, 255, 255, 0.08)',
    '--input-text':            '#FFFFFF',
    '--input-placeholder':     'rgba(199, 204, 201, 0.45)',
    '--input-focus-border':    '#81C784',   // key action: focus state

    // Chat
    '--chat-bubble-self':      'rgba(255, 255, 255, 0.10)',
    '--chat-bubble-other':     '#161717',
    '--chat-text-self':        '#FFFFFF',
    '--chat-text-other':       'rgba(255,255,255,0.70)',

    // Auth Page
    '--auth-panel-bg':         '#161717',

    // Status / Badges
    '--status-pending-bg':     'rgba(245,158,11,0.08)',
    '--status-pending-text':    'rgba(245,158,11,0.85)',
    '--status-success-bg':     'rgba(129,199,132,0.10)',
    '--status-success-text':   '#81C784',
    '--status-failed-bg':      'rgba(239,100,100,0.10)',
    '--status-failed-text':     'rgba(239,100,100,0.85)',
    '--status-info-bg':        'rgba(147,197,253,0.08)',
    '--status-info-text':      'rgba(147,197,253,0.85)',

    // ─── BACKWARD COMPATIBLE GLOBAL ALIASES ─────────────────────────────────
    '--bg':          '#0B0C0C',
    '--bg2':         '#161717',
    '--bg3':         '#000000',
    '--bg4':         '#1E2020',
    '--bg5':         '#252727',
    '--text':        '#FFFFFF',
    '--textMid':     'rgba(255,255,255,0.70)',
    '--textLow':     'rgba(255,255,255,0.40)',
    '--sulu':        '#81C784',
    '--suluLo':      'rgba(129, 199, 132, 0.10)',
    '--suluMd':      'rgba(129, 199, 132, 0.22)',
    '--silver':      '#C7CCC9',
    '--silverLo':    'rgba(199, 204, 201, 0.10)',
    '--silverMd':    'rgba(199, 204, 201, 0.30)',
    '--border':      'rgba(255, 255, 255, 0.08)',
    '--border2':     'rgba(255, 255, 255, 0.14)',
    '--navBg':       'rgba(11,12,12,0.96)',
    '--inputBg':     'transparent',
    '--danger':      'rgba(239,100,100,0.85)',
    '--dangerLo':    'rgba(239,100,100,0.10)',
    '--heroFilter':  'brightness(0.18) saturate(0.45)',
    '--imgFilter':   'brightness(0.55) saturate(0.7)',
    '--accent2':     '#E8B86D',
    '--amber':       'rgba(245,158,11,0.85)',
    '--amberLo':     'rgba(245,158,11,0.08)',
    '--blue':        'rgba(147,197,253,0.85)',
    '--blueLo':      'rgba(147,197,253,0.08)',
  },
  light: {
    // ─── GRANULAR COMPONENT-LEVEL VARIABLES ─────────────────────────────────
    // Global Page Styles
    '--page-bg':               '#FAFAF9',
    '--page-text':             '#241f1f',
    '--text-muted':            '#54594F',
    '--text-low':              '#84897F',
    '--page-border':           'rgba(31, 36, 33, 0.08)',
    '--accent-color':          '#4C7846',   // green reserved for key actions
    '--accent-gold':           '#E8B86D',

    // Navbar
    '--nav-bg':                'rgba(250,250,249,0.96)',
    '--nav-border':            'rgba(31, 36, 33, 0.08)',
    '--nav-link':              '#54594F',
    '--nav-link-hover':        '#1F2421',
    '--nav-active':            '#4C7846',   // key action: active state

    // Sidebar
    '--sidebar-bg':            '#FFFFFF',
    '--sidebar-border':        'rgba(31, 36, 33, 0.08)',
    '--sidebar-link':          '#54594F',
    '--sidebar-link-hover':    '#241f1f',
    '--sidebar-active-bg':     'rgba(31, 36, 33, 0.06)',
    '--sidebar-active-text':   '#4C7846',   // key action: active state

    // Buttons
    '--btn-primary-bg':        '#4C7846',   // key action: primary CTA
    '--btn-primary-text':      '#FFFFFF',
    '--btn-primary-hover':     '0.88',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#3D4339',
    '--btn-secondary-border':  'rgba(61, 67, 57, 0.30)',
    '--btn-icon-border':       'rgba(31, 36, 33, 0.10)',
    '--btn-icon-text':         '#3D4339',
    '--btn-icon-hover-bg':     'rgba(31, 36, 33, 0.06)',

    // Cards & Panels
    '--card-bg':               '#FFFFFF',
    '--card-border':           'rgba(31, 36, 33, 0.10)',
    '--card-title':            '#241f1f',
    '--card-body':             '#54594F',
    '--card-hover-bg':         'rgba(31, 36, 33, 0.03)',

    // Inputs
    '--input-bg':              '#FFFFFF',
    '--input-border':          'rgba(31, 36, 33, 0.18)',
    '--input-text':            '#241f1f',
    '--input-placeholder':     'rgba(61, 67, 57, 0.45)',
    '--input-focus-border':    '#4C7846',   // key action: focus state

    // Chat
    '--chat-bubble-self':      'rgba(31, 36, 33, 0.06)',
    '--chat-bubble-other':     '#F1F1EF',
    '--chat-text-self':        '#241f1f',
    '--chat-text-other':       '#54594F',

    // Auth Page
    '--auth-panel-bg':         '#FFFFFF',

    // Status / Badges
    '--status-pending-bg':     'rgba(180,120,0,0.07)',
    '--status-pending-text':    'rgba(180,120,0,0.85)',
    '--status-success-bg':     'rgba(76,120,70,0.08)',
    '--status-success-text':   '#4C7846',
    '--status-failed-bg':      'rgba(200,50,50,0.08)',
    '--status-failed-text':     'rgba(200,50,50,0.85)',
    '--status-info-bg':        'rgba(37,99,235,0.07)',
    '--status-info-text':      'rgba(37,99,235,0.85)',

    // ─── BACKWARD COMPATIBLE GLOBAL ALIASES ─────────────────────────────────
    '--bg':          '#FAFAF9',
    '--bg2':         '#FFFFFF',
    '--bg3':         '#E7E8E4',
    '--bg4':         '#FFFFFF',
    '--bg5':         '#F1F1EF',
    '--text':        '#241f1f',
    '--textMid':     '#54594F',
    '--textLow':     'rgba(31, 36, 33, 0.40)',
    '--sulu':        '#4C7846',
    '--suluLo':      'rgba(76, 120, 70, 0.08)',
    '--suluMd':      'rgba(76, 120, 70, 0.18)',
    '--silver':      '#3D4339',
    '--silverLo':    'rgba(31, 36, 33, 0.06)',
    '--silverMd':    'rgba(31, 36, 33, 0.18)',
    '--border':      'rgba(31, 36, 33, 0.08)',
    '--border2':     'rgba(31, 36, 33, 0.15)',
    '--navBg':       'rgba(250,250,249,0.96)',
    '--inputBg':     '#FFFFFF',
    '--danger':      'rgba(200,50,50,0.85)',
    '--dangerLo':    'rgba(200,50,50,0.08)',
    '--heroFilter':  'brightness(0.30) saturate(0.55)',
    '--imgFilter':   'brightness(0.75) saturate(0.85)',
    '--accent2':     '#E8B86D',
    '--amber':       'rgba(180,120,0,0.85)',
    '--amberLo':     'rgba(180,120,0,0.07)',
    '--blue':        'rgba(37,99,235,0.85)',
    '--blueLo':      'rgba(37,99,235,0.07)',
  }
};
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import CartBadge from '../components/CartBadge';
import {
  ArrowLeft, ArrowRight, Star, MapPin, ShieldCheck,
  MessageSquare, Sun, Moon, Globe, Package, Award, Clock,
} from 'lucide-react';

const FALLBACK_PRODUCT_IMG = 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
const FALLBACK_COVER_IMG   = 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────
const T = {
  fr: {
    back: '← Retour',
    nav: { login: 'Connexion →' },
    verified: 'Fournisseur vérifié',
    unverified: 'Non vérifié',
    locationFallback: 'Maroc',
    reviewsWord: (n) => `${n} avis`,
    stats: {
      products: 'Produits au catalogue',
      rating: 'Note moyenne',
      member: 'Membre depuis',
    },
    contactCta: 'Envoyer un message',
    products: {
      heading: 'Catalogue disponible',
      count: (n) => `${n} produit${n === 1 ? '' : 's'}`,
      emptyTitle: 'Aucune annonce active',
      emptyBody: 'Ce fournisseur prépare sa prochaine récolte. Revenez bientôt pour découvrir ses nouveaux produits.',
      noPrice: '—',
    },
    reviews: {
      heading: 'Avis clients',
      anon: 'Acheteur anonyme',
      emptyTitle: 'Aucun avis vérifié pour le moment',
    },
    loading: 'Chargement du profil...',
    notFound: 'Profil fournisseur introuvable',
    backToMarket: 'Retour au marketplace',
  },
  en: {
    back: '← Back',
    nav: {login: 'Sign in →' },
    verified: 'Verified supplier',
    unverified: 'Unverified',
    locationFallback: 'Morocco',
    reviewsWord: (n) => `${n} review${n === 1 ? '' : 's'}`,
    stats: {
      products: 'Products listed',
      rating: 'Average rating',
      member: 'Member since',
    },
    contactCta: 'Send message',
    products: {
      heading: 'Available catalogue',
      count: (n) => `${n} product${n === 1 ? '' : 's'}`,
      emptyTitle: 'No active listings',
      emptyBody: 'This supplier is preparing their next harvest. Check back soon for new products.',
      noPrice: '—',
    },
    reviews: {
      heading: 'Customer reviews',
      anon: 'Anonymous buyer',
      emptyTitle: 'No verified reviews yet',
    },
    loading: 'Loading profile...',
    notFound: 'Supplier profile not found',
    backToMarket: 'Back',
  },
};

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyles = ({ theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    :root {
      ${Object.entries(THEMES[theme]).map(([k,v]) => `${k}: ${v};`).join('\n      ')}
    }

    body { background: var(--page-bg); color: var(--page-text); transition: background 0.3s, color 0.3s; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .gl-fu { animation: fadeUp 0.6s ease forwards; }
    .gl-d1 { animation-delay: 0.10s; opacity: 0; }
    .gl-d2 { animation-delay: 0.18s; opacity: 0; }

    .gl-nav-link {
      font-family: 'DM Mono', monospace; font-size: 10px;
      letter-spacing: 0.20em; text-transform: uppercase;
      color: var(--nav-link); text-decoration: none; transition: color 0.2s;
    }
    .gl-nav-link:hover { color: var(--nav-link-hover); }

    .gl-icon-btn {
      background: none; border: 1px solid var(--btn-icon-border); cursor: pointer;
      padding: 7px 13px; display: inline-flex; align-items: center; gap: 6px;
      transition: border-color 0.2s, background 0.2s; border-radius: 2px;
      color: var(--btn-icon-text); font-family: 'DM Mono', monospace; font-size: 10px;
      letter-spacing: 0.12em; text-transform: uppercase;
    }
    .gl-icon-btn:hover { border-color: var(--accent-color); background: var(--btn-icon-hover-bg); color: var(--page-text); }

    .gl-btn-p {
      font-family: 'DM Mono', monospace; font-size: 11px;
      letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none;
      background: var(--btn-primary-bg); color: var(--btn-primary-text); border: none; cursor: pointer;
      padding: 15px 32px; display: inline-flex; align-items: center; gap: 10px;
      transition: opacity 0.2s; font-weight: 500;
    }
    .gl-btn-p:hover { opacity: var(--btn-primary-hover); }

    .gl-btn-g {
      font-family: 'DM Mono', monospace; font-size: 11px;
      letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none;
      background: var(--btn-secondary-bg); color: var(--btn-secondary-text);
      border: 1px solid var(--btn-secondary-border); cursor: pointer;
      padding: 15px 32px; display: inline-flex; align-items: center; gap: 10px;
      transition: border-color 0.2s, color 0.2s;
    }
    .gl-btn-g:hover { border-color: var(--btn-secondary-text); color: var(--page-text); }

    .gl-panel { overflow: hidden; }
    .gl-panel img { transition: transform 0.45s ease; }
    .gl-panel:hover img { transform: scale(1.04); }

    .gl-card { transition: border-color 0.2s, transform 0.2s; }
    .gl-card:hover { border-color: var(--card-border); transform: translateY(-2px); }

    .gl-spin {
      width: 28px; height: 28px; border: 2px solid var(--btn-icon-border);
      border-top-color: var(--btn-icon-text); border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}</style>
);

// Logo component is imported from components/Logo


// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar = ({ theme, onTheme, lang, onLang, t }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const { isAuthenticated, user: authUser } = useAuthStore();

  const getDashboardPath = () => {
    const role = authUser?.role?.toLowerCase() || '';
    if (role === 'admin') return '/gl/c0ns0le';
    if (role === 'fournisseur') return '/fournisseur/dashboard';
    return '/restaurant/dashboard';
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'var(--nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: 70 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="gl-icon-btn" onClick={onTheme} title="theme">
              {theme === 'dark' ? <><Sun size={12}/><span>Day</span></> : <><Moon size={12}/><span>Night</span></>}
            </button>
            <button className="gl-icon-btn" onClick={onLang} title="lang">
              <Globe size={12}/><span>{lang === 'fr' ? 'EN' : 'FR'}</span>
            </button>
          </div>
          <Logo />
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'flex-end' }}>
            <Link to="/browse" className="gl-nav-link">{t.nav.browse}</Link>
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="gl-nav-link" style={{ color: 'var(--sulu)' }}>
                {lang === 'fr' ? 'Mon Espace' : 'Dashboard'}
              </Link>
            ) : (
              <Link to="/login" className="gl-btn-p" style={{ padding: '10px 20px', fontSize: 10 }}>{t.nav.login}</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// ─── RATING STARS ────────────────────────────────────────────────────────────
const RatingStars = ({ rating = 0, size = 13 }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        color={n <= Math.round(rating) ? 'var(--silver)' : 'var(--silverLo)'}
        fill={n <= Math.round(rating) ? 'var(--silver)' : 'none'}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

// ─── STAT BLOCK ──────────────────────────────────────────────────────────────
const StatBlock = ({ icon: Icon, value, label, accent, noBorder }) => (
  <div style={{ padding: '24px 26px', borderRight: noBorder ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 40, height: 40, border: '1px solid var(--silverMd)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={16} color={accent ? 'var(--sulu)' : 'var(--silver)'} strokeWidth={1.5} />
    </div>
    <div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--silver)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  </div>
);

// ─── PRODUCT CARD ────────────────────────────────────────────────────────────
const ProductCard = ({ product, noPriceLabel }) => (
  <div className="gl-card" style={{
    border: '1px solid var(--border)', background: 'var(--bg2)',
    display: 'flex', flexDirection: 'column',
  }}>
    <div className="gl-panel" style={{ aspectRatio: '4/3', position: 'relative' }}>
      <img
        src={product.image_url || product.image || FALLBACK_PRODUCT_IMG}
        alt={product.name || 'Produit'}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'var(--imgFilter)' }}
      />
      {product.category && (
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          border: '1px solid var(--border)', padding: '5px 10px',
          fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#FFFFFF',
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          {product.category}
        </span>
      )}
    </div>
    <div style={{ padding: '18px 20px 22px' }}>
      <h3 style={{
        fontFamily: 'DM Serif Display, serif', fontSize: 17, fontWeight: 400,
        color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8,
      }}>
        {product.name || 'Produit'}
      </h3>
      {product.description && (
        <p style={{
          fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--silver)',
          lineHeight: 1.7, letterSpacing: '0.05em', marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.description}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--text)' }}>
          {product.price != null ? `${product.price} MAD` : noPriceLabel}
        </span>
        {product.unit && (
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            / {product.unit}
          </span>
        )}
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const FournisseurProfile = () => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const { id } = useParams();
  
  
  const t = T[lang];

  const [fournisseur, setFournisseur] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [f, p, r] = await Promise.all([
          axios.get(`/api/fournisseurs/${id}`),
          axios.get(`/api/fournisseurs/${id}/products`),
          axios.get(`/api/fournisseurs/${id}/reviews`),
        ]);
        setFournisseur(f.data);
        setProducts(p.data || []);
        setReviews(r.data || []);
      } catch (err) {
        setError(err.response?.data?.message || '');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const navProps = { theme, onTheme: () => toggleTheme(), lang, onLang: () => toggleLang(), t };

  // ─ Loading state ─
  if (loading) {
    return (
      <>
        <GlobalStyles theme={theme} />
        <Navbar {...navProps} />
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div className="gl-spin" />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--textLow)', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
            {t.loading}
          </span>
        </div>
      </>
    );
  }

  // ─ Error state ─
  if (error || !fournisseur) {
    return (
      <>
        <GlobalStyles theme={theme} />
        <Navbar {...navProps} />
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ border: '1px solid var(--border)', background: 'var(--bg2)', padding: '48px 40px', textAlign: 'center', maxWidth: 420, width: '100%' }}>
            <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--text)', textTransform: 'uppercase', marginBottom: 24 }}>
              {error || t.notFound}
            </p>
            <Link to="/browse" className="gl-btn-p">{t.backToMarket}</Link>
          </div>
        </div>
      </>
    );
  }

  const memberSince = fournisseur.created_at
    ? new Date(fournisseur.created_at).getFullYear()
    : '—';

  return (
    <>
      <GlobalStyles theme={theme} />
      <Navbar {...navProps} />

      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 96 }}>

        {/* ── COVER / HERO ───────────────────────────────────────── */}
        <div style={{ position: 'relative', height: 320 }}>
          <img
            src={fournisseur.cover_image_url || FALLBACK_COVER_IMG}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'var(--heroFilter)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.35) 100%)' }} />
          <div style={{ position: 'absolute', top: 90, left: 0, right: 0, maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
            <Link to="/browse" className="gl-nav-link" style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ArrowLeft size={13} /> {t.back.replace('← ', '')}
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

          {/* ── HEADER PANEL ───────────────────────────────────────── */}
          <div className="gl-fu" style={{
            border: '1px solid var(--border)', background: 'var(--bg2)',
            padding: '40px 44px', marginTop: -64, marginBottom: 0,
            display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{ flex: '1 1 380px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {fournisseur.company_name || fournisseur.name || 'Fournisseur'}
                </h1>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: fournisseur.is_verified ? 'var(--sulu)' : 'var(--textLow)',
                  background: fournisseur.is_verified ? 'var(--suluLo)' : 'transparent',
                  border: `1px solid ${fournisseur.is_verified ? 'var(--suluMd)' : 'var(--border)'}`,
                  padding: '5px 12px', letterSpacing: '0.18em', textTransform: 'uppercase',
                }}>
                  <ShieldCheck size={11} /> {fournisseur.is_verified ? t.verified : t.unverified}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginBottom: 20 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--silver)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  <MapPin size={13} color="var(--silver)" /> {fournisseur.city || t.locationFallback}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RatingStars rating={fournisseur.avg_rating || 0} />
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--textMid)', fontWeight: 500 }}>
                    {(fournisseur.avg_rating || 0)} · {t.reviewsWord(reviews.length)}
                  </span>
                </div>
              </div>

              {fournisseur.description && (
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--textMid)', lineHeight: 1.85, letterSpacing: '0.04em', maxWidth: 560 }}>
                  {fournisseur.description}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Link to="/login" className="gl-btn-p">
                <MessageSquare size={14} /> {t.contactCta} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── STATS STRIP ────────────────────────────────────────── */}
          <div className="gl-fu gl-d1" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid var(--border)', borderTop: 'none',
            marginBottom: 60,
          }}>
            <StatBlock icon={Package} value={products.length} label={t.stats.products} />
            <StatBlock
              icon={Award}
              value={typeof (fournisseur.avg_rating ?? 0) === 'number' ? (fournisseur.avg_rating ?? 0).toFixed(1) : fournisseur.avg_rating}
              label={t.stats.rating}
              accent
            />
            <StatBlock icon={Clock} value={memberSince} label={t.stats.member} noBorder />
          </div>

          {/* ── PRODUCTS ───────────────────────────────────────────── */}
          <div className="gl-fu gl-d2" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t.products.heading}
              </h2>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--textLow)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {t.products.count(products.length)}
              </span>
            </div>

            {products.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} noPriceLabel={t.products.noPrice} />
                ))}
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border)', background: 'var(--bg2)', padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, border: '1px solid var(--silverMd)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Package size={20} color="var(--silver)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>
                  {t.products.emptyTitle}
                </h3>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--silver)', letterSpacing: '0.10em', maxWidth: 360, lineHeight: 1.8 }}>
                  {t.products.emptyBody}
                </p>
              </div>
            )}
          </div>

          {/* ── REVIEWS ────────────────────────────────────────────── */}
          <div style={{ border: '1px solid var(--border)', background: 'var(--bg2)', padding: '44px' }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 32 }}>
              {t.reviews.heading} ({reviews?.length || 0})
            </h2>

            {reviews.length > 0 ? (
              <div>
                {reviews.map((review, i) => (
                  <div key={review.id} style={{ padding: '24px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 500, color: 'var(--text)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          {review.user_name || t.reviews.anon}
                        </h3>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginTop: 4 }}>
                          {review.date ? new Date(review.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB') : ''}
                        </span>
                      </div>
                      <RatingStars rating={review.rating} size={12} />
                    </div>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--textMid)', lineHeight: 1.85, letterSpacing: '0.04em' }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', borderTop: '1px solid var(--border)' }}>
                <Star size={26} color="var(--silverLo)" fill="var(--silverLo)" style={{ marginBottom: 16 }} />
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--textLow)', letterSpacing: '0.20em', textTransform: 'uppercase' }}>
                  {t.reviews.emptyTitle}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default FournisseurProfile;