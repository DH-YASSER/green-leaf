import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { Printer, Eye, X, AlertCircle } from 'lucide-react';
import OrderReceipt from '../../components/OrderReceipt';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, confirmed, delivered, rejected
  const [expandedOrderId, setExpandedOrderId] = useState(null); // ID of the expanded order row
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

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

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: 'cancelled' });
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <div className="text-center py-12 text-brand-primary font-bold">Loading orders...</div>;
  if (error) return <div className="text-center py-12 text-brand-terracotta font-bold">{error}</div>;

  return (
    <DashboardLayout title="Order Management" navLinks={[
      { path: '/restaurant/dashboard', label: 'Dashboard', active: false },
      { path: '/restaurant/orders', label: 'Orders', active: true },
      { path: '/restaurant/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-6 pb-12">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-4">
          {['all', 'pending', 'confirmed', 'delivered', 'rejected'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 text-slate-400 text-3xs font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-sm">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <React.Fragment key={order.id}>
                      {/* Order Row */}
                      <tr
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                          expandedOrderId === order.id ? 'bg-brand-highlight/10' : ''
                        }`}
                        onClick={() => {
                          setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
                        }}
                      >
                        <td className="px-6 py-4 font-bold text-brand-terracotta">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {order.fournisseur_name || 'Unknown Supplier'}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-black text-brand-primary">
                          {order.total_amount} MAD
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-2xs leading-5 font-black uppercase tracking-wider rounded-full border ${getStatusStyles(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-bold">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {expandedOrderId === order.id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Order Details */}
                      {expandedOrderId === order.id && (
                        <tr className="bg-brand-highlight/5">
                          <td colSpan="6" className="px-6 py-6 border-y border-brand-primary/5">
                            <div className="space-y-6">
                              {/* Order Items */}
                              <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Order Items / Articles de la Commande</h3>
                                {order.items && order.items.length > 0 ? (
                                  <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-b-0 last:pb-0">
                                        <span className="font-bold text-slate-700">
                                          {item.product_name} <span className="text-xs font-medium text-slate-400">({item.quantity} {item.unit || 'Kg'})</span>
                                        </span>
                                        <span className="font-black text-brand-primary">
                                          {item.unit_price} MAD each
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-slate-500">No items details available</p>
                                )}
                              </div>

                              {/* Totals & Actions Grid */}
                              <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-slate-100">
                                <div>
                                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Invoice Summary</h3>
                                  <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 text-sm font-bold">
                                    <div className="flex justify-between text-slate-500">
                                      <span>Subtotal</span>
                                      <span>{order.subtotal} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                      <span>Discount</span>
                                      <span>{order.discount || 0} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                      <span>Tax</span>
                                      <span>{order.tax || 0} MAD</span>
                                    </div>
                                    <div className="flex justify-between items-center text-brand-primary font-black text-base pt-2 border-t border-slate-50">
                                      <span>Total</span>
                                      <span>{order.total_amount} MAD</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Operations</h3>
                                  
                                  {/* Print Invoice Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedInvoiceOrder(order);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all cursor-pointer"
                                  >
                                    <Printer className="w-4 h-4" />
                                    Generate B2B Invoice Receipt
                                  </button>

                                  {/* Cancel Order Action */}
                                  {order.status === 'pending' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelOrder(order.id);
                                      }}
                                      className="w-full flex items-center justify-center gap-2 py-3 bg-brand-terracotta hover:bg-brand-terracotta/90 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                      Cancel Order Request
                                    </button>
                                  )}

                                  {order.status !== 'pending' && (
                                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                                      <span className="text-xs text-slate-400 font-bold italic">Order is locked in {order.status} state.</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                      No orders found under this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice receipt print overlay */}
      {selectedInvoiceOrder && (
        <OrderReceipt 
          order={selectedInvoiceOrder} 
          onClose={() => setSelectedInvoiceOrder(null)} 
        />
      )}
    </DashboardLayout>
  );
};

// Helper function to get status styles
const getStatusStyles = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'confirmed':
    case 'accepted':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'delivered':
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'rejected':
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export default RestaurantOrders;
