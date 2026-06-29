import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, ShoppingCart, Package, Truck, Users,
  BarChart2, FileText, Settings, Sun, Moon, Globe,
  LogOut, Bell, ChevronRight, Menu, X
} from 'lucide-react';

const THEMES_CSS = {
  dark: {
    '--db-sidebar':     '#0c0e16',
    '--db-sidebar-b':   '#171a27',
    '--db-topbar':      '#0f1219',
    '--db-card':        '#141720',
    '--db-card-b':      '#1e2235',
    '--db-page':        '#0a0c13',
    '--db-text':        '#dde3f2',
    '--db-muted':       '#6b7494',
    '--db-low':         '#363c58',
    '--db-accent':      '#a8f070',
    '--db-accent-dim':  'rgba(168,240,112,0.10)',
    '--db-accent-b':    'rgba(168,240,112,0.22)',
    '--db-purple':      '#8b5cf6',
    '--db-purple-dim':  'rgba(139,92,246,0.12)',
    '--db-blue':        '#3b82f6',
    '--db-blue-dim':    'rgba(59,130,246,0.10)',
    '--db-amber':       '#f59e0b',
    '--db-amber-dim':   'rgba(245,158,11,0.10)',
    '--db-red':         '#ef4444',
    '--db-red-dim':     'rgba(239,68,68,0.10)',
    '--db-teal':        '#2dd4bf',
    '--db-teal-dim':    'rgba(45,212,191,0.10)',
  },
  light: {
    '--db-sidebar':     '#ffffff',
    '--db-sidebar-b':   '#f4f5f9',
    '--db-topbar':      '#ffffff',
    '--db-card':        '#ffffff',
    '--db-card-b':      '#e8eaf2',
    '--db-page':        '#f0f2f8',
    '--db-text':        '#1a1d2e',
    '--db-muted':       '#6b7494',
    '--db-low':         '#9ca3c0',
    '--db-accent':      '#3d8c1a',
    '--db-accent-dim':  'rgba(61,140,26,0.08)',
    '--db-accent-b':    'rgba(61,140,26,0.20)',
    '--db-purple':      '#7c3aed',
    '--db-purple-dim':  'rgba(124,58,237,0.08)',
    '--db-blue':        '#2563eb',
    '--db-blue-dim':    'rgba(37,99,235,0.08)',
    '--db-amber':       '#d97706',
    '--db-amber-dim':   'rgba(217,119,6,0.08)',
    '--db-red':         '#dc2626',
    '--db-red-dim':     'rgba(220,38,38,0.08)',
    '--db-teal':        '#0d9488',
    '--db-teal-dim':    'rgba(13,148,136,0.08)',
  }
};

import Logo from './components/Logo';

const NAV_RESTAURANT = [
  { section: 'Principal' },
  { to: '/restaurant/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/restaurant/commandes',  icon: ShoppingCart,    label: 'Commandes',   badge: '14' },
  { to: '/restaurant/catalogue',  icon: Package,         label: 'Catalogue' },
  { to: '/restaurant/livraisons', icon: Truck,           label: 'Livraisons' },
  { section: 'Gestion' },
  { to: '/restaurant/fournisseurs', icon: Users,      label: 'Fournisseurs' },
  { to: '/restaurant/analytique',   icon: BarChart2,  label: 'Analytique' },
  { to: '/restaurant/facturation',  icon: FileText,   label: 'Facturation' },
  { section: 'Compte' },
  { to: '/restaurant/parametres',   icon: Settings,   label: 'Paramètres' },
];

