import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import FournisseurCard from '../components/FournisseurCard';
import FilterSidebar from '../components/FilterSidebar';
import { Leaf, SlidersHorizontal, Grid, ArrowLeft } from 'lucide-react';

const Browse = () => {
  const [products, setProducts] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [filters, setFilters] = useState({
    category: [],
    city: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    verifiedOnly: false,
    sortBy: 'top-rated', // top-rated, price-asc, price-desc, newest
    page: 1,
    limit: 9, // 3-column layout friendly
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/products', {
        params: {
          ...filters,
          category: filters.category.join(','),
        }
      });
      setProducts(response.data.products || []);
      setFournisseurs(response.data.fournisseurs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products from marketplace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to page 1
    }));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text dot-grid selection:bg-brand-primary/30 selection:text-white">
      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="glass-nav-dark fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                <Leaf className="h-4.5 w-4.5 text-brand-primary" />
              </div>
              <span className="font-heading text-base font-bold tracking-[0.1em] text-white">
                GREEN<span className="text-brand-primary">LEAF</span>
              </span>
            </Link>

            <div className="flex gap-8 items-center">
              <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO HEADER ═══════════════════════ */}
      <header className="relative bg-brand-surface/40 border-b border-white/5 pt-36 pb-20 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-primary mb-3 block">
            B2B Marketplace Portal
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase text-white tracking-tight mb-4">
            PRODUCE CATALOGUE
          </h1>
          <p className="text-zinc-400 text-[13px] sm:text-sm max-w-lg leading-relaxed">
            Purchase directly from verified Moroccan growers, cooperatives, and spice mills. Refine by region, price range, and category.
          </p>
        </div>
      </header>

      {/* ═══════════════════════ CATALOG MAIN CONTENT ═══════════════════════ */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[45vh] gap-6">
            <div className="animate-spin h-7 w-7 border-2 border-brand-primary border-t-transparent"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Loading Marketplace Inventory...</span>
          </div>
        ) : error ? (
          <div className="text-center py-24 border border-white/5 bg-brand-surface max-w-xl mx-auto p-8 shadow-luxury">
            <p className="font-bold text-white/70 uppercase tracking-wide mb-6 text-sm">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-8 py-4 bg-brand-primary text-brand-bg text-[10px] font-black uppercase tracking-[0.25em] hover:bg-brand-secondary transition-colors btn-sharp"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* Header controls bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-4 py-2">
                  Items Found: {products.length}
                </span>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <SlidersHorizontal className="w-4.5 h-4.5 text-zinc-500 hidden sm:block" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value, page: 1 })}
                  className="px-4 py-3 bg-brand-surface border border-white/10 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-300 focus:text-white focus:border-brand-primary focus:outline-none transition-all rounded-none w-full sm:w-auto"
                >
                  <option value="top-rated">Sort: Top Rated First</option>
                  <option value="price-asc">Sort: Price: Low to High</option>
                  <option value="price-desc">Sort: Price: High to Low</option>
                  <option value="newest">Sort: Newest Uploads</option>
                </select>
              </div>
            </div>

            {/* Grid Layout: Sidebar Filter & Products */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Sidebar Filters */}
              <aside className="lg:col-span-3">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                />
              </aside>

              {/* Products Grid */}
              <section className="lg:col-span-9">
                {products.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <FournisseurCard
                        key={product.id}
                        product={product}
                        fournisseur={fournisseurs.find(f => f.id === product.fournisseur_id) || {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-brand-surface border border-white/5 p-20 text-center shadow-luxury">
                    <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center bg-white/[0.02] border border-white/5">
                      <Grid className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className="text-white font-heading text-sm font-bold uppercase tracking-wider mb-3">
                      No Products Found
                    </p>
                    <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto">
                      Try broadening your filters, categories, or price ranges to find suppliers.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {products.length > 0 && (
                  <div className="mt-16 flex justify-center items-center gap-6">
                    <button
                      onClick={() => handleFilterChange({ page: Math.max(1, filters.page - 1) })}
                      disabled={filters.page <= 1}
                      className="px-6 py-3 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors btn-sharp bg-white/[0.01]"
                    >
                      Previous Page
                    </button>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary bg-brand-primary/10 px-4 py-2 border border-brand-primary/20">
                      Page {filters.page}
                    </span>
                    <button
                      onClick={() => handleFilterChange({ page: filters.page + 1 })}
                      disabled={products.length < filters.limit}
                      className="px-6 py-3 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors btn-sharp bg-white/[0.01]"
                    >
                      Next Page
                    </button>
                  </div>
                )}
              </section>

            </div>
          </>
        )}
      </main>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="border-t border-white/5 py-16 bg-brand-bg relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em]">
          <p>© 2026 GREENLEAF MOROCCO — B2B DIRECT SOURCING PORTAL</p>
        </div>
      </footer>
    </div>
  );
};

export default Browse;
