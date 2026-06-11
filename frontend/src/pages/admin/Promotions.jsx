import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/admin/promotions');
        setPromotions(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleDisable = async (id) => {
    try {
      await axios.patch(`/api/admin/promotions/${id}/disable`, { is_active: false });
      const response = await axios.get('/api/admin/promotions');
      setPromotions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disable promotion');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Promotion Management" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: false },
        { path: '/admin/promotions', label: 'Promotions', active: true },
        { path: '/admin/logs', label: 'Logs', active: false },
      ]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-20 gap-4 reveal-item">
          <div className="animate-spin h-8 w-8 border-2 border-brand-accent border-t-transparent"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Loading promotions...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Promotion Management" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: false },
        { path: '/admin/promotions', label: 'Promotions', active: true },
        { path: '/admin/logs', label: 'Logs', active: false },
      ]}>
        <div className="text-center py-20 glass-card-dark reveal-item">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-brand-accent">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Promotion Management" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: false },
      { path: '/admin/users', label: 'Users', active: false },
      { path: '/admin/orders', label: 'Orders', active: false },
      { path: '/admin/promotions', label: 'Promotions', active: true },
      { path: '/admin/logs', label: 'Logs', active: false },
    ]}>
      <div className="space-y-6 pb-12">
        {/* Promotions Table */}
        <div className="glass-card-dark p-8 reveal-item delay-100">
          {promotions.length > 0 ? (
            <div className="overflow-x-auto border border-brand-border">
              <table className="min-w-full divide-y divide-brand-border text-left">
                <thead className="bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Value</th>
                    <th className="px-6 py-4">Period</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-[12px] text-white/80">
                  {promotions.map((promo, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        {promo.fournisseur_name || 'Unknown Supplier'}
                      </td>
                      <td className="px-6 py-4 text-white font-bold">
                        {promo.product_name || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4 text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                        {promo.promo_type}
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-accent">
                        {promo.value} {promo.promo_type === 'percentage' ? '%' : 'MAD'}
                      </td>
                      <td className="px-6 py-4 text-white/60 font-semibold">
                        {promo.start_date && promo.end_date ? (
                          <div className="flex flex-col gap-0.5">
                            <span>{new Date(promo.start_date).toLocaleDateString()}</span>
                            <span className="text-[10px] text-white/30 uppercase">to</span>
                            <span>{new Date(promo.end_date).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-white/30">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider ${
                          promo.is_active
                            ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                            : 'bg-white/10 text-white/50 border border-white/20'
                        }`}>
                          {promo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {promo.is_active ? (
                          <button
                            onClick={() => handleDisable(promo.id)}
                            className="btn-sharp-outline px-3 py-1.5 text-[10px] border-white/20 text-white/50"
                          >
                            Disable
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Disabled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-brand-border">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">No promotions found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPromotions;