const NAV_FOURNISSEUR = [
  { section: 'Principal' },
  { to: '/fournisseur/dashboard',  icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/fournisseur/commandes',  icon: ShoppingCart,    label: 'Commandes',   badge: '7' },
  { to: '/fournisseur/produits',   icon: Package,         label: 'Produits' },
  { to: '/fournisseur/livraisons', icon: Truck,           label: 'Livraisons' },
  { section: 'Réseau' },
  { to: '/fournisseur/clients',    icon: Users,      label: 'Restaurants' },
  { to: '/fournisseur/analytique', icon: BarChart2,  label: 'Analytique' },
  { to: '/fournisseur/revenus',    icon: FileText,   label: 'Revenus' },
  { section: 'Compte' },
  { to: '/fournisseur/parametres', icon: Settings,   label: 'Paramètres' },
];

const STYLE_ID = 'db-layout-styles';

export const DashboardLayout = ({ children, role = 'restaurant' }) => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const nav = role === 'fournisseur' ? NAV_FOURNISSEUR : NAV_RESTAURANT;
  const cssVars = THEMES_CSS[theme] || THEMES_CSS.dark;

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : (role === 'restaurant' ? 'RS' : 'FN');

  // ── Inject styles into a named <style> tag and REMOVE on unmount ──────────
  useEffect(() => {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .db-shell {
        ${Object.entries(cssVars).map(([k,v]) => `${k}: ${v};`).join(' ')}
        display: flex; height: 100vh; overflow: hidden;
        background: var(--db-page); font-family: 'DM Mono', monospace;
        transition: background 0.3s, color 0.3s;
      }

      /* ── SIDEBAR ── */
      .db-sidebar {
        width: ${sidebarOpen ? '220px' : '0px'};
        min-width: ${sidebarOpen ? '220px' : '0px'};
        background: var(--db-sidebar);
        border-right: 1px solid var(--db-card-b);
        display: flex; flex-direction: column;
        transition: width 0.25s cubic-bezier(.4,0,.2,1), min-width 0.25s cubic-bezier(.4,0,.2,1);
        overflow: hidden;
      }
      .db-sb-logo {
        padding: 18px 16px 14px;
        border-bottom: 1px solid var(--db-card-b);
        display: flex; align-items: center; gap: 9px;
        opacity: ${mounted ? 1 : 0};
        transform: translateY(${mounted ? '0' : '-8px'});
        transition: opacity 0.4s 0.05s, transform 0.4s 0.05s;
      }
      .db-nav { padding: 10px 0; flex: 1; overflow-y: auto; overflow-x: hidden; }
      .db-nav::-webkit-scrollbar { width: 3px; }
      .db-nav::-webkit-scrollbar-thumb { background: var(--db-low); border-radius: 3px; }
      .db-section {
        padding: 12px 16px 4px;
        font-size: 8.5px; color: var(--db-low);
        letter-spacing: 0.24em; text-transform: uppercase;
        white-space: nowrap;
      }
      .db-navitem {
        display: flex; align-items: center; gap: 9px;
        padding: 9px 12px; margin: 1px 8px; border-radius: 6px;
        color: var(--db-muted); font-size: 11px; letter-spacing: 0.06em;
        text-decoration: none; white-space: nowrap;
        transition: background 0.15s, color 0.15s, transform 0.15s;
        position: relative; cursor: pointer;
      }
      .db-navitem:hover { background: rgba(255,255,255,0.04); color: var(--db-text); transform: translateX(2px); }
      .db-navitem.active {
        background: var(--db-accent-dim); color: var(--db-accent);
        border: 1px solid var(--db-accent-b);
      }
      .db-navitem svg { flex-shrink: 0; opacity: 0.8; }
      .db-navitem.active svg { opacity: 1; }
      .db-badge {
        margin-left: auto; background: var(--db-accent-dim);
        color: var(--db-accent); font-size: 8px; padding: 2px 7px;
        border-radius: 10px; letter-spacing: 0.06em;
        border: 1px solid var(--db-accent-b);
      }
      .db-sb-avatar {
        padding: 12px 16px; border-top: 1px solid var(--db-card-b);
        display: flex; align-items: center; gap: 9px; cursor: pointer;
        transition: background 0.15s;
      }
      .db-sb-avatar:hover { background: rgba(255,255,255,0.03); }
      .db-av-circle {
        width: 32px; height: 32px; border-radius: 50%;
        background: var(--db-purple-dim); border: 1px solid rgba(139,92,246,0.3);
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; color: var(--db-purple); font-weight: 500; flex-shrink: 0;
      }
      .db-av-name { font-size: 11px; color: var(--db-text); letter-spacing: 0.04em; }
      .db-av-role { font-size: 8.5px; color: var(--db-low); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }

      /* ── MAIN ── */
      .db-main { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
      .db-topbar {
        background: var(--db-topbar); border-bottom: 1px solid var(--db-card-b);
        padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;
        flex-shrink: 0; gap: 16px;
      }
      .db-topbar-left { display: flex; align-items: center; gap: 12px; }
      .db-topbar-right { display: flex; align-items: center; gap: 8px; }
      .db-menu-btn {
        background: transparent; border: 1px solid var(--db-card-b);
        color: var(--db-muted); padding: 6px 8px; border-radius: 5px; cursor: pointer;
        display: flex; align-items: center; transition: all 0.15s;
      }
      .db-menu-btn:hover { border-color: var(--db-accent-b); color: var(--db-accent); }
      .db-topbar-title { font-size: 15px; color: var(--db-text); letter-spacing: 0.04em; }
      .db-topbar-sub { font-size: 9px; color: var(--db-muted); letter-spacing: 0.14em; text-transform: uppercase; }
      .db-icon-btn {
        background: transparent; border: 1px solid var(--db-card-b);
        color: var(--db-muted); padding: 6px 11px; border-radius: 5px; cursor: pointer;
        font-family: 'DM Mono', monospace; font-size: 9.5px;
        letter-spacing: 0.12em; text-transform: uppercase;
        display: inline-flex; align-items: center; gap: 5px;
        transition: all 0.15s;
      }
      .db-icon-btn:hover { border-color: var(--db-accent-b); color: var(--db-accent); }
      .db-notif-btn {
        background: transparent; border: 1px solid var(--db-card-b);
        color: var(--db-muted); padding: 6px 8px; border-radius: 5px; cursor: pointer;
        display: flex; align-items: center; position: relative; transition: all 0.15s;
      }
      .db-notif-btn:hover { border-color: var(--db-accent-b); color: var(--db-accent); }
      .db-notif-dot {
        position: absolute; top: 5px; right: 5px; width: 6px; height: 6px;
        border-radius: 50%; background: var(--db-accent);
      }
      .db-logout-btn {
        background: transparent; border: 1px solid var(--db-card-b);
        color: var(--db-muted); padding: 6px 8px; border-radius: 5px; cursor: pointer;
        display: flex; align-items: center; transition: all 0.15s;
      }
      .db-logout-btn:hover { border-color: var(--db-red-dim); color: var(--db-red); }

      /* ── CONTENT ── */
      .db-content {
        flex: 1; overflow-y: auto; padding: 20px 24px;
        display: flex; flex-direction: column; gap: 16px;
        background: var(--db-page);
      }
      .db-content::-webkit-scrollbar { width: 4px; }
      .db-content::-webkit-scrollbar-thumb { background: var(--db-low); border-radius: 4px; }

      /* ── CARDS ── */
      .db-card {
        background: var(--db-card); border: 1px solid var(--db-card-b);
        border-radius: 10px; padding: 16px 18px;
        opacity: ${mounted ? 1 : 0};
        transform: translateY(${mounted ? '0' : '12px'});
        transition: opacity 0.4s, transform 0.4s;
      }
      .db-card:hover { border-color: var(--db-accent-b); transition: border-color 0.2s; }
      .db-card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
      .db-card-title { font-size: 11px; color: var(--db-text); letter-spacing: 0.08em; text-transform: uppercase; }
      .db-card-sub { font-size: 9px; color: var(--db-muted); letter-spacing: 0.08em; margin-top: 3px; }
      .db-card-action {
        font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.12em;
        text-transform: uppercase; background: transparent;
        border: 1px solid var(--db-card-b); color: var(--db-muted);
        padding: 5px 10px; border-radius: 4px; cursor: pointer; transition: all 0.15s;
        display: flex; align-items: center; gap: 4px;
      }
      .db-card-action:hover { border-color: var(--db-accent-b); color: var(--db-accent); }

      /* ── STAT CARDS ── */
      .db-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
      @media (max-width: 1100px) { .db-stat-grid { grid-template-columns: repeat(2, 1fr); } }
      .db-stat-card {
        background: var(--db-card); border: 1px solid var(--db-card-b);
        border-radius: 10px; padding: 16px 18px;
        position: relative; overflow: hidden;
        opacity: ${mounted ? 1 : 0};
        transform: translateY(${mounted ? '0' : '14px'});
        transition: opacity 0.4s, transform 0.4s, border-color 0.2s;
      }
      .db-stat-card:hover { border-color: var(--db-accent-b); }
      .db-stat-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; border-radius: 10px 10px 0 0; }
      .db-stat-label { font-size: 9px; color: var(--db-muted); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 10px; }
      .db-stat-val { font-size: 24px; color: var(--db-text); letter-spacing: -0.02em; font-weight: 400; margin-bottom: 6px; }
      .db-stat-delta { font-size: 9.5px; letter-spacing: 0.08em; display: flex; align-items: center; gap: 4px; }
      .db-stat-icon { position: absolute; top: 16px; right: 16px; opacity: 0.25; }

      /* ── TABLE ── */
      .db-table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
      .db-table th { font-size: 8.5px; color: var(--db-low); letter-spacing: 0.18em; text-transform: uppercase; padding: 7px 12px; text-align: left; border-bottom: 1px solid var(--db-card-b); font-weight: 400; }
      .db-table td { padding: 11px 12px; border-bottom: 1px solid rgba(30,34,53,0.5); color: var(--db-muted); vertical-align: middle; }
      .db-table tr:last-child td { border-bottom: none; }
      .db-table tr:hover td { background: rgba(255,255,255,0.02); color: var(--db-text); }

      /* ── PILLS ── */
      .db-pill { display: inline-flex; align-items: center; font-size: 8px; padding: 3px 9px; border-radius: 10px; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Mono', monospace; }
      .db-pill-live    { background: var(--db-accent-dim); color: var(--db-accent); border: 1px solid var(--db-accent-b); }
      .db-pill-pending { background: var(--db-amber-dim);  color: var(--db-amber);  border: 1px solid rgba(245,158,11,0.25); }
      .db-pill-done    { background: var(--db-blue-dim);   color: var(--db-blue);   border: 1px solid rgba(59,130,246,0.25); }
      .db-pill-cancel  { background: var(--db-red-dim);    color: var(--db-red);    border: 1px solid rgba(239,68,68,0.25); }

      /* ── PROGRESS ── */
      .db-prog-wrap { width: 72px; height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
      .db-prog-fill { height: 3px; border-radius: 2px; background: var(--db-accent); transition: width 0.6s ease; }

      /* ── GRID LAYOUTS ── */
      .db-mid-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; }
      .db-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      @media (max-width: 1000px) { .db-mid-grid, .db-bottom-grid { grid-template-columns: 1fr; } }

      /* ── ACTIVITY ── */
      .db-activity-item { display: flex; align-items: flex-start; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--db-card-b); }
      .db-activity-item:last-child { border-bottom: none; }
      .db-act-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
      .db-act-text { font-size: 10.5px; color: var(--db-muted); line-height: 1.5; flex: 1; }
      .db-act-text strong { color: var(--db-text); font-weight: 400; }
      .db-act-time { font-size: 9px; color: var(--db-low); letter-spacing: 0.08em; margin-top: 2px; }

      /* ── SUPPLIERS ── */
      .db-sup-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--db-card-b); }
      .db-sup-row:last-child { border-bottom: none; }
      .db-sup-av { width: 28px; height: 28px; border-radius: 6px; background: var(--db-accent-dim); border: 1px solid var(--db-accent-b); display: flex; align-items: center; justify-content: center; font-size: 9.5px; color: var(--db-accent); flex-shrink: 0; letter-spacing: 0.04em; }
      .db-sup-name { font-size: 10.5px; color: var(--db-text); }
      .db-sup-city { font-size: 9px; color: var(--db-low); }
      .db-sup-amt { margin-left: auto; font-size: 10.5px; color: var(--db-accent); text-align: right; }

      @keyframes fadeUp { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
      .db-animate { animation: fadeUp 0.4s ease forwards; }

      /* ── RESPONSIVE ── */
      @media (max-width: 768px) {
        .db-sidebar {
          position: fixed !important;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          width: ${sidebarOpen ? '260px' : '0px'} !important;
          min-width: ${sidebarOpen ? '260px' : '0px'} !important;
          box-shadow: ${sidebarOpen ? '4px 0 24px rgba(0,0,0,0.5)' : 'none'};
        }
        .db-sidebar-backdrop {
          display: ${sidebarOpen ? 'block' : 'none'};
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(0,0,0,0.5);
        }
        .db-topbar { padding: 10px 14px !important; }
        .db-content { padding: 14px !important; }
        .db-stat-grid { grid-template-columns: 1fr !important; }
        .db-mid-grid, .db-bottom-grid { grid-template-columns: 1fr !important; }
        .db-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .db-table { min-width: 600px; }
        .db-topbar-title { font-size: 13px !important; }
        .db-topbar-sub { font-size: 8px !important; }
        .db-icon-btn span { display: none; }
      }
      @media (max-width: 480px) {
        .db-stat-val { font-size: 20px !important; }
        .db-card { padding: 12px !important; }
      }
    `;

    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;

    // Clean up on unmount so styles don't leak to other pages
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, [theme, sidebarOpen, mounted]);

  return (
    <div className="db-shell">
      {/* MOBILE BACKDROP */}
      <div className="db-sidebar-backdrop" onClick={() => setSidebarOpen(false)} style={{ display: 'none' }} />

      {/* SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-sb-logo">
          <Logo />
        </div>
        <nav className="db-nav">
          {nav.map((item, i) => {
            if (item.section) return (
              <div key={i} className="db-section">{item.section}</div>
            );
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={i} to={item.to} className={`db-navitem${isActive ? ' active' : ''}`}
                style={{ animationDelay: `${i * 30}ms` }}>
                <Icon size={14} />
                {item.label}
                {item.badge && <span className="db-badge">{item.badge}</span>}
                {isActive && <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
              </Link>
            );
          })}
        </nav>
        <div className="db-sb-avatar" onClick={handleLogout} title="Déconnexion">
          <div className="db-av-circle">{initials}</div>
          <div>
            <div className="db-av-name">{user?.name || 'Utilisateur'}</div>
            <div className="db-av-role">{user?.company_name || (role === 'restaurant' ? 'Restaurant' : 'Fournisseur')}</div>
          </div>
          <LogOut size={12} style={{ marginLeft: 'auto', color: 'var(--db-low)' }} />
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="db-main">
        {/* TOPBAR */}
        <div className="db-topbar">
          <div className="db-topbar-left">
            <button className="db-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
            <div>
              <div className="db-topbar-sub">{role === 'restaurant' ? 'Restaurant' : 'Fournisseur'} · {user?.city || 'Casablanca'}</div>
              <div className="db-topbar-title">Tableau de bord</div>
            </div>
          </div>
          <div className="db-topbar-right">
            <button className="db-icon-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              {theme === 'dark' ? 'Day' : 'Night'}
            </button>
            <button className="db-icon-btn" onClick={toggleLang}>
              <Globe size={12} />
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button className="db-notif-btn">
              <Bell size={14} />
              <span className="db-notif-dot" />
            </button>
            <button className="db-logout-btn" onClick={handleLogout}>
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="db-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;