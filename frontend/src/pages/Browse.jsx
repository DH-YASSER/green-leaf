import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAppStore } from '../store/appStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import {
  Search, X, ChevronDown, ChevronRight, ChevronLeft,
  ShoppingCart, Check, Star, MapPin, Package, Bell, User, BadgeCheck,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   BROWSE PAGE — GreenLeaf
   Dark editorial identity matching Home.jsx: #0B0C0C bg, DM Serif Display
   headings, DM Mono uppercase labels, --sulu (#81C784) accent.
   ═══════════════════════════════════════════════════════════════════════════ */

// ── GreenLeaf theme tokens (mirrors Home.jsx's THEMES.dark/.light) ────────
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

// ── Categories (keys must match `categories.slug` in the DB) ──────────────
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
  { value: 'top-rated',  label: 'Mieux notés',       labelEn: 'Top Rated' },
  { value: 'newest',     label: 'Plus récents',      labelEn: 'Newest' },
  { value: 'price-asc',  label: 'Prix croissant',    labelEn: 'Price: Low to High' },
  { value: 'price-desc', label: 'Prix décroissant',  labelEn: 'Price: High to Low' },
];

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'];

// ── Image helpers (demo/placeholder imagery only) ────────────────────────
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
  minRating: 0, verifiedOnly: false, sortBy: 'top-rated',
  page: 1, limit: 12, search: '',
};

