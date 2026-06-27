import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAppStore } from '../store/appStore';
import {
  ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag,
  Truck, CreditCard, Check, X, ChevronLeft,
} from 'lucide-react';

// ─── THEME TOKENS (mirrors RestaurantApp's design system) ─────────────────
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
  },
};

const CartStyles = ({ theme }) => {
  const v = THEMES[theme] || THEMES.dark;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

      .cp-page {
        ${Object.entries(v).map(([k, val]) => `${k}: ${val};`).join('\n        ')}
        min-height: 100vh; background: var(--page-bg); color: var(--text-1);
        font-family: 'Inter', system-ui, sans-serif;
        transition: background 0.3s, color 0.3s;
      }
      .cp-page * { box-sizing: border-box; }
      .cp-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px; }
      .cp-label { font-size: 11px; font-weight: 600; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; }

      .cp-input, .cp-select {
        width: 100%; padding: 10px 12px; border: 1.5px solid var(--border-strong);
        border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px;
        color: var(--text-1); background: var(--input-bg); outline: none;
        transition: border-color 0.15s;
      }
      .cp-input:focus, .cp-select:focus { border-color: var(--accent); }
      .cp-input::placeholder { color: var(--text-3); }
      .cp-select { appearance: none; cursor: pointer; }

      .cp-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer;
        font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
        transition: opacity 0.15s, background 0.15s, color 0.15s, border-color 0.15s;
        white-space: nowrap;
      }
      .cp-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      .cp-btn-primary { background: var(--accent); color: var(--accent-text); width: 100%; }
      .cp-btn-primary:hover:not(:disabled) { opacity: 0.88; }
      .cp-btn-ghost {
        background: transparent; color: var(--text-2); border: 1.5px solid var(--border-strong); width: 100%;
      }
      .cp-btn-ghost:hover:not(:disabled) { background: var(--hover); color: var(--text-1); border-color: var(--accent); }
      .cp-btn-sm { padding: 8px 14px; font-size: 12px; border-radius: 8px; }

      .cp-icon-btn {
        width: 30px; height: 30px; border-radius: 8px; border: none; background: var(--subtle);
        color: var(--accent); display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: opacity 0.15s; flex-shrink: 0;
      }
      .cp-icon-btn:hover:not(:disabled) { opacity: 0.75; }
      .cp-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }

      .cp-remove-btn {
        width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border-strong);
        background: transparent; color: var(--text-3); display: flex; align-items: center;
        justify-content: center; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
      }
      .cp-remove-btn:hover { border-color: var(--danger-border); color: var(--danger-text); background: var(--danger-bg); }

      .cp-item-row {
        display: flex; align-items: center; gap: 16px; padding: 16px;
        border-radius: 12px; transition: background 0.15s;
      }
      .cp-item-row:hover { background: var(--hover); }

      .cp-thumb {
        width: 60px; height: 60px; border-radius: 10px; overflow: hidden; flex-shrink: 0;
        background: var(--surface-alt); display: flex; align-items: center; justify-content: center;
        font-size: 22px; border: 1px solid var(--border);
      }

      .cp-summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 7px 0; }
      .cp-summary-row span:first-child { color: var(--text-2); }
      .cp-summary-row span:last-child { color: var(--text-1); font-weight: 500; }

      .cp-divider { height: 1px; background: var(--border); margin: 16px 0; }

      .cp-empty {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        min-height: 70vh; gap: 18px; text-align: center; padding: 24px;
      }

      .cp-back-link {
        display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500;
        color: var(--text-2); text-decoration: none; transition: color 0.15s;
      }
      .cp-back-link:hover { color: var(--accent); }

      .cp-split-option {
        padding: 14px 16px; border-radius: 10px; cursor: pointer; transition: all 0.15s;
        border: 1.5px solid var(--border-strong); background: var(--surface);
      }
      .cp-split-option.on { border-color: var(--accent); background: var(--subtle); }

      .cp-success-banner {
        background: var(--subtle); border: 1.5px solid var(--accent); color: var(--accent);
        border-radius: 10px; padding: 16px; text-align: center; font-size: 14px; font-weight: 600;
        display: flex; align-items: center; justify-content: center; gap: 8px;
      }

      .cp-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
      }
      .cp-modal {
        background: var(--surface); border-radius: 16px; box-shadow: var(--shadow);
        width: 440px; max-width: 100%; padding: 24px; border: 1px solid var(--border);
      }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

      @media (max-width: 860px) {
        .cp-grid { grid-template-columns: 1fr !important; }
        .cp-summary-panel { position: static !important; }
      }
    `}</style>
  );
};

// ─── SPLIT PAYMENT MODAL ──────────────────────────────────────────────────
const SPLIT_OPTIONS = [
  { id: 'full',     label: 'Paiement complet',  desc: 'Une seule transaction' },
  { id: '2x',       label: 'En 2 fois',          desc: '2 versements égaux, sans frais' },
  { id: '3x',       label: 'En 3 fois',          desc: '3 versements égaux, sans frais' },
  { id: 'half_now', label: '50% maintenant',     desc: '50% à la livraison' },
];

const SplitModal = ({ total, onClose, onConfirm }) => {
  const [selected, setSelected] = useState('full');
  const fmt = n => n.toFixed(2) + ' MAD';

  const getInstallments = () => {
    if (selected === '2x')       return [total / 2, total / 2];
    if (selected === '3x')       return [total / 3, total / 3, total / 3];
    if (selected === 'half_now') return [total / 2, total / 2];
    return [total];
  };

  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} color="var(--accent)" />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Mode de paiement</span>
          </div>
          <button onClick={onClose} className="cp-icon-btn" style={{ background: 'var(--hover)', color: 'var(--text-2)' }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {SPLIT_OPTIONS.map(opt => (
            <div key={opt.id} onClick={() => setSelected(opt.id)} className={`cp-split-option${selected === opt.id ? ' on' : ''}`}>
              <div style={{ fontSize: 13, fontWeight: 600, color: selected === opt.id ? 'var(--accent)' : 'var(--text-1)', marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{opt.desc}</div>
            </div>
          ))}
        </div>

        <div className="cp-card" style={{ padding: 14, marginBottom: 18 }}>
          <div className="cp-label" style={{ marginBottom: 10 }}>Échéancier</div>
          {getInstallments().map((amt, i) => (
            <div key={i} className="cp-summary-row" style={{ borderBottom: i < getInstallments().length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span>{selected === 'half_now' ? (i === 0 ? 'Maintenant' : 'À la livraison') : `Versement ${i + 1}`}</span>
              <span style={{ color: 'var(--accent)' }}>{fmt(amt)}</span>
            </div>
          ))}
        </div>

        <button onClick={() => onConfirm(selected)} className="cp-btn cp-btn-primary">
          Confirmer — {fmt(total)}
        </button>
      </div>
    </div>
  );
};

// ─── DELIVERY OPTIONS ──────────────────────────────────────────────────────
const DELIVERY_FEES = {
  casa:   { label: 'Casablanca — Centre',    fee: 15 },
  rabat:  { label: 'Rabat — Agdal',          fee: 20 },
  fes:    { label: 'Fès — Médina',           fee: 25 },
  mek:    { label: 'Meknès — Centre-ville',  fee: 35 },
  agadir: { label: 'Agadir — Ville',         fee: 40 },
};

const PROMOS = {
  MARKEAT20: { type: 'pct',  value: 20 },
  GREENLEAF: { type: 'flat', value: 30 },
  BETA50:    { type: 'pct',  value: 50 },
};

// ─── MAIN CART ─────────────────────────────────────────────────────────────
export default function Cart() {
  const items          = useCartStore(s => s.items);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const clearCart      = useCartStore(s => s.clearCart);
  const { theme } = useAppStore();

  const [address, setAddress]     = useState('casa');
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg]   = useState(null);
  const [promoDisc, setPromoDisc] = useState(null);
  const [showSplit, setShowSplit] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [splitMode, setSplitMode] = useState(null);

  const fmt = n => Number(n).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD';

  const subtotal = items.reduce((a, i) => a + i.quantity * (i.price || 0), 0);
  const delivery = DELIVERY_FEES[address]?.fee || 15;
  const tva      = subtotal * 0.20;
  const discount = promoDisc
    ? promoDisc.type === 'pct' ? subtotal * (promoDisc.value / 100) : Math.min(promoDisc.value, subtotal)
    : 0;
  const total = Math.max(0, subtotal + delivery + tva - discount);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) { setPromoMsg({ ok: false, text: 'Entre un code valide.' }); return; }
    const found = PROMOS[code];
    if (!found) { setPromoMsg({ ok: false, text: 'Code invalide ou expiré.' }); setPromoDisc(null); return; }
    setPromoDisc(found);
    const label = found.type === 'pct' ? found.value + '%' : found.value + ' MAD';
    setPromoMsg({ ok: true, text: `Code appliqué — ${label} de réduction.` });
  };

  const handleConfirm = (mode) => {
    setSplitMode(mode);
    setShowSplit(false);
    setConfirmed(true);
  };

  const totalQty = items.reduce((a, i) => a + i.quantity, 0);

  // ── Empty state ──
  if (items.length === 0) return (
    <div className="cp-page" data-theme={theme === 'dark' ? 'dark' : 'light'}>
      <CartStyles theme={theme} />
      <div className="cp-empty">
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag size={26} color="var(--accent)" strokeWidth={1.6} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>
          Panier vide
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
          Ajoutez des produits depuis le catalogue
        </p>
        <Link to="/browse" className="cp-btn cp-btn-primary" style={{ width: 'auto', textDecoration: 'none', padding: '12px 24px' }}>
          Voir le catalogue <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="cp-page" data-theme={theme === 'dark' ? 'dark' : 'light'}>
      <CartStyles theme={theme} />

      {showSplit && <SplitModal total={total} onClose={() => setShowSplit(false)} onConfirm={handleConfirm} />}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link to="/browse" className="cp-back-link" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <ChevronLeft size={14} /> Catalogue
          </Link>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-1)' }}>
              Mon panier
            </h1>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {totalQty} article{totalQty !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="cp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: items ── */}
          <div className="cp-card" style={{ padding: 12 }}>
            {items.map((item, idx) => (
              <div key={item.productId}>
                <div className="cp-item-row">
                  {/* Image or fallback */}
                  <div className="cp-thumb">
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'var(--img-filter)' }} />
                      : '🛒'
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>
                      {item.fournisseurName} · {item.unit}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
                      {fmt(item.price)} / {item.unit}
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button className="cp-icon-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      <Minus size={13} />
                    </button>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', minWidth: 24, textAlign: 'center' }}>
                      {item.quantity}
                    </div>
                    <button className="cp-icon-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', minWidth: 80, textAlign: 'right' }}>
                    {fmt(item.price * item.quantity)}
                  </div>

                  {/* Remove */}
                  <button className="cp-remove-btn" onClick={() => removeFromCart(item.productId)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                {idx < items.length - 1 && <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />}
              </div>
            ))}

            {/* Clear cart */}
            <div style={{ padding: '12px 16px 4px' }}>
              <button onClick={clearCart} className="cp-back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12 }}>
                Vider le panier
              </button>
            </div>
          </div>

          {/* ── RIGHT: summary panel ── */}
          <div className="cp-card cp-summary-panel" style={{ padding: 20, position: 'sticky', top: 24 }}>

            {/* Delivery */}
            <div className="cp-label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Truck size={13} /> Livraison
            </div>
            <select value={address} onChange={e => setAddress(e.target.value)} className="cp-select">
              {Object.entries(DELIVERY_FEES).map(([k, v]) => (
                <option key={k} value={k}>{v.label} — {v.fee} MAD</option>
              ))}
            </select>

            <div className="cp-divider" />

            {/* Promo */}
            <div className="cp-label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag size={13} /> Code promo
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={promoCode} onChange={e => setPromoCode(e.target.value)}
                placeholder="GREENLEAF"
                onKeyDown={e => e.key === 'Enter' && applyPromo()}
                className="cp-input"
                style={{ flex: 1, textTransform: 'uppercase' }}
              />
              <button onClick={applyPromo} className="cp-btn cp-btn-primary cp-btn-sm" style={{ width: 'auto' }}>
                OK
              </button>
            </div>
            {promoMsg && (
              <div style={{ fontSize: 12, marginTop: 8, color: promoMsg.ok ? 'var(--accent)' : 'var(--danger-text)' }}>
                {promoMsg.text}
              </div>
            )}

            <div className="cp-divider" />

            {/* Summary rows */}
            <div className="cp-label" style={{ marginBottom: 6 }}>Résumé</div>
            <div className="cp-summary-row"><span>Sous-total</span><span>{fmt(subtotal)}</span></div>
            <div className="cp-summary-row"><span>Livraison</span><span>{fmt(delivery)}</span></div>
            <div className="cp-summary-row"><span>TVA (20%)</span><span>{fmt(tva)}</span></div>
            {discount > 0 && (
              <div className="cp-summary-row"><span>Réduction</span><span style={{ color: 'var(--accent)' }}>−{fmt(discount)}</span></div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, marginTop: 8, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{fmt(total)}</span>
            </div>
            {splitMode && (
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
                Mode : {SPLIT_OPTIONS.find(o => o.id === splitMode)?.label}
              </div>
            )}

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {confirmed ? (
                <div className="cp-success-banner">
                  <Check size={16} /> Commande confirmée
                </div>
              ) : (
                <>
                  <button onClick={() => setConfirmed(true)} className="cp-btn cp-btn-primary">
                    Confirmer la commande
                  </button>
                  <button onClick={() => setShowSplit(true)} className="cp-btn cp-btn-ghost">
                    <CreditCard size={15} /> Payer en plusieurs fois
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}