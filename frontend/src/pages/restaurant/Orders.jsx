import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  Download,
  PackageCheck,
  PackageSearch,
  RefreshCw,
  Search,
  ShoppingCart,
  Store,
  User,
  XCircle,
} from 'lucide-react';
import axios from '../../api/axios';
import Logo from '../../components/Logo';
import NotificationBell from '../../components/NotificationBell';
import { useAppStore } from '../../store/appStore';

const statusCopy = {
  pending: {
    label: 'Waiting for supplier',
    tone: '#8a5a00',
    bg: '#fff7df',
    border: '#f3d58a',
  },
  confirmed: {
    label: 'Accepted',
    tone: '#176047',
    bg: '#eaf8f0',
    border: '#a8dec2',
  },
  delivered: {
    label: 'Delivered',
    tone: '#1f6f3d',
    bg: '#e7f7e9',
    border: '#9ad2a2',
  },
  rejected: {
    label: 'Rejected',
    tone: '#9b1c1c',
    bg: '#fff0f0',
    border: '#efb0b0',
  },
  cancelled: {
    label: 'Cancelled',
    tone: '#6f1d1b',
    bg: '#fff0f0',
    border: '#efb0b0',
  },
};

const filters = [
  { value: 'all', label: 'All orders' },
  { value: 'pending', label: 'Waiting' },
  { value: 'confirmed', label: 'Accepted' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price_high', label: 'Highest total' },
  { value: 'price_low', label: 'Lowest total' },
];

const timelineSteps = [
  { key: 'pending', title: 'Order placed', detail: 'Sent to the supplier' },
  { key: 'confirmed', title: 'Accepted', detail: 'Supplier is preparing it' },
  { key: 'delivered', title: 'Delivered', detail: 'Order completed' },
];

const formatMoney = (value) => `${Number(value || 0).toFixed(2)} MAD`;

const formatDate = (value) => {
  if (!value) return 'Date unavailable';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getStatus = (status) => statusCopy[status] || {
  label: status || 'Unknown',
  tone: '#374151',
  bg: '#f4f4f2',
  border: '#deded8',
};

function StatusBadge({ status }) {
  const meta = getStatus(status);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1px solid ${meta.border}`,
        background: meta.bg,
        color: meta.tone,
        borderRadius: 999,
        padding: '5px 10px',
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {meta.label}
    </span>
  );
}

function OrderTimeline({ status }) {
  const isStopped = status === 'rejected' || status === 'cancelled';
  const currentIndex = status === 'delivered' ? 2 : status === 'confirmed' ? 1 : 0;

  return (
    <div className="ro-timeline" aria-label="Order tracking">
      {timelineSteps.map((step, index) => {
        const done = !isStopped && index <= currentIndex;
        const active = !isStopped && index === currentIndex;
        return (
          <div className={`ro-step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`} key={step.key}>
            <span className="ro-step-dot">{done ? <Check size={13} /> : index + 1}</span>
            <span>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </span>
          </div>
        );
      })}
      {isStopped && (
        <div className="ro-step is-stopped">
          <span className="ro-step-dot"><XCircle size={13} /></span>
          <span>
            <strong>{status === 'cancelled' ? 'Cancelled' : 'Rejected'}</strong>
            <small>This order will not continue</small>
          </span>
        </div>
      )}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="ro-list" aria-label="Loading orders">
      {[0, 1, 2].map((item) => (
        <div className="ro-card ro-skeleton" key={item}>
          <div />
          <div />
          <div />
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const { lang } = useAppStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page,
        sort: sortBy,
      };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (submittedSearch.trim()) params.search = submittedSearch.trim();

      const response = await axios.get('/api/restaurant/orders', { params });
      const payload = response.data || {};
      const nextOrders = Array.isArray(payload.data) ? payload.data : [];

      setOrders(nextOrders);
      setPagination({
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
        total: payload.total || nextOrders.length,
      });
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      setOrders([]);
      setError(
        status === 403
          ? (lang === 'fr' ? 'Votre compte restaurant doit etre verifie avant de suivre les commandes.' : 'Your restaurant account must be verified before you can track orders.')
          : message || (lang === 'fr' ? 'Les commandes ne peuvent pas charger pour le moment.' : 'Orders could not load right now. Try again in a moment.')
      );
    } finally {
      setLoading(false);
    }
  }, [sortBy, statusFilter, submittedSearch, lang]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const summary = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc.total += Number(order.total_price || 0);
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, { total: 0 });
  }, [orders]);

  const submitSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(search);
  };

  const exportOrders = async () => {
    try {
      const response = await axios.get('/api/restaurant/orders/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `greenleaf-orders-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(lang === 'fr' ? 'L export ne peut pas etre cree pour le moment.' : 'The export could not be created right now.');
    }
  };

  return (
    <main className="restaurant-orders-page">
      <style>{`
        .restaurant-orders-page {
          min-height: 100vh;
          background: var(--page-bg, #faf9f6);
          color: var(--page-text, #1a1a1a);
          padding: 0 0 56px;
          font-family: Inter, system-ui, sans-serif;
        }

        .ro-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: var(--nav-bg, rgba(250,250,249,.96));
          border-bottom: 1px solid var(--nav-border, rgba(31,36,33,.08));
          backdrop-filter: blur(18px);
        }

        .ro-nav-inner {
          max-width: 1280px;
          height: 68px;
          margin: 0 auto;
          padding: 0 clamp(18px, 4vw, 48px);
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .ro-nav-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          flex: 0 0 auto;
        }

        .ro-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted, #62675f);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .ro-nav-link:hover {
          color: var(--page-text, #1a1a1a);
        }

        .ro-nav-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ro-nav-icon {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--btn-icon-text, #4f554d);
          border: 1px solid var(--btn-icon-border, rgba(31,36,33,.1));
          border-radius: 999px;
          background: transparent;
          text-decoration: none;
        }

        .ro-nav-icon:hover {
          background: var(--btn-icon-hover-bg, rgba(31,36,33,.06));
          color: var(--page-text, #1a1a1a);
        }

        .ro-shell {
          max-width: 1240px;
          margin: 0 auto;
          padding: 34px clamp(18px, 4vw, 48px) 0;
        }

        .ro-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted, #4f514c);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .ro-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          margin-bottom: 28px;
          border: 1px solid var(--page-border, rgba(31,36,33,.08));
          background: var(--card-bg, #fff);
          border-radius: 10px;
          padding: clamp(22px, 4vw, 36px);
        }

        .ro-eyebrow {
          margin: 0 0 8px;
          color: var(--accent-color, #2d9b4f);
          font-family: 'DM Mono', ui-monospace, monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .ro-header h1 {
          margin: 0;
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(34px, 4.4vw, 56px);
          font-weight: 400;
          line-height: .98;
          letter-spacing: 0;
          text-transform: none;
        }

        .ro-header p {
          margin: 12px 0 0;
          max-width: 620px;
          color: var(--text-muted, #666b62);
          font-size: 15px;
          line-height: 1.6;
        }

        .ro-export,
        .ro-retry,
        .ro-empty a,
        .ro-pagination button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          border: 1px solid var(--btn-primary-bg, #20231f);
          background: var(--btn-primary-bg, #20231f);
          color: var(--btn-primary-text, #fff);
          border-radius: 6px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        }

        .ro-export:hover,
        .ro-retry:hover,
        .ro-empty a:hover {
          opacity: var(--btn-primary-hover, .88);
        }

        .ro-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .ro-stat {
          border: 1px solid var(--page-border, rgba(0,0,0,.08));
          background: var(--card-bg, #fff);
          border-radius: 8px;
          padding: 16px;
        }

        .ro-stat span {
          display: block;
          color: var(--text-muted, #74776f);
          font-family: 'DM Mono', ui-monospace, monospace;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 8px;
        }

        .ro-stat strong {
          display: block;
          font-size: 24px;
        }

        .ro-toolbar {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) 190px 180px;
          gap: 12px;
          margin-bottom: 20px;
        }

        .ro-search,
        .ro-select {
          height: 46px;
          border: 1px solid var(--input-border, rgba(0,0,0,.1));
          background: var(--input-bg, #fff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .ro-search input,
        .ro-select select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--input-text, #20231f);
          font-size: 14px;
        }

        .ro-select select {
          appearance: none;
          cursor: pointer;
        }

        .ro-list {
          display: grid;
          gap: 14px;
        }

        .ro-card {
          border: 1px solid var(--page-border, rgba(0,0,0,.09));
          background: var(--card-bg, #fff);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(20, 27, 31, .06);
        }

        .ro-card-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px;
          padding: 20px;
          cursor: pointer;
        }

        .ro-title-row,
        .ro-meta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .ro-title-row h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: 0;
          text-transform: none;
        }

        .ro-meta-row {
          margin-top: 10px;
          color: var(--text-muted, #656960);
          font-size: 13px;
        }

        .ro-total {
          text-align: right;
        }

        .ro-total strong {
          display: block;
          font-size: 20px;
          margin-bottom: 9px;
        }

        .ro-timeline {
          border-top: 1px solid var(--page-border, rgba(0,0,0,.07));
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
          padding: 18px 20px;
          background: var(--card-hover-bg, #fbfbf8);
        }

        .ro-step {
          position: relative;
          display: flex;
          gap: 10px;
          color: #8a8d86;
          min-width: 0;
        }

        .ro-step:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 13px;
          left: 30px;
          right: 12px;
          height: 2px;
          background: var(--page-border, #dcded8);
        }

        .ro-step.is-done:not(:last-child)::after {
          background: var(--accent-color, #2d9b4f);
        }

        .ro-step-dot {
          position: relative;
          z-index: 1;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid var(--page-border, #d6d8d2);
          background: var(--card-bg, #fff);
          color: var(--text-muted, #777b72);
          font-size: 12px;
          font-weight: 800;
        }

        .ro-step.is-done .ro-step-dot {
          background: var(--accent-color, #2d9b4f);
          border-color: var(--accent-color, #2d9b4f);
          color: var(--btn-primary-text, #fff);
        }

        .ro-step.is-stopped .ro-step-dot {
          background: #a32929;
          border-color: #a32929;
          color: #fff;
        }

        .ro-step strong {
          display: block;
          color: var(--page-text, #22241f);
          font-size: 13px;
        }

        .ro-step small {
          display: block;
          margin-top: 3px;
          font-size: 12px;
          line-height: 1.35;
        }

        .ro-details {
          border-top: 1px solid var(--page-border, rgba(0,0,0,.07));
          padding: 0 20px 20px;
        }

        .ro-items {
          width: 100%;
          border-collapse: collapse;
          margin-top: 18px;
          font-size: 14px;
        }

        .ro-items th {
          text-align: left;
          color: var(--text-muted, #74776f);
          font-size: 11px;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 0 0 10px;
        }

        .ro-items td {
          border-top: 1px solid var(--page-border, rgba(0,0,0,.06));
          padding: 12px 0;
          color: var(--page-text, #343731);
        }

        .ro-items th:not(:first-child),
        .ro-items td:not(:first-child) {
          text-align: right;
        }

        .ro-note {
          margin-top: 12px;
          border: 1px solid #e6e2d8;
          background: #fffaf0;
          border-radius: 8px;
          padding: 12px;
          color: #5d5546;
          font-size: 13px;
        }

        .ro-alert,
        .ro-empty {
          border: 1px solid var(--page-border, rgba(0,0,0,.09));
          background: var(--card-bg, #fff);
          border-radius: 8px;
          padding: 28px;
        }

        .ro-alert {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: #6f1d1b;
        }

        .ro-alert div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ro-empty {
          text-align: center;
          padding: 64px 24px;
        }

        .ro-empty h2 {
          margin: 16px 0 8px;
          letter-spacing: 0;
          text-transform: none;
        }

        .ro-empty p {
          margin: 0 auto 22px;
          max-width: 420px;
          color: var(--text-muted, #666b62);
          line-height: 1.6;
        }

        .ro-pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .ro-pagination button {
          width: 42px;
          padding: 0;
          background: var(--card-bg, #fff);
          color: var(--page-text, #20231f);
        }

        .ro-pagination button.is-active {
          background: var(--btn-primary-bg, #20231f);
          color: var(--btn-primary-text, #fff);
        }

        .ro-skeleton {
          min-height: 158px;
          padding: 20px;
        }

        .ro-skeleton div {
          height: 16px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(120,120,120,.12), rgba(120,120,120,.22), rgba(120,120,120,.12));
          background-size: 200% 100%;
          animation: ro-pulse 1.2s linear infinite;
          margin-bottom: 14px;
        }

        .ro-skeleton div:nth-child(1) { width: 42%; }
        .ro-skeleton div:nth-child(2) { width: 70%; }
        .ro-skeleton div:nth-child(3) { width: 55%; }

        @keyframes ro-pulse {
          to { background-position: -200% 0; }
        }

        @media (max-width: 820px) {
          .ro-nav-inner {
            gap: 14px;
          }

          .ro-nav-link {
            display: none;
          }

          .ro-header,
          .ro-toolbar,
          .ro-card-main {
            grid-template-columns: 1fr;
          }

          .ro-total {
            text-align: left;
          }

          .ro-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ro-timeline {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .ro-step:not(:last-child)::after {
            left: 13px;
            right: auto;
            top: 30px;
            bottom: -12px;
            width: 2px;
            height: auto;
          }

          .ro-items {
            min-width: 560px;
          }

          .ro-details {
            overflow-x: auto;
          }
        }
      `}</style>

      <nav className="ro-nav">
        <div className="ro-nav-inner">
          <Link to="/" className="ro-nav-logo" aria-label="GreenLeaf">
            <Logo size={30} textColor="var(--page-text)" leafColor="var(--accent-color)" subtextColor="var(--text-muted)" />
          </Link>
          <Link className="ro-nav-link" to="/browse">
            {lang === 'fr' ? 'Retour aux achats' : 'Back to shopping'}
          </Link>
          <div className="ro-nav-actions">
            <NotificationBell buttonClassName="ro-nav-icon" iconSize={18} />
            <Link className="ro-nav-icon" to="/cart" aria-label="Cart"><ShoppingCart size={18} /></Link>
            <Link className="ro-nav-icon" to="/restaurant/settings" aria-label="Account"><User size={18} /></Link>
          </div>
        </div>
      </nav>

      <div className="ro-shell">
        <Link className="ro-back" to="/browse">{lang === 'fr' ? 'Retour au marche' : 'Back to marketplace'}</Link>

        <section className="ro-header">
          <div>
            <p className="ro-eyebrow">{lang === 'fr' ? 'Espace restaurant' : 'Restaurant portal'}</p>
            <h1>{lang === 'fr' ? 'Suivi des commandes' : 'Order tracking'}</h1>
            <p>{lang === 'fr' ? 'Suivez chaque commande fournisseur, avec les produits, les totaux, les notes et le statut en direct.' : 'Follow every supplier order from request to acceptance and delivery, with products, totals, notes, and live status in one clean view.'}</p>
          </div>
          <button className="ro-export" type="button" onClick={exportOrders}>
            <Download size={16} />
            {lang === 'fr' ? 'Exporter' : 'Export orders'}
          </button>
        </section>

        <section className="ro-stats" aria-label="Order summary">
          <div className="ro-stat">
            <span>{lang === 'fr' ? 'Commandes' : 'Total orders'}</span>
            <strong>{pagination.total}</strong>
          </div>
          <div className="ro-stat">
            <span>{lang === 'fr' ? 'En attente' : 'Waiting'}</span>
            <strong>{summary.pending || 0}</strong>
          </div>
          <div className="ro-stat">
            <span>{lang === 'fr' ? 'Acceptees' : 'Accepted'}</span>
            <strong>{summary.confirmed || 0}</strong>
          </div>
          <div className="ro-stat">
            <span>{lang === 'fr' ? 'Total visible' : 'Visible total'}</span>
            <strong>{formatMoney(summary.total)}</strong>
          </div>
        </section>

        <form className="ro-toolbar" onSubmit={submitSearch}>
          <label className="ro-search">
            <Search size={17} color="#656960" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={lang === 'fr' ? 'Chercher une commande ou fournisseur' : 'Search order number or supplier'}
            />
          </label>

          <label className="ro-select">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
            <ChevronDown size={16} color="#656960" />
          </label>

          <label className="ro-select">
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown size={16} color="#656960" />
          </label>
        </form>

        {error && (
          <section className="ro-alert">
            <div>
              <AlertCircle size={20} />
              <strong>{error}</strong>
            </div>
            <button className="ro-retry" type="button" onClick={() => fetchOrders(pagination.current_page)}>
              <RefreshCw size={15} />
              {lang === 'fr' ? 'Reessayer' : 'Retry'}
            </button>
          </section>
        )}

        {loading ? (
          <LoadingRows />
        ) : !error && orders.length === 0 ? (
          <section className="ro-empty">
            <PackageSearch size={42} color="#6f756b" />
            <h2>{lang === 'fr' ? 'Aucune commande' : 'No orders yet'}</h2>
            <p>{lang === 'fr' ? 'Quand vous passez une commande, elle apparait ici avec son statut.' : 'Once you place an order from the marketplace, it will appear here with supplier acceptance and delivery tracking.'}</p>
            <Link to="/browse">{lang === 'fr' ? 'Explorer' : 'Start shopping'}</Link>
          </section>
        ) : !error ? (
          <>
            <section className="ro-list">
              {orders.map((order) => {
                const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
                const isExpanded = expandedOrder === order.id;

                return (
                  <article className="ro-card" key={order.id}>
                    <div
                      className="ro-card-main"
                      role="button"
                      tabIndex={0}
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setExpandedOrder(isExpanded ? null : order.id);
                        }
                      }}
                    >
                      <div>
                        <div className="ro-title-row">
                          <h2>Order #{order.id}</h2>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="ro-meta-row">
                          <span><Store size={14} /> {order.fournisseur?.name || 'Supplier'}</span>
                          <span><Clock size={14} /> {formatDate(order.created_at)}</span>
                          <span><PackageCheck size={14} /> {itemCount} item{itemCount === 1 ? '' : 's'}</span>
                        </div>
                      </div>
                      <div className="ro-total">
                        <strong>{formatMoney(order.total_price)}</strong>
                        <ChevronDown
                          size={18}
                          color="#656960"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s ease' }}
                        />
                      </div>
                    </div>

                    <OrderTimeline status={order.status} />

                    {isExpanded && (
                      <div className="ro-details">
                        <table className="ro-items">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty</th>
                              <th>Unit price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order.items || []).map((item) => (
                              <tr key={item.id}>
                                <td>
                                  {item.product_name || item.product?.name || 'Product'}
                                  {item.promo_applied ? ' - promo applied' : ''}
                                </td>
                                <td>{item.quantity}</td>
                                <td>{formatMoney(item.unit_price)}</td>
                                <td>{formatMoney(Number(item.quantity || 0) * Number(item.unit_price || 0))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {order.notes && <div className="ro-note">Note: {order.notes}</div>}
                      </div>
                    )}
                  </article>
                );
              })}
            </section>

            {pagination.last_page > 1 && (
              <nav className="ro-pagination" aria-label="Order pages">
                {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
                  <button
                    className={page === pagination.current_page ? 'is-active' : ''}
                    key={page}
                    type="button"
                    onClick={() => fetchOrders(page)}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}
