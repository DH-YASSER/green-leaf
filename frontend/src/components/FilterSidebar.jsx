import React, { useState } from 'react';

const SULU   = '#e46718';
const BORDER = 'rgb(255, 255, 255)';

const mono = (size = 10) => ({
  fontFamily: 'DM Mono, monospace',
  fontSize: size,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
});

const cities = [
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'rabat',      label: 'Rabat'      },
  { value: 'marrakech',  label: 'Marrakech'  },
  { value: 'fes',        label: 'Fès'        },
  { value: 'tanger',     label: 'Tanger'     },
  { value: 'agadir',     label: 'Agadir'     },
];

const SectionLabel = ({ children }) => (
  <span style={{ ...mono(8), color: 'var(--textLow)', marginBottom: 10, display: 'block' }}>
    {children}
  </span>
);

const Divider = () => (
  <div style={{ borderTop: `1px solid ${BORDER}`, margin: '14px 0' }} />
);

const GLCheckbox = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    <div style={{
      width: 13, height: 13, flexShrink: 0,
      border: `1px solid ${checked ? SULU : BORDER}`,
      background: checked ? 'rgba(168,224,99,0.10)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s',
    }}>
      {checked && <div style={{ width: 5, height: 5, background: SULU }} />}
    </div>
    <span style={{ ...mono(9), color: checked ? 'var(--text)' : 'var(--textMid)', transition: 'color 0.15s' }}>
      {label}
    </span>
  </label>
);

const FilterSidebar = ({ filters = {}, onChange }) => {
  const [selectedCity,  setSelectedCity]  = useState(filters.city || '');
  const [priceRange,    setPriceRange]    = useState([filters.minPrice || 0, filters.maxPrice || 1000]);
  const [minRating,     setMinRating]     = useState(filters.minRating || 0);
  const [verifiedOnly,  setVerifiedOnly]  = useState(filters.verifiedOnly || false);

  const handleApply = () => onChange({
    city: selectedCity,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minRating,
    verifiedOnly,
    page: 1,
  });

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* City */}
      <SectionLabel>Ville / City</SectionLabel>
      <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
        style={{
          width: '100%', background: 'var(--bg)',
          border: `1px solid ${BORDER}`,
          color: selectedCity ? 'var(--text)' : 'var(--textLow)',
          padding: '9px 10px', ...mono(9), outline: 'none',
          cursor: 'pointer', appearance: 'none',
        }}>
        <option value="" style={{ background: '#0B2818' }}>Toutes les villes</option>
        {cities.map(c => (
          <option key={c.value} value={c.value} style={{ background: '#0B2818', color: '#fff' }}>{c.label}</option>
        ))}
      </select>

      <Divider />

      {/* Price range */}
      <SectionLabel>Prix (MAD)</SectionLabel>
      <div style={{ display: 'flex', gap: 8 }}>
        {[['Min', 0], ['Max', 1]].map(([lbl, idx]) => (
          <div key={lbl} style={{ flex: 1 }}>
            <span style={{ ...mono(8), color: 'var(--textLow)', display: 'block', marginBottom: 5 }}>{lbl}</span>
            <input
              type="number"
              value={priceRange[idx]}
              onChange={e => {
                const v = parseInt(e.target.value) || 0;
                setPriceRange(prev => idx === 0 ? [v, prev[1]] : [prev[0], v]);
              }}
              style={{
                width: '100%', background: 'transparent',
                border: `1px solid ${BORDER}`, color: 'var(--text)',
                padding: '8px 9px', ...mono(9), outline: 'none',
              }}
            />
          </div>
        ))}
      </div>

      <Divider />

      {/* Min rating */}
      <SectionLabel>Note minimale</SectionLabel>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} onClick={() => setMinRating(star === minRating ? 0 : star)}
            style={{
              flex: 1, padding: '7px 0',
              background: minRating >= star ? 'rgba(168,224,99,0.10)' : 'transparent',
              border: `1px solid ${minRating >= star ? SULU : BORDER}`,
              color: minRating >= star ? SULU : 'var(--textLow)',
              ...mono(8), cursor: 'pointer', transition: 'all 0.15s',
            }}>
            {star}★
          </button>
        ))}
      </div>

      <Divider />

      {/* Verified only */}
      <GLCheckbox
        checked={verifiedOnly}
        onChange={e => setVerifiedOnly(e.target.checked)}
        label="Vérifiés seulement"
      />

      <Divider />

      {/* Apply — un seul bouton */}
      <button onClick={handleApply} style={{
        width: '100%',
        background: SULU, color: '#0B2818',
        border: 'none', padding: '12px 0',
        ...mono(9), fontWeight: 500,
        cursor: 'pointer', transition: 'opacity 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Appliquer →
      </button>
    </div>
  );
};

export default FilterSidebar;