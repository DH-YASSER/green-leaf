import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { X, Filter, RotateCcw } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (filters.status) {
          params.status = filters.status;
        }
        if (filters.start_date) {
          params.start_date = filters.start_date;
        }
        if (filters.end_date) {
          params.end_date = filters.end_date;
        }
        const response = await axios.get('/api/admin/orders', { params });
        setOrders(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  if (loading) {
    return (
      <DashboardLayout title="Order Management" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: true },
        { path: '/admin/promotions', label: 'Promotions', active: false },
        { path: '/admin/logs', label: 'Logs', active: false },
      ]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-20 gap-4 reveal-item">
          <div className="animate-spin h-8 w-8 border-2 border-brand-accent border-t-transparent"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Loading orders...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Order Management" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: true },
        { path: '/admin/promotions', label: 'Promotions', active: false },
        { path: '/admin/logs', label: 'Logs', active: false },
      ]}>
        <div className="text-center py-20 glass-card-dark reveal-item">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-brand-accent">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Order Management" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: false },
      { path: '/admin/users', label: 'Users', active: false },
      { path: '/admin/orders', label: 'Orders', active: true },
      { path: '/admin/promotions', label: 'Promotions', active: false },
      { path: '/admin/logs', label: 'Logs', active: false },
    ]}>
      <div className="space-y-6 pb-12">
        {/* Filters */}
        <div className="glass-card-dark p-6 reveal-item delay-100">
          <div className="flex items-center gap-2 mb-4 text-white/70">
            <Filter className="w-4 h-4 text-brand-accent" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Filter Orders</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="status" className="block text-[9px] font-bold text-white/40 mb-2 uppercase tracking-widest">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.02] border border-brand-border text-sm font-medium text-white focus:border-brand-accent focus:outline-none transition-all"
              >
                <option value="" className="bg-brand-surface">All Statuses</option>
                <option value="pending" className="bg-brand-surface">Pending</option>
                <option value="confirmed" className="bg-brand-surface">Confirmed</option>
                <option value="delivered" className="bg-brand-surface">Delivered</option>
                <option value="rejected" className="bg-brand-surface">Rejected</option>
              </select>
            </div>
            <div>
              <label htmlFor="start_date" className="block text-[9px] font-bold text-white/40 mb-2 uppercase tracking-widest">
                Start Date
              </label>
              <input
                id="start_date"
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.02] border border-brand-border text-sm font-medium text-white focus:border-brand-accent focus:outline-none transition-all scheme-dark"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-[9px] font-bold text-white/40 mb-2 uppercase tracking-widest">
                End Date
              </label>
              <input
                id="end_date"
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.02] border border-brand-border text-sm font-medium text-white focus:border-brand-accent focus:outline-none transition-all scheme-dark"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: '', start_date: '', end_date: '' });
                }}
                className="btn-sharp-outline w-full py-3.5 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card-dark p-8 reveal-item delay-200">
          {orders.length > 0 ? (
            <div className="overflow-x-auto border border-brand-border">
              <table className="min-w-full divide-y divide-brand-border text-left">
                <thead className="bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Restaurant</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-[12px] text-white/80">
                  {orders.map((order, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-white/80">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-white font-bold">
                        {order.restaurant_name || 'Unknown Restaurant'}
                      </td>
                      <td className="px-6 py-4 text-white font-bold">
                        {order.fournisseur_name || 'Unknown Supplier'}
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-accent">
                        {order.total_amount} MAD
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40 text-right">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-brand-border">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-transparent text-brand-accent border border-brand-accent/50';
    case 'confirmed':
      return 'bg-white/10 text-white border border-white/20';
    case 'delivered':
      return 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20';
    case 'rejected':
      return 'bg-white/10 text-white/50 border border-white/20';
    default:
      return 'bg-white/5 text-white/40 border border-white/10';
  }
};

export default AdminOrders;
