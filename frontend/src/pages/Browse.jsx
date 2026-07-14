import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAppStore } from '../store/appStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import NotificationBell from '../components/NotificationBell';
import Logo from '../components/Logo';
import {
  Search, X, ChevronDown, ChevronRight, ChevronLeft,
  ShoppingCart, Check, Star, MapPin, Package, User, BadgeCheck,
  Truck, AlertCircle, RefreshCw, SearchX,
} from 'lucide-react';

/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
   BROWSE PAGE â€” GreenLeaf
   Dark editorial identity matching Home.jsx: #0B0C0C bg, DM Serif Display
   headings, DM Mono uppercase labels, --sulu (#81C784) accent.
   â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */

// â”€â”€ GreenLeaf theme tokens (mirrors Home.jsx's THEMES.dark/.light) â”€â”€â”€â”€â”€â”€â”€â”€
const THEMES = {
  dark: {
    '--page-bg': '#0B0C0C', '--page-text': '#FFFFFF',
    '--text-muted': 'rgba(255,255,255,0.70)', '--text-low': 'rgba(255,255,255,0.40)',
    '--page-border': 'rgba(255,255,255,0.08)',
    '--accent-color': '#81C784', '--accent-gold': '#E8B86D',
    '--nav-bg': 'rgba(11,12,12,0.96)', '--nav-border': 'rgba(255,255,255,0.08)',
    '--btn-primary-bg': '#81C784', '--btn-primary-text': '#000000', '--btn-primary-hover': '0.88',
    '--btn-icon-border': 'rgba(255,255,255,0.08)', '--btn-icon-text': '#C7CCC9', '--btn-icon-hover-bg': 'rgba(255,255,255,0.08)',
    '--card-bg': '#161717', '--card-border': 'rgba(255,255,255,0.08)', '--card-hover-bg': 'rgba(255,255,255,0.04)',
    '--input-bg': 'transparent', '--input-border': 'rgba(255,255,255,0.08)', '--input-text': '#FFFFFF',
    '--input-placeholder': 'rgba(199,204,201,0.45)',
    '--sulu': '#81C784', '--suluLo': 'rgba(129,199,132,0.10)',
  },
  light: {
    '--page-bg': '#FAFAF9', '--page-text': '#241f1f',
    '--text-muted': '#54594F', '--text-low': '#84897F',
    '--page-border': 'rgba(31,36,33,0.08)',
    '--accent-color': '#4C7846', '--accent-gold': '#E8B86D',
    '--nav-bg': 'rgba(250,250,249,0.96)', '--nav-border': 'rgba(31,36,33,0.08)',
    '--btn-primary-bg': '#4C7846', '--btn-primary-text': '#FFFFFF', '--btn-primary-hover': '0.88',
    '--btn-icon-border': 'rgba(31,36,33,0.10)', '--btn-icon-text': '#3D4339', '--btn-icon-hover-bg': 'rgba(31,36,33,0.06)',
    '--card-bg': '#FFFFFF', '--card-border': 'rgba(31,36,33,0.10)', '--card-hover-bg': 'rgba(31,36,33,0.03)',
    '--input-bg': '#FFFFFF', '--input-border': 'rgba(31,36,33,0.18)', '--input-text': '#241f1f',
    '--input-placeholder': 'rgba(61,67,57,0.45)',
    '--sulu': '#4C7846', '--suluLo': 'rgba(76,120,70,0.08)',
  },
};

// â”€â”€ Categories (keys must match `categories.slug` in the DB) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORIES = [
  { key: '',                      label: 'Tout',                     labelEn: 'All' },
  { key: 'fruits-legumes',        label: 'Fruits & Légumes',         labelEn: 'Fruits & Vegetables' },
  { key: 'viandes-poissons',      label: 'Viandes & Poissons',       labelEn: 'Meat & Fish' },
  { key: 'epices-condiments',     label: 'Épices & Condiments',      labelEn: 'Spices & Condiments' },
  { key: 'produits-laitiers',     label: 'Produits Laitiers',        labelEn: 'Dairy' },
  { key: 'cereales-legumineuses', label: 'Céréales & Légumineuses',  labelEn: 'Grains & Legumes' },
  { key: 'boissons',              label: 'Boissons',                  labelEn: 'Beverages' },
  { key: 'boulangerie',           label: 'Boulangerie',               labelEn: 'Bakery' },
  { key: 'surgeles',              label: 'Surgelés',                  labelEn: 'Frozen' },
];

const SORT_OPTIONS = [
  { value: 'none',       label: 'Nothing',           labelEn: 'Nothing' },
  { value: 'top-rated',  label: 'Mieux notés',       labelEn: 'Top Rated' },
  { value: 'newest',     label: 'Plus récents',      labelEn: 'Newest' },
  { value: 'price-asc',  label: 'Prix croissant',    labelEn: 'Price: Low to High' },
  { value: 'price-desc', label: 'Prix décroissant',  labelEn: 'Price: High to Low' },
];

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'];

// â”€â”€ Image helpers (demo/placeholder imagery only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORY_IMAGES = {
  'fruits-legumes':        'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
  'viandes-poissons':      'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg',
  'boissons':               'https://images.pexels.com/photos/2122294/pexels-photo-2122294.jpeg',
  'epices-condiments':      'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg',
  'produits-laitiers':      'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg',
  'cereales-legumineuses':  'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg',
  'boulangerie':            'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg',
  'surgeles':               'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg',
};
const FALLBACK = 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg';

const AD_SLIDES = [
  {
    key: 'produce',
    word: { fr: 'produits frais', en: 'fresh produce' },
    images: [
      'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
      'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
      'https://images.pexels.com/photos/3872433/pexels-photo-3872433.jpeg',
      'https://images.pexels.com/photos/4198023/pexels-photo-4198023.jpeg',
    ],
  },
  {
    key: 'spices',
    word: { fr: 'épices', en: 'spices' },
    images: [
      'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg',
      'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg',
      'https://images.pexels.com/photos/678414/pexels-photo-678414.jpeg',
      'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg',
    ],
  },
  {
    key: 'bakery',
    word: { fr: 'boulangerie', en: 'bakery' },
    images: [
      'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg',
      'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg',
      'https://images.pexels.com/photos/2067424/pexels-photo-2067424.jpeg',
      'https://images.pexels.com/photos/6605207/pexels-photo-6605207.jpeg',
    ],
  },
];

const getImgBase = (p) => {
  if (p.image) return p.image;
  if (Array.isArray(p.images) && p.images[0]) {
    return p.images[0].image_path ? `/storage/${p.images[0].image_path}` : p.images[0];
  }
  const catStr = typeof p.category === 'object' ? (p.category?.slug || p.category?.name || '') : (p.category || '');
  return CATEGORY_IMAGES[catStr] || FALLBACK;
};

// Blur-up pair: tiny thumb renders instantly, full image fades in on load.
const getImgPair = (p) => {
  const base = getImgBase(p);
  if (base.includes('pexels.com')) {
    return { thumb: `${base}?auto=compress&w=32`, full: `${base}?auto=compress&w=600` };
  }
  return { thumb: base, full: base };
};

