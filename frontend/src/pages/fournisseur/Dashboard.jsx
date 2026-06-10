import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const FournisseurDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activePromos: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch stats
        const statsResponse = await axios.get('/api/fournisseur/dashboard/stats');
        // Fetch recent orders (pending and recent)
        const ordersResponse = await axios.get('/api/fournisseur/orders', { params: { limit: 5 } });

        setStats(statsResponse.data || {});
        setRecentOrders(ordersResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="Fournisseur Dashboard" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: true },
      { path: '/fournisseur/products', label: 'Products', active: false },
      { path: '/fournisseur/promotions', label: 'Promotions', active: false },
      { path: '/fournisseur/orders', label: 'Orders', active: false },
      { path: '/fournisseur/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">👋</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Welcome back, Supplier!</h2>
              <p className="text-gray-500 mt-1">Manage your products, promotions, and orders.</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">📦</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">🏷️</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePromos}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">⏳</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold">💰</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue} MAD</p>
            </div>
          </div>
        </div>

        {/* Pending Orders Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Orders</h2>
            <Link to="/fournisseur/orders" className="text-indigo-600 hover:text-indigo-500">
              View All Orders
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.restaurant_name || 'Unknown Restaurant'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items_count || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.total_amount} MAD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          onClick={() => {
                            // In a real app, we would call an API to accept the order
                            alert('Accept order functionality not implemented');
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            // In a real app, we would call an API to reject the order
                            alert('Reject order functionality not implemented');
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No pending orders</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FournisseurDashboard;