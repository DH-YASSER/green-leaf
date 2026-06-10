import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';

const RestaurantDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch orders for the restaurant (we assume the endpoint /api/restaurant/orders returns all orders for the logged-in restaurant)
        const response = await axios.get('/api/restaurant/orders');
        const orders = response.data || [];

        // Calculate stats
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

        setStats({ totalOrders, pendingOrders, deliveredOrders });

        // Get recent 5 orders (sorted by date descending)
        const sortedOrders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentOrders(sortedOrders.slice(0, 5));
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
    <DashboardLayout title="Restaurant Dashboard" navLinks={[
      { path: '/restaurant/dashboard', label: 'Dashboard', active: true },
      { path: '/restaurant/orders', label: 'Orders', active: false },
      { path: '/restaurant/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">👋</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Welcome back, Chef!</h2>
              <p className="text-gray-500 mt-1">Ready to manage your orders and grow your business?</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">📦</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">⏳</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Delivered Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/restaurant/orders" className="text-indigo-600 hover:text-indigo-500">
              View All Orders
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.fournisseur_name || 'Unknown Supplier'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.total_amount} MAD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No recent orders</p>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-green-50 rounded-xl shadow-md p-6 text-center">
          <h2 className="font-semibold text-gray-900 mb-4">Need to restock?</h2>
          <p className="text-gray-500 mb-4">
            Browse verified suppliers and place your next order in minutes.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Browse Suppliers
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper function to get status color class
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default RestaurantDashboard;