// Frontend sort values -> backend's expected sort_by values
const SORT_BY_MAP = { 'top-rated': 'rating', 'newest': 'newest', 'price-asc': 'price_asc', 'price-desc': 'price_desc' };

const DEFAULT_FILTERS = {
  category: '', city: '', minPrice: 0, maxPrice: 1000,
  minRating: 0, verifiedOnly: false, sortBy: 'none',
  page: 1, limit: 12, search: '',
};

const filtersFromParams = (params) => ({
  category: params.get('category') || '',
  city: params.get('city') || '',
  minPrice: Number(params.get('minPrice')) || 0,
  maxPrice: params.has('maxPrice') ? Number(params.get('maxPrice')) : 1000,
  minRating: Number(params.get('minRating')) || 0,
  verifiedOnly: params.get('verified') === '1',
  sortBy: SORT_OPTIONS.some(o => o.value === params.get('sort')) ? params.get('sort') : 'none',
  page: Number(params.get('page')) || 1,
  limit: 12,
  search: params.get('q') || '',
});

const filtersToParams = (f) => {
  const p = new URLSearchParams();
  if (f.category) p.set('category', f.category);
  if (f.city) p.set('city', f.city);
  if (f.minPrice > 0) p.set('minPrice', f.minPrice);
  if (f.maxPrice < 1000) p.set('maxPrice', f.maxPrice);
  if (f.minRating > 0) p.set('minRating', f.minRating);
  if (f.verifiedOnly) p.set('verified', '1');
  if (f.sortBy !== 'none') p.set('sort', f.sortBy);
  if (f.page > 1) p.set('page', f.page);
  if (f.search) p.set('q', f.search);
  return p;
};

