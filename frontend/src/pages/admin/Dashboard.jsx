import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

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
        setStats(response.data || {});
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="Admin Dashboard" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: true },
      { path: '/admin/users', label: 'Users', active: false },
      { path: '/admin/orders', label: 'Orders', active: false },
      { path: '/admin/promotions', label: 'Promotions', active: false },
      { path: '/admin/logs', label: 'Logs', active: false },
    ]}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Restaurants */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">🍽️</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_restaurants}</p>
            </div>
          </div>
          {/* Total Fournisseurs */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">🛒</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_fournisseurs}</p>
            </div>
          </div>
          {/* Pending Verifications */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold">⏳</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900 bg-orange-100 text-orange-800 px-2 py-1 rounded">
                {stats.pending_verifications}
              </p>
            </div>
          </div>
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold">📦</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
            </div>
          </div>
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">💰</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_revenue} MAD</p>
            </div>
          </div>
        </div>

        {/* Top 5 Fournisseurs Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top 5 Suppliers by Orders</h2>
          </div>
          {stats.top_fournisseurs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.top_fournisseurs.map((fournisseur, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {fournisseur.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fournisseur.order_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No supplier data available</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;