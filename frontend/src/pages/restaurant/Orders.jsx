import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Download, Package } from 'lucide-react';
import axios from '../../api/axios';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', labelFr: 'Tous' },
  { value: 'pending', label: 'Pending', labelFr: 'En attente' },
  { value: 'confirmed', label: 'Confirmed', labelFr: 'Confirmée' },
  { value: 'shipped', label: 'Shipped', labelFr: 'Expédiée' },
  { value: 'delivered', label: 'Delivered', labelFr: 'Livrée' },
  { value: 'cancelled', label: 'Cancelled', labelFr: 'Annulée' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first', labelFr: 'Plus récentes' },
  { value: 'oldest', label: 'Oldest first', labelFr: 'Plus anciennes' },
  { value: 'price_high', label: 'Price: High to Low', labelFr: 'Prix décroissant' },
  { value: 'price_low', label: 'Price: Low to High', labelFr: 'Prix croissant' },
];

const statusColor = (s) => {
  switch (s) {
    case 'pending': return { bg: '#FEF3C7', text: '#92400E' };
    case 'confirmed': return { bg: '#DBEAFE', text: '#1E40AF' };
    case 'shipped': return { bg: '#E0E7FF', text: '#3730A3' };
    case 'delivered': return { bg: '#D1FAE5', text: '#065F46' };
    case 'cancelled': return { bg: '#FEE2E2', text: '#991B1B' };
    default: return { bg: '#F3F4F6', text: '#374151' };
  }
};

const Orders = () => {
  const { lang } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showSortDrop, setShowSortDrop] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;
      params.sort = sortBy;

      const res = await axios.get('/api/restaurant/orders', { params });
      setOrders(res.data.data || []);
      setPagination({ current_page: res.data.current_page, last_page: res.data.last_page, total: res.data.total });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, sortBy]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleExport = async () => {
    try {
      const res = await axios.get('/api/restaurant/orders/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      {/* ── TOP NAVIGATION ── */}
      <div style={{ padding: '24px 32px', flexShrink: 0 }}>
        <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
           {lang === 'fr' ? 'Retour aux achats' : 'Back to shopping'}
        </Link>
      </div>

      {/* ── ORDERS CONTENT ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 24px 48px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 400, color: '#1a1a1a', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {lang === 'fr' ? 'Commandes' : 'Orders'}
          </h1>
          <button onClick={handleExport} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#1a1a1a', padding: 0 }}>
            <Download size={16} />
            <span style={{ textDecoration: 'underline' }}>{lang === 'fr' ? 'Télécharger' : 'Download spreadsheet'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={18} color="#999" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={lang === 'fr' ? 'Rechercher dans toutes les commandes' : 'Search all orders'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: 24, border: '1px solid #e8e8e8', fontSize: 14, color: '#1a1a1a', outline: 'none' }}
          />
        </form>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Status Filter */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setShowStatusDrop(!showStatusDrop); setShowSortDrop(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, border: '1px solid #e8e8e8', background: '#fff', fontSize: 14, color: '#1a1a1a', cursor: 'pointer' }}>
                {lang === 'fr' ? (STATUS_OPTIONS.find(s => s.value === statusFilter)?.labelFr) : (STATUS_OPTIONS.find(s => s.value === statusFilter)?.label)} <ChevronDown size={14} color="#555" />
              </button>
              {showStatusDrop && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 50, minWidth: 160, padding: '8px 0' }}>
                  {STATUS_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setShowStatusDrop(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: statusFilter === opt.value ? '#f5f5f5' : 'transparent', fontSize: 14, cursor: 'pointer', color: '#1a1a1a' }}>
                      {lang === 'fr' ? opt.labelFr : opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setShowSortDrop(!showSortDrop); setShowStatusDrop(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, border: '1px solid #e8e8e8', background: '#fff', fontSize: 14, color: '#1a1a1a', cursor: 'pointer' }}>
              {lang === 'fr' ? 'Trier: ' : 'Sort: '}{lang === 'fr' ? SORT_OPTIONS.find(s => s.value === sortBy)?.labelFr : SORT_OPTIONS.find(s => s.value === sortBy)?.label} <ChevronDown size={14} color="#555" />
            </button>
            {showSortDrop && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 50, minWidth: 180, padding: '8px 0' }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSortDrop(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: sortBy === opt.value ? '#f5f5f5' : 'transparent', fontSize: 14, cursor: 'pointer', color: '#1a1a1a' }}>
                    {lang === 'fr' ? opt.labelFr : opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders List or Empty State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
            {lang === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', maxWidth: 400, margin: '80px auto 0' }}>
            <Package size={48} strokeWidth={1} color="#ccc" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 28, fontWeight: 400, color: '#1a1a1a', marginBottom: 16, fontFamily: 'Georgia, serif', letterSpacing: 2, textTransform: 'uppercase' }}>
              {lang === 'fr' ? 'Aucune commande' : 'No orders yet'}
            </h2>
            <p style={{ fontSize: 16, color: '#555', marginBottom: 32 }}>
              {lang === 'fr' ? 'À la recherche d\'idées ?' : 'Looking for ideas?'}
            </p>
            <Link to="/browse" style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid #e8e8e8', borderRadius: 4, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
              {lang === 'fr' ? 'Voir les nouveautés' : 'View New Arrivals'}
            </Link>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
              {pagination.total} {lang === 'fr' ? 'commande(s)' : 'order(s)'}
            </div>
            {orders.map(order => {
              const sc = statusColor(order.status);
              return (
                <div key={order.id} style={{ border: '1px solid #e8e8e8', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
                  <div
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedOrder === order.id ? '#fafafa' : '#fff' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>#{order.id}</span>
                      <span style={{ fontSize: 14, color: '#555' }}>{order.fournisseur?.name}</span>
                      <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, backgroundColor: sc.bg, color: sc.text, fontWeight: 600, textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{Number(order.total_price).toFixed(2)} MAD</span>
                      <span style={{ fontSize: 13, color: '#999' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                      <ChevronDown size={16} color="#999" style={{ transform: expandedOrder === order.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </div>
                  </div>
                  {expandedOrder === order.id && (
                    <div style={{ padding: '0 24px 16px', borderTop: '1px solid #f0f0f0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                            <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Produit' : 'Product'}</th>
                            <th style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Qté' : 'Qty'}</th>
                            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Prix unitaire' : 'Unit Price'}</th>
                            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td style={{ padding: '10px 0', fontSize: 14, color: '#1a1a1a' }}>{item.product_name} {item.promo_applied && <span style={{ color: '#16a34a', fontSize: 11 }}>🏷️ Promo</span>}</td>
                              <td style={{ textAlign: 'center', padding: '10px 0', fontSize: 14, color: '#555' }}>{item.quantity}</td>
                              <td style={{ textAlign: 'right', padding: '10px 0', fontSize: 14, color: '#555' }}>{Number(item.unit_price).toFixed(2)} MAD</td>
                              <td style={{ textAlign: 'right', padding: '10px 0', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{(item.quantity * item.unit_price).toFixed(2)} MAD</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {order.notes && (
                        <div style={{ marginTop: 12, fontSize: 13, color: '#666', fontStyle: 'italic' }}>
                          📝 {order.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => fetchOrders(page)}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: page === pagination.current_page ? '#1a1a1a' : '#f5f5f5', color: page === pagination.current_page ? '#fff' : '#1a1a1a', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Orders;