// â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Styles = ({ theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    :root {
      ${Object.entries(THEMES[theme] || THEMES.dark).map(([k, v]) => `${k}: ${v};`).join('\n      ')}
    }
    body { background: var(--page-bg); color: var(--page-text); transition: background 0.3s, color 0.3s; -webkit-font-smoothing: antialiased; font-family: 'DM Mono', monospace; }
    :focus-visible { outline: 2px solid var(--sulu); outline-offset: 2px; }

    .gl-btn-p { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; background:var(--btn-primary-bg); color:var(--btn-primary-text); border:none; cursor:pointer; padding:13px 28px; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:opacity .2s,transform .15s; font-weight:500; }
    .gl-btn-p:hover { opacity:var(--btn-primary-hover); transform:translateY(-1px); }
    .gl-btn-g { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; background:transparent; color:var(--text-muted); border:1px solid var(--card-border); cursor:pointer; padding:13px 28px; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:all .2s; }
    .gl-btn-g:hover { border-color:var(--accent-color); color:var(--page-text); }
    .gl-nav-link { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-muted); text-decoration:none; transition:color .2s; }
    .gl-nav-link:hover { color:var(--page-text); }
    .gl-input { width:100%; background:var(--input-bg); border:1px solid var(--input-border); outline:none; padding:12px 16px; font-family:'DM Mono',monospace; font-size:12px; color:var(--input-text); letter-spacing:.03em; transition:border-color .2s; }
    .gl-input::placeholder { color:var(--input-placeholder); }
    .gl-input:focus { border-color:var(--accent-color); }

    .gl-browse-nav { position: sticky; top: 0; z-index: 100; background: var(--nav-bg); backdrop-filter: blur(10px); border-bottom: 1px solid var(--nav-border); transition: box-shadow 0.2s; }
    .gl-browse-nav.scrolled { box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .gl-browse-nav-inner { max-width: 1440px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; height: 68px; gap: 24px; }
    .gl-browse-logo { flex-shrink: 0; display: inline-flex; align-items: center; }
    .gl-browse-search-wrap { flex: 1; max-width: 520px; position: relative; }
    .gl-browse-search { width: 100%; height: 42px; border: 1px solid var(--input-border); border-radius: 2px; padding: 0 16px 0 40px; font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.03em; color: var(--input-text); background: var(--input-bg); outline: none; transition: border-color 0.2s; }
    .gl-browse-search:focus { border-color: var(--accent-color); }
    .gl-browse-search::placeholder { color: var(--input-placeholder); }
    .gl-browse-nav-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
    .gl-browse-nav-btn { height: 40px; border-radius: 20px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--btn-icon-text); transition: background 0.15s, color 0.15s; position: relative; padding: 0 10px; text-decoration: none; }
    .gl-browse-nav-btn:hover { background: var(--btn-icon-hover-bg); color: var(--page-text); }
    .gl-browse-cart-count { position: absolute; top: -6px; right: -8px; background: var(--sulu); color: var(--btn-primary-text); font-size: 9px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; line-height: 1; }

    .gl-cats { border-bottom: 1px solid var(--page-border); background: var(--page-bg); position: sticky; top: 68px; z-index: 90; }
    .gl-cats-inner { max-width: 1440px; margin: 0 auto; padding: 0 32px; display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; }
    .gl-cats-inner::-webkit-scrollbar { display: none; }
    .gl-cat-tab { padding: 16px 18px; font-family: 'DM Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-low); cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; white-space: nowrap; transition: color 0.15s, border-color 0.15s; display: flex; align-items: center; gap: 6px; }
    .gl-cat-tab:hover { color: var(--text-muted); }
    .gl-cat-tab.active { color: var(--page-text); border-bottom-color: var(--sulu); }
    .gl-cat-count { font-size: 9.5px; color: var(--text-low); }
    .gl-cat-tab.active .gl-cat-count { color: var(--sulu); }

    .gl-layout { max-width: 1440px; margin: 0 auto; padding: 0 48px; min-height: calc(100vh - 130px); }
    .gl-main { padding: 40px 0 100px; }

    .gl-ad-hero { position:relative; min-height:330px; margin:0 0 28px; overflow:hidden; background:#ffd2bb; color:#1e1b18; border:1px solid rgba(31,36,33,.08); }
    .gl-ad-copy { position:absolute; z-index:2; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; pointer-events:none; }
    .gl-ad-title { font-family:'DM Serif Display',serif; font-size:clamp(28px,3.3vw,44px); line-height:1.12; font-weight:400; max-width:460px; letter-spacing:0; }
    .gl-ad-word-wrap { display:inline-grid; overflow:hidden; vertical-align:baseline; }
    .gl-ad-word { display:inline-block; text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:5px; animation:gl-ad-word-up 1.25s cubic-bezier(.22,.8,.24,1) both; }
    .gl-ad-img { position:absolute; object-fit:cover; box-shadow:0 16px 34px rgba(57,38,27,.08); animation:gl-ad-img-up 1.25s cubic-bezier(.22,.8,.24,1) both; }
    .gl-ad-img.one { width:170px; height:150px; left:7%; top:0; animation-delay:.02s; }
    .gl-ad-img.two { width:250px; height:130px; left:0; bottom:18px; animation-delay:.08s; }
    .gl-ad-img.three { width:230px; height:170px; right:0; top:54px; animation-delay:.04s; }
    .gl-ad-img.four { width:170px; height:150px; right:9%; bottom:0; animation-delay:.12s; }
    .gl-ad-dots { position:absolute; left:50%; bottom:16px; transform:translateX(-50%); z-index:3; display:flex; gap:7px; }
    .gl-ad-dot { width:6px; height:6px; border-radius:999px; border:0; background:rgba(30,27,24,.28); cursor:pointer; padding:0; }
    .gl-ad-dot.active { width:18px; background:#1e1b18; }
    @keyframes gl-ad-word-up { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
    @keyframes gl-ad-img-up { from { opacity:0; transform:translateY(34px); } to { opacity:1; transform:translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .gl-ad-word, .gl-ad-img { animation:none; } }
    .gl-browse-controls { display:grid; grid-template-columns:auto minmax(0, 1fr) auto; align-items:center; gap:18px; padding:16px 0 18px; margin-bottom:18px; border-top:1px solid var(--page-border); border-bottom:1px solid var(--page-border); }
    .gl-control-group { display:flex; align-items:center; gap:10px; min-width:0; }

    .gl-toolbar { display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; gap: 16px; flex-wrap: wrap; }
    .gl-result-count { font-size: 11px; letter-spacing: 0.06em; color: var(--text-low); text-transform: uppercase; }
    .gl-result-count strong { color: var(--page-text); font-weight: 500; }
    .gl-sort-select { height: 38px; border: 1px solid var(--input-border); border-radius: 2px; padding: 0 30px 0 14px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.04em; color: var(--text-muted); background: var(--input-bg); cursor: pointer; appearance: none; outline: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23C7CCC9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }

    .gl-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 30px 22px; transition: opacity 0.15s; }
    .gl-grid.refetching { opacity: 0.4; pointer-events: none; }

    .gl-card { cursor: default; text-decoration: none; color: inherit; display: flex; flex-direction: column; min-width:0; }
    .gl-card-img-wrap { position: relative; aspect-ratio: 1/1; border-radius: 3px; overflow: hidden; background: var(--card-bg); margin-bottom: 12px; border:1px solid var(--card-border); }
    .gl-card-img-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(14px); transform: scale(1.1); }
    .gl-card-img { position: relative; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.92); transition: opacity 0.35s ease, transform 0.4s ease; opacity: 0; }
    .gl-card-img.loaded { opacity: 1; }
    .gl-card:hover .gl-card-img.loaded { transform: scale(1.04); filter: brightness(1); }
    .gl-card-badge { position: absolute; top: 10px; left: 10px; background: var(--accent-gold); color: #1a1200; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; border-radius: 999px; padding: 5px 9px; box-shadow:0 8px 20px rgba(0,0,0,.22); }
    .gl-card-stock { position:absolute; left:8px; bottom:8px; max-width:calc(100% - 64px); display:inline-flex; align-items:center; gap:5px; padding:5px 8px; border-radius:999px; background:rgba(255,255,255,.92); color:#333; border:1px solid rgba(31,36,33,.10); backdrop-filter:blur(8px); font-size:10px; letter-spacing:.04em; }
    .gl-card-actions { position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 6px; opacity: 0; transition: opacity 0.2s; }
    .gl-card:hover .gl-card-actions, .gl-card:focus-within .gl-card-actions { opacity: 1; }
    .gl-card-action-btn { width: 34px; height: 34px; border-radius: 50%; background: rgba(11,12,12,0.7); backdrop-filter: blur(6px); border: 1px solid var(--card-border); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, border-color 0.15s; color: var(--text-muted); }
    .gl-card-action-btn:hover { transform: scale(1.1); border-color: var(--accent-color); color: var(--accent-color); }
    .gl-card-action-btn.added { background: var(--sulu); color: var(--btn-primary-text); border-color: var(--sulu); }
    .gl-card-quick-add { position: absolute; bottom: 10px; left: 10px; right: 10px; background: var(--sulu); color: var(--btn-primary-text); border: none; border-radius: 3px; padding: 10px 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; cursor: pointer; opacity: 0; transform: translateY(6px); transition: opacity 0.2s, transform 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .gl-card:hover .gl-card-quick-add, .gl-card:focus-within .gl-card-quick-add { opacity: 1; transform: translateY(0); }
    .gl-card-quick-add:hover { opacity: 0.88; }
    .gl-card-supplier { font-size: 10px; color: var(--text-low); font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px; min-width:0; }
    .gl-card-supplier span { min-width:0; overflow:hidden; text-overflow:ellipsis; }
    .gl-card-supplier .verified-badge { color: var(--sulu); flex-shrink: 0; }
    .gl-card-name { font-family: 'DM Mono', monospace; font-size: 12.5px; font-weight: 400; color: var(--page-text); line-height: 1.45; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .gl-card-price-row { display:flex; align-items:flex-end; justify-content:space-between; gap:10px; margin-top:auto; }
    .gl-card-price { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--page-text); white-space:nowrap; }
    .gl-card-price .unit { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 400; color: var(--text-low); margin-left: 4px; letter-spacing: 0.03em; }
    .gl-card-meta { display: flex; align-items: center; gap: 10px; margin-top: 7px; flex-wrap:wrap; min-height:19px; }
    .gl-card-rating { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--text-muted); }
    .gl-card-rating .count { color: var(--text-low); }
    .gl-card-location { font-size: 11px; color: var(--text-low); display: flex; align-items: center; gap: 3px; }
    .gl-card-supplier-link { font-size:10px; color:var(--sulu); text-decoration:none; letter-spacing:.04em; white-space:nowrap; }
    .gl-card-supplier-link:hover { text-decoration:underline; }

    .gl-dropdown-wrap { position: relative; display: flex; align-items: center; }
    .gl-dropdown { position: absolute; top: 100%; right: 0; width: 220px; background: var(--card-bg); border: 1px solid var(--card-border); box-shadow: 0 12px 32px rgba(0,0,0,0.4); border-radius: 4px; margin-top: 14px; padding: 10px 0; opacity: 0; visibility: hidden; transform: translateY(-6px); transition: all 0.2s; z-index: 200; }
    .gl-dropdown-wrap:hover .gl-dropdown, .gl-dropdown-wrap:focus-within .gl-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
    .gl-dropdown-header { padding: 6px 18px 14px; border-bottom: 1px solid var(--card-border); margin-bottom: 6px; }
    .gl-dropdown-header h4 { font-size: 10.5px; font-weight: 500; color: var(--page-text); letter-spacing: 0.1em; text-transform: uppercase; }
    .gl-dropdown-item { display: block; padding: 10px 18px; font-size: 11.5px; letter-spacing: 0.04em; color: var(--text-muted); text-decoration: none; transition: background 0.15s, color 0.15s; background: none; border: none; width: 100%; text-align: left; cursor: pointer; font-family: 'DM Mono', monospace; }
    .gl-dropdown-item:hover { background: var(--card-hover-bg); color: var(--page-text); }
    .gl-dropdown-divider { height: 1px; background: var(--card-border); margin: 6px 0; }

    .gl-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .gl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 10.5px; letter-spacing: 0.04em; background: var(--card-bg); color: var(--text-muted); border: 1px solid var(--card-border); cursor: pointer; transition: border-color 0.15s, color 0.15s; font-family: 'DM Mono', monospace; }
    .gl-chip:hover { border-color: var(--accent-color); color: var(--page-text); }

    .gl-pagination { display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 56px; padding-top: 32px; border-top: 1px solid var(--page-border); }
    .gl-page-btn { min-width: 38px; height: 38px; border-radius: 2px; border: 1px solid var(--card-border); background: transparent; color: var(--text-muted); font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; padding: 0 12px; font-family: 'DM Mono', monospace; }
    .gl-page-btn:hover:not(:disabled) { border-color: var(--accent-color); color: var(--page-text); }
    .gl-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .gl-page-btn.current { background: var(--sulu); border-color: var(--sulu); color: var(--btn-primary-text); }

    @keyframes gl-shimmer { 0% { background-position: -420px 0; } 100% { background-position: 420px 0; } }
    .gl-skeleton { background: linear-gradient(90deg, var(--card-bg) 24%, var(--card-hover-bg) 50%, var(--card-bg) 76%); background-size: 840px 100%; animation: gl-shimmer 1.6s ease infinite; border-radius: 3px; }
    .gl-loading-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; color:var(--text-muted); font-size:11px; letter-spacing:.06em; text-transform:uppercase; }
    .gl-loading-pulse { display:inline-flex; align-items:center; gap:8px; }
    .gl-loading-pulse::before { content:''; width:8px; height:8px; border-radius:50%; background:var(--sulu); animation:gl-dot-pulse 1.2s ease-in-out infinite; }
    @keyframes gl-dot-pulse { 0%,100% { opacity:.35; transform:scale(.8); } 50% { opacity:1; transform:scale(1); } }
    .gl-skeleton-card { min-width:0; }
    .gl-skeleton-img { aspect-ratio:1/1; border:1px solid var(--card-border); margin-bottom:12px; }
    .gl-skeleton-meta { display:flex; align-items:center; gap:8px; margin-top:10px; }

    .gl-state { min-height:330px; border:1px solid var(--card-border); border-radius:4px; background:linear-gradient(180deg, var(--card-hover-bg), transparent 70%); display:grid; place-items:center; padding:42px 24px; text-align:center; }
    .gl-state-inner { max-width:460px; margin:0 auto; }
    .gl-state-icon { width:54px; height:54px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:var(--suluLo); color:var(--sulu); margin-bottom:18px; }
    .gl-state.error .gl-state-icon { background:rgba(190,52,52,.08); color:#b83d3d; }
    .gl-state-kicker { color:var(--text-low); font-size:10px; letter-spacing:.16em; text-transform:uppercase; margin-bottom:8px; }
    .gl-state h3 { font-family:'DM Serif Display',serif; font-size:28px; line-height:1.12; font-weight:400; color:var(--page-text); margin-bottom:10px; }
    .gl-state p { font-size:12px; color:var(--text-muted); line-height:1.7; letter-spacing:.02em; margin-bottom:24px; }
    .gl-state-actions { display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; }
    .gl-state-action { min-height:40px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 16px; border-radius:3px; border:1px solid var(--card-border); font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.04em; cursor:pointer; background:var(--input-bg); color:var(--page-text); }
    .gl-state-action.primary { background:var(--btn-primary-bg); color:var(--btn-primary-text); border-color:var(--btn-primary-bg); }
    .gl-state-action:hover { border-color:var(--accent-color); }
    .gl-state-suggestions { display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap; margin-top:20px; }
    .gl-state-suggestion { border:1px solid var(--card-border); background:transparent; color:var(--text-muted); border-radius:999px; min-height:32px; padding:0 12px; font-size:10.5px; font-family:'DM Mono',monospace; cursor:pointer; }
    .gl-state-suggestion:hover { color:var(--page-text); border-color:var(--accent-color); }

    .gl-filter-bar-wrap { position: relative; display: flex; align-items: center; gap: 10px; flex-wrap:wrap; min-width:0; }
    .gl-filter-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 20px; border: 1px solid var(--card-border); background: transparent; font-size: 11px; letter-spacing: 0.04em; color: var(--text-muted); cursor: pointer; transition: all 0.2s; font-family: 'DM Mono', monospace; }
    .gl-filter-btn:hover { border-color: var(--accent-color); color: var(--page-text); }
    .gl-filter-btn.active { border-color: var(--accent-color); color: var(--sulu); background: var(--suluLo); }
    .gl-filter-dropdown { position: absolute; top: calc(100% + 8px); left: 0; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 4px; box-shadow: 0 16px 48px rgba(0,0,0,0.45); padding: 20px; z-index: 200; min-width: 300px; }
    .gl-filter-dropdown-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--card-border); }
    .gl-filter-clear { background: none; border: none; color: var(--text-low); text-decoration: underline; cursor: pointer; font-size: 11px; font-family: 'DM Mono', monospace; }
    .gl-filter-label { display: block; font-size: 10px; color: var(--text-low); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; }
    .gl-filter-option { display: flex; align-items: center; gap: 12px; padding: 9px 0; cursor: pointer; font-size: 12px; color: var(--text-muted); }
    .gl-filter-option:hover { color: var(--page-text); }
    .gl-checkbox { width: 17px; height: 17px; border-radius: 3px; border: 1.5px solid var(--card-border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
    .gl-checkbox.checked { background: var(--sulu); border-color: var(--sulu); }

    .gl-toast-stack { position: fixed; bottom: 24px; right: 24px; z-index: 500; display: flex; flex-direction: column; gap: 10px; }
    .gl-toast { display: flex; align-items: center; gap: 10px; background: var(--card-bg); border: 1px solid var(--card-border); color: var(--page-text); padding: 13px 18px; border-radius: 4px; font-size: 11.5px; letter-spacing: 0.03em; box-shadow: 0 12px 32px rgba(0,0,0,0.4); animation: gl-toast-in 0.2s ease; }
    .gl-toast .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--sulu); flex-shrink: 0; }
    @keyframes gl-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

    @media (max-width: 1100px) { .gl-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 768px) {
      .gl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 12px; }
      .gl-browse-nav-inner { height:auto; min-height:68px; padding: 12px 16px; gap: 12px; flex-wrap:wrap; }
      .gl-browse-logo { order:1; }
      .gl-browse-nav-actions { order:2; }
      .gl-browse-search-wrap { order:3; flex-basis:100%; max-width:none; }
      .gl-cats { top:118px; }
      .gl-cats-inner { padding: 0 16px; }
      .gl-layout { padding: 0 16px; }
      .gl-main { padding: 18px 0 48px; }
      .gl-ad-hero { min-height:300px; margin-left:-16px; margin-right:-16px; border-left:0; border-right:0; }
      .gl-ad-title { max-width:330px; }
      .gl-ad-img.one { width:110px; height:105px; left:5%; }
      .gl-ad-img.two { width:160px; height:90px; left:-24px; bottom:18px; }
      .gl-ad-img.three { width:145px; height:120px; right:-24px; top:48px; }
      .gl-ad-img.four { width:112px; height:104px; right:7%; bottom:4px; }
      .gl-browse-controls { grid-template-columns:1fr; align-items:stretch; gap:12px; }
      .gl-control-group { width:100%; }
      .gl-control-group.filters { overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
      .gl-control-group.filters::-webkit-scrollbar { display:none; }
      .gl-sort-select { width:100%; }
      .gl-toast-stack { left: 16px; right: 16px; bottom: 16px; }
    }
    @media (max-width: 480px) {
      .gl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 10px; }
      .gl-card-name { font-size: 12px; line-height:1.45; }
      .gl-card-price { font-size:15px; }
      .gl-card-price .unit { display:block; margin-left:0; margin-top:1px; }
      .gl-card-quick-add { display: none; }
      .gl-card-actions { opacity: 1; }
      .gl-card-stock { display:none; }
      .gl-filter-bar-wrap { overflow-x: visible; flex-wrap:nowrap; padding-bottom: 0; scrollbar-width:none; }
      .gl-filter-bar-wrap::-webkit-scrollbar { display:none; }
      .gl-filter-btn { flex:0 0 auto; }
      .gl-filter-dropdown { position:fixed; left:16px; right:16px; top:auto; bottom:76px; min-width:0; max-height:70vh; overflow:auto; }
      .gl-ad-hero { min-height:280px; }
      .gl-ad-title { font-size:28px; max-width:250px; }
      .gl-ad-img.one { width:92px; height:88px; }
      .gl-ad-img.two { width:132px; height:78px; }
      .gl-ad-img.three { width:116px; height:100px; }
      .gl-ad-img.four { width:88px; height:84px; }
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 4px; }
  `}</style>
);

// â”€â”€ Product Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Rotating ad hero. Replace AD_SLIDES with real paid placements later.
const BrowseAdHero = ({ lang, activeIndex, onSelect }) => {
  const slide = AD_SLIDES[activeIndex] || AD_SLIDES[0];
  const word = slide.word?.[lang] || slide.word?.en;
  const label = lang === 'fr'
    ? ['La sélection parfaite de ', ' pour votre restaurant.']
    : ['The perfect ', ' for your restaurant.'];

  return (
    <section className="gl-ad-hero" aria-label={lang === 'fr' ? 'Publicités GreenLeaf' : 'GreenLeaf ads'}>
      <img key={`${slide.key}-1`} className="gl-ad-img one" src={`${slide.images[0]}?auto=compress&w=420`} alt="" aria-hidden="true" />
      <img key={`${slide.key}-2`} className="gl-ad-img two" src={`${slide.images[1]}?auto=compress&w=560`} alt="" aria-hidden="true" />
      <img key={`${slide.key}-3`} className="gl-ad-img three" src={`${slide.images[2]}?auto=compress&w=560`} alt="" aria-hidden="true" />
      <img key={`${slide.key}-4`} className="gl-ad-img four" src={`${slide.images[3]}?auto=compress&w=420`} alt="" aria-hidden="true" />
      <div className="gl-ad-copy">
        <h1 className="gl-ad-title">
          {label[0]}
          <span className="gl-ad-word-wrap">
            <span key={slide.key} className="gl-ad-word">{word}</span>
          </span>
          {label[1]}
        </h1>
      </div>
      <div className="gl-ad-dots" aria-label={lang === 'fr' ? 'Changer la publicité' : 'Change ad'}>
        {AD_SLIDES.map((item, index) => (
          <button
            key={item.key}
            type="button"
            className={`gl-ad-dot${index === activeIndex ? ' active' : ''}`}
            aria-label={`${lang === 'fr' ? 'Publicité' : 'Ad'} ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </section>
  );
};

