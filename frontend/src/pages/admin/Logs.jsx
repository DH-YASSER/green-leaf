import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';

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
        // Assuming the response includes data and pagination info
        setLogs(response.data.logs || []); // Adjust based on actual API response
        setTotalPages(response.data.total_pages || 1);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="Audit Logs" navLinks={[
      { path: '/admin/dashboard', label: 'Dashboard', active: false },
      { path: '/admin/users', label: 'Users', active: false },
      { path: '/admin/orders', label: 'Orders', active: false },
      { path: '/admin/promotions', label: 'Promotions', active: false },
      { path: '/admin/logs', label: 'Logs', active: true },
    ]}>
      <div className="space-y-6">
        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.admin_name || 'Unknown Admin'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.target_type} #{log.target_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-6">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-3 text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminLogs;