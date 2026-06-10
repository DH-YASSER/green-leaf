import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const FournisseurPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPromoId, setEditPromoId] = useState(null);
  const [form, setForm] = useState({
    product_id: '',
    promo_type: 'percentage', // percentage, fixed, bundle, flash
    value: '',
    min_qty: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/fournisseur/promotions');
        setPromotions(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editPromoId) {
        // Update existing promotion
        await axios.put(`/api/fournisseur/promotions/${editPromoId}`, form);
      } else {
        // Create new promotion
        await axios.post('/api/fournisseur/promotions', form);
      }
      // Close form and reset
      setShowForm(false);
      setEditPromoId(null);
      setForm({
        product_id: '',
        promo_type: 'percentage',
        value: '',
        min_qty: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
      });
      // Refetch promotions
      const response = await axios.get('/api/fournisseur/promotions');
      setPromotions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axios.patch(`/api/fournisseur/promotions/${id}/toggle`, { is_active: !isActive });
      // Refetch promotions
      const response = await axios.get('/api/fournisseur/promotions');
      setPromotions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle promotion');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="Manage Promotions" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: false },
      { path: '/fournisseur/products', label: 'Products', active: false },
      { path: '/fournisseur/promotions', label: 'Promotions', active: true },
      { path: '/fournisseur/orders', label: 'Orders', active: false },
      { path: '/fournisseur/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-6">
        {/* Header with Add Promotion button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Promotion List</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditPromoId(null);
              setForm({
                product_id: '',
                promo_type: 'percentage',
                value: '',
                min_qty: '',
                start_date: '',
                end_date: '',
                usage_limit: '',
              });
            }}
            className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary"
          >
            <span className="mr-2">+</span> Create Promotion
          </button>
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.length > 0 ? (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {promo.product_name || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.promo_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {promo.value} {promo.promo_type === 'percentage' ? '%' : 'MAD'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.start_date && promo.end_date ? (
                          <>
                            <span className="block">{new Date(promo.start_date).toLocaleDateString()}</span>
                            <span className="block">to</span>
                            <span className="block">{new Date(promo.end_date).toLocaleDateString()}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.usage_current}/{promo.usage_limit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {promo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          onClick={() => handleToggle(promo.id, promo.is_active)}
                          className="px-3 py-1 text-sm font-medium rounded-full ${promo.is_active ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}"
                        >
                          {promo.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => {
                            setEditPromoId(promo.id);
                            setForm({
                              product_id: promo.product_id,
                              promo_type: promo.promo_type,
                              value: promo.value,
                              min_qty: promo.min_qty,
                              start_date: promo.start_date,
                              end_date: promo.end_date,
                              usage_limit: promo.usage_limit,
                            });
                            setShowForm(true);
                          }}
                          className="px-3 py-1 bg-brand-secondary text-white rounded-md text-sm hover:bg-brand-primary"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No promotions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Promotion Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editPromoId ? 'Edit Promotion' : 'Create Promotion'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditPromoId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    id="product_id"
                    required
                    value={form.product_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    <option value="">Select a product</option>
                    {/* In a real app, we would fetch the list of products for this fournisseur */}
                    {/* For now, we'll leave it as a placeholder */}
                    <option value="1">Sample Product 1</option>
                    <option value="2">Sample Product 2</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="promo_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Promotion Type
                  </label>
                  <select
                    id="promo_type"
                    required
                    value={form.promo_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount Discount</option>
                    <option value="bundle">Bundle Deal</option>
                    <option value="flash">Flash Sale</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    id="value"
                    type="number"
                    required
                    value={form.value}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="min_qty" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Quantity
                    </label>
                    <input
                      id="min_qty"
                      type="number"
                      value={form.min_qty}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      id="usage_limit"
                      type="number"
                      value={form.usage_limit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      id="start_date"
                      type="date"
                      value={form.start_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      id="end_date"
                      type="date"
                      value={form.end_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditPromoId(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:opacity-50"
                  >
                    {editPromoId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FournisseurPromotions;
