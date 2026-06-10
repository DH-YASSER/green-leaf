import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { Printer, Check, X, Truck, Package, Clock, Eye, AlertCircle } from 'lucide-react';
import OrderReceipt from '../../components/OrderReceipt';

const FournisseurOrders = () => {
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
      const response = await axios.get('/api/fournisseur/orders', { params });
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/fournisseur/orders/${orderId}/status`, { status: newStatus });
      // Refetch orders
      const response = await axios.get('/api/fournisseur/orders');
      const allOrders = response.data || [];
      setOrders(statusFilter !== 'all' ? allOrders.filter(o => o.status === statusFilter) : allOrders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return <div className="text-center py-12 text-brand-primary font-bold">Loading orders...</div>;
  if (error) return <div className="text-center py-12 text-brand-terracotta font-bold">{error}</div>;

  return (
    <DashboardLayout title="Order Management" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: false },
      { path: '/fournisseur/products', label: 'Products', active: false },
      { path: '/fournisseur/promotions', label: 'Promotions', active: false },
      { path: '/fournisseur/orders', label: 'Orders', active: true },
      { path: '/fournisseur/messages', label: 'Messages', active: false },
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
                  <th className="px-6 py-4">Restaurant</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
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
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {order.restaurant_name || 'Unknown Restaurant'}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-500">
                          {order.items_count || 0} items
                        </td>
                        <td className="px-6 py-4 font-black text-brand-primary">
                          {order.total_amount} MAD
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                          {new Date(order.created_at).toLocaleDateString()}
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
                                          {item.unit_price} MAD / unit
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

                                  {/* Status Operations */}
                                  <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Update Order Status</p>
                                    <div className="flex gap-2">
                                      {order.status === 'pending' && (
                                        <>
                                          <button
                                            onClick={() => handleStatusChange(order.id, 'confirmed')}
                                            className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 bg-brand-secondary hover:bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                                          >
                                            <Check className="w-3.5 h-3.5" />
                                            Confirm
                                          </button>
                                          <button
                                            onClick={() => handleStatusChange(order.id, 'rejected')}
                                            className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta/90 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                            Reject
                                          </button>
                                        </>
                                      )}
                                      {order.status === 'confirmed' && (
                                        <button
                                          onClick={() => handleStatusChange(order.id, 'delivered')}
                                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                                        >
                                          <Truck className="w-4 h-4" />
                                          Mark as Delivered
                                        </button>
                                      )}
                                      {(order.status === 'delivered' || order.status === 'completed') && (
                                        <div className="w-full flex items-center justify-center gap-2 p-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100">
                                          <Check className="w-4 h-4" />
                                          Order delivered successfully
                                        </div>
                                      )}
                                      {(order.status === 'rejected' || order.status === 'cancelled') && (
                                        <div className="w-full flex items-center justify-center gap-2 p-2 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-100">
                                          <AlertCircle className="w-4 h-4" />
                                          Order cancelled/rejected
                                        </div>
                                      )}
                                    </div>
                                  </div>
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

export default FournisseurOrders;
