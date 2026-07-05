import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import {
  Sun, Moon, Globe, ShoppingCart, ArrowRight,
  ChevronDown, ClipboardList, User, LogOut, Settings,
} from 'lucide-react';

/**
 * Shared top nav. Renders across the buyer app now that there is no more
 * sidebar dashboard for buyers — the catalog (/browse) *is* the buyer's
 * dashboard, and this bar is what carries Cart / Orders / Account.
 *
 * Suppliers and admins are unaffected: they still get the "Dashboard" link
 * pointing at their respective consoles.
 */
const Navbar = ({ theme, onTheme, lang, onLang, scrolled = true, cartRef, cartBump }) => {
  const totalItems = useCartStore(s => s.totalItems());
  const { isAuthenticated, user, logout } = useAuthStore();
  const role = user?.role?.toLowerCase() || '';
  const isBuyer = isAuthenticated && role === 'restaurant';

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const onClick = e => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const getDashboardPath = () => {
    if (role === 'admin') return '/gl/c0ns0le';
    if (role === 'fournisseur') return '/fournisseur/dashboard';
    return '/browse';
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
            <Link to="/browse" className="bp-nav-link">{lang === 'fr' ? 'Catalogue' : 'Catalog'}</Link>

            {!isAuthenticated && (
              <Link to="/login" className="bp-nav-link">{lang === 'fr' ? 'Connexion' : 'Sign in'}</Link>
            )}

            {isAuthenticated && !isBuyer && (
              <Link to={getDashboardPath()} className="bp-nav-link" style={{ color: 'var(--accent)' }}>
                {lang === 'fr' ? 'Mon espace' : 'Dashboard'}
              </Link>
            )}

            {isBuyer && (
              <Link to="/orders" className="bp-nav-link">
                {lang === 'fr' ? 'Commandes' : 'Orders'}
              </Link>
            )}

            {/* Cart icon — visible to everyone, doubles as the "Buy" entry point */}
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

            {/* Account dropdown — buyer only */}
            {isBuyer && (
              <div ref={accountRef} style={{ position: 'relative' }}>
                <button
                  className="bp-icon-btn wide"
                  onClick={() => setAccountOpen(o => !o)}
                  style={{ gap: 6 }}
                >
                  <User size={14} />
                  {(user?.name || (lang === 'fr' ? 'Compte' : 'Account')).split(' ')[0]}
                  <ChevronDown size={12} style={{ transform: accountOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
                </button>

                {accountOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 190,
                    background: 'var(--surface, var(--bg2))', border: '1.5px solid var(--border-strong, var(--border2))',
                    borderRadius: 12, boxShadow: '0 24px 64px rgba(0,0,0,0.25)', overflow: 'hidden', zIndex: 60,
                  }}>
                    <Link to="/orders" className="bp-nav-link" onClick={() => setAccountOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' }}>
                      <ClipboardList size={14} /> {lang === 'fr' ? 'Commandes' : 'Orders'}
                    </Link>
                    <Link to="/account" className="bp-nav-link" onClick={() => setAccountOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' }}>
                      <Settings size={14} /> {lang === 'fr' ? 'Paramètres du compte' : 'Account settings'}
                    </Link>
                    <button
                      onClick={() => { setAccountOpen(false); logout(); }}
                      className="bp-nav-link"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', width: '100%',
                        background: 'none', border: 'none', borderTop: '1px solid var(--border)',
                        cursor: 'pointer', textAlign: 'left', color: 'var(--danger-text, var(--danger))',
                      }}
                    >
                      <LogOut size={14} /> {lang === 'fr' ? 'Déconnexion' : 'Log out'}
                    </button>
                  </div>
                )}
              </div>
            )}

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

export default Navbar;