import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { ArrowLeft, ArrowRight, ClipboardList } from 'lucide-react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/admin/logs?page=${page}`);
        setLogs(response.data.logs || []);
        setTotalPages(response.data.total_pages || 1);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  if (loading) {
    return (
      <DashboardLayout title="Audit Logs" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: false },
        { path: '/admin/promotions', label: 'Promotions', active: false },
        { path: '/admin/logs', label: 'Logs', active: true },
      ]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-20 gap-4">
          <div className="animate-spin h-8 w-8 border-2 border-brand-primary border-t-transparent"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Loading logs...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Audit Logs" navLinks={[
        { path: '/admin/dashboard', label: 'Dashboard', active: false },
        { path: '/admin/users', label: 'Users', active: false },
        { path: '/admin/orders', label: 'Orders', active: false },
        { path: '/admin/promotions', label: 'Promotions', active: false },
        { path: '/admin/logs', label: 'Logs', active: true },
      ]}>
        <div className="text-center py-20 bg-brand-surface border border-white/[0.04]">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-brand-terracotta">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Audit Logs" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: false },
      { path: '/admin/users', label: 'Users', active: false },
      { path: '/admin/orders', label: 'Orders', active: false },
      { path: '/admin/promotions', label: 'Promotions', active: false },
      { path: '/admin/logs', label: 'Logs', active: true },
    ]}>
      <div className="space-y-6 pb-12">
        {/* Logs Table */}
        <div className="bg-brand-surface border border-white/[0.04] p-8">
          <div className="flex items-center gap-2 mb-8 text-white/70">
            <ClipboardList className="w-4 h-4 text-brand-primary" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">System Action Logs</h3>
          </div>
          
          {logs.length > 0 ? (
            <div className="overflow-x-auto border border-white/[0.04]">
              <table className="min-w-full divide-y divide-white/[0.04] text-left">
                <thead className="bg-white/[0.01] text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Admin</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Target</th>
                    <th className="px-6 py-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[12px] text-white/60">
                  {logs.map((log, index) => (
                    <tr key={index} className="hover:bg-white/[0.01]">
                      <td className="px-6 py-4 font-bold text-white/80">
                        {log.admin_name || 'Unknown Admin'}
                      </td>
                      <td className="px-6 py-4 text-white/80 font-bold">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-white/40 font-semibold">
                        {log.target_type} #{log.target_id}
                      </td>
                      <td className="px-6 py-4 text-white/30 text-right">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.01] border border-dashed border-white/10">
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">No logs found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8 pt-6 border-t border-white/[0.04]">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-40 text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-40 text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLogs;