const ProductCard = ({ product, fournisseur, lang, onAdd }) => {
  const addToCart = useCartStore(s => s.addToCart);
  const [added, setAdded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { thumb, full } = getImgPair(product);
  const price = Number(product.price || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const rating = fournisseur?.avg_rating || fournisseur?.fournisseur_profile?.avg_rating;
  const reviewCount = fournisseur?.review_count;
  const supplierName = fournisseur?.company_name || fournisseur?.name || (lang === 'fr' ? 'Fournisseur' : 'Supplier');
  const stock = Number(product.stock ?? 0);
  const stockLabel = stock > 0
    ? (lang === 'fr' ? `${stock} en stock` : `${stock} in stock`)
    : (lang === 'fr' ? 'Stock limite' : 'Limited stock');

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ ...product, image: full }, fournisseur, 1);
    setAdded(true);
    onAdd?.(product);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="gl-card">
      <div className="gl-card-img-wrap">
        <img className="gl-card-img-thumb" src={thumb} alt="" aria-hidden="true" />
        <img className={`gl-card-img${loaded ? ' loaded' : ''}`} src={full} alt={product.name} loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={e => { e.target.onerror = null; e.target.src = FALLBACK; setLoaded(true); }} />
        {product.has_active_promo && <div className="gl-card-badge">-{product.promo_discount}%</div>}
        <div className="gl-card-stock"><Package size={11} /> {stockLabel}</div>
        <div className="gl-card-actions">
          <button className={`gl-card-action-btn${added ? ' added' : ''}`} onClick={handleAdd}
            aria-label={lang === 'fr' ? 'Ajouter au panier' : 'Add to cart'}
            title={lang === 'fr' ? 'Ajouter au panier' : 'Add to cart'}>
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>
        </div>
        <button className="gl-card-quick-add" onClick={handleAdd}>
          {added ? <><Check size={13} /> {lang === 'fr' ? 'Ajoutأ© !' : 'Added!'}</>
                 : <><ShoppingCart size={13} /> {lang === 'fr' ? 'Ajouter' : 'Add to Cart'}</>}
        </button>
      </div>
      <div className="gl-card-supplier">
        {fournisseur?.is_verified && <BadgeCheck size={13} className="verified-badge" aria-label={lang === 'fr' ? 'Fournisseur vأ©rifiأ©' : 'Verified supplier'} />}
        <span>{supplierName}</span>
      </div>
      <div className="gl-card-name">{product.name}</div>
      <div className="gl-card-price-row">
        <div className="gl-card-price">{price} <span className="unit">MAD / {product.unit || 'Kg'}</span></div>
        {fournisseur?.id && (
          <Link className="gl-card-supplier-link" to={`/supplier/${fournisseur.id}`} onClick={e => e.stopPropagation()}>
            {lang === 'fr' ? 'Voir' : 'View'}
          </Link>
        )}
      </div>
      <div className="gl-card-meta">
        {!!rating && (
          <span className="gl-card-rating">
            <Star size={12} fill="var(--accent-gold)" stroke="none" /> {Number(rating).toFixed(1)}
            {!!reviewCount && <span className="count">({reviewCount})</span>}
          </span>
        )}
        {fournisseur?.city && <span className="gl-card-location"><MapPin size={11} /> {fournisseur.city}</span>}
        <span className="gl-card-location"><Truck size={11} /> {lang === 'fr' ? 'Livraison directe' : 'Direct delivery'}</span>
      </div>
    </div>
  );
};

