import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all'); // all, restaurant, fournisseur, pending

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (tab === 'restaurant') {
          params.role = 'restaurant';
        } else if (tab === 'fournisseur') {
          params.role = 'fournisseur';
        } else if (tab === 'pending') {
          params.verified = false;
        }
        // For 'all', we don't need any filter
        const response = await axios.get('/api/admin/users', { params });
        setUsers(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [tab]);

  const handleVerify = async (id) => {
    try {
      await axios.patch(`/api/admin/users/${id}/verify`);
      // Refetch users
      const response = await axios.get('/api/admin/users', {
        params: tab === 'pending' ? { verified: false } : {}
      });
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify user');
    }
  };

  const handleBan = async (id) => {
    try {
      await axios.patch(`/api/admin/users/${id}/ban`);
      // Refetch users
      const response = await axios.get('/api/admin/users', {
        params: tab === 'pending' ? { verified: false } : {}
      });
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to ban user');
    }
  };

  const handleUnban = async (id) => {
    try {
      await axios.patch(`/api/admin/users/${id}/unban`);
      // Refetch users
      const response = await axios.get('/api/admin/users', {
        params: tab === 'pending' ? { verified: false } : {}
      });
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unban user');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="User Management" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: false },
      { path: '/admin/users', label: 'Users', active: true },
      { path: '/admin/orders', label: 'Orders', active: false },
      { path: '/admin/promotions', label: 'Promotions', active: false },
      { path: '/admin/logs', label: 'Logs', active: false },
    ]}>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 text-sm font-medium ${tab === 'all'
              ? 'bg-brand-highlight/30 text-brand-secondary'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            All Users
          </button>
          <button
            onClick={() => setTab('restaurant')}
            className={`px-4 py-2 text-sm font-medium ${tab === 'restaurant'
              ? 'bg-brand-highlight/30 text-brand-secondary'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Restaurants
          </button>
          <button
            onClick={() => setTab('fournisseur')}
            className={`px-4 py-2 text-sm font-medium ${tab === 'fournisseur'
              ? 'bg-brand-highlight/30 text-brand-secondary'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Suppliers
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 text-sm font-medium ${tab === 'pending'
              ? 'bg-brand-highlight/30 text-brand-secondary'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Pending Verification
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
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
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.city || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.is_verified ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            ✗ Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        {/* Show Verify button only if not verified and not banned? */}
                        {!user.is_verified && user.status !== 'banned' && (
                          <button
                            onClick={() => handleVerify(user.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                          >
                            Verify
                          </button>
                        )}
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => handleBan(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                          >
                            Ban
                          </button>
                        )}
                        {user.status === 'banned' && (
                          <button
                            onClick={() => handleUnban(user.id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                          >
                            Unban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper functions for role and status colors
const getRoleColor = (role) => {
  switch (role) {
    case 'restaurant':
      return 'bg-blue-100 text-blue-800';
    case 'fournisseur':
      return 'bg-green-100 text-green-800';
    case 'admin':
      return 'bg-brand-highlight/40 text-brand-primary';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'banned':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default AdminUsers;
