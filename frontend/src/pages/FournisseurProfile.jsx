import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import FournisseurCard from '../components/FournisseurCard';
import RatingStars from '../components/RatingStars';
import { Leaf, Star } from 'lucide-react';

const FournisseurProfile = () => {
  const { id } = useParams();
  const [fournisseur, setFournisseur] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const fournisseurResponse = await axios.get(`/api/fournisseurs/${id}`);
        const productsResponse = await axios.get(`/api/fournisseurs/${id}/products`);
        const reviewsResponse = await axios.get(`/api/fournisseurs/${id}/reviews`);

        setFournisseur(fournisseurResponse.data);
        setProducts(productsResponse.data || []);
        setReviews(reviewsResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load fournisseur profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center gap-4">
        <div className="animate-spin h-8 w-8 border-2 border-brand-primary border-t-transparent"></div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Loading Profile...</span>
      </div>
    );
  }

  if (error || !fournisseur) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center p-6">
        <div className="bg-brand-surface border border-white/[0.06] p-10 text-center max-w-md w-full">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-brand-terracotta mb-6">
            {error || 'Fournisseur profile not found'}
          </p>
          <Link
            to="/browse"
            className="inline-flex px-6 py-3 bg-brand-primary text-brand-bg text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-brand-accent"
          >
            Return to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text pb-20">
      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                <Leaf className="h-4.5 w-4.5 text-brand-primary" />
              </div>
              <span className="font-heading text-base font-bold tracking-tight text-white uppercase">
                Green<span className="text-brand-primary">Leaf</span>
              </span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link to="/browse" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors">
                Marketplace
              </Link>
              <Link to="/login" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ MAIN PROFILE ═══════════════════════ */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Back navigation link */}
        <div className="mb-8">
          <Link
            to="/browse"
            className="text-[11px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1.5"
          >
            ← Back to browse
          </Link>
        </div>

        {/* Fournisseur Header Panel */}
        <div className="bg-brand-surface border border-white/[0.06] p-8 sm:p-10 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  {fournisseur.company_name || fournisseur.name || 'Premium Supplier'}
                </h1>
                {fournisseur.is_verified && (
                  <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-0.5">
                    VERIFIED SUPPLIER
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40">
                <span>📍 {fournisseur.city || 'Morocco'}</span>
                <span className="text-white/10">•</span>
                <div className="flex items-center gap-1">
                  <RatingStars rating={fournisseur.avg_rating || 0} size="sm" />
                  <span className="text-white/60 font-bold ml-1">({fournisseur.avg_rating || 0})</span>
                </div>
              </div>

              {fournisseur.description && (
                <p className="mt-6 text-[13px] text-white/50 leading-relaxed max-w-2xl">
                  {fournisseur.description}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <Link
                to="/login"
                className="inline-flex bg-white/[0.02] border border-white/10 hover:border-brand-primary/40 text-white hover:text-brand-primary px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors"
              >
                Send Message
              </Link>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-16">
          <h2 className="font-heading text-lg font-bold uppercase tracking-[0.2em] text-white mb-8">
            Available Catalog Products
          </h2>
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <FournisseurCard
                  key={product.id}
                  product={product}
                  fournisseur={fournisseur}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-brand-surface border border-white/5 shadow-luxury">
              <div className="w-16 h-16 mb-6 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/5">
                <Leaf className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">No Active Listings</h3>
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider text-center max-w-sm leading-relaxed">
                This supplier is currently preparing their seasonal harvest. Check back soon for new inventory updates.
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-brand-surface border border-white/[0.06] p-8 sm:p-10">
          <h2 className="font-heading text-lg font-bold uppercase tracking-[0.2em] text-white mb-8">
            Reviews ({reviews?.length || 0})
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  className={`pt-6 first:pt-0 border-t border-white/[0.06] first:border-t-0`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                        {review.user_name || 'Anonymous Purchaser'}
                      </h3>
                      <span className="text-[10px] text-white/20 uppercase tracking-widest block mt-0.5">
                        {review.date ? new Date(review.date).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <div>
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <p className="text-[13px] text-white/45 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-t border-white/5 mt-8">
              <Star className="w-8 h-8 text-white/[0.03] fill-white/[0.03] mb-4" />
              <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                No verified purchase reviews yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FournisseurProfile;
