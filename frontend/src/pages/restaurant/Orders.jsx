import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, confirmed, delivered, rejected
  const [expandedOrderId, setExpandedOrderId] = useState(null); // ID of the expanded order row

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }
        const response = await axios.get('/api/restaurant/orders', { params });
        setOrders(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="Order Management" navLinks={[
      { path: '/restaurant/dashboard', label: 'Dashboard', active: false },
      { path: '/restaurant/orders', label: 'Orders', active: true },
      { path: '/restaurant/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'all'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'pending'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'confirmed'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'delivered'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Delivered
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'rejected'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Rejected
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <>
                      {/* Order Row */}
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 cursor-pointer ${expandedOrderId === order.id ? 'bg-indigo-50' : ''}`}
                        onClick={() => {
                          setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          {expandedOrderId === order.id ? (
                            <span className="text-indigo-600">▲</span>
                          ) : (
                            <span className="text-gray-600">▼</span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Order Details */}
                      {expandedOrderId === order.id && (
                        <tr className="bg-indigo-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="space-y-4">
                              <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                                {order.items && order.items.length > 0 ? (
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between text-sm">
                                        <span className="text-gray-700">
                                          {item.product_name} ({item.quantity} {item.unit || ''})
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                          {item.unit_price} MAD each
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500">No items details available</p>
                                )}
                              </div>

                              <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                  <div>
                                    <p className="text-sm text-gray-500">Subtotal</p>
                                    <p className="text-sm font-medium text-gray-900">{order.subtotal} MAD</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Discount</p>
                                    <p className="text-sm font-medium text-gray-900">{order.discount || 0} MAD</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Tax</p>
                                    <p className="text-sm font-medium text-gray-900">{order.tax || 0} MAD</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-sm font-medium text-gray-900">{order.total_amount} MAD</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No orders found
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

export default RestaurantOrders;