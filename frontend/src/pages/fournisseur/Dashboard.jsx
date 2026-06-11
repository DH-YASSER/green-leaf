import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Tag, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  ArrowRight,
  Package
} from 'lucide-react';
import { RevenueTrendChart, CategoryBarChart } from '../../components/DashboardCharts';

const FournisseurDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activePromos: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setError('');
    try {
      // Fetch stats
      const statsResponse = await axios.get('/api/fournisseur/dashboard/stats');
      // Fetch recent orders
      const ordersResponse = await axios.get('/api/fournisseur/orders');
      
      setStats(statsResponse.data || {});
      
      const allOrders = ordersResponse.data || [];
      // Show only pending orders in the table
      const pending = allOrders.filter(o => o.status === 'pending');
      setRecentOrders(pending);

      // Generate mock weekly trend data based on completed orders
      const completedOrders = allOrders.filter(o => o.status === 'completed' || o.status === 'delivered' || o.status === 'shipped');
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const trend = days.map((day, i) => {
        // distribute completed orders loosely across days
        const val = completedOrders.reduce((acc, order, idx) => {
          if (idx % 7 === i) return acc + (order.total_amount || 0);
          return acc;
        }, 0);
        return { label: day, value: Math.round(val) || (i * 120 + 80) }; // fallback trend
      });
      setRevenueData(trend);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/fournisseur/orders/${orderId}/status`, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" navLinks={[
        { path: '/fournisseur/dashboard', label: 'Dashboard', active: true },
        { path: '/fournisseur/products', label: 'Products', active: false },
        { path: '/fournisseur/promotions', label: 'Promotions', active: false },
        { path: '/fournisseur/orders', label: 'Orders', active: false },
        { path: '/fournisseur/messages', label: 'Messages', active: false },
      ]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-20 gap-4 reveal-item">
          <div className="animate-spin h-8 w-8 border-2 border-brand-accent border-t-transparent"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Loading Dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard" navLinks={[
        { path: '/fournisseur/dashboard', label: 'Dashboard', active: true },
        { path: '/fournisseur/products', label: 'Products', active: false },
        { path: '/fournisseur/promotions', label: 'Promotions', active: false },
        { path: '/fournisseur/orders', label: 'Orders', active: false },
        { path: '/fournisseur/messages', label: 'Messages', active: false },
      ]}>
        <div className="text-center py-20 glass-card-dark reveal-item">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-brand-accent">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: true },
      { path: '/fournisseur/products', label: 'Products', active: false },
      { path: '/fournisseur/promotions', label: 'Promotions', active: false },
      { path: '/fournisseur/orders', label: 'Orders', active: false },
      { path: '/fournisseur/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-8 pb-12">
        {/* Stats Panels */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Package, label: 'Total Products', value: stats.totalProducts, delay: 'delay-100' },
            { icon: Tag, label: 'Active Promos', value: stats.activePromos, delay: 'delay-200' },
            { icon: Clock, label: 'Pending Requests', value: stats.pendingOrders, delay: 'delay-300' },
            { icon: DollarSign, label: 'Total Revenue', value: `${stats.totalRevenue} MAD`, delay: 'delay-400' },
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

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 glass-card-dark p-6 reveal-item delay-200">
            <RevenueTrendChart data={revenueData} />
          </div>
          <div className="glass-card-dark p-6 reveal-item delay-300">
            <CategoryBarChart data={[
              { label: 'Vegetables / Légumes', value: 45 },
              { label: 'Meats / Viandes', value: 30 },
              { label: 'Dry Goods / Secs', value: 25 }
            ]} />
          </div>
        </div>

        {/* Pending Requests Table */}
        <div className="glass-card-dark p-8 reveal-item delay-400">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">Pending Requests</h2>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-1">Accept or reject incoming requests</p>
            </div>
            <Link to="/fournisseur/orders" className="text-[11px] font-bold uppercase tracking-widest text-brand-accent hover:text-white flex items-center gap-1.5 transition-colors">
              Manage All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto border border-brand-border">
              <table className="min-w-full divide-y divide-brand-border text-left">
                <thead className="bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Restaurant</th>
                    <th className="px-6 py-4">Items count</th>
                    <th className="px-6 py-4">Total amount</th>
                    <th className="px-6 py-4">Order date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-[12px] text-white/80">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-white/80">
                        {order.restaurant_name || 'Unknown Restaurant'}
                      </td>
                      <td className="px-6 py-4 font-bold text-white/60">
                        {order.items_count || 0} items
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-accent">
                        {order.total_amount} MAD
                      </td>
                      <td className="px-6 py-4 text-white/40">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          className="btn-sharp px-3 py-1.5 inline-flex items-center gap-1 text-[10px]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'rejected')}
                          className="btn-sharp-outline px-3 py-1.5 inline-flex items-center gap-1 text-[10px] border-white/20 text-white/50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-brand-border">
              <ShoppingBag className="w-6 h-6 text-white/20 mx-auto mb-3" />
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">No pending orders at this moment</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FournisseurDashboard;
