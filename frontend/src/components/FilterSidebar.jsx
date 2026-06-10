import React, { useState } from 'react';
import RatingStars from './RatingStars';

const FilterSidebar = ({ filters, onChange }) => {
  const [open, setOpen] = useState(true); // Keep open by default on desktop for better UX
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
      page: 1, // Reset to first page
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
    <div className="bg-white rounded-3xl p-6 shadow-luxury border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-brand-primary">Filters / Filtres</h3>
        <button
          onClick={handleResetFilters}
          className="text-xs font-black text-brand-terracotta hover:underline uppercase tracking-wider"
        >
          Reset
        </button>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.value} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${cat.value}`}
                checked={selectedCategories.includes(cat.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, cat.value]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== cat.value));
                  }
                }}
                className="h-4 w-4 text-brand-secondary focus:ring-brand-accent border-slate-200 rounded"
              />
              <label htmlFor={`category-${cat.value}`} className="ml-3 block text-sm font-bold text-slate-600">
                {cat.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Moroccan City / Ville</h4>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="block w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-accent transition-all outline-none"
        >
          <option value="">All Cities / Toutes les villes</option>
          {cities.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Price Range (MAD)</h4>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Min</span>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold text-slate-700"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Max</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Minimum Rating</h4>
        <div className="flex items-center space-x-2 mb-3">
          <RatingStars rating={minRating} size="sm" />
          <span className="text-xs font-bold text-slate-500">
            {minRating} Stars and up
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setMinRating(star)}
              className={`flex-1 py-1 rounded-lg text-xs font-black transition-all ${
                minRating === star ? 'bg-brand-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {star}★
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified-only"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 text-brand-secondary focus:ring-brand-accent border-slate-200 rounded"
          />
          <label htmlFor="verified-only" className="ml-3 block text-sm font-bold text-slate-600">
            Verified Suppliers Only
          </label>
        </div>
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all btn-premium shadow-md"
      >
        Apply Filters / Filtrer
      </button>
    </div>
  );
};

export default FilterSidebar;