const filtersFromParams = (params) => ({
  category: params.get('category') || '',
  city: params.get('city') || '',
  minPrice: Number(params.get('minPrice')) || 0,
  maxPrice: params.has('maxPrice') ? Number(params.get('maxPrice')) : 1000,
  minRating: Number(params.get('minRating')) || 0,
  verifiedOnly: params.get('verified') === '1',
  sortBy: SORT_OPTIONS.some(o => o.value === params.get('sort')) ? params.get('sort') : 'top-rated',
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
  if (f.sortBy !== 'top-rated') p.set('sort', f.sortBy);
  if (f.page > 1) p.set('page', f.page);
  if (f.search) p.set('q', f.search);
  return p;
};

// ── Styles ─────────────────────────────────────────────────────────────────
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
    .gl-browse-logo { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 24px; color: var(--page-text); text-decoration: none; flex-shrink: 0; }
    .gl-browse-logo span { color: var(--sulu); }
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

    .gl-toolbar { display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; gap: 16px; flex-wrap: wrap; }
    .gl-result-count { font-size: 11px; letter-spacing: 0.06em; color: var(--text-low); text-transform: uppercase; }
    .gl-result-count strong { color: var(--page-text); font-weight: 500; }
    .gl-sort-select { height: 38px; border: 1px solid var(--input-border); border-radius: 2px; padding: 0 30px 0 14px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.04em; color: var(--text-muted); background: var(--input-bg); cursor: pointer; appearance: none; outline: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23C7CCC9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }

    .gl-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px 22px; transition: opacity 0.15s; }
    .gl-grid.refetching { opacity: 0.4; pointer-events: none; }

    .gl-card { cursor: pointer; text-decoration: none; color: inherit; display: flex; flex-direction: column; }
    .gl-card-img-wrap { position: relative; aspect-ratio: 3/4; border-radius: 4px; overflow: hidden; background: var(--card-bg); margin-bottom: 14px; }
    .gl-card-img-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(14px); transform: scale(1.1); }
    .gl-card-img { position: relative; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.92); transition: opacity 0.35s ease, transform 0.4s ease; opacity: 0; }
    .gl-card-img.loaded { opacity: 1; }
    .gl-card:hover .gl-card-img.loaded { transform: scale(1.04); filter: brightness(1); }
    .gl-card-badge { position: absolute; top: 10px; left: 10px; background: var(--accent-gold); color: #1a1200; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; border-radius: 2px; padding: 4px 8px; }
    .gl-card-actions { position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 6px; opacity: 0; transition: opacity 0.2s; }
    .gl-card:hover .gl-card-actions, .gl-card:focus-within .gl-card-actions { opacity: 1; }
    .gl-card-action-btn { width: 34px; height: 34px; border-radius: 50%; background: rgba(11,12,12,0.7); backdrop-filter: blur(6px); border: 1px solid var(--card-border); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, border-color 0.15s; color: var(--text-muted); }
    .gl-card-action-btn:hover { transform: scale(1.1); border-color: var(--accent-color); color: var(--accent-color); }
    .gl-card-action-btn.added { background: var(--sulu); color: var(--btn-primary-text); border-color: var(--sulu); }
    .gl-card-quick-add { position: absolute; bottom: 10px; left: 10px; right: 10px; background: var(--sulu); color: var(--btn-primary-text); border: none; border-radius: 2px; padding: 10px 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; cursor: pointer; opacity: 0; transform: translateY(6px); transition: opacity 0.2s, transform 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .gl-card:hover .gl-card-quick-add, .gl-card:focus-within .gl-card-quick-add { opacity: 1; transform: translateY(0); }
    .gl-card-quick-add:hover { opacity: 0.88; }
    .gl-card-supplier { font-size: 10px; color: var(--text-low); font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px; }
    .gl-card-supplier .verified-badge { color: var(--sulu); flex-shrink: 0; }
    .gl-card-name { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 400; color: var(--page-text); line-height: 1.5; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .gl-card-price { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--page-text); }
    .gl-card-price .unit { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 400; color: var(--text-low); margin-left: 4px; letter-spacing: 0.03em; }
    .gl-card-meta { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
    .gl-card-rating { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--text-muted); }
    .gl-card-rating .count { color: var(--text-low); }
    .gl-card-location { font-size: 11px; color: var(--text-low); display: flex; align-items: center; gap: 3px; }

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

    @keyframes gl-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    .gl-skeleton { background: linear-gradient(90deg, var(--card-bg) 25%, var(--card-hover-bg) 50%, var(--card-bg) 75%); background-size: 800px 100%; animation: gl-shimmer 1.5s ease infinite; border-radius: 2px; }

    .gl-empty { text-align: center; padding: 90px 24px; border: 1px dashed var(--card-border); border-radius: 4px; grid-column: 1 / -1; }
    .gl-empty h3 { font-family: 'DM Serif Display', serif; font-size: 22px; font-weight: 400; color: var(--page-text); margin-bottom: 10px; }
    .gl-empty p { font-size: 11.5px; color: var(--text-low); letter-spacing: 0.03em; margin-bottom: 24px; }

    .gl-filter-bar-wrap { position: relative; display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
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

    @media (max-width: 1100px) { .gl-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 768px) { .gl-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; } .gl-browse-nav-inner { padding: 0 16px; gap: 12px; } .gl-cats-inner { padding: 0 16px; } .gl-layout { padding: 0 16px; } .gl-main { padding: 20px 0 48px; } .gl-toast-stack { left: 16px; right: 16px; bottom: 16px; } }
    @media (max-width: 480px) { .gl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px 10px; } .gl-card-name { font-size: 12.5px; } .gl-card-quick-add { display: none; } .gl-card-actions { opacity: 1; } .gl-filter-bar-wrap { overflow-x: auto; padding-bottom: 8px; } }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 4px; }
  `}</style>
);

// ── Product Card ───────────────────────────────────────────────────────────
const ProductCard = ({ product, fournisseur, lang, onAdd }) => {
  const addToCart = useCartStore(s => s.addToCart);
  const [added, setAdded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { thumb, full } = getImgPair(product);
  const price = Number(product.price || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const rating = fournisseur?.avg_rating || fournisseur?.fournisseur_profile?.avg_rating;
  const reviewCount = fournisseur?.review_count;

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
        <div className="gl-card-actions">
          <button className={`gl-card-action-btn${added ? ' added' : ''}`} onClick={handleAdd}
            aria-label={lang === 'fr' ? 'Ajouter au panier' : 'Add to cart'}
            title={lang === 'fr' ? 'Ajouter au panier' : 'Add to cart'}>
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>
        </div>
        <button className="gl-card-quick-add" onClick={handleAdd}>
          {added ? <><Check size={13} /> {lang === 'fr' ? 'Ajouté !' : 'Added!'}</>
                 : <><ShoppingCart size={13} /> {lang === 'fr' ? 'Ajouter' : 'Add to Cart'}</>}
        </button>
      </div>
      <div className="gl-card-supplier">
        {fournisseur?.is_verified && <BadgeCheck size={13} className="verified-badge" aria-label={lang === 'fr' ? 'Fournisseur vérifié' : 'Verified supplier'} />}
        <span>{fournisseur?.company_name || fournisseur?.name || 'Fournisseur'}</span>
      </div>
      <div className="gl-card-name">{product.name}</div>
      <div className="gl-card-price">{price} <span className="unit">MAD / {product.unit || 'Kg'}</span></div>
      <div className="gl-card-meta">
        {!!rating && (
          <span className="gl-card-rating">
            <Star size={12} fill="var(--accent-gold)" stroke="none" /> {Number(rating).toFixed(1)}
            {!!reviewCount && <span className="count">({reviewCount})</span>}
          </span>
        )}
        {fournisseur?.city && <span className="gl-card-location"><MapPin size={11} /> {fournisseur.city}</span>}
      </div>
    </div>
  );
};

// ── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = ({ variant = 0 }) => {
  const nameWidth = [72, 85, 65][variant % 3];
  return (
    <div>
      <div className="gl-skeleton" style={{ aspectRatio: '3/4', borderRadius: 4, marginBottom: 14 }} />
      <div className="gl-skeleton" style={{ height: 9, width: '45%', marginBottom: 10 }} />
      <div className="gl-skeleton" style={{ height: 12, width: `${nameWidth}%`, marginBottom: 8 }} />
      <div className="gl-skeleton" style={{ height: 12, width: '35%' }} />
    </div>
  );
};

// ── Toast Stack ────────────────────────────────────────────────────────────
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

// ── Top Filter Bar ────────────────────────────────────────────────────────
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
          {lang === 'fr' ? 'Prix' : 'Price'} {filters.minPrice > 0 || filters.maxPrice < 1000 ? '•' : ''} <ChevronDown size={13} />
        </button>
        {activeDropdown === 'price' && (
          <div className="gl-filter-dropdown" id="price-panel" role="group" aria-label={lang === 'fr' ? 'Filtre de prix' : 'Price filter'}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="price-min" className="gl-filter-label">Min (MAD)</label>
                <input id="price-min" type="number" className="gl-input" value={localPrice.min || ''}
                  onChange={e => setLocalPrice(p => ({ ...p, min: +e.target.value || 0 }))} />
              </div>
              <span style={{ color: 'var(--text-low)', marginTop: 18 }}>—</span>
              <div style={{ flex: 1 }}>
                <label htmlFor="price-max" className="gl-filter-label">Max (MAD)</label>
                <input id="price-max" type="number" className="gl-input" value={localPrice.max >= 1000 ? '' : localPrice.max}
                  onChange={e => setLocalPrice(p => ({ ...p, max: +e.target.value || 1000 }))} />
              </div>
            </div>
            <div className="gl-filter-dropdown-actions">
              <button onClick={() => { setLocalPrice({ min: 0, max: 1000 }); onChange({ minPrice: 0, maxPrice: 1000 }); setActiveDropdown(null); }} className="gl-filter-clear">
                {lang === 'fr' ? 'Réinitialiser' : 'Clear'}
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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN BROWSE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const Browse = () => {
  const { lang, theme } = useAppStore();
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
        params: { ...buildParams(f), sort_by: SORT_BY_MAP[f.sortBy] || 'newest', page: f.page },
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

  const pushToast = (product) => {
    const id = ++toastId.current;
    const message = lang === 'fr' ? `${product.name} ajouté au panier` : `${product.name} added to cart`;
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
    if (filters.minRating > 0) chips.push({ key: 'rating', label: `${filters.minRating}★+`, clear: () => handleFilterChange({ minRating: 0 }) });
    if (filters.verifiedOnly) chips.push({ key: 'verified', label: lang === 'fr' ? 'Vérifiés' : 'Verified', clear: () => handleFilterChange({ verifiedOnly: false }) });
    return chips;
  }, [filters, lang]);

  const emptyReason = filters.search
    ? (lang === 'fr' ? `Aucun résultat pour "${filters.search}"` : `No results for "${filters.search}"`)
    : (lang === 'fr' ? 'Aucun produit trouvé' : 'No products found');
  const emptyHint = filters.search
    ? (lang === 'fr' ? 'Vérifiez l\u2019orthographe ou essayez un autre terme.' : 'Check the spelling or try a different term.')
    : (lang === 'fr' ? 'Essayez d\u2019élargir vos filtres.' : 'Try broadening your filters.');

  return (
    <>
      <Styles theme={theme || 'dark'} />

      {/* ── TOP NAVIGATION ── */}
      <nav className={`gl-browse-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="gl-browse-nav-inner">
          <Link to="/" className="gl-browse-logo">Green<span>Leaf</span></Link>
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
            <button className="gl-browse-nav-btn" aria-label="Notifications" style={{ width: 'auto' }}>
              <Bell size={20} strokeWidth={1.4} />
            </button>
            {isAuthenticated ? (
              <div className="gl-dropdown-wrap">
                <button className="gl-browse-nav-btn" aria-label="Account" style={{ width: 'auto' }}>
                  <User size={21} strokeWidth={1.4} />
                </button>
                <div className="gl-dropdown">
                  <div className="gl-dropdown-header">
                    <h4>{lang === 'fr' ? 'Bonjour' : 'Hi'}, {user?.name || 'user'}</h4>
                  </div>
                  <Link to="/restaurant/dashboard" className="gl-dropdown-item">{lang === 'fr' ? 'Commandes' : 'Orders'}</Link>
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

      {/* ── CATEGORY BAR ── */}
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

      {/* ── MAIN LAYOUT ── */}
      <div className="gl-layout">
        <main className="gl-main">

          <FilterBar filters={filters} onChange={handleFilterChange} lang={lang} />

          <div className="gl-toolbar">
            <div className="gl-result-count" aria-live="polite">
              <strong>{total}</strong> {lang === 'fr' ? 'produits' : 'products'}
            </div>
            <div>
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
            <div className="gl-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} variant={i} />)}
            </div>
          ) : error ? (
            <div className="gl-empty">
              <p>{error}</p>
              <button onClick={() => fetchProducts(filters)} className="gl-btn-p" style={{ padding: '12px 28px', fontSize: 10 }}>
                {lang === 'fr' ? 'Réessayer' : 'Retry'}
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="gl-empty">
              <Package size={36} color="var(--text-low)" style={{ marginBottom: 18 }} />
              <h3>{emptyReason}</h3>
              <p>{emptyHint}</p>
              <button onClick={resetFilters} className="gl-btn-g" style={{ padding: '12px 28px', fontSize: 10 }}>
                {lang === 'fr' ? 'Réinitialiser' : 'Reset filters'}
              </button>
            </div>
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
                  <button className="gl-page-btn" disabled={filters.page <= 1} aria-label={lang === 'fr' ? 'Page précédente' : 'Previous page'}
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