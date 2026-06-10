import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import VerifiedBadge from './VerifiedBadge';
import PromoTag from './PromoTag';

const FournisseurCard = ({ product, fournisseur }) => {
  const priceRange = product.price_min && product.price_max
    ? `${product.price_min} - ${product.price_max} MAD / ${product.unit || ''}`
    : `${product.price} MAD / ${product.unit || ''}`;

  return (
    <Link
      to={`/fournisseur/${fournisseur.id}`}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-luxury transition-all duration-300
                 border border-slate-100 hover:border-brand-accent/50
                 overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 flex flex-col justify-between flex-grow">
        {/* Product image placeholder with organic green gradients */}
        <div className="relative aspect-video w-full rounded-2xl mb-4 bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/5 to-brand-saffron/5 pointer-events-none"></div>
          <LeafIcon className="w-8 h-8 text-brand-secondary/20" />
          
          {/* Promo tag with rotation */}
          {product.has_active_promo && (
            <PromoTag discount={product.promo_discount} className="absolute top-2 right-2 scale-90" />
          )}
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest bg-brand-accent/10 px-2.5 py-1 rounded-lg">
              {product.category || 'Légumes'}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              📍 {fournisseur.city || 'Maroc'}
            </span>
          </div>

          <h3 className="text-base font-black text-brand-primary line-clamp-1 group-hover:text-brand-accent transition-colors duration-300">
            {product.name}
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || 'Ingrédient de qualité supérieure issu de producteurs marocains.'}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price / Prix</span>
              <span className="text-sm font-black text-brand-primary">{priceRange}</span>
            </div>
            {fournisseur.is_verified && (
              <span className="text-[9px] font-black text-brand-secondary bg-brand-accent/10 rounded-full px-2 py-0.5">
                VERIFIED
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{fournisseur.company_name}</span>
            <div className="flex items-center gap-1">
              <span className="text-brand-saffron">★</span>
              <span className="text-slate-600 font-bold">{fournisseur.avg_rating || 'N/A'}</span>
            </div>
          </div>

          <button
            className="w-full flex items-center justify-center py-3 bg-slate-50 group-hover:bg-brand-primary text-slate-600 group-hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 gap-2 border border-slate-100 group-hover:border-brand-primary"
          >
            Order / Commander
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
    <path d="M9 22v-4" />
  </svg>
);

export default FournisseurCard;
