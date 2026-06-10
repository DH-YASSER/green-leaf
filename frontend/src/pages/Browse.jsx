import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import FournisseurCard from '../components/FournisseurCard';
import FilterSidebar from '../components/FilterSidebar';
import RatingStars from '../components/RatingStars';
import { Leaf } from 'lucide-react';

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
    limit: 10,
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
      setError(err.response?.data?.message || 'Failed to fetch products / Échec du chargement');
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
      page: 1, // Reset to first page
    }));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-800">
      {/* Header navbar for subpages */}
      <nav className="glass border-b border-brand-primary/10 shadow-sm px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-lg font-black text-brand-primary">GreenLeaf</span>
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="text-xs font-black uppercase text-brand-primary/80 hover:text-brand-primary tracking-wider">Home / Accueil</Link>
          <Link to="/login" className="text-xs font-black uppercase text-brand-primary/80 hover:text-brand-primary tracking-wider">Dashboard</Link>
        </div>
      </nav>

      {/* Hero Zellige Section */}
      <header className="bg-brand-primary relative overflow-hidden py-16 text-white border-b border-brand-primary/20">
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><path d='M30 0 L0 30 L30 60 L60 30 Z' fill='%23ffffff'/><path d='M0 30 L30 0 L60 30 L30 60 Z' fill='%23ffffff'/></svg>")`,
            backgroundRepeat: 'repeat'
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Moroccan Sourcing Marketplace
          </h1>
          <p className="text-brand-highlight/90 text-sm font-semibold max-w-xl">
            Achetez directement auprès des agriculteurs et distributeurs marocains. Comparez les prix et commandez en gros.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="animate-spin h-10 w-10 border-4 border-brand-accent border-t-transparent rounded-full"></div>
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Loading Marketplace / Chargement...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-brand-terracotta">
            <p className="font-bold mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors font-bold text-xs uppercase tracking-wider"
            >
              Retry / Réessayer
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <span className="text-brand-primary text-sm font-black uppercase tracking-wider bg-brand-accent/10 px-4 py-2 rounded-xl">
                Showing {products.length} products
              </span>
              <div className="flex space-x-3">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value, page: 1 })}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <option value="top-rated">Top Rated / Mieux notés</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sidebar filters */}
              <aside className="lg:col-span-3">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                />
              </aside>

              {/* Products grid */}
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
                  <div className="bg-white rounded-3xl p-12 text-center shadow-luxury border border-slate-100">
                    <div className="w-16 h-16 mx-auto mb-6 bg-slate-50 flex items-center justify-center rounded-full">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-800 text-lg font-black mb-2">
                      No products found
                    </p>
                    <p className="text-slate-400 text-xs font-bold max-w-sm mx-auto uppercase tracking-wider leading-relaxed">
                      Try adjusting your search criteria or select different categories.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {products.length > 0 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={() => handleFilterChange({ page: Math.max(1, filters.page - 1) })}
                      disabled={filters.page <= 1}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider bg-white disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="text-xs font-black text-brand-primary">
                      Page {filters.page}
                    </span>
                    <button
                      onClick={() => handleFilterChange({ page: filters.page + 1 })}
                      disabled={products.length < filters.limit}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider bg-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2026 Green Leaf Morocco — B2B Direct Sourcing Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default Browse;
