import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Camera, AlertCircle, Search, ShoppingCart, Bell, User } from 'lucide-react';

/**
 * FAIRE-STYLE ACCOUNT / SETTINGS PAGE
 */

const REGIONS = ['Casablanca-Settat', 'Souss-Massa', 'Marrakech-Safi', 'Fès-Meknès', 'Tanger-Tétouan-Al Hoceïma', 'Rabat-Salé-Kénitra', 'Oriental', 'Béni Mellal-Khénifra', 'Drâa-Tafilalet', 'Guelmim-Oued Noun'];
const MAX_AVATAR_MB = 5;
const MIN_PWD_LEN = 8;

const EMPTY_INFO = { business_name: '', contact_name: '', email: '', phone: '', address: '', region: '', bio: '' };
const EMPTY_PWD = { current: '', newPwd: '', confirm: '' };
const DEFAULT_NOTIFS = { order_updates: true, messages: true, promos: false, weekly: true };

// ── Styles ─────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #FFFFFF; color: #1a1a1a; font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

    /* Top Nav (matches Browse.jsx) */
    .faire-nav { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid #e8e8e8; }
    .faire-nav-inner { max-width: 1440px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; height: 64px; gap: 24px; }
    .faire-logo { font-size: 22px; font-weight: 800; letter-spacing: -0.6px; color: #1a1a1a; text-decoration: none; flex-shrink: 0; }
    .faire-logo span { color: #2D9B4F; }
    .faire-search-wrap { flex: 1; max-width: 560px; position: relative; }
    .faire-search { width: 100%; height: 42px; border: 1.5px solid #d4d4d4; border-radius: 24px; padding: 0 16px 0 42px; font-size: 14px; color: #1a1a1a; background: #f7f7f7; outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif; }
    .faire-search:focus { border-color: #2D9B4F; background: #fff; box-shadow: 0 0 0 3px rgba(45,155,79,0.08); }
    .faire-nav-actions { display: flex; align-items: center; gap: 20px; margin-left: auto; }
    .faire-nav-btn { height: 40px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #555; transition: color 0.15s; position: relative; text-decoration: none; }
    .faire-nav-btn:hover { color: #1a1a1a; }
    .faire-cart-count { position: absolute; top: -6px; right: -10px; background: #2D9B4F; color: #fff; font-size: 9px; font-weight: 700; width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }

    /* Layout */
    .acc-layout { max-width: 1440px; margin: 0 auto; display: flex; min-height: calc(100vh - 65px); }
    
    /* Sidebar */
    .acc-sidebar { width: 260px; border-right: 1px solid #e8e8e8; padding: 40px 0 40px 32px; flex-shrink: 0; }
    .acc-sidebar-group { margin-bottom: 32px; }
    .acc-sidebar-title { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
    .acc-nav-link { display: block; font-size: 14px; color: #555; text-decoration: none; padding: 8px 0; transition: color 0.15s; cursor: pointer; font-weight: 400; border: none; background: none; text-align: left; width: 100%; }
    .acc-nav-link:hover { color: #1a1a1a; }
    .acc-nav-link.active { color: #1a1a1a; font-weight: 600; }

    /* Main Content */
    .acc-main { flex: 1; padding: 40px 60px 80px; max-width: 860px; }
    .acc-page-title { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .acc-page-subtitle { font-size: 14px; color: #555; margin-bottom: 32px; }

    /* Forms & Inputs */
    .r-label { display: block; font-size: 13px; font-weight: 500; color: #555; margin-bottom: 6px; }
    .r-input, .r-select, .r-textarea { width: 100%; padding: 12px 14px; border: 1.5px solid #d4d4d4; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; background: #fff; transition: border-color 0.15s; outline: none; }
    .r-input:focus, .r-select:focus, .r-textarea:focus { border-color: #1a1a1a; }
    .r-input-error { border-color: #dc2626 !important; }
    .r-field { display: flex; flex-direction: column; margin-bottom: 24px; }
    
    /* Buttons */
    .r-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: background 0.15s; }
    .r-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .r-btn-dark { background: #333; color: #fff; }
    .r-btn-dark:hover:not(:disabled) { background: #1a1a1a; }
    .r-btn-outline { background: transparent; color: #1a1a1a; border: 1.5px solid #d4d4d4; }
    .r-btn-outline:hover:not(:disabled) { border-color: #1a1a1a; }

    /* Misc */
    .r-avatar-wrap { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
    .r-avatar { width: 64px; height: 64px; border-radius: 50%; background: #333; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; overflow: hidden; }
    .r-error-text { font-size: 12px; color: #dc2626; margin-top: 6px; }
    .r-saved-text { font-size: 13px; color: #16a34a; font-weight: 500; }
    .acc-table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    .acc-table th { text-align: left; padding: 16px 0; border-bottom: 1px solid #e8e8e8; font-size: 14px; font-weight: 600; color: #1a1a1a; }
    .acc-table td { padding: 20px 0; border-bottom: 1px solid #e8e8e8; font-size: 14px; color: #555; }
    
    /* Dropdown */
    .faire-dropdown-wrap { position: relative; display: flex; align-items: center; }
    .faire-dropdown { position: absolute; top: 100%; right: 0; width: 220px; background: #fff; border: 1px solid #e8e8e8; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-radius: 8px; margin-top: 14px; padding: 12px 0; opacity: 0; visibility: hidden; transform: translateY(-8px); transition: all 0.2s; z-index: 200; }
    .faire-dropdown-wrap:hover .faire-dropdown, .faire-dropdown-wrap:focus-within .faire-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
    .faire-dropdown::before { content: ''; position: absolute; top: -6px; right: 2px; width: 10px; height: 10px; background: #fff; border-top: 1px solid #e8e8e8; border-left: 1px solid #e8e8e8; transform: rotate(45deg); }
    .faire-dropdown-header { padding: 8px 20px 16px; border-bottom: 1px solid #e8e8e8; margin-bottom: 8px; }
    .faire-dropdown-header h4 { font-size: 13px; font-weight: 700; color: #1a1a1a; letter-spacing: 0.02em; margin: 0; text-transform: uppercase; }
    .faire-dropdown-item { display: block; padding: 10px 20px; font-size: 14px; color: #1a1a1a; text-decoration: none; transition: background 0.15s; background: none; border: none; width: 100%; text-align: left; cursor: pointer; }
    .faire-dropdown-item:hover { background: #f9f9f9; }
    .faire-dropdown-divider { height: 1px; background: #e8e8e8; margin: 8px 0; }
  `}</style>
);

const SaveBar = ({ savedLabel, saving, savingLabel, saveLabel, onSave, disabled }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
    <button className="r-btn r-btn-dark" onClick={onSave} disabled={saving || disabled} style={{ minWidth: 160 }}>
      {saving ? savingLabel : saveLabel}
    </button>
    {savedLabel && <span className="r-saved-text">{savedLabel}</span>}
  </div>
);

// ── PANELS ─────────────────────────────────────────────────────────────────

const InfoPanel = ({ info, setInfo, profilePic, avatarError, avatarErrorMsg, onAvatarClick, avatarRef, onAvatarChange, saving, saved, dirty, onSave, lang, user, toggleLang }) => (
  <div>
    <div className="acc-page-title">{lang === 'fr' ? 'Informations personnelles' : 'Personal information'}</div>
    
    <div className="r-avatar-wrap" style={{ marginTop: 32 }}>
      <div className="r-avatar">
        {profilePic
          ? <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (info.business_name || info.contact_name || 'U').charAt(0).toUpperCase()
        }
      </div>
      <div>
        <input ref={avatarRef} type="file" accept="image/*" onChange={onAvatarChange} style={{ display: 'none' }} />
        <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#1a1a1a', fontSize: 14, fontWeight: 500, cursor: 'pointer' }} onClick={onAvatarClick}>
          {lang === 'fr' ? 'Changer la photo de profil' : 'Change profile photo'}
        </button>
        {avatarError && <div className="r-error-text">{avatarErrorMsg}</div>}
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Prénom' : 'First name'}</label>
        <input className="r-input" value={info.contact_name?.split(' ')[0] || ''} onChange={e => {
          const parts = (info.contact_name || '').split(' ');
          parts[0] = e.target.value;
          setInfo(p => ({ ...p, contact_name: parts.join(' ').trim() }));
        }} />
      </div>
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Nom' : 'Last name'}</label>
        <input className="r-input" value={info.contact_name?.split(' ').slice(1).join(' ') || ''} onChange={e => {
          const first = (info.contact_name || '').split(' ')[0] || '';
          setInfo(p => ({ ...p, contact_name: `${first} ${e.target.value}`.trim() }));
        }} />
      </div>
      
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Numéro de téléphone portable' : 'Mobile phone number'}</label>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className="r-select" style={{ width: 90 }}><option>+212</option></select>
          <input className="r-input" value={info.phone || ''} onChange={e => setInfo(p => ({ ...p, phone: e.target.value }))} />
        </div>
      </div>
      <div className="r-field">
        {/* Placeholder to match Faire's grid layout */}
      </div>

      <div className="r-field" style={{ gridColumn: '1/-1' }}>
        <label className="r-label">{lang === 'fr' ? 'Poste' : 'Job description'}</label>
        <select className="r-select">
          <option>{lang === 'fr' ? 'Sélectionner une option' : 'Select an option'}</option>
          <option>Owner</option>
          <option>Manager</option>
          <option>Buyer</option>
        </select>
      </div>

      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Adresse e-mail du compte' : 'Account email'}</label>
        <input className="r-input" value={user?.email || info.email || ''} disabled style={{ background: '#f9f9f9', color: '#555' }} />
      </div>
    </div>

    <div className="acc-page-title" style={{ marginTop: 32, fontSize: 20 }}>{lang === 'fr' ? 'Détails de l\'entreprise' : 'Business details'}</div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', marginTop: 24 }}>
      <div className="r-field" style={{ gridColumn: '1/-1' }}>
        <label className="r-label">{lang === 'fr' ? 'Nom de l\'entreprise' : 'Business name'}</label>
        <input className="r-input" value={info.business_name || ''} onChange={e => setInfo(p => ({ ...p, business_name: e.target.value }))} />
      </div>
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Site web' : 'Website'}</label>
        <input className="r-input" placeholder="https://" value={info.website || ''} onChange={e => setInfo(p => ({ ...p, website: e.target.value }))} />
      </div>
      <div className="r-field">
        <label className="r-label">Instagram</label>
        <input className="r-input" placeholder="@" value={info.instagram || ''} onChange={e => setInfo(p => ({ ...p, instagram: e.target.value }))} />
      </div>
    </div>

    <div className="acc-page-title" style={{ marginTop: 32, fontSize: 20 }}>{lang === 'fr' ? 'Langue' : 'Language'}</div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginTop: 24 }}>
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Langue' : 'Language'}</label>
        <select className="r-select" value={lang} onChange={e => { if(e.target.value !== lang) toggleLang(); }}>
          <option value="en">English (UK)</option>
          <option value="fr">Français (FR)</option>
        </select>
      </div>
    </div>

    <SaveBar
      savedLabel={saved}
      saving={saving}
      savingLabel={lang === 'fr' ? 'Enregistrement...' : 'Saving...'}
      saveLabel={lang === 'fr' ? 'Enregistrer' : 'Save'}
      onSave={onSave}
      disabled={!dirty}
    />
  </div>
);

const SecurityPanel = ({ pwd, setPwd, pwdError, clearPwdError, saving, saved, onSave, lang }) => (
  <div>
    <div className="acc-page-title">{lang === 'fr' ? 'Sécurité et confidentialité' : 'Security & privacy'}</div>
    <div className="acc-page-subtitle">
      {lang === 'fr' ? 'Consultez vos connexions récentes et l\'activité de votre compte.' : 'Review your recent logins and account activity.'} <a href="#" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>{lang === 'fr' ? 'En savoir plus' : 'Learn more'}</a> {lang === 'fr' ? 'sur la sécurisation de votre compte.' : 'about how to secure your account.'}
    </div>
    
    <table className="acc-table" style={{ marginBottom: 40 }}>
      <thead>
        <tr>
          <th>{lang === 'fr' ? 'Événement' : 'Event'}</th>
          <th>{lang === 'fr' ? 'Date et heure' : 'Time'}</th>
          <th>{lang === 'fr' ? 'Appareil' : 'Device'}</th>
          <th>{lang === 'fr' ? 'Lieu' : 'Location'}</th>
          <th>{lang === 'fr' ? 'Détails' : 'Details'}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{lang === 'fr' ? 'Création du compte' : 'Create account'}</td>
          <td>{new Date().toLocaleDateString()}, 6:16 AM GMT+1</td>
          <td>Chrome 149 on Windows 10</td>
          <td>Rabat, Rabat-Salé-Kénitra, Morocco</td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
      <button style={{ width: 40, height: 40, border: 'none', background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed', color: '#ccc' }}>←</button>
      <button style={{ width: 40, height: 40, border: '1px solid #1a1a1a', background: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>1</button>
      <button style={{ width: 40, height: 40, border: 'none', background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed', color: '#ccc' }}>→</button>
    </div>

    <div className="acc-page-title" style={{ fontSize: 20 }}>{lang === 'fr' ? 'Confidentialité' : 'Privacy'}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
      <a href="#" style={{ color: '#1a1a1a', textDecoration: 'underline', fontSize: 14 }}>{lang === 'fr' ? 'Afficher les paramètres des cookies' : 'View cookie settings'}</a>
      <a href="#" style={{ color: '#1a1a1a', textDecoration: 'underline', fontSize: 14 }}>{lang === 'fr' ? 'Désactiver le compte' : 'Deactivate account'}</a>
    </div>

    <div className="acc-page-title" style={{ fontSize: 20, marginTop: 48, marginBottom: 16 }}>{lang === 'fr' ? 'Changer de mot de passe' : 'Change password'}</div>
    <div style={{ maxWidth: 480 }}>
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Mot de passe actuel' : 'Current password'}</label>
        <input className="r-input" type="password" value={pwd.current} onChange={e => { setPwd(p => ({ ...p, current: e.target.value })); clearPwdError(); }} />
      </div>
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Nouveau mot de passe' : 'New password'}</label>
        <input className="r-input" type="password" value={pwd.newPwd} onChange={e => { setPwd(p => ({ ...p, newPwd: e.target.value })); clearPwdError(); }} />
      </div>
      <div className="r-field">
        <label className="r-label">{lang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm password'}</label>
        <input className={`r-input${pwdError ? ' r-input-error' : ''}`} type="password" value={pwd.confirm} onChange={e => { setPwd(p => ({ ...p, confirm: e.target.value })); clearPwdError(); }} />
        {pwdError && <div className="r-error-text">{pwdError}</div>}
      </div>
      <SaveBar savedLabel={saved} saving={saving} savingLabel={lang === 'fr' ? 'Mise à jour...' : 'Updating...'} saveLabel={lang === 'fr' ? 'Mettre à jour' : 'Update password'} onSave={onSave} />
    </div>
  </div>
);

const NotifsPanel = ({ notifs, setNotifs, saving, saved, dirty, onSave, lang, user }) => {
  const [activeTab, setActiveTab] = useState('faire');
  
  return (
    <div>
      <div className="acc-page-title">{lang === 'fr' ? 'Préférences e-mail' : 'Email preferences'}</div>
      <div className="acc-page-subtitle">{lang === 'fr' ? 'Gérez vos préférences e-mail pour' : 'Manage your email preferences for'} {user?.email || 'yassirdehmani7@gmail.com'}</div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: 32 }}>
        <button 
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'faire' ? '2px solid #1a1a1a' : '2px solid transparent', fontSize: 14, fontWeight: activeTab === 'faire' ? 600 : 500, color: activeTab === 'faire' ? '#1a1a1a' : '#555', cursor: 'pointer' }}
          onClick={() => setActiveTab('faire')}
        >
          {lang === 'fr' ? 'E-mails de GreenLeaf' : 'Emails from GreenLeaf'}
        </button>
        <button 
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'brands' ? '2px solid #1a1a1a' : '2px solid transparent', fontSize: 14, fontWeight: activeTab === 'brands' ? 600 : 500, color: activeTab === 'brands' ? '#1a1a1a' : '#555', cursor: 'pointer' }}
          onClick={() => setActiveTab('brands')}
        >
          {lang === 'fr' ? 'E-mails de fournisseurs' : 'Emails from brands'}
        </button>
      </div>

      {activeTab === 'faire' ? (
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>{lang === 'fr' ? 'Promotions & offres' : 'Promotions & offers'}</div>
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '0 20px' }}>
            {[
              { key: 'flash_sales', label: lang === 'fr' ? 'Ventes flash' : 'Flash sales', sub: lang === 'fr' ? 'Mises à jour sur les lots limités.' : 'Updates on limited-time bundles.' },
              { key: 'warehouse_sales', label: lang === 'fr' ? 'Déstockages' : 'Warehouse sales', sub: lang === 'fr' ? 'Ventes d\'entrepôt sur tout le site.' : 'Updates on warehouse sales across the whole site.' },
              { key: 'brand_specials', label: lang === 'fr' ? 'Offres fournisseurs' : 'Brand specials', sub: lang === 'fr' ? 'Offres recommandées de fournisseurs.' : 'Recommended deals from brands on GreenLeaf.' },
              { key: 'promos', label: lang === 'fr' ? 'Marchés GreenLeaf' : 'GreenLeaf Markets', sub: '' },
              { key: 'free_shipping', label: lang === 'fr' ? 'Promotions livraison gratuite' : 'Free shipping promotions', sub: '' },
            ].map((item, i, arr) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{item.sub}</div>}
                </div>
                <button 
                  onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                  style={{ width: 44, height: 24, borderRadius: 12, background: notifs[item.key] ? '#1a1a1a' : '#d4d4d4', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: 2, left: notifs[item.key] ? 22 : 2, width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 0.2s' }} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginTop: 32, marginBottom: 16 }}>{lang === 'fr' ? 'Recommandations fournisseurs & produits' : 'Brand & product recommendations'}</div>
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '0 20px' }}>
            {[
              { key: 'brand_spotlights', label: lang === 'fr' ? 'Fournisseurs à la une' : 'Brand spotlights', sub: lang === 'fr' ? 'Fournisseurs populaires.' : 'Popular and trending brands we think you\'ll like.' },
              { key: 'new_brand_recs', label: lang === 'fr' ? 'Nouveaux fournisseurs' : 'New brand recommendations', sub: lang === 'fr' ? 'Nouveaux fournisseurs pour votre magasin.' : 'New brand arrivals, recommended for your shop.' },
              { key: 'new_brand_cats', label: lang === 'fr' ? 'Nouveaux fournisseurs par catégorie' : 'New brand recommendations by category', sub: lang === 'fr' ? 'Nouveaux fournisseurs dans vos catégories.' : 'New brand arrivals, in specific product categories.' },
              { key: 'new_product_recs', label: lang === 'fr' ? 'Nouveaux produits recommandés' : 'New product recommendations', sub: lang === 'fr' ? 'Nouveautés des fournisseurs que vous aimez.' : 'Fresh finds from brands you\'ve ordered from or might like.' },
              { key: 'showroom', label: lang === 'fr' ? 'Showroom' : 'Showroom', sub: '' },
            ].map((item, i, arr) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{item.sub}</div>}
                </div>
                <button 
                  onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                  style={{ width: 44, height: 24, borderRadius: 12, background: notifs[item.key] ? '#1a1a1a' : '#d4d4d4', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: 2, left: notifs[item.key] ? 22 : 2, width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 0.2s' }} />
                </button>
              </div>
            ))}
          </div>

          <SaveBar savedLabel={saved} saving={saving} savingLabel={lang === 'fr' ? 'Enregistrement...' : 'Saving...'} saveLabel={lang === 'fr' ? 'Enregistrer' : 'Save'} onSave={onSave} disabled={!dirty} />
        </div>
      ) : (
        <div style={{ fontSize: 14, color: '#555' }}>
          {lang === 'fr' ? 'Aucune préférence pour le moment.' : 'No preferences for brands yet.'}
        </div>
      )}
    </div>
  );
};

// ── PLACEHOLDERS (To match Faire screens) ──────────────────────────────────
const StoresPanel = ({ lang }) => (
  <div>
    <div className="acc-page-title">
      {lang === 'fr' ? 'Magasins' : 'Stores'}
      <button className="r-btn r-btn-dark">{lang === 'fr' ? 'Ajouter un magasin' : 'Add store'}</button>
    </div>
    <div className="acc-page-subtitle">{lang === 'fr' ? 'Gérez vos établissements' : 'Add or edit all stores that you want to order for that are part of your business.'}</div>
    <table className="acc-table">
      <thead>
        <tr>
          <th>{lang === 'fr' ? 'Nom du magasin' : 'Store name'}</th>
          <th>{lang === 'fr' ? 'Type' : 'Store type'}</th>
          <th>{lang === 'fr' ? 'Canaux' : 'Channels'}</th>
          <th>{lang === 'fr' ? 'Adresse' : 'Shipping address'}</th>
          <th>{lang === 'fr' ? 'Paiement' : 'Payment method'}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ textDecoration: 'underline', color: '#1a1a1a' }}>prideoff</td>
          <td>Book Store</td>
          <td>Online</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const TeamPanel = ({ info, lang }) => (
  <div>
    <div className="acc-page-title">
      {lang === 'fr' ? 'Équipe et permissions' : 'Team & permissions'}
      <button className="r-btn r-btn-dark">{lang === 'fr' ? 'Ajouter un membre' : 'Add team member'}</button>
    </div>
    <div className="acc-page-subtitle">{lang === 'fr' ? 'Gérez les accès' : 'Add team members and customize their permissions.'} <a href="#" style={{ color: '#1a1a1a' }}>Learn more</a></div>
    <table className="acc-table">
      <thead>
        <tr>
          <th>{lang === 'fr' ? 'Nom' : 'Name'}</th>
          <th>{lang === 'fr' ? 'E-mail' : 'Email'}</th>
          <th>{lang === 'fr' ? 'Type de compte' : 'Account type'}</th>
          <th>{lang === 'fr' ? 'Statut' : 'Status'}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1a1a1a' }}>
            <div className="r-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
              {(info.contact_name || 'U').charAt(0).toUpperCase()}
            </div>
            <span style={{ textDecoration: 'underline' }}>{info.contact_name || 'YASSIR DEHMANI'}</span>
          </td>
          <td>{info.email || 'yassirdehmani7@gmail.com'}</td>
          <td>Owner</td>
          <td><span style={{ background: '#e6f4ea', color: '#137333', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>Active</span></td>
          <td style={{ textAlign: 'right' }}><button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#555', fontSize: 14 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const PaymentPanel = ({ lang }) => (
  <div>
    <div className="acc-page-title">
      {lang === 'fr' ? 'Moyens de paiement' : 'Payment methods'}
      <button className="r-btn r-btn-dark">{lang === 'fr' ? 'Ajouter' : 'Add payment method'}</button>
    </div>
    <div className="acc-page-subtitle">{lang === 'fr' ? 'Vous serez facturé en MAD' : 'You\'ll always be charged in MAD'}</div>
  </div>
);

const ShippingPanel = ({ lang }) => (
  <div>
    <div className="acc-page-title">
      {lang === 'fr' ? 'Livraison' : 'Shipping'}
      <div>
        <button className="r-btn r-btn-outline" style={{ border: 'none', marginRight: 16 }}>{lang === 'fr' ? 'Annuler' : 'Discard Changes'}</button>
        <button className="r-btn r-btn-dark" disabled>{lang === 'fr' ? 'Enregistrer' : 'Save'}</button>
      </div>
    </div>
    <div className="acc-page-subtitle" style={{ color: '#1a1a1a', fontWeight: 600, marginBottom: 8 }}>{lang === 'fr' ? 'Transporteurs' : 'Preferred Carriers'}</div>
    <p style={{ fontSize: 14, color: '#555', marginBottom: 24, maxWidth: 600, lineHeight: 1.5 }}>
      {lang === 'fr' 
        ? 'Sélectionnez vos transporteurs préférés. L\'option la moins chère parmi votre sélection sera recommandée.' 
        : 'Select your preferred carriers for your orders on GreenLeaf. The cheapest option among your selected carriers will be recommended to brands.'}
    </p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {['Amana', 'Chronopost', 'Aramex', 'CTM Messagerie', 'Ghazala'].map(carrier => (
        <div key={carrier} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #e8e8e8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input type="checkbox" style={{ width: 16, height: 16 }} />
            <Package size={20} color="#555" />
            <span style={{ fontSize: 14, color: '#1a1a1a' }}>{carrier}</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#555', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg> 
            {lang === 'fr' ? 'Exclure' : 'Exclude Carrier'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

// ── MAIN APP ───────────────────────────────────────────────────────────────

const Account = () => {
  const { lang, toggleLang } = useAppStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore(s => s.items);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  const [activeTab, setActiveTab] = useState('profile');
  const [profilePic, setProfilePic] = useState(null);

  // Data state
  const [info, setInfo] = useState(EMPTY_INFO);
  const [savedInfo, setSavedInfo] = useState(EMPTY_INFO);
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFS);
  const [savedNotifs, setSavedNotifs] = useState(DEFAULT_NOTIFS);
  const [pwd, setPwd] = useState(EMPTY_PWD);
  const [pwdError, setPwdError] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [avatarErrorMsg, setAvatarErrorMsg] = useState('');
  
  const avatarRef = useRef();
  const savedTimer = useRef();

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/restaurant/profile');
      const data = r.data || {};
      const nextInfo = { ...EMPTY_INFO, ...data };
      const nextNotifs = { ...DEFAULT_NOTIFS, ...(data.notifications || {}) };
      setInfo(nextInfo); setSavedInfo(nextInfo);
      setNotifs(nextNotifs); setSavedNotifs(nextNotifs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);
  useEffect(() => () => clearTimeout(savedTimer.current), []);

  const flash = msg => {
    setSaved(msg);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(''), 2800);
  };

  const infoDirty = useMemo(() => JSON.stringify(info) !== JSON.stringify(savedInfo), [info, savedInfo]);
  const notifsDirty = useMemo(() => JSON.stringify(notifs) !== JSON.stringify(savedNotifs), [notifs, savedNotifs]);

  const saveInfo = async () => {
    setSaving(true);
    try {
      await axios.put('/api/restaurant/profile', info);
      setSavedInfo(info);
      flash(lang === 'fr' ? '✓ Enregistré' : '✓ Saved');
    } catch (e) { }
    finally { setSaving(false); }
  };

  const savePwd = async () => {
    setPwdError('');
    if (!pwd.current || !pwd.newPwd || !pwd.confirm) { setPwdError(lang === 'fr' ? 'Requis' : 'Required'); return; }
    if (pwd.newPwd.length < MIN_PWD_LEN) { setPwdError(lang === 'fr' ? 'Trop court' : 'Too short'); return; }
    if (pwd.newPwd !== pwd.confirm) { setPwdError(lang === 'fr' ? 'Ne correspondent pas' : 'Mismatch'); return; }
    setSaving(true);
    try {
      await axios.put('/api/restaurant/password', { current_password: pwd.current, new_password: pwd.newPwd });
      setPwd(EMPTY_PWD);
      flash(lang === 'fr' ? '✓ Mis à jour' : '✓ Updated');
    } catch (e) { }
    finally { setSaving(false); }
  };

  const saveNotifs = async () => {
    setSaving(true);
    try {
      await axios.put('/api/restaurant/notifications', notifs);
      setSavedNotifs(notifs);
      flash(lang === 'fr' ? '✓ Enregistré' : '✓ Saved');
    } catch (e) { }
    finally { setSaving(false); }
  };

  const handleAvatar = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(false);
    if (!file.type.startsWith('image/')) { setAvatarErrorMsg('Image only'); setAvatarError(true); e.target.value = ''; return; }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) { setAvatarErrorMsg('Max 5MB'); setAvatarError(true); e.target.value = ''; return; }
    
    setProfilePic(URL.createObjectURL(file));
    const fd = new FormData(); fd.append('avatar', file);
    try {
      const r = await axios.post('/api/restaurant/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (r.data?.avatar_url) setProfilePic(r.data.avatar_url);
    } catch (err) {
      setAvatarErrorMsg('Error saving photo'); setAvatarError(true);
    } finally { e.target.value = ''; }
  };

  return (
    <>
      <GlobalStyles />
      
      {/* ── TOP NAVIGATION ── */}
      <nav className="faire-nav">
        <div className="faire-nav-inner">
          <Link to="/" className="faire-logo">Green<span>Leaf</span></Link>
          <div style={{ flex: 1, paddingLeft: 32 }}>
            <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
               {lang === 'fr' ? 'Retour aux achats' : 'Back to shopping'}
            </Link>
          </div>
          <div className="faire-nav-actions">
            <button className="faire-nav-btn" title="Notifications" style={{ padding: 0 }}>
              <Bell size={24} strokeWidth={1.2} />
            </button>
            {isAuthenticated ? (
              <div className="faire-dropdown-wrap">
                <button className="faire-nav-btn" title="Account" style={{ padding: 0 }}>
                  <User size={26} strokeWidth={1.2} />
                </button>
                <div className="faire-dropdown">
                  <div className="faire-dropdown-header">
                    <h4>{lang === 'fr' ? 'BONJOUR' : 'HI'}, {user?.name || 'USER'}</h4>
                  </div>
                  <Link to="/restaurant/dashboard" className="faire-dropdown-item">{lang === 'fr' ? 'Commandes' : 'Orders'}</Link>
                  <Link to="/restaurant/messages" className="faire-dropdown-item">{lang === 'fr' ? 'Messages' : 'Messages'}</Link>
                  <Link to="/restaurant/favorites" className="faire-dropdown-item">{lang === 'fr' ? 'Favoris' : 'Favorites'}</Link>
                  <Link to="/restaurant/settings" className="faire-dropdown-item">{lang === 'fr' ? 'Paramètres' : 'Settings'}</Link>
                  <div className="faire-dropdown-divider"></div>
                  <Link to="/help" className="faire-dropdown-item">{lang === 'fr' ? 'Centre d\'aide' : 'Help center'}</Link>
                  <div className="faire-dropdown-divider"></div>
                  <button className="faire-dropdown-item" onClick={logout}>{lang === 'fr' ? 'Déconnexion' : 'Sign out'}</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="faire-nav-btn" style={{ fontSize: 13, fontWeight: 600 }}>{lang === 'fr' ? 'Connexion' : 'Sign In'}</Link>
            )}
            <Link to="/cart" className="faire-nav-btn" title="Cart" style={{ padding: 0 }}>
              <ShoppingCart size={24} strokeWidth={1.2} />
              {cartCount > 0 && <span className="faire-cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── LAYOUT ── */}
      <div className="acc-layout">
        
        {/* Sidebar Navigation */}
        <aside className="acc-sidebar">
          <div className="acc-sidebar-group">
            <div className="acc-sidebar-title">{lang === 'fr' ? 'Paramètres' : 'Settings'}</div>
            <button className={`acc-nav-link ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>{lang === 'fr' ? 'Magasins' : 'Stores'}</button>
            <button className={`acc-nav-link ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>{lang === 'fr' ? 'Équipe et permissions' : 'Team & permissions'}</button>
            <button className={`acc-nav-link ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>{lang === 'fr' ? 'Moyens de paiement' : 'Payment methods'}</button>
            <button className={`acc-nav-link ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>{lang === 'fr' ? 'Livraison' : 'Shipping'}</button>
          </div>
          
          <div className="acc-sidebar-group">
            <div className="acc-sidebar-title">{lang === 'fr' ? 'Profil' : 'Profile'}</div>
            <button className={`acc-nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>{lang === 'fr' ? 'Profil' : 'Profile'}</button>
            <button className={`acc-nav-link ${activeTab === 'email' ? 'active' : ''}`} onClick={() => setActiveTab('email')}>{lang === 'fr' ? 'Préférences e-mail' : 'Email preferences'}</button>
            <button className={`acc-nav-link ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>{lang === 'fr' ? 'Sécurité et confidentialité' : 'Security & privacy'}</button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="acc-main">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="spin" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </svg>
            </div>
          ) : (
            <>
              {activeTab === 'stores' && <StoresPanel lang={lang} />}
              {activeTab === 'team' && <TeamPanel info={info} lang={lang} />}
              {activeTab === 'payment' && <PaymentPanel lang={lang} />}
              {activeTab === 'shipping' && <ShippingPanel lang={lang} />}
              {activeTab === 'profile' && (
                <InfoPanel 
                  info={info} setInfo={setInfo} profilePic={profilePic} 
                  avatarError={avatarError} avatarErrorMsg={avatarErrorMsg} 
                  onAvatarClick={() => avatarRef.current?.click()} avatarRef={avatarRef} onAvatarChange={handleAvatar} 
                  saving={saving} saved={saved} dirty={infoDirty} onSave={saveInfo} lang={lang} user={user} toggleLang={toggleLang}
                />
              )}
              {activeTab === 'email' && (
                <NotifsPanel 
                  notifs={notifs} setNotifs={setNotifs} 
                  saving={saving} saved={saved} dirty={notifsDirty} onSave={saveNotifs} lang={lang} user={user}
                />
              )}
              {activeTab === 'security' && (
                <SecurityPanel 
                  pwd={pwd} setPwd={setPwd} pwdError={pwdError} clearPwdError={() => setPwdError('')} 
                  saving={saving} saved={saved} onSave={savePwd} lang={lang}
                />
              )}
            </>
          )}
        </main>

      </div>
    </>
  );
};

export default Account;