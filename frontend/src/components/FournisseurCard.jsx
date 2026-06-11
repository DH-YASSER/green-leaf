import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { Star, MapPin } from 'lucide-react';

// A premium curated map of products/categories to high-end Unsplash photography.
// Makes the catalogue look incredibly real and premium, avoiding default empty mock styling.
const getProductImage = (product) => {
  const name = (product.name || '').toLowerCase();
  const category = (product.category || '').toLowerCase();

  // Match by name first for maximum specificity
  if (name.includes('tomate')) {
    return 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('pomme de terre') || name.includes('patate')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('poivron')) {
    return 'https://images.unsplash.com/photo-1563513318-57457d1301fd?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('hach') || name.includes('bœuf') || name.includes('boeuf')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('poulet') || name.includes('volaille')) {
    return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('agneau')) {
    return 'https://images.unsplash.com/photo-1602491453979-54a3a4a72d3c?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('sidi ali') || name.includes('eau')) {
    return 'https://images.unsplash.com/photo-1616119129598-c923d240d046?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('coca') || name.includes('cola')) {
    return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('safran')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('tajine') || name.includes('épice') || name.includes('epice')) {
    return 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('semoule') || name.includes('couscous')) {
    return 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('riz')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop';
  }

  // Fallbacks based on category
  switch (category) {
    case 'legumes':
    case 'légumes':
      return 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=600&auto=format&fit=crop';
    case 'viandes':
      return 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=600&auto=format&fit=crop';
    case 'boissons':
      return 'https://images.unsplash.com/photo-1527960471264-93a989ef1cd4?q=80&w=600&auto=format&fit=crop';
    case 'epices':
    case 'épices':
      return 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop';
    case 'secs':
      return 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=600&auto=format&fit=crop';
    default:
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop';
  }
};

const FournisseurCard = ({ product, fournisseur }) => {
  const priceRange = product.price_min && product.price_max
    ? `${product.price_min} - ${product.price_max} MAD / ${product.unit || ''}`
    : `${product.price.toFixed(2)} MAD / ${product.unit || ''}`;

  const imageUrl = getProductImage(product);

  return (
    <Link
      to={`/supplier/${fournisseur.id}`}
      className="group bg-brand-surface border border-white/5 hover:border-brand-primary/20 transition-all duration-400 overflow-hidden flex flex-col h-full card-hover"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-video w-full bg-zinc-900 border-b border-white/5 overflow-hidden zoom-container">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover zoom-image"
          loading="lazy"
        />
        
        {/* Promotion tag */}
        {product.has_active_promo && (
          <div className="absolute top-0 right-0 bg-brand-terracotta text-white font-heading text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 z-10">
            -{product.promo_discount}% OFF
          </div>
        )}

        {/* Verified Badge */}
        {fournisseur.is_verified && (
          <div className="absolute bottom-3 left-3 bg-brand-primary text-brand-bg font-heading text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 z-10">
            VERIFIED
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          {/* Category & City */}
          <div className="flex justify-between items-center mb-3.5">
            <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.25em] bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5">
              {product.category || 'Légumes'}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-500" />
              {fournisseur.city || 'Maroc'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white group-hover:text-brand-primary transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Product Description */}
          <p className="mt-2 text-[12px] text-zinc-400 leading-relaxed line-clamp-2">
            {product.description || 'Ingrédient de qualité supérieure issu de producteurs marocains.'}
          </p>
        </div>

        {/* Product Details Section */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">PRICE UNIT</span>
              <span className="text-[12px] font-bold text-white tracking-wide">{priceRange}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">RATING</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-brand-saffron fill-brand-saffron" />
                <span className="text-xs font-bold text-white">{fournisseur.avg_rating || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-bold text-white/70 uppercase tracking-wider">{fournisseur.company_name}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">STOCK: {product.stock} {product.unit || 'Kg'}</span>
          </div>

          {/* CTA Button */}
          <button
            className="w-full flex items-center justify-center py-3 bg-white/[0.02] border border-white/10 group-hover:bg-brand-primary group-hover:text-brand-bg text-white group-hover:border-brand-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 gap-2 btn-sharp mt-2"
          >
            Order Now
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FournisseurCard;
