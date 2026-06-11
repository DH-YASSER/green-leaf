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
      const response = await axios.get('/api/admin/users', {
        params: tab === 'pending' ? { verified: false } : {}
      });
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unban user');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="User Management" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: true },
        { path: '/admin/orders', label: 'Orders', active: false },
        { path: '/admin/promotions', label: 'Promotions', active: false },
        { path: '/admin/logs', label: 'Logs', active: false },
      ]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-20 gap-4 reveal-item">
          <div className="animate-spin h-8 w-8 border-2 border-brand-accent border-t-transparent"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Loading users...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="User Management" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: true },
        { path: '/admin/orders', label: 'Orders', active: false },
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
    <DashboardLayout title="User Management" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: false },
      { path: '/admin/users', label: 'Users', active: true },
      { path: '/admin/orders', label: 'Orders', active: false },
      { path: '/admin/promotions', label: 'Promotions', active: false },
      { path: '/admin/logs', label: 'Logs', active: false },
    ]}>
      <div className="space-y-6 pb-12">
        {/* Tabs */}
        <div className="flex space-x-2 border-b border-brand-border pb-px reveal-item delay-100">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'restaurant', label: 'Restaurants' },
            { id: 'fournisseur', label: 'Suppliers' },
            { id: 'pending', label: 'Pending Verification' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                tab === t.id
                  ? 'bg-brand-accent/10 border-t border-x border-brand-accent/20 text-brand-accent'
                  : 'bg-transparent border-t border-x border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Users Table */}
        <div className="glass-card-dark p-8 reveal-item delay-200">
          {users.length > 0 ? (
            <div className="overflow-x-auto border border-brand-border">
              <table className="min-w-full divide-y divide-brand-border text-left">
                <thead className="bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Verified</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-[12px] text-white/80">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-white text-left">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-white/60 text-left font-semibold">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-white/60 text-left font-semibold">
                        {user.city || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        {user.is_verified ? (
                          <span className="px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20">
                            ✗ Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        {!user.is_verified && user.status !== 'banned' && (
                          <button
                            onClick={() => handleVerify(user.id)}
                            className="btn-sharp px-3 py-1.5 text-[10px]"
                          >
                            Verify
                          </button>
                        )}
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => handleBan(user.id)}
                            className="btn-sharp-outline px-3 py-1.5 text-[10px]"
                          >
                            Ban
                          </button>
                        )}
                        {user.status === 'banned' && (
                          <button
                            onClick={() => handleUnban(user.id)}
                            className="btn-sharp-outline px-3 py-1.5 text-[10px] border-white/20 text-white/50"
                          >
                            Unban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-brand-border">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">No users found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const getRoleColor = (role) => {
  switch (role) {
    case 'restaurant':
      return 'bg-white/10 text-white border border-white/20';
    case 'fournisseur':
      return 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20';
    case 'admin':
      return 'bg-white/20 text-white border border-white/30';
    default:
      return 'bg-white/5 text-white/40 border border-white/10';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20';
    case 'banned':
      return 'bg-white/10 text-white/50 border border-white/20';
    case 'pending':
      return 'bg-transparent text-brand-accent border border-brand-accent/50';
    default:
      return 'bg-white/5 text-white/40 border border-white/10';
  }
};

export default AdminUsers;
