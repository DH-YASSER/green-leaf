import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { Utensils, Truck, UserCheck, ShoppingBag, DollarSign, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_restaurants: 0,
    total_fournisseurs: 0,
    pending_verifications: 0,
    total_orders: 0,
    total_revenue: 0,
    top_fournisseurs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/admin/stats');
        const data = response.data || {};
        setStats({
          total_restaurants: data.total_restaurants || 0,
          total_fournisseurs: data.total_fournisseurs || 0,
          pending_verifications: data.pending_verifications || 0,
          total_orders: data.total_orders || 0,
          total_revenue: data.total_revenue || 0,
          top_fournisseurs: data.top_5_fournisseurs || data.top_fournisseurs || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: true },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: false },
        { path: '/admin/promotions', label: 'Promotions', active: false },
        { path: '/admin/logs', label: 'Logs', active: false },
      ]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-20 gap-4 reveal-item">
          <div className="animate-spin h-8 w-8 border-2 border-brand-accent border-t-transparent"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Loading stats...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: true },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: false },
        { path: '/admin/promotions', label: 'Promotions', active: false },
        { path: '/admin/logs', label: 'Logs', active: false },
      ]}>
        <div className="text-center py-20 bg-brand-surface border border-white/[0.04] reveal-item">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-brand-accent">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: true },
      { path: '/admin/users', label: 'Users', active: false },
      { path: '/admin/orders', label: 'Orders', active: false },
      { path: '/admin/promotions', label: 'Promotions', active: false },
      { path: '/admin/logs', label: 'Logs', active: false },
    ]}>
      <div className="space-y-8 pb-12">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Utensils, label: 'Total Restaurants', value: stats.total_restaurants, delay: 'delay-100' },
            { icon: Truck, label: 'Total Suppliers', value: stats.total_fournisseurs, delay: 'delay-200' },
            { icon: UserCheck, label: 'Pending Verifications', value: stats.pending_verifications, delay: 'delay-300' },
            { icon: ShoppingBag, label: 'Total Orders', value: stats.total_orders, delay: 'delay-400' },
            { icon: DollarSign, label: 'Total Revenue', value: `${stats.total_revenue || 0} MAD`, delay: 'delay-500' },
          ].map((stat, i) => (
            <div key={i} className={`glass-card-dark p-6 flex items-center gap-5 reveal-item ${stat.delay}`}>
              <div className="h-10 w-10 border border-brand-accent/20 bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.15em]">{stat.label}</p>
                <p className="font-heading text-lg font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Top 5 Suppliers Table */}
        <div className="glass-card-dark p-8 reveal-item delay-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">Top 5 Suppliers</h2>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-1">Suppliers ranked by order volume</p>
            </div>
            <Link to="/admin/users" className="text-[11px] font-bold uppercase tracking-widest text-brand-accent hover:text-white flex items-center gap-1.5 transition-colors">
              Manage Users
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {(stats.top_fournisseurs || []).length > 0 ? (
            <div className="overflow-x-auto border border-brand-border">
              <table className="min-w-full divide-y divide-brand-border text-left">
                <thead className="bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Supplier Name</th>
                    <th className="px-6 py-4">Order Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-[12px] text-white/80">
                  {stats.top_fournisseurs.map((fournisseur, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        {fournisseur.name}
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-accent">
                        {fournisseur.order_count} orders
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-brand-border">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">No supplier data available</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
