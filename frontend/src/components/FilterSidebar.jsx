import React, { useState } from 'react';
import RatingStars from './RatingStars';

const FilterSidebar = ({ filters, onChange }) => {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 1000]);
  const [selectedCity, setSelectedCity] = useState(filters.city || '');
  const [selectedCategories, setSelectedCategories] = useState(filters.category || []);
  const [minRating, setMinRating] = useState(filters.minRating || 0);
  const [verifiedOnly, setVerifiedOnly] = useState(filters.verifiedOnly || false);

  const categories = [
    { value: 'legumes', label: 'Vegetables / Légumes' },
    { value: 'viandes', label: 'Meats / Viandes' },
    { value: 'boissons', label: 'Beverages / Boissons' },
    { value: 'epices', label: 'Spices / Épices' },
    { value: 'secs', label: 'Dry Goods / Secs' },
  ];

  const cities = [
    { value: 'casablanca', label: 'Casablanca' },
    { value: 'rabat', label: 'Rabat' },
    { value: 'marrakech', label: 'Marrakech' },
    { value: 'fes', label: 'Fes' },
    { value: 'tanger', label: 'Tangier' },
    { value: 'agadir', label: 'Agadir' },
  ];

  const handleApplyFilters = () => {
    onChange({
      category: selectedCategories,
      city: selectedCity,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: minRating,
      verifiedOnly: verifiedOnly,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedCity('');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setVerifiedOnly(false);
    onChange({
      category: [],
      city: '',
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      verifiedOnly: false,
      page: 1,
    });
  };

  return (
    <div className="bg-brand-surface border border-white/[0.06] p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">
          Filters / Filtres
        </h3>
        <button
          onClick={handleResetFilters}
          className="text-[10px] font-bold text-brand-terracotta hover:text-brand-terracotta/80 uppercase tracking-widest transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Categories</h4>
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat.value);
            return (
              <label
                key={cat.value}
                className="flex items-center group cursor-pointer text-[12px] font-medium text-white/60 hover:text-white transition-colors"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, cat.value]);
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== cat.value));
                      }
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border transition-all flex items-center justify-center ${
                      isChecked
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-white/10 bg-transparent group-hover:border-white/20'
                    }`}
                  >
                    {isChecked && (
                      <div className="w-1.5 h-1.5 bg-brand-primary"></div>
                    )}
                  </div>
                </div>
                <span className="ml-3">{cat.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Moroccan City */}
      <div className="space-y-3 pt-4 border-t border-white/[0.06]">
        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">City / Ville</h4>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 text-[12px] font-semibold text-white/80 focus:text-white focus:border-brand-primary focus:outline-none transition-all"
        >
          <option value="" className="bg-brand-surface text-white/60">All Cities / Toutes les villes</option>
          {cities.map((city) => (
            <option key={city.value} value={city.value} className="bg-brand-surface text-white">
              {city.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-white/[0.06]">
        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Price Range (MAD)</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block mb-1">Min</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 text-[12px] font-bold text-white focus:border-brand-primary focus:outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block mb-1">Max</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
              className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 text-[12px] font-bold text-white focus:border-brand-primary focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-3 pt-4 border-t border-white/[0.06]">
        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Minimum Rating</h4>
        <div className="flex items-center space-x-2 mb-2">
          <RatingStars rating={minRating} size="sm" />
          <span className="text-[11px] font-semibold text-white/40">{minRating} Stars +</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setMinRating(star)}
              className={`flex-1 py-1.5 text-[11px] font-bold transition-all border ${
                minRating === star
                  ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                  : 'bg-transparent border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
              }`}
            >
              {star}★
            </button>
          ))}
        </div>
      </div>

      {/* Verified Only */}
      <div className="pt-4 border-t border-white/[0.06]">
        <label className="flex items-center group cursor-pointer text-[12px] font-medium text-white/60 hover:text-white transition-colors">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 border transition-all flex items-center justify-center ${
                verifiedOnly
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-white/10 bg-transparent group-hover:border-white/20'
              }`}
            >
              {verifiedOnly && (
                <div className="w-1.5 h-1.5 bg-brand-primary"></div>
              )}
            </div>
          </div>
          <span className="ml-3">Verified Suppliers Only</span>
        </label>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full bg-brand-primary text-brand-bg py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all btn-premium hover:bg-brand-accent"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