// â”€â”€ Skeleton Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SkeletonCard = ({ variant = 0 }) => {
  const nameWidth = [72, 85, 65][variant % 3];
  return (
    <div className="gl-skeleton-card" aria-hidden="true">
      <div className="gl-skeleton gl-skeleton-img" />
      <div className="gl-skeleton" style={{ height: 9, width: '48%', marginBottom: 10 }} />
      <div className="gl-skeleton" style={{ height: 13, width: `${nameWidth}%`, marginBottom: 9 }} />
      <div className="gl-skeleton" style={{ height: 15, width: '38%' }} />
      <div className="gl-skeleton-meta">
        <div className="gl-skeleton" style={{ height: 10, width: '26%' }} />
        <div className="gl-skeleton" style={{ height: 10, width: '34%' }} />
      </div>
    </div>
  );
};

// â”€â”€ Toast Stack â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LoadingState = ({ lang }) => (
  <>
    <div className="gl-loading-head" role="status" aria-live="polite">
      <span className="gl-loading-pulse">{lang === 'fr' ? 'Chargement du catalogue' : 'Loading catalog'}</span>
      <span>{lang === 'fr' ? 'Prأ©paration des produits' : 'Preparing products'}</span>
    </div>
    <div className="gl-grid" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} variant={i} />)}
    </div>
  </>
);

