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
  TrendingUp,
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
      // Refresh all statistics and tables
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return <div className="text-center py-12 text-brand-primary font-bold">Loading dashboard...</div>;
  if (error) return <div className="text-center py-12 text-brand-terracotta font-bold">{error}</div>;

  return (
    <DashboardLayout title="Fournisseur Dashboard" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: true },
      { path: '/fournisseur/products', label: 'Products', active: false },
      { path: '/fournisseur/promotions', label: 'Promotions', active: false },
      { path: '/fournisseur/orders', label: 'Orders', active: false },
      { path: '/fournisseur/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-8 pb-12">
        {/* Welcome Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl p-6 text-white shadow-lg">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 w-48 h-48 bg-brand-accent/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl">
              👋
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Marhaban, Supplier Partner!</h2>
              <p className="text-brand-highlight text-xs font-semibold uppercase tracking-wider mt-1">
                Green Leaf Morocco B2B Supply Portal
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-luxury transition-all duration-300">
            <div className="h-12 w-12 bg-brand-highlight/30 text-brand-secondary rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xs font-black text-slate-400 uppercase tracking-widest">Total Products</p>
              <p className="text-2xl font-black text-brand-primary mt-0.5">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-luxury transition-all duration-300">
            <div className="h-12 w-12 bg-brand-highlight/30 text-brand-secondary rounded-2xl flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xs font-black text-slate-400 uppercase tracking-widest">Active Promos</p>
              <p className="text-2xl font-black text-brand-primary mt-0.5">{stats.activePromos}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-luxury transition-all duration-300">
            <div className="h-12 w-12 bg-amber-50 text-brand-saffron rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xs font-black text-slate-400 uppercase tracking-widest">Pending Requests</p>
              <p className="text-2xl font-black text-brand-primary mt-0.5">{stats.pendingOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-luxury transition-all duration-300">
            <div className="h-12 w-12 bg-brand-highlight/30 text-brand-secondary rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xs font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
              <p className="text-2xl font-black text-brand-secondary mt-0.5">{stats.totalRevenue} MAD</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueTrendChart data={revenueData} />
          </div>
          <div>
            <CategoryBarChart data={[
              { label: 'Vegetables / Légumes', value: 45 },
              { label: 'Meats / Viandes', value: 30 },
              { label: 'Dry Goods / Secs', value: 25 }
            ]} />
          </div>
        </div>

        {/* Pending Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-brand-primary uppercase tracking-wider">Pending Orders / Commandes en attente</h2>
              <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Approve or reject incoming requests</p>
            </div>
            <Link to="/fournisseur/orders" className="text-xs font-black uppercase text-brand-secondary hover:text-brand-primary flex items-center gap-1.5 transition-colors">
              Manage All Orders
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto border border-slate-50 rounded-2xl">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50 text-slate-400 text-3xs font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Restaurant</th>
                    <th className="px-6 py-4">Items count</th>
                    <th className="px-6 py-4">Total amount</th>
                    <th className="px-6 py-4">Order date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {order.restaurant_name || 'Unknown Restaurant'}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-500">
                        {order.items_count || 0} items
                      </td>
                      <td className="px-6 py-4 font-black text-brand-primary">
                        {order.total_amount} MAD
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2">
                        <button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          className="inline-flex items-center gap-1 px-3.5 py-2 bg-brand-secondary hover:bg-brand-primary text-white rounded-xl shadow-sm hover:shadow transition-all uppercase tracking-wider cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'rejected')}
                          className="inline-flex items-center gap-1 px-3.5 py-2 bg-brand-terracotta hover:bg-brand-terracotta/95 text-white rounded-xl shadow-sm hover:shadow transition-all uppercase tracking-wider cursor-pointer"
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
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No pending orders at this moment</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FournisseurDashboard;
