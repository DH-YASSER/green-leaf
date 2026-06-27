import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { MapPin, Star, ShoppingCart, Check } from 'lucide-react';

// ─── IMAGE MAP ────────────────────────────────────────────────────────────
// Strip accents so "bœuf"/"boeuf", "épice"/"epice" etc. all match the same
// rule, and prefer an image the backend already gives us before falling
// back to keyword guessing.
const normalize = (s = '') =>
  s.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae');

const NAME_IMAGE_RULES = [
  
];

const CATEGORY_IMAGE_RULES = {
  legumes:  'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&w=600',
  viandes:  'https://imgs.search.brave.com/YQChv8WZKKcmRIhZ5-VnDB9MNYq3EFIERJ2YwjPq1LM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/YXRsYW50ZXJyYS5m/ci9tZWRpYS9jYXRh/bG9nL3Byb2R1Y3Qv/Y2FjaGUvNTdkYTU3/ZDFiMTcwNDYyN2Fi/NzNhNjQyZTliYWUy/MTIvNC85LzQ5MzAw/NC0wMDU1MDIwMC00/NDE4LVN0ZWFrLWhh/Y2hlLWRlLWJvZXVm/LTE1LS1tZy5qcGc',
  boissons: 'https://images.pexels.com/photos/2122294/pexels-photo-2122294.jpeg?auto=compress&w=600',
  epices:   'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&w=600',
  secs:     'https://imgs.search.brave.com/Ah_jrT0e8gb5EYcYZHXDEoCP_rSEClI7HHctS746tTI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3RpL3Bob3Rv/cy1ncmF0dWl0ZS90/Mi8yMjY3MzY4MS1y/aXotc3VyLWZvbmQt/bm9pci1waG90by5q/cGc',
};

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&w=600';

const getProductImage = (product) => {
  // 1) Trust a real image from the backend/catalog data first.
  if (product.image) return product.image;
  if (Array.isArray(product.images) && product.images[0]) return product.images[0];

  // 2) Otherwise guess from the product name.
  const name = normalize(product.name);
  for (const [keywords, url] of NAME_IMAGE_RULES) {
    if (keywords.some(k => name.includes(k))) return url;
  }

  // 3) Otherwise guess from the category.
  const cat = normalize(product.category);
  if (CATEGORY_IMAGE_RULES[cat]) return CATEGORY_IMAGE_RULES[cat];

  // 4) Generic fallback — better than a mismatched photo.
  return FALLBACK_IMAGE;
};

// ─── FOURNISSEUR CARD ─────────────────────────────────────────────────────
const FournisseurCard = ({ product, fournisseur, onCartAdd }) => {
  const addToCart = useCartStore(s => s.addToCart);
  const cartItems = useCartStore(s => s.items);
  const isInCart = cartItems.some(i => i.product_id === product.id);
  const [added, setAdded] = useState(false);

  const imageUrl = getProductImage(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, image: imageUrl }, fournisseur, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    if (onCartAdd) onCartAdd(e);
  };

  const formatPrice = (n) => Number(n).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const priceRange = product.price_min && product.price_max
    ? `${formatPrice(product.price_min)} – ${formatPrice(product.price_max)} MAD / ${product.unit || 'Kg'}`
    : `${formatPrice(product.price || 0)} MAD / ${product.unit || 'Kg'}`;

  return (
    <Link
      to={`/supplier/${fournisseur.id}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 14,
          display: 'flex', flexDirection: 'column', height: '100%',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          overflow: 'hidden',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'var(--img-filter)', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1.0)'; }}
            onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
          />

          {/* Promo tag */}
          {product.has_active_promo && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: '#FFB74D', color: '#1A1A1A',
              fontSize: 11, fontWeight: 700, borderRadius: 8,
              padding: '4px 9px', pointerEvents: 'none',
            }}>
              -{product.promo_discount}%
            </div>
          )}

          {/* Category tag */}
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            fontSize: 11, fontWeight: 600, color: 'var(--text-1)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '4px 10px',
            pointerEvents: 'none',
          }}>
            {product.category || 'Légumes'}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* City */}
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} /> {fournisseur.city || 'Maroc'}
          </p>

          {/* Product name */}
          <h3 style={{
            fontFamily: 'Inter, sans-serif', fontWeight: 700,
            fontSize: 16, color: 'var(--text-1)',
            letterSpacing: '-0.2px', lineHeight: 1.25, marginBottom: 6,
          }}>
            {product.name}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 16, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.description || 'Ingrédient de qualité supérieure — producteurs marocains.'}
          </p>

          {/* Stats row */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-3)', display: 'block', marginBottom: 3 }}>Prix unitaire</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{priceRange}</span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-3)', display: 'block', marginBottom: 3 }}>Note</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#E8A23D', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Star size={12} fill="#E8A23D" strokeWidth={0} /> {fournisseur.avg_rating || '—'}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-3)', display: 'block', marginBottom: 3 }}>Fournisseur</span>
              <span style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{fournisseur.company_name}</span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-3)', display: 'block', marginBottom: 3 }}>Stock</span>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{product.stock} {product.unit || 'Kg'}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%', borderRadius: 10, padding: '11px 0',
              background: added ? 'var(--subtle)' : 'var(--accent)',
              border: `1.5px solid ${added ? 'var(--accent)' : 'var(--accent)'}`,
              color: added ? 'var(--accent)' : 'var(--accent-text)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!added) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { if (!added) e.currentTarget.style.opacity = '1'; }}
          >
            {added ? <><Check size={14} /> Ajouté au panier</> : <><ShoppingCart size={14} /> {isInCart ? 'Ajouter encore' : 'Commander'}</>}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FournisseurCard;