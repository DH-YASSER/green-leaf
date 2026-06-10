import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import FournisseurCard from '../components/FournisseurCard';
import RatingStars from '../components/RatingStars';
import VerifiedBadge from '../components/VerifiedBadge';
import PromoTag from '../components/PromoTag';

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
        // Fetch fournisseur details
        const fournisseurResponse = await axios.get(`/api/fournisseurs/${id}`);
        // Fetch products for this fournisseur
        const productsResponse = await axios.get(`/api/fournisseurs/${id}/products`);
        // Fetch reviews for this fournisseur
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

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!fournisseur) return <div className="text-center py-12">Fournisseur not found</div>;

  return (
    <div className="min-h-bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <div className="mb-6">
          <a href="/browse" className="text-brand-secondary hover:text-brand-primary">
            ← Back to browse
          </a>
        </div>

        {/* Fournisseur header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="mb-4 md:mb-0">
              {/* Cover image placeholder */}
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-500">Cover Image</span>
              </div>
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {fournisseur.company_name || fournisseur.name}
                </h1>
                <VerifiedBadge isVerified={fournisseur.is_verified} />
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📍 {fournisseur.city}</span>
                  <span>·</span>
                  <span>
                    <RatingStars rating={fournisseur.avg_rating || 0} size="sm" />
                    {fournisseur.avg_rating ? ` (${fournisseur.avg_rating})` : ''}
                  </span>
                </div>
              </div>
            </div>
            <div className="md:mt-4 md:text-right">
              {/* Follow/Message button placeholder */}
              <button className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">
                Message
              </button>
            </div>
          </div>

          {/* Description */}
          {fournisseur.description && (
            <div className="mt-4 text-gray-600">
              {fournisseur.description}
            </div>
          )}
        </div>

        {/* Products grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Products
          </h2>
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <FournisseurCard
                  key={product.id}
                  product={product}
                  fournisseur={fournisseur}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products available
            </div>
          )}
        </div>

        {/* Reviews section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reviews ({reviews.length})
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-t border-gray-200 pt-4 first:border-t-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">
                          {review.user_name || 'Anonymous'}
                        </h3>
                        <span className="ml-2 text-sm text-gray-500">
                          {review.date ? new Date(review.date).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <div className="mt-1">
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <button className="text-brand-secondary hover:text-brand-primary">
                      Report
                    </button>
                  </div>
                  <p className="text-gray-600">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No reviews yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FournisseurProfile;
