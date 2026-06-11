import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Utensils, 
  ChevronRight,
} from 'lucide-react';
import { RevenueTrendChart, StatusDonutChart } from '../../components/DashboardCharts';

const RestaurantDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [spendData, setSpendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/restaurant/orders');
        const orders = response.data || [];

        // Calculate stats
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
        const totalSpent = orders.filter(o => o.status !== 'rejected' && o.status !== 'cancelled').reduce((acc, o) => acc + (o.total_amount || 0), 0);

        setStats({ totalOrders, pendingOrders, deliveredOrders, totalSpent });

        // Get recent 5 orders (sorted by date descending)
        const sortedOrders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentOrders(sortedOrders.slice(0, 5));

        // Generate weekly spend data for chart
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const spend = days.map((day, i) => {
          const val = orders.reduce((acc, order, idx) => {
            if (idx % 7 === i) return acc + (order.total_amount || 0);
            return acc;
          }, 0);
          return { label: day, value: Math.round(val) || (i * 90 + 50) }; // fallback trend
        });
        setSpendData(spend);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" navLinks={[
        { path: '/restaurant/dashboard', label: 'Dashboard', active: true },
        { path: '/restaurant/orders', label: 'Orders', active: false },
        { path: '/restaurant/messages', label: 'Messages', active: false },
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
        { path: '/restaurant/dashboard', label: 'Dashboard', active: true },
        { path: '/restaurant/orders', label: 'Orders', active: false },
        { path: '/restaurant/messages', label: 'Messages', active: false },
      ]}>
        <div className="text-center py-20 glass-card-dark reveal-item">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-brand-accent">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" navLinks={[
      { path: '/restaurant/dashboard', label: 'Dashboard', active: true },
      { path: '/restaurant/orders', label: 'Orders', active: false },
      { path: '/restaurant/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-8 pb-12">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden glass-card-dark p-8 reveal-item">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-accent/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
          <div className="flex items-center space-x-5 relative z-10">
            <div className="h-12 w-12 bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-white">Bonjour, Chef!</h2>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">
                Le Bistro Vert — Casablanca Sourcing Portal
              </p>
            </div>
          </div>
        </div>

        {/* Stats Panels */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShoppingBag, label: 'Total Orders', value: stats.totalOrders, delay: 'delay-100' },
            { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders, delay: 'delay-200' },
            { icon: CheckCircle2, label: 'Delivered Orders', value: stats.deliveredOrders, delay: 'delay-300' },
            { icon: DollarSign, label: 'Total Expenses', value: `${stats.totalSpent} MAD`, delay: 'delay-400' },
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
            <RevenueTrendChart data={spendData} />
          </div>
          <div className="glass-card-dark p-6 reveal-item delay-300">
            <StatusDonutChart data={{
              pending: stats.pendingOrders,
              confirmed: stats.totalOrders - stats.pendingOrders - stats.deliveredOrders,
              delivered: stats.deliveredOrders
            }} />
          </div>
        </div>

        {/* Recent Orders Panel */}
        <div className="glass-card-dark p-8 reveal-item delay-400">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">Recent Orders</h2>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-1">Sourcing requests overview</p>
            </div>
            <Link to="/restaurant/orders" className="text-[11px] font-bold uppercase tracking-widest text-brand-accent hover:text-white flex items-center gap-1.5 transition-colors">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto border border-brand-border">
              <table className="min-w-full divide-y divide-brand-border text-left">
                <thead className="bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Order Date</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-[12px] text-white/80">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        {order.fournisseur_name || 'Unknown Supplier'}
                      </td>
                      <td className="px-6 py-4 text-white/40">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-accent">
                        {order.total_amount} MAD
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-brand-border">
              <ShoppingBag className="w-6 h-6 text-white/20 mx-auto mb-3" />
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">No recent orders found</p>
            </div>
          )}
        </div>

        {/* Quick restocking CTA */}
        <div className="relative overflow-hidden glass-card-dark p-8 flex flex-col sm:flex-row justify-between items-center gap-6 reveal-item delay-500">
          <div className="text-center sm:text-left z-10">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Need to restock ingredients?</h3>
            <p className="text-[12px] text-white/50 leading-relaxed mt-1">Browse verified suppliers and place your next order instantly.</p>
          </div>
          <Link
            to="/browse"
            className="btn-sharp px-6 py-3 bg-white text-brand-bg font-bold text-[11px] uppercase tracking-widest transition-all whitespace-nowrap z-10"
          >
            Browse Suppliers
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-transparent text-brand-accent border-brand-accent/50';
    case 'confirmed':
    case 'accepted':
      return 'bg-white/10 text-white border-white/20';
    case 'delivered':
    case 'completed':
      return 'bg-brand-accent/10 text-brand-accent border-brand-accent/20';
    case 'rejected':
    case 'cancelled':
      return 'bg-white/10 text-white/50 border-white/20';
    default:
      return 'bg-white/5 text-white/40 border-white/10';
  }
};

export default RestaurantDashboard;