const CatalogState = ({ type, lang, title, body, onPrimary, onSecondary, onSuggestion }) => {
  const isError = type === 'error';
  const Icon = isError ? AlertCircle : SearchX;
  const suggestions = lang === 'fr'
    ? [
        { label: 'Fruits & lأ©gumes', category: 'fruits-legumes' },
        { label: 'أ‰pices', category: 'epices-condiments' },
        { label: 'Boulangerie', category: 'boulangerie' },
      ]
    : [
        { label: 'Fruits & vegetables', category: 'fruits-legumes' },
        { label: 'Spices', category: 'epices-condiments' },
        { label: 'Bakery', category: 'boulangerie' },
      ];

  return (
    <div className={`gl-state ${type}`}>
      <div className="gl-state-inner">
        <div className="gl-state-icon"><Icon size={25} /></div>
        <div className="gl-state-kicker">{isError ? (lang === 'fr' ? 'Erreur catalogue' : 'Catalog error') : (lang === 'fr' ? 'Aucun rأ©sultat' : 'No results')}</div>
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="gl-state-actions">
          <button className="gl-state-action primary" type="button" onClick={onPrimary}>
            {isError ? <RefreshCw size={14} /> : <X size={14} />}
            {isError ? (lang === 'fr' ? 'Rأ©essayer' : 'Retry') : (lang === 'fr' ? 'Rأ©initialiser' : 'Reset filters')}
          </button>
          <button className="gl-state-action" type="button" onClick={onSecondary}>
            <Search size={14} />
            {lang === 'fr' ? 'Nouvelle recherche' : 'New search'}
          </button>
        </div>
        {!isError && (
          <div className="gl-state-suggestions" aria-label={lang === 'fr' ? 'Suggestions' : 'Suggestions'}>
            {suggestions.map(item => (
              <button key={item.category} className="gl-state-suggestion" type="button" onClick={() => onSuggestion(item.category)}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ToastStack = ({ toasts }) => (
  <div className="gl-toast-stack" aria-live="polite">
    {toasts.map(t => (
      <div key={t.id} className="gl-toast">
        <span className="dot" />
        {t.message}
      </div>
    ))}
  </div>
);

// â”€â”€ Top Filter Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FilterBar = ({ filters, onChange, lang }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [localPrice, setLocalPrice] = useState({ min: filters.minPrice, max: filters.maxPrice });
  const wrapRef = useRef(null);

  const toggle = (key) => setActiveDropdown(p => p === key ? null : key);

  const applyPrice = () => {
    onChange({ minPrice: localPrice.min, maxPrice: localPrice.max });
    setActiveDropdown(null);
  };

  useEffect(() => {
    if (!activeDropdown) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        wrapRef.current?.querySelector(`[aria-controls="${activeDropdown}-panel"]`)?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeDropdown]);

  return (
    <div className="gl-filter-bar-wrap" ref={wrapRef}>

      <div style={{ position: 'relative' }}>
        <button className={`gl-filter-btn${activeDropdown === 'city' || filters.city ? ' active' : ''}`}
          onClick={() => toggle('city')} aria-haspopup="true" aria-expanded={activeDropdown === 'city'}
          aria-controls="city-panel">
          {filters.city || (lang === 'fr' ? 'Ville' : 'City')} <ChevronDown size={13} />
        </button>
        {activeDropdown === 'city' && (
          <div className="gl-filter-dropdown" id="city-panel" role="menu" style={{ minWidth: 220 }}>
            {CITIES.map(city => (
              <label key={city} role="menuitemradio" aria-checked={filters.city === city} tabIndex={0}
                className="gl-filter-option"
                onClick={() => { onChange({ city: filters.city === city ? '' : city }); setActiveDropdown(null); }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange({ city: filters.city === city ? '' : city }); setActiveDropdown(null); } }}>
                <div className={`gl-checkbox${filters.city === city ? ' checked' : ''}`}>
                  {filters.city === city && <Check size={12} color="var(--btn-primary-text)" strokeWidth={3} />}
                </div>
                {city}
              </label>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <button className={`gl-filter-btn${activeDropdown === 'price' || filters.minPrice > 0 || filters.maxPrice < 1000 ? ' active' : ''}`}
          onClick={() => toggle('price')} aria-haspopup="true" aria-expanded={activeDropdown === 'price'}
          aria-controls="price-panel">
          {lang === 'fr' ? 'Prix' : 'Price'} {filters.minPrice > 0 || filters.maxPrice < 1000 ? 'â€¢' : ''} <ChevronDown size={13} />
        </button>
        {activeDropdown === 'price' && (
          <div className="gl-filter-dropdown" id="price-panel" role="group" aria-label={lang === 'fr' ? 'Filtre de prix' : 'Price filter'}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="price-min" className="gl-filter-label">Min (MAD)</label>
                <input id="price-min" type="number" className="gl-input" value={localPrice.min || ''}
                  onChange={e => setLocalPrice(p => ({ ...p, min: +e.target.value || 0 }))} />
              </div>
              <span style={{ color: 'var(--text-low)', marginTop: 18 }}>â€”</span>
              <div style={{ flex: 1 }}>
                <label htmlFor="price-max" className="gl-filter-label">Max (MAD)</label>
                <input id="price-max" type="number" className="gl-input" value={localPrice.max >= 1000 ? '' : localPrice.max}
                  onChange={e => setLocalPrice(p => ({ ...p, max: +e.target.value || 1000 }))} />
              </div>
            </div>
            <div className="gl-filter-dropdown-actions">
              <button onClick={() => { setLocalPrice({ min: 0, max: 1000 }); onChange({ minPrice: 0, maxPrice: 1000 }); setActiveDropdown(null); }} className="gl-filter-clear">
                {lang === 'fr' ? 'Rأ©initialiser' : 'Clear'}
              </button>
              <button onClick={applyPrice} className="gl-btn-p" style={{ padding: '10px 22px', fontSize: 10 }}>
                {lang === 'fr' ? 'Appliquer' : 'Apply'}
              </button>
            </div>
          </div>
        )}
      </div>

      <button className={`gl-filter-btn${filters.verifiedOnly ? ' active' : ''}`}
        onClick={() => onChange({ verifiedOnly: !filters.verifiedOnly })}
        aria-pressed={filters.verifiedOnly}>
                {lang === 'fr' ? 'Fournisseurs vérifiés' : 'Verified Suppliers'}
      </button>

      {activeDropdown && <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setActiveDropdown(null)} />}
    </div>
  );
};

// â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
// MAIN BROWSE COMPONENT
// â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
const Browse = () => {
  const { lang } = useAppStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore(s => s.items);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts]         = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [refetching, setRefetching]     = useState(false);
  const [error, setError]               = useState('');
  const [scrolled, setScrolled]         = useState(false);
  const [toasts, setToasts]             = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [activeAd, setActiveAd] = useState(0);

  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [search, setSearch]   = useState(filters.search);

  const searchTimeout = useRef(null);
  const abortRef       = useRef(null);
  const countsAbortRef  = useRef(null);
  const toastId         = useRef(0);
  const catTabRefs       = useRef([]);
  const isFirstRun       = useRef(true);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setSearchParams(filtersToParams(filters), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const buildParams = (f) => ({
    category: f.category || undefined,
    search: f.search || undefined,
    city: f.city || undefined,
    min_price: f.minPrice || undefined,
    max_price: f.maxPrice < 1000 ? f.maxPrice : undefined,
    min_rating: f.minRating || undefined,
    is_verified_only: f.verifiedOnly || undefined,
  });

  const fetchProducts = async (f) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (isFirstRun.current) setLoading(true);
    else setRefetching(true);
    setError('');

    try {
      const { data } = await axios.get('/api/products', {
        params: { ...buildParams(f), ...(SORT_BY_MAP[f.sortBy] ? { sort_by: SORT_BY_MAP[f.sortBy] } : {}), page: f.page },
        signal: controller.signal,
      });
      const list = data.data || data.products || [];
      setProducts(list);
      const uniqs = []; const ids = new Set();
      list.forEach(p => {
        if (p.fournisseur && !ids.has(p.fournisseur.id)) {
          ids.add(p.fournisseur.id); uniqs.push(p.fournisseur);
        }
      });
      setFournisseurs(uniqs);
      setTotal(data.total || list.length || 0);
    } catch (err) {
      if (axios.isCancel?.(err) || err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      if (abortRef.current === controller) { setLoading(false); setRefetching(false); }
      isFirstRun.current = false;
    }
  };

  const fetchCategoryCounts = async (f) => {
    if (countsAbortRef.current) countsAbortRef.current.abort();
    const controller = new AbortController();
    countsAbortRef.current = controller;
    try {
      const { data } = await axios.get('/api/products/category-counts', {
        params: buildParams({ ...f, category: '' }),
        signal: controller.signal,
      });
      setCategoryCounts({ __all: data.total || 0, ...(data.byCategory || {}) });
    } catch (err) {
      // counts are a nice-to-have; fail silently
    }
  };

  useEffect(() => {
    fetchProducts(filters);
    fetchCategoryCounts(filters);
    return () => { abortRef.current?.abort(); countsAbortRef.current?.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => () => clearTimeout(searchTimeout.current), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAd(index => (index + 1) % AD_SLIDES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleFilterChange = (patch) => setFilters(prev => ({ ...prev, ...patch, page: patch.page ?? 1 }));

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => handleFilterChange({ search: val }), 400);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
  };

  const startNewSearch = () => {
    setSearch('');
    handleFilterChange({ search: '' });
    window.requestAnimationFrame(() => document.getElementById('browse-search')?.focus());
  };

  const jumpToSuggestedCategory = (category) => {
    setSearch('');
    setFilters(prev => ({ ...prev, search: '', category, page: 1 }));
  };

  const pushToast = (product) => {
    const id = ++toastId.current;
    const message = lang === 'fr' ? `${product.name} ajoutأ© au panier` : `${product.name} added to cart`;
    setToasts(t => [...t, { id, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500);
  };

  const handleCatKeyDown = (e, idx) => {
    let nextIdx = null;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % CATEGORIES.length;
    if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + CATEGORIES.length) % CATEGORIES.length;
    if (e.key === 'Home') nextIdx = 0;
    if (e.key === 'End') nextIdx = CATEGORIES.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      catTabRefs.current[nextIdx]?.focus();
      handleFilterChange({ category: CATEGORIES[nextIdx].key });
    }
  };

  const totalPages = Math.ceil(total / filters.limit) || 1;

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.city) chips.push({ key: 'city', label: filters.city, clear: () => handleFilterChange({ city: '' }) });
    if (filters.minPrice > 0) chips.push({ key: 'minP', label: `Min ${filters.minPrice} MAD`, clear: () => handleFilterChange({ minPrice: 0 }) });
    if (filters.maxPrice < 1000) chips.push({ key: 'maxP', label: `Max ${filters.maxPrice} MAD`, clear: () => handleFilterChange({ maxPrice: 1000 }) });
    if (filters.minRating > 0) chips.push({ key: 'rating', label: `${filters.minRating}âک…+`, clear: () => handleFilterChange({ minRating: 0 }) });
    if (filters.verifiedOnly) chips.push({ key: 'verified', label: lang === 'fr' ? 'Vأ©rifiأ©s' : 'Verified', clear: () => handleFilterChange({ verifiedOnly: false }) });
    return chips;
  }, [filters, lang]);

  const emptyReason = filters.search
    ? (lang === 'fr' ? `Aucun rأ©sultat pour "${filters.search}"` : `No results for "${filters.search}"`)
    : (lang === 'fr' ? 'Aucun produit trouvأ©' : 'No products found');
  const emptyHint = filters.search
    ? (lang === 'fr' ? 'Vأ©rifiez l\u2019orthographe ou essayez un autre terme.' : 'Check the spelling or try a different term.')
    : (lang === 'fr' ? 'Essayez d\u2019أ©largir vos filtres.' : 'Try broadening your filters.');

  return (
    <>
      <Styles theme="light" />

      {/* â”€â”€ TOP NAVIGATION â”€â”€ */}
      <nav className={`gl-browse-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="gl-browse-nav-inner">
          <div className="gl-browse-logo">
            <Logo size={30} textColor="var(--page-text)" leafColor="var(--sulu)" subtextColor="var(--text-low)" />
          </div>
          <div className="gl-browse-search-wrap">
            <Search size={15} color="var(--text-low)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <label htmlFor="browse-search" className="sr-only">{lang === 'fr' ? 'Rechercher' : 'Search'}</label>
            <input id="browse-search" className="gl-browse-search" type="text"
            placeholder={lang === 'fr' ? 'Rechercher des produits, fournisseurs…' : 'Search products, suppliers…'}
              value={search} onChange={e => handleSearch(e.target.value)} />
            {search && (
              <button onClick={() => handleSearch('')} aria-label={lang === 'fr' ? 'Effacer la recherche' : 'Clear search'}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-low)', display: 'flex' }}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="gl-browse-nav-actions">
            <NotificationBell buttonClassName="gl-browse-nav-btn" buttonStyle={{ width: 'auto' }} iconSize={20} />
            {isAuthenticated ? (
              <div className="gl-dropdown-wrap">
                <button className="gl-browse-nav-btn" aria-label="Account" style={{ width: 'auto' }}>
                  <User size={21} strokeWidth={1.4} />
                </button>
                <div className="gl-dropdown">
                  <div className="gl-dropdown-header">
                    <h4>{lang === 'fr' ? 'Bonjour' : 'Hi'}, {user?.name || 'user'}</h4>
                  </div>
                  <Link to="/restaurant/commandes" className="gl-dropdown-item">{lang === 'fr' ? 'Commandes' : 'Orders'}</Link>
                  <Link to="/restaurant/messages" className="gl-dropdown-item">{lang === 'fr' ? 'Messages' : 'Messages'}</Link>
                  <Link to="/restaurant/favorites" className="gl-dropdown-item">{lang === 'fr' ? 'Favoris' : 'Favorites'}</Link>
                  <Link to="/restaurant/settings" className="gl-dropdown-item">{lang === 'fr' ? 'Paramètres' : 'Settings'}</Link>
                  <div className="gl-dropdown-divider"></div>
                  <Link to="/help" className="gl-dropdown-item">{lang === 'fr' ? "Centre d'aide" : 'Help center'}</Link>
                  <div className="gl-dropdown-divider"></div>
                  <button className="gl-dropdown-item" onClick={logout}>{lang === 'fr' ? 'Déconnexion' : 'Sign out'}</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="gl-nav-link" style={{ padding: '0 12px' }}>
                {lang === 'fr' ? 'Connexion' : 'Sign In'}
              </Link>
            )}
            <Link to="/cart" className="gl-browse-nav-btn" aria-label={`Cart, ${cartCount} items`} style={{ width: 'auto' }}>
              <ShoppingCart size={20} strokeWidth={1.4} />
              {cartCount > 0 && <span className="gl-browse-cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* â”€â”€ CATEGORY BAR â”€â”€ */}
      <div className="gl-cats">
        <div className="gl-cats-inner" role="tablist" aria-label={lang === 'fr' ? 'Catégories' : 'Categories'}>
          {CATEGORIES.map((cat, idx) => {
            const isActive = filters.category === cat.key;
            const count = cat.key === '' ? categoryCounts.__all : categoryCounts[cat.key];
            return (
              <button key={cat.key} ref={el => catTabRefs.current[idx] = el}
                role="tab" aria-selected={isActive} tabIndex={isActive ? 0 : -1}
                className={`gl-cat-tab${isActive ? ' active' : ''}`}
                onClick={() => handleFilterChange({ category: cat.key })}
                onKeyDown={e => handleCatKeyDown(e, idx)}>
                {lang === 'fr' ? cat.label : cat.labelEn}
                {count !== undefined && <span className="gl-cat-count">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* â”€â”€ MAIN LAYOUT â”€â”€ */}
      <div className="gl-layout">
        <main className="gl-main">
          <BrowseAdHero lang={lang} activeIndex={activeAd} onSelect={setActiveAd} />

          <div className="gl-browse-controls" id="browse-filters">
            <span className="gl-result-count" aria-live="polite">
              <strong>{total}</strong> {lang === 'fr' ? 'produits' : 'products'}
            </span>
            <div className="gl-control-group filters">
              <FilterBar filters={filters} onChange={handleFilterChange} lang={lang} />
            </div>
            <div className="gl-control-group sort">
              <label htmlFor="sort-select" className="sr-only">{lang === 'fr' ? 'Trier par' : 'Sort by'}</label>
              <select id="sort-select" className="gl-sort-select" value={filters.sortBy}
                onChange={e => handleFilterChange({ sortBy: e.target.value })}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{lang === 'fr' ? o.label : o.labelEn}</option>
                ))}
              </select>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="gl-chips">
              {activeChips.map(chip => (
                <button key={chip.key} className="gl-chip" onClick={chip.clear}>
                  {chip.label} <X size={12} />
                </button>
              ))}
              <button className="gl-chip" onClick={resetFilters} style={{ borderColor: 'transparent', color: 'var(--sulu)' }}>
                {lang === 'fr' ? 'Tout effacer' : 'Clear all'}
              </button>
            </div>
          )}

          {loading ? (
            <LoadingState lang={lang} />
          ) : error ? (
            <CatalogState
              type="error"
              lang={lang}
              title={lang === 'fr' ? 'Le catalogue ne répond pas.' : 'The catalog did not load.'}
              body={lang === 'fr'
                ? 'La connexion aux produits a échoué. Réessayez, ou effacez les filtres si une recherche bloque les résultats.'
                : 'The product request failed. Retry, or clear filters if a search is blocking the results.'}
              onPrimary={() => fetchProducts(filters)}
              onSecondary={resetFilters}
            />
          ) : products.length === 0 ? (
            <CatalogState
              type="empty"
              lang={lang}
              title={emptyReason}
              body={emptyHint}
              onPrimary={resetFilters}
              onSecondary={startNewSearch}
              onSuggestion={jumpToSuggestedCategory}
            />
          ) : (
            <>
              <div className={`gl-grid${refetching ? ' refetching' : ''}`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} lang={lang} onAdd={pushToast}
                    fournisseur={product.fournisseur || fournisseurs.find(f => f.id === product.fournisseur_id) || {}} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="gl-pagination" aria-label={lang === 'fr' ? 'Pagination' : 'Pagination'}>
                  <button className="gl-page-btn" disabled={filters.page <= 1} aria-label={lang === 'fr' ? 'Page prأ©cأ©dente' : 'Previous page'}
                    onClick={() => handleFilterChange({ page: filters.page - 1 })}>
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const pg = filters.page <= 4 ? i + 1 : filters.page - 3 + i;
                    if (pg < 1 || pg > totalPages) return null;
                    return (
                      <button key={pg} className={`gl-page-btn${pg === filters.page ? ' current' : ''}`}
                        aria-current={pg === filters.page ? 'page' : undefined}
                        onClick={() => handleFilterChange({ page: pg })}>
                        {pg}
                      </button>
                    );
                  })}
                  <button className="gl-page-btn" disabled={filters.page >= totalPages} aria-label={lang === 'fr' ? 'Page suivante' : 'Next page'}
                    onClick={() => handleFilterChange({ page: filters.page + 1 })}>
                    <ChevronRight size={14} />
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>

      <ToastStack toasts={toasts} />
    </>
  );
};

export default Browse;
