import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { LogoMark } from '../../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ShoppingBag, Store, MessageSquare,
  Settings, LogOut, Globe, Sun, Moon, Bell, TrendingUp,
  Search, Eye, Check, X, Ban,
  AlertTriangle, ArrowUpRight, ArrowDownRight,
  RefreshCw, Download, Shield, Activity,
  UserCheck, ClipboardList,
  ChevronRight, AlertCircle, BarChart2,
  Package, Zap, Filter, MoreHorizontal,
} from 'lucide-react';

// ─── THEMES (matching RestaurantApp palette exactly) ──────────────────────
const THEMES = {
  dark: {
    '--page-bg':               '#0A0E12',
    '--page-text':             '#E8E8E8',
    '--text-muted':            'rgba(232,232,232,0.70)',
    '--text-low':              'rgba(232,232,232,0.40)',
    '--page-border':           'rgba(255, 255, 255, 0.06)',
    '--accent-color':          '#4CAF50',
    '--accent-gold':           '#FFB74D',
    '--nav-bg':                'rgba(10,14,18,0.98)',
    '--nav-border':            'rgba(255, 255, 255, 0.06)',
    '--sidebar-bg':            '#0D2B24',
    '--sidebar-border':        'rgba(76, 175, 80, 0.10)',
    '--sidebar-link':          'rgba(232,232,232,0.70)',
    '--sidebar-link-hover':    '#E8E8E8',
    '--sidebar-active-bg':     'rgba(76, 175, 80, 0.15)',
    '--sidebar-active-text':   '#4CAF50',
    '--btn-primary-bg':        '#4CAF50',
    '--btn-primary-text':      '#FFFFFF',
    '--btn-primary-hover':     '0.90',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#B0B0B0',
    '--btn-secondary-border':  'rgba(255, 255, 255, 0.12)',
    '--btn-icon-border':       'rgba(255, 255, 255, 0.08)',
    '--btn-icon-text':         '#B0B0B0',
    '--btn-icon-hover-bg':     'rgba(255, 255, 255, 0.08)',
    '--card-bg':               '#141B1F',
    '--card-border':           'rgba(76, 175, 80, 0.08)',
    '--card-title':            '#E8E8E8',
    '--card-body':             'rgba(232,232,232,0.70)',
    '--card-hover-bg':         'rgba(255, 255, 255, 0.04)',
    '--input-bg':              'rgba(255, 255, 255, 0.04)',
    '--input-border':          'rgba(76, 175, 80, 0.20)',
    '--input-text':            '#E8E8E8',
    '--input-placeholder':     'rgba(232,232,232,0.40)',
    '--input-focus-border':    '#4CAF50',
    '--status-pending-bg':     'rgba(255, 152, 0, 0.12)',
    '--status-pending-text':   'rgba(255, 152, 0, 0.90)',
    '--status-success-bg':     'rgba(76, 175, 80, 0.12)',
    '--status-success-text':   '#4CAF50',
    '--status-failed-bg':      'rgba(244, 67, 54, 0.12)',
    '--status-failed-text':    'rgba(244, 67, 54, 0.90)',
    '--status-info-bg':        'rgba(33, 150, 243, 0.12)',
    '--status-info-text':      'rgba(33, 150, 243, 0.90)',
    '--bg':          '#0A0E12',
    '--bg2':         '#141B1F',
    '--text':        '#E8E8E8',
    '--textMid':     'rgba(232,232,232,0.70)',
    '--textLow':     'rgba(232,232,232,0.40)',
    '--sulu':        '#4CAF50',
    '--suluLo':      'rgba(76, 175, 80, 0.10)',
    '--suluMd':      'rgba(76, 175, 80, 0.20)',
    '--silver':      '#B0B0B0',
    '--silverLo':    'rgba(255, 255, 255, 0.08)',
    '--border':      'rgba(255, 255, 255, 0.06)',
    '--border2':     'rgba(255, 255, 255, 0.10)',
    '--danger':      'rgba(244, 67, 54, 0.90)',
    '--dangerLo':    'rgba(244, 67, 54, 0.10)',
    '--amber':       'rgba(255, 152, 0, 0.90)',
    '--amberLo':     'rgba(255, 152, 0, 0.12)',
    '--blue':        'rgba(33, 150, 243, 0.90)',
    '--blueLo':      'rgba(33, 150, 243, 0.12)',
  },
  light: {
    '--page-bg':               '#F8FAFB',
    '--page-text':             '#1A1A1A',
    '--text-muted':            'rgba(26,26,26,0.65)',
    '--text-low':              'rgba(26,26,26,0.45)',
    '--page-border':           'rgba(0, 0, 0, 0.06)',
    '--accent-color':          '#2D9B4F',
    '--accent-gold':           '#D4A574',
    '--nav-bg':                'rgba(255,255,255,0.98)',
    '--nav-border':            'rgba(0, 0, 0, 0.08)',
    '--sidebar-bg':            '#E8F5E9',
    '--sidebar-border':        'rgba(0, 0, 0, 0.06)',
    '--sidebar-link':          'rgba(26,26,26,0.70)',
    '--sidebar-link-hover':    '#1A1A1A',
    '--sidebar-active-bg':     'rgba(45,155,79,0.10)',
    '--sidebar-active-text':   '#2D9B4F',
    '--btn-primary-bg':        '#2D9B4F',
    '--btn-primary-text':      '#F5F5F5',
    '--btn-primary-hover':     '0.92',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#666666',
    '--btn-secondary-border':  'rgba(0, 0, 0, 0.15)',
    '--btn-icon-border':       'rgba(0, 0, 0, 0.08)',
    '--btn-icon-text':         '#666666',
    '--btn-icon-hover-bg':     'rgba(0, 0, 0, 0.05)',
    '--card-bg':               '#FAF9F6',
    '--card-border':           'rgba(0, 0, 0, 0.08)',
    '--card-title':            '#1A1A1A',
    '--card-body':             'rgba(26,26,26,0.70)',
    '--card-hover-bg':         'rgba(0, 0, 0, 0.02)',
    '--input-bg':              '#FFFFFF',
    '--input-border':          'rgba(0, 0, 0, 0.12)',
    '--input-text':            '#1A1A1A',
    '--input-placeholder':     'rgba(26,26,26,0.45)',
    '--input-focus-border':    '#2D9B4F',
    '--status-pending-bg':     'rgba(245,158,11,0.12)',
    '--status-pending-text':   'rgba(200,120,0,0.95)',
    '--status-success-bg':     'rgba(45,155,79,0.12)',
    '--status-success-text':   '#2D9B4F',
    '--status-failed-bg':      'rgba(220,53,69,0.12)',
    '--status-failed-text':    'rgba(220,53,69,0.95)',
    '--status-info-bg':        'rgba(25,118,210,0.12)',
    '--status-info-text':      'rgba(25,118,210,0.95)',
    '--bg':          '#F8FAFB',
    '--bg2':         '#FFFFFF',
    '--text':        '#1A1A1A',
    '--textMid':     'rgba(26,26,26,0.70)',
    '--textLow':     'rgba(26,26,26,0.45)',
    '--sulu':        '#2D9B4F',
    '--suluLo':      'rgba(45,155,79,0.10)',
    '--suluMd':      'rgba(45,155,79,0.20)',
    '--silver':      '#666666',
    '--silverLo':    'rgba(0, 0, 0, 0.08)',
    '--border':      'rgba(0, 0, 0, 0.08)',
    '--border2':     'rgba(0, 0, 0, 0.12)',
    '--danger':      'rgba(220,53,69,0.95)',
    '--dangerLo':    'rgba(220,53,69,0.10)',
    '--amber':       'rgba(200,120,0,0.95)',
    '--amberLo':     'rgba(245,158,11,0.12)',
    '--blue':        'rgba(25,118,210,0.95)',
    '--blueLo':      'rgba(25,118,210,0.12)',
  },
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────
const T = {
  fr: {
    nav: {
      overview: 'Vue d\'ensemble', users: 'Utilisateurs', suppliers: 'Fournisseurs',
      orders: 'Commandes', analytics: 'Analytiques', settings: 'Paramètres',
    },
    topbar: { title: 'Admin Console', logout: 'Déconnexion' },
    confirm: { title: 'Confirmer l\'action', cancel: 'Annuler', confirm: 'Confirmer' },
    errors: { loadFailed: 'Échec du chargement.', actionFailed: 'Action échouée.', retry: 'Réessayer' },
    pagination: { prev: '← Précédent', next: 'Suivant →', of: 'sur', rows: 'lignes' },
    overview: {
      eyebrow: 'Tableau de bord', title: 'Vue d\'ensemble',
      stats: [
        { label: 'Utilisateurs actifs', key: 'activeUsers' },
        { label: 'Fournisseurs vérifiés', key: 'verifiedSuppliers' },
        { label: 'Commandes totales', key: 'totalOrders' },
        { label: 'Volume total (MAD)', key: 'totalVolume' },
      ],
      activity: 'Activité récente', actSub: 'Dernières actions système',
      alerts: 'Alertes', alertSub: 'Éléments nécessitant une action',
      breakdown: 'Répartition des statuts', bkSub: 'Commandes par statut',
      topSup: 'Top fournisseurs', topSupSub: 'Par volume de commandes',
      noAlerts: 'Aucune alerte', noData: 'Aucune donnée',
    },
    users: {
      eyebrow: 'Gestion', title: 'Utilisateurs',
      filters: ['Tous', 'Actifs', 'Suspendus', 'En attente'],
      filterVals: ['all', 'active', 'suspended', 'pending'],
      cols: ['Nom', 'Email', 'Rôle', 'Statut', 'Inscrit', 'Actions'],
      ban: 'Suspendre', unban: 'Réactiver',
      noData: 'Aucun utilisateur',
      confirmBan: 'Suspendre cet utilisateur ? Il ne pourra plus se connecter.',
      confirmUnban: 'Réactiver cet utilisateur ?',
    },
    suppliers: {
      eyebrow: 'Gestion', title: 'Fournisseurs',
      filters: ['Tous', 'Vérifiés', 'En attente', 'Suspendus'],
      filterVals: ['all', 'verified', 'pending', 'suspended'],
      cols: ['Fournisseur', 'Email', 'Région', 'Statut', 'Commandes', 'Actions'],
      approve: 'Approuver', reject: 'Rejeter', suspend: 'Suspendre', reactivate: 'Réactiver',
      noData: 'Aucun fournisseur',
      confirmApprove: 'Approuver ce fournisseur ?',
      confirmReject: 'Rejeter ce fournisseur ? Cette action est définitive.',
      confirmSuspend: 'Suspendre ce fournisseur ?',
      confirmReactivate: 'Réactiver ce fournisseur ?',
    },
    orders: {
      eyebrow: 'Surveillance', title: 'Toutes les Commandes',
      filters: ['Toutes', 'En attente', 'Confirmées', 'Livrées', 'Annulées'],
      filterVals: ['all', 'pending', 'confirmed', 'delivered', 'cancelled'],
      cols: ['#', 'Restaurant', 'Fournisseur', 'Date', 'Total', 'Statut', 'Action'],
      noData: 'Aucune commande',
      forceDeliver: 'Marquer livrée', forceCancel: 'Annuler',
      confirmDeliver: 'Forcer la livraison de cette commande ?',
      confirmCancel: 'Annuler cette commande ?',
    },
    analytics: {
      eyebrow: 'Analytiques', title: 'Rapport de performance',
      revTitle: 'Volume par statut', orderTrend: 'Tendance des commandes',
      topRestaurants: 'Top restaurants', byVolume: 'par volume',
      noData: 'Aucune donnée disponible',
    },
    settings: {
      eyebrow: 'Configuration', title: 'Paramètres système',
      sections: ['Général', 'Sécurité', 'Notifications', 'Maintenance'],
      secIds: ['general', 'security', 'notifs', 'maintenance'],
      save: 'Enregistrer', saving: 'Enregistrement...', saved: '✓ Enregistré',
      validation: {
        emailInvalid: 'Adresse email invalide.',
        timeoutRange: 'Le timeout doit être entre 5 et 1440 minutes.',
        uploadRange: 'La taille max doit être entre 1 et 100 MB.',
      },
    },
  },
  en: {
    nav: {
      overview: 'Overview', users: 'Users', suppliers: 'Suppliers',
      orders: 'Orders', analytics: 'Analytics', settings: 'Settings',
    },
    topbar: { title: 'Admin Console', logout: 'Logout' },
    confirm: { title: 'Confirm action', cancel: 'Cancel', confirm: 'Confirm' },
    errors: { loadFailed: 'Failed to load. Please retry.', actionFailed: 'Action failed. Please retry.', retry: 'Retry' },
    pagination: { prev: '← Previous', next: 'Next →', of: 'of', rows: 'rows' },
    overview: {
      eyebrow: 'Dashboard', title: 'Overview',
      stats: [
        { label: 'Active Users', key: 'activeUsers' },
        { label: 'Verified Suppliers', key: 'verifiedSuppliers' },
        { label: 'Total Orders', key: 'totalOrders' },
        { label: 'Total Volume (MAD)', key: 'totalVolume' },
      ],
      activity: 'Recent Activity', actSub: 'Latest system actions',
      alerts: 'Alerts', alertSub: 'Items requiring action',
      breakdown: 'Status breakdown', bkSub: 'Orders by status',
      topSup: 'Top suppliers', topSupSub: 'By order volume',
      noAlerts: 'No alerts', noData: 'No data',
    },
    users: {
      eyebrow: 'Management', title: 'Users',
      filters: ['All', 'Active', 'Suspended', 'Pending'],
      filterVals: ['all', 'active', 'suspended', 'pending'],
      cols: ['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'],
      ban: 'Suspend', unban: 'Reactivate',
      noData: 'No users found',
      confirmBan: 'Suspend this user? They will no longer be able to log in.',
      confirmUnban: 'Reactivate this user?',
    },
    suppliers: {
      eyebrow: 'Management', title: 'Suppliers',
      filters: ['All', 'Verified', 'Pending', 'Suspended'],
      filterVals: ['all', 'verified', 'pending', 'suspended'],
      cols: ['Supplier', 'Email', 'Region', 'Status', 'Orders', 'Actions'],
      approve: 'Approve', reject: 'Reject', suspend: 'Suspend', reactivate: 'Reactivate',
      noData: 'No suppliers found',
      confirmApprove: 'Approve this supplier?',
      confirmReject: 'Reject this supplier? This action is permanent.',
      confirmSuspend: 'Suspend this supplier?',
      confirmReactivate: 'Reactivate this supplier?',
    },
    orders: {
      eyebrow: 'Monitoring', title: 'All Orders',
      filters: ['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'],
      filterVals: ['all', 'pending', 'confirmed', 'delivered', 'cancelled'],
      cols: ['#', 'Restaurant', 'Supplier', 'Date', 'Total', 'Status', 'Action'],
      noData: 'No orders found',
      forceDeliver: 'Mark delivered', forceCancel: 'Cancel',
      confirmDeliver: 'Force-deliver this order?',
      confirmCancel: 'Cancel this order?',
    },
    analytics: {
      eyebrow: 'Analytics', title: 'Performance Report',
      revTitle: 'Volume by status', orderTrend: 'Order trend',
      topRestaurants: 'Top restaurants', byVolume: 'by volume',
      noData: 'No data available',
    },
    settings: {
      eyebrow: 'Configuration', title: 'System Settings',
      sections: ['General', 'Security', 'Notifications', 'Maintenance'],
      secIds: ['general', 'security', 'notifs', 'maintenance'],
      save: 'Save', saving: 'Saving...', saved: '✓ Saved',
      validation: {
        emailInvalid: 'Invalid email address.',
        timeoutRange: 'Timeout must be between 5 and 1440 minutes.',
        uploadRange: 'Max upload size must be between 1 and 100 MB.',
      },
    },
  },
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────
const GS = ({ theme }) => {
  const t = THEMES[theme] || THEMES.dark;
  const isDark = theme === 'dark';

  const localVars = {
    '--page-bg':        t['--page-bg'],
    '--surface':        t['--card-bg'],
    '--surface-alt':    t['--page-bg'],
    '--hover':          t['--card-hover-bg'],
    '--subtle':         t['--sidebar-active-bg'],
    '--border':         t['--page-border'],
    '--border-strong':  t['--card-border'],
    '--text-1':         t['--page-text'],
    '--text-2':         t['--text-muted'],
    '--text-3':         t['--text-low'],
    '--accent':         t['--accent-color'],
    '--accent-text':    t['--btn-primary-text'],
    '--danger-bg':      t['--status-failed-bg'],
    '--danger-text':    t['--status-failed-text'],
    '--warn-bg':        t['--status-pending-bg'],
    '--warn-text':      t['--status-pending-text'],
    '--success-bg':     t['--status-success-bg'],
    '--success-text':   t['--status-success-text'],
    '--info-bg':        t['--status-info-bg'],
    '--info-text':      t['--status-info-text'],
    '--input-bg':       t['--input-bg'],
    '--sidebar-bg':     t['--sidebar-bg'],
    '--sidebar-border': t['--sidebar-border'],
    '--sidebar-link':   t['--sidebar-link'],
    '--sidebar-link-hover': t['--sidebar-link-hover'],
    '--sidebar-active-bg': t['--sidebar-active-bg'],
    '--sidebar-active-text': t['--sidebar-active-text'],
    '--shadow': isDark ? '0 24px 64px rgba(0,0,0,0.55)' : '0 24px 64px rgba(0,0,0,0.15)',
  };

  // also expose raw theme tokens on :root for badges that use them directly
  const rootVars = Object.entries(t).map(([k, v]) => `${k}: ${v};`).join(' ');

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      :root { ${rootVars} }
      body { font-family: 'Inter', system-ui, sans-serif; font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .spin { animation: spin 0.7s linear infinite; display: inline-block; }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .a-fu { animation: fadeUp 0.28s ease forwards; }
      @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.3; } }

      /* ── APP SHELL ── */
      .a-app {
        ${Object.entries(localVars).map(([k, v]) => `${k}: ${v};`).join('\n        ')}
        display: flex; height: 100vh; padding: 16px; gap: 12px;
        background: var(--page-bg); overflow: hidden; transition: background 0.3s;
      }
      body { background: var(--page-bg); color: var(--text-1); transition: background 0.3s, color 0.3s; }

      /* ── SIDEBAR ── */
      .a-sidebar {
        width: 240px; min-width: 240px; background: var(--sidebar-bg);
        border-right: 1px solid var(--sidebar-border);
        display: flex; flex-direction: column; height: 100%;
        border-radius: 16px; overflow: hidden; flex-shrink: 0;
        transition: background 0.3s, border-color 0.3s;
      }
      .a-logo-row { display: flex; align-items: center; gap: 10px; padding: 22px 20px 18px; }
      .a-logo-text { font-size: 16px; font-weight: 700; color: var(--text-1); letter-spacing: -0.3px; }
      .a-nav-badge { margin-left: auto; background: var(--danger-bg); color: var(--danger-text); font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 99px; }
      .a-nav-section { padding: 0 12px; display: flex; flex-direction: column; gap: 2px; }
      .a-nav-item {
        display: flex; align-items: center; gap: 12px; padding: 10px 12px;
        border-radius: 10px; font-size: 14px; font-weight: 400;
        color: var(--sidebar-link); cursor: pointer; border: none; background: none;
        width: 100%; text-align: left; text-decoration: none;
        transition: background 0.15s, color 0.15s; white-space: nowrap;
      }
      .a-nav-item:hover { background: var(--sidebar-active-bg); color: var(--sidebar-link-hover); }
      .a-nav-item.active { background: var(--btn-primary-bg); color: var(--btn-primary-text); font-weight: 500; }
      .a-nav-item.active svg { color: var(--btn-primary-text); }
      .a-nav-divider { height: 1px; background: var(--sidebar-border); margin: 10px 12px; }
      .a-nav-bottom { margin-top: auto; padding: 12px 12px 16px; }

      /* ── MAIN ── */
      .a-main {
        flex: 1; background: var(--surface); border-radius: 16px;
        display: flex; flex-direction: column; overflow: hidden; min-width: 0;
        transition: background 0.2s;
      }

      /* ── TOPBAR ── */
      .a-topbar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 28px; border-bottom: 1px solid var(--border); flex-shrink: 0;
      }
      .a-topbar-title { font-size: 22px; font-weight: 700; color: var(--text-1); letter-spacing: -0.4px; }
      .a-topbar-right { display: flex; align-items: center; gap: 10px; }
      .a-icon-btn {
        width: 36px; height: 36px; border: 1.5px solid var(--border-strong); border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: var(--surface); cursor: pointer; color: var(--text-2); transition: all 0.15s; position: relative;
      }
      .a-icon-btn:hover { background: var(--hover); color: var(--text-1); }
      .a-icon-btn .a-dot {
        position: absolute; top: -2px; right: -2px; width: 9px; height: 9px;
        border-radius: 50%; background: var(--danger-text); border: 2px solid var(--surface);
      }

      /* ── STAT CARD ── */
      .a-stat-card {
        background: var(--surface); border: 1.5px solid var(--border-strong); border-radius: 14px;
        padding: 20px 22px; position: relative; overflow: hidden; transition: border-color 0.2s;
      }
      .a-stat-card:hover { border-color: var(--accent); }
      .a-stat-accent { position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--accent); opacity: 0.6; }

      /* ── PANEL / CARD ── */
      .a-card {
        background: var(--surface); border: 1.5px solid var(--border-strong); border-radius: 14px; overflow: hidden;
      }
      .a-card-head {
        padding: 16px 20px; border-bottom: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between;
      }
      .a-card-title { font-size: 14px; font-weight: 600; color: var(--text-1); }
      .a-card-sub { font-size: 12px; color: var(--text-2); margin-top: 2px; }

      /* ── TABLE ── */
      .a-table { width: 100%; border-collapse: collapse; }
      .a-table thead th {
        padding: 11px 16px; text-align: left; font-size: 12px; font-weight: 500;
        color: var(--text-2); border-bottom: 1.5px solid var(--border); background: var(--surface); white-space: nowrap;
      }
      .a-table tbody td {
        padding: 13px 16px; border-bottom: 1px solid var(--border);
        font-size: 13px; color: var(--text-1); vertical-align: middle;
      }
      .a-table tbody tr:last-child td { border-bottom: none; }
      .a-table tbody tr { transition: background 0.1s; }
      .a-table tbody tr:hover { background: var(--hover); }

      /* ── FILTER TABS ── */
      .a-filter-tab {
        padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
        border: none; background: none; cursor: pointer; color: var(--text-2);
        transition: all 0.15s; white-space: nowrap;
      }
      .a-filter-tab.on { background: var(--accent); color: var(--accent-text); }
      .a-filter-tab:hover:not(.on) { background: var(--hover); color: var(--text-1); }

      /* ── BUTTONS ── */
      .a-btn {
        display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 9px;
        font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
        cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap;
      }
      .a-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .a-btn-primary { background: var(--accent); color: var(--accent-text); }
      .a-btn-primary:hover:not(:disabled) { opacity: 0.88; }
      .a-btn-ghost { background: var(--surface); color: var(--text-2); border: 1.5px solid var(--border-strong); }
      .a-btn-ghost:hover:not(:disabled) { background: var(--hover); color: var(--text-1); }
      .a-btn-danger { background: var(--danger-bg); color: var(--danger-text); border: 1px solid var(--danger-text); }
      .a-btn-danger:hover:not(:disabled) { opacity: 0.85; }
      .a-btn-success { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-text); }
      .a-btn-success:hover:not(:disabled) { opacity: 0.85; }
      .a-btn-warn { background: var(--warn-bg); color: var(--warn-text); border: 1px solid var(--warn-text); }
      .a-btn-warn:hover:not(:disabled) { opacity: 0.85; }
      .a-btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 7px; }

      /* ── SEARCH ── */
      .a-search {
        display: flex; align-items: center; gap: 8px;
        background: var(--input-bg); border: 1.5px solid var(--border-strong);
        border-radius: 10px; padding: 7px 14px; min-width: 220px;
        transition: border-color 0.15s;
      }
      .a-search:focus-within { border-color: var(--accent); }
      .a-search input {
        border: none; background: none; outline: none; font-family: 'Inter', sans-serif;
        font-size: 13px; color: var(--text-1); width: 100%;
      }
      .a-search input::placeholder { color: var(--text-3); }

      /* ── BADGES ── */
      .a-badge {
        display: inline-block; padding: 3px 10px; border-radius: 8px;
        font-size: 12px; font-weight: 500; border: 1px solid transparent;
      }
      .a-badge-active    { background: var(--success-bg); color: var(--success-text); border-color: var(--success-text); }
      .a-badge-pending   { background: var(--warn-bg);    color: var(--warn-text);    border-color: var(--warn-text); }
      .a-badge-suspended { background: var(--danger-bg);  color: var(--danger-text);  border-color: var(--danger-text); }
      .a-badge-verified  { background: var(--success-bg); color: var(--success-text); border-color: var(--success-text); }
      .a-badge-confirmed { background: var(--info-bg);    color: var(--info-text);    border-color: var(--info-text); }
      .a-badge-delivered { background: var(--success-bg); color: var(--success-text); border-color: var(--success-text); }
      .a-badge-cancelled { background: var(--danger-bg);  color: var(--danger-text);  border-color: var(--danger-text); }
      .a-badge-rejected  { background: var(--danger-bg);  color: var(--danger-text);  border-color: var(--danger-text); }
      .a-badge-admin     { background: var(--info-bg);    color: var(--info-text);    border-color: var(--info-text); }
      .a-badge-restaurant{ background: var(--warn-bg);    color: var(--warn-text);    border-color: var(--warn-text); }
      .a-badge-supplier  { background: var(--success-bg); color: var(--success-text); border-color: var(--success-text); }

      /* ── MODAL ── */
      .a-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px;
      }
      .a-modal {
        background: var(--surface); border: 1.5px solid var(--border-strong); border-radius: 16px;
        box-shadow: var(--shadow); width: 100%; max-width: 460px; overflow: hidden;
      }
      .a-modal-head { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
      .a-modal-body { padding: 24px; }
      .a-modal-foot { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }

      /* ── TOGGLE ── */
      .a-toggle {
        width: 44px; height: 24px; border-radius: 99px; position: relative;
        background: var(--border-strong); transition: background 0.2s; border: none; cursor: pointer; padding: 0; flex-shrink: 0;
      }
      .a-toggle.on { background: var(--accent); }
      .a-toggle-knob {
        position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
        background: #fff; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      .a-toggle.on .a-toggle-knob { transform: translateX(20px); }

      /* ── PAGINATION ── */
      .a-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid var(--border); }

      /* ── ALERT / ERROR ── */
      .a-error-banner {
        display: flex; align-items: center; gap: 10px; padding: 12px 16px;
        background: var(--danger-bg); border: 1.5px solid var(--danger-text); border-radius: 10px;
      }

      /* ── EMPTY ── */
      .a-empty {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        padding: 56px 20px; text-align: center; color: var(--text-3); gap: 12px;
      }

      /* ── AVATAR ── */
      .a-avatar {
        border-radius: 50%; object-fit: cover; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center; font-weight: 600; overflow: hidden;
      }

      /* ── SETTINGS ROWS ── */
      .a-settings-row {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 20px; border-bottom: 1px solid var(--border); gap: 16px;
      }
      .a-settings-row:last-child { border-bottom: none; }

      /* ── LABEL / INPUT ── */
      .a-label { display: block; font-size: 12px; font-weight: 500; color: var(--text-2); margin-bottom: 5px; }
      .a-input {
        width: 100%; padding: 9px 12px; border: 1.5px solid var(--border-strong); border-radius: 9px;
        font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text-1);
        background: var(--input-bg); transition: border-color 0.15s; outline: none;
      }
      .a-input:focus { border-color: var(--accent); }
      .a-input::placeholder { color: var(--text-3); }
      .a-input.error { border-color: var(--danger-text); }

      /* ── SEG BUTTONS ── */
      .a-seg-btn {
        padding: 8px 16px; font-size: 13px; font-weight: 500; background: none;
        border: 1.5px solid var(--border-strong); border-right: none;
        cursor: pointer; color: var(--text-2); transition: all 0.14s;
      }
      .a-seg-btn:first-child { border-radius: 9px 0 0 9px; }
      .a-seg-btn:last-child { border-right: 1.5px solid var(--border-strong); border-radius: 0 9px 9px 0; }
      .a-seg-btn:hover { background: var(--hover); color: var(--text-1); }
      .a-seg-btn.on { background: var(--subtle); color: var(--accent); border-color: var(--accent); }

      /* ── DONUT ── */
      .a-donut-legend { display: flex; flex-direction: column; gap: 8px; }
      .a-donut-leg-item { display: flex; align-items: center; gap: 8px; }
      .a-donut-leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

      /* ── ALERT ITEMS ── */
      .a-alert-item {
        display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
        border-bottom: 1px solid var(--border); transition: background 0.12s; cursor: pointer;
      }
      .a-alert-item:last-child { border-bottom: none; }
      .a-alert-item:hover { background: var(--hover); }

      /* ── SPARKBARS ── */
      .a-sparkbar-wrap { display: flex; align-items: flex-end; gap: 3px; height: 40px; padding: 0 2px; }

      @media print {
        body * { visibility: hidden; }
      }
    `}</style>
  );
};

// ─── HELPERS ──────────────────────────────────────────────────────────────
const fmt = n => Number(n || 0).toLocaleString('fr-MA');
const fmtDate = s => s ? new Date(s).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const AV_COLORS = [
  { bg: '#fef3c7', color: '#92400e' }, { bg: '#dbeafe', color: '#1e40af' },
  { bg: '#d1fae5', color: '#065f46' }, { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#ede9fe', color: '#5b21b6' }, { bg: '#fee2e2', color: '#991b1b' },
];
const avColor = (name = '') => AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length];

const StatusBadge = ({ status }) => {
  const map = {
    active: 'a-badge-active', pending: 'a-badge-pending', suspended: 'a-badge-suspended',
    banned: 'a-badge-suspended', verified: 'a-badge-verified', confirmed: 'a-badge-confirmed',
    delivered: 'a-badge-delivered', completed: 'a-badge-delivered', cancelled: 'a-badge-cancelled',
    rejected: 'a-badge-rejected', admin: 'a-badge-admin', restaurant: 'a-badge-restaurant', supplier: 'a-badge-supplier',
  };
  return <span className={`a-badge ${map[status] || 'a-badge-pending'}`}>{status || '—'}</span>;
};

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 12 }}>
    <svg className="spin" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Loading...</span>
  </div>
);

const Empty = ({ icon: Icon, label }) => (
  <div className="a-empty">
    <Icon size={36} strokeWidth={1.2} />
    <span style={{ fontSize: 13 }}>{label}</span>
  </div>
);

const ErrorBanner = ({ message, onRetry }) => (
  <div className="a-error-banner">
    <AlertCircle size={14} color="var(--danger-text)" strokeWidth={1.5} />
    <span style={{ fontSize: 13, color: 'var(--danger-text)', flex: 1 }}>{message}</span>
    {onRetry && (
      <button className="a-btn a-btn-danger a-btn-sm" onClick={onRetry}>
        <RefreshCw size={11} /> Retry
      </button>
    )}
  </div>
);

// ─── HOOKS ────────────────────────────────────────────────────────────────
const useDebounce = (value, delay = 220) => {
  const [d, setD] = useState(value);
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return d;
};

const usePagination = (items, pageSize = 25) => {
  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [items.length]);
  const totalPages = Math.ceil(items.length / pageSize);
  const slice = items.slice(page * pageSize, (page + 1) * pageSize);
  return { slice, page, totalPages, setPage, total: items.length, pageSize };
};

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel, t }) => (
  <div className="a-modal-overlay" onClick={onCancel}>
    <div className="a-modal" onClick={e => e.stopPropagation()}>
      <div className="a-modal-head">
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{t.confirm.title}</span>
        <button className="a-icon-btn" style={{ width: 28, height: 28 }} onClick={onCancel}><X size={13} /></button>
      </div>
      <div className="a-modal-body">
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{message}</p>
      </div>
      <div className="a-modal-foot">
        <button className="a-btn a-btn-ghost" onClick={onCancel}>{t.confirm.cancel}</button>
        <button className="a-btn a-btn-primary" onClick={onConfirm}>{t.confirm.confirm}</button>
      </div>
    </div>
  </div>
);

// ─── PAGINATION BAR ───────────────────────────────────────────────────────
const PaginationBar = ({ page, totalPages, total, pageSize, setPage, t }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="a-pagination">
      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
        {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} {t.pagination.of} {total}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="a-btn a-btn-ghost a-btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>{t.pagination.prev}</button>
        <button className="a-btn a-btn-ghost a-btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>{t.pagination.next}</button>
      </div>
    </div>
  );
};

// ─── MINI DONUT ───────────────────────────────────────────────────────────
const Donut = ({ data }) => {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let cumulative = 0;
  const cx = 44, cy = 44, r = 28;
  const segments = data.map(d => {
    const pct = d.value / total;
    const start = cumulative; cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
    const largeArc = pct > 0.5 ? 1 : 0;
    return { ...d, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx={cx} cy={cy} r={r} fill="var(--hover)" />
        {segments.map((s, i) => <path key={i} d={s.d} fill={s.color} opacity="0.85" />)}
        <circle cx={cx} cy={cy} r={18} fill="var(--surface)" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="var(--text-1)" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="600">{total}</text>
      </svg>
      <div className="a-donut-legend">
        {data.map((d, i) => (
          <div key={i} className="a-donut-leg-item">
            <div className="a-donut-leg-dot" style={{ background: d.color }} />
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', marginLeft: 'auto' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SparkBars = ({ data }) => {
  const hasData = data && data.some(d => d.value > 0);
  if (!hasData) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}>
      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>No volume data</span>
    </div>
  );
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="a-sparkbar-wrap">
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%',
            background: i === data.length - 1 ? 'var(--accent)' : 'var(--subtle)',
            height: `${(d.value / max) * 100}%`, minHeight: 2, transition: 'height 0.3s',
            opacity: i === data.length - 1 ? 1 : 0.6, borderRadius: '2px 2px 0 0',
          }} />
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
const Sidebar = ({ view, setView, t, onLogout, alertCount }) => {
  const nav = [
    { id: 'overview', icon: LayoutDashboard, label: t.nav.overview },
    { id: 'users', icon: Users, label: t.nav.users },
    { id: 'suppliers', icon: Store, label: t.nav.suppliers },
    { id: 'orders', icon: ShoppingBag, label: t.nav.orders },
    { id: 'analytics', icon: BarChart2, label: t.nav.analytics },
  ];
  return (
    <div className="a-sidebar">
      <div className="a-logo-row">
        <LogoMark size={28} />
        <span className="a-logo-text">Green<span style={{ color: 'var(--accent)' }}>Leaf</span></span>
      </div>

      <div className="a-nav-section">
        {nav.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`a-nav-item${view === id ? ' active' : ''}`} onClick={() => setView(id)}>
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
            {id === 'overview' && alertCount > 0 && (
              <span className="a-nav-badge">{alertCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="a-nav-divider" />

      <div className="a-nav-section">
        <button className={`a-nav-item${view === 'settings' ? ' active' : ''}`} onClick={() => setView('settings')}>
          <Settings size={17} strokeWidth={1.8} />
          <span>{t.nav.settings}</span>
        </button>
      </div>

      <div className="a-nav-bottom" style={{ display: 'flex', justifyContent: 'center', padding: '12px 12px 16px' }}>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          width: '45px', height: '45px', border: 'none', borderRadius: '50%',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          transition: 'width 0.3s, border-radius 0.3s',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
          backgroundColor: 'rgba(200, 50, 50, 0.75)',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.width = '130px';
            e.currentTarget.style.borderRadius = '40px';
            e.currentTarget.querySelector('.lo-sign').style.width = '30%';
            e.currentTarget.querySelector('.lo-sign').style.paddingLeft = '20px';
            e.currentTarget.querySelector('.lo-text').style.opacity = '1';
            e.currentTarget.querySelector('.lo-text').style.width = '70%';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.width = '45px';
            e.currentTarget.style.borderRadius = '50%';
            e.currentTarget.querySelector('.lo-sign').style.width = '100%';
            e.currentTarget.querySelector('.lo-sign').style.paddingLeft = '0px';
            e.currentTarget.querySelector('.lo-text').style.opacity = '0';
            e.currentTarget.querySelector('.lo-text').style.width = '0%';
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'translate(2px,2px)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translate(0,0)'}
        >
          <div className="lo-sign" style={{ width: '100%', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={17} color="white" strokeWidth={2.2} />
          </div>
          <div className="lo-text" style={{ position: 'absolute', right: 0, width: '0%', opacity: 0, color: 'white', fontSize: '0.9em', fontWeight: 600, transition: '0.3s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {t.topbar.logout}
          </div>
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════════════════════════════════
const TopBar = ({ view, theme, toggleTheme, lang, toggleLang, t, alertCount, onAlerts }) => {
  const titles = {
    overview: t.nav.overview, users: t.nav.users, suppliers: t.nav.suppliers,
    orders: t.nav.orders, analytics: t.nav.analytics, settings: t.nav.settings,
  };
  return (
    <div className="a-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="a-topbar-title">{titles[view] || view}</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)', padding: '2px 8px', background: 'var(--hover)', borderRadius: 6, fontWeight: 500 }}>
          Admin
        </span>
      </div>
      <div className="a-topbar-right">
        <button className="a-icon-btn" onClick={onAlerts} title="Alerts">
          <Bell size={15} />
          {alertCount > 0 && <span className="a-dot" />}
        </button>
        <button className="a-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button className="a-icon-btn" onClick={toggleLang} style={{ fontSize: 11, fontWeight: 600, width: 'auto', padding: '0 10px', gap: 4 }}>
          <Globe size={14} /> {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 10px', border: '1.5px solid var(--border-strong)', borderRadius: 10 }}>
          <div className="a-avatar" style={{ width: 30, height: 30, background: 'var(--subtle)', color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.topbar.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════
const Overview = ({ t, onAlertCountChange }) => {
  const to = t.overview;
  const [data, setData] = useState({ activeUsers: 0, verifiedSuppliers: 0, totalOrders: 0, totalVolume: 0 });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [ordRes, usrRes] = await Promise.all([
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users'),
      ]);
      const ords = ordRes.data || [];
      const usrs = usrRes.data || [];
      setOrders(ords);
      setUsers(usrs);
      setData({
        activeUsers: usrs.filter(u => u.status === 'active').length || usrs.length,
        verifiedSuppliers: usrs.filter(u => u.role === 'supplier' && u.verified).length,
        totalOrders: ords.length,
        totalVolume: ords.filter(o => !['cancelled', 'rejected'].includes(o.status)).reduce((a, o) => a + (o.total_amount || 0), 0),
      });
    } catch (e) {
      setError(t.errors.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const alertItems = useMemo(() => [
    ...orders.filter(o => o.status === 'pending').slice(0, 3).map(o => ({
      type: 'order', color: 'rgba(255,152,0,0.9)', icon: ShoppingBag,
      msg: `Order #${o.id?.slice(0, 8) || '—'} pending confirmation`,
      time: fmtDate(o.created_at),
    })),
    ...users.filter(u => u.status === 'pending').slice(0, 2).map(u => ({
      type: 'user', color: 'rgba(33,150,243,0.9)', icon: Users,
      msg: `${u.name || u.email} awaiting verification`,
      time: fmtDate(u.created_at),
    })),
  ].slice(0, 5), [orders, users]);

  useEffect(() => {
    if (onAlertCountChange) onAlertCountChange(alertItems.length);
  }, [alertItems.length]);

  const donutData = useMemo(() => [
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'rgba(255,152,0,0.85)' },
    { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, color: 'rgba(33,150,243,0.85)' },
    { label: 'Delivered', value: orders.filter(o => ['delivered', 'completed'].includes(o.status)).length, color: 'var(--accent)' },
    { label: 'Cancelled', value: orders.filter(o => ['cancelled', 'rejected'].includes(o.status)).length, color: 'rgba(244,67,54,0.85)' },
  ].filter(d => d.value > 0), [orders]);

  const topSuppliers = useMemo(() => Object.values(
    orders.reduce((acc, o) => {
      const name = o.supplier_name || o.supplier || 'Unknown';
      if (!acc[name]) acc[name] = { name, count: 0, volume: 0 };
      acc[name].count++; acc[name].volume += (o.total_amount || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.volume - a.volume).slice(0, 5), [orders]);

  const recentActivity = useMemo(() => [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6), [orders]);

  const weekBars = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => ({ label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], value: 0 }));
    orders.forEach(o => {
      if (!o.created_at) return;
      const dow = new Date(o.created_at).getDay();
      days[dow].value += (o.total_amount || 0);
    });
    return days;
  }, [orders]);

  const STATS = [
    { ...to.stats[0], value: data.activeUsers, icon: Users, delta: '+12%' },
    { ...to.stats[1], value: data.verifiedSuppliers, icon: Store, delta: '+3' },
    { ...to.stats[2], value: data.totalOrders, icon: ShoppingBag, delta: '+8%' },
    { ...to.stats[3], value: `${fmt(data.totalVolume)} MAD`, icon: TrendingUp, delta: '+15%' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="a-fu" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{to.eyebrow}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{to.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="a-btn a-btn-ghost" onClick={load}><RefreshCw size={13} /></button>
          <button className="a-btn a-btn-ghost"><Download size={13} /> Export</button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {STATS.map((s, i) => (
          <div key={i} className="a-stat-card">
            <div className="a-stat-accent" />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: 'var(--subtle)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={16} color="var(--accent)" strokeWidth={1.7} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--success-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                <ArrowUpRight size={12} /> {s.delta}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.5px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {/* Alerts */}
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <div className="a-card-title">{to.alerts}</div>
              <div className="a-card-sub">{to.alertSub}</div>
            </div>
            {alertItems.length > 0 && (
              <span style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                {alertItems.length}
              </span>
            )}
          </div>
          <div>
            {alertItems.length === 0
              ? <div style={{ padding: '28px 16px', textAlign: 'center' }}><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{to.noAlerts}</span></div>
              : alertItems.map((a, i) => (
                <div key={i} className="a-alert-item">
                  <div style={{ width: 30, height: 30, background: `${a.color}20`, border: `1px solid ${a.color}30`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <a.icon size={13} color={a.color} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.4, marginBottom: 2 }}>{a.msg}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.time}</div>
                  </div>
                  <ChevronRight size={14} color="var(--text-3)" />
                </div>
              ))
            }
          </div>
        </div>

        {/* Status breakdown + weekly trend */}
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <div className="a-card-title">{to.breakdown}</div>
              <div className="a-card-sub">{to.bkSub}</div>
            </div>
          </div>
          <div style={{ padding: '18px 20px' }}>
            {donutData.length > 0
              ? <Donut data={donutData} />
              : <div style={{ textAlign: 'center', padding: '20px 0' }}><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{to.noData}</span></div>
            }
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>Weekly volume trend</div>
              <SparkBars data={weekBars} />
            </div>
          </div>
        </div>

        {/* Top Suppliers */}
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <div className="a-card-title">{to.topSup}</div>
              <div className="a-card-sub">{to.topSupSub}</div>
            </div>
          </div>
          <div>
            {topSuppliers.length === 0
              ? <div style={{ padding: '28px 16px', textAlign: 'center' }}><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{to.noData}</span></div>
              : topSuppliers.map((s, i) => {
                const maxVol = topSuppliers[0].volume || 1;
                return (
                  <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-3)', minWidth: 18 }}>0{i + 1}</span>
                        <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{fmt(s.volume)} MAD</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--border-strong)', borderRadius: 99, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(s.volume / maxVol) * 100}%`, background: 'var(--accent)', borderRadius: 99, opacity: 0.7 }} />
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="a-card">
        <div className="a-card-head">
          <div>
            <div className="a-card-title">{to.activity}</div>
            <div className="a-card-sub">{to.actSub}</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{recentActivity.length} events</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--border)' }}>
          {recentActivity.map((o, i) => {
            const colMap = { pending: 'rgba(255,152,0,0.9)', confirmed: 'rgba(33,150,243,0.9)', delivered: 'var(--accent)', cancelled: 'rgba(244,67,54,0.9)' };
            const col = colMap[o.status] || 'var(--text-3)';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', borderRight: i % 3 !== 2 ? '1px solid var(--border)' : undefined }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0, marginTop: 5, animation: o.status === 'pending' ? 'pulse 2s infinite' : undefined }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', marginBottom: 2 }}>Order #{o.id?.slice(0, 8) || '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.restaurant_name || 'Restaurant'} → {o.supplier_name || 'Supplier'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusBadge status={o.status} />
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtDate(o.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// USERS VIEW
// ═══════════════════════════════════════════════════════════════════════════
const UsersView = ({ t }) => {
  const tu = t.users;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw);
  const [acting, setActing] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await axios.get('/api/admin/users');
      setUsers(r.data || []);
    } catch (e) { setError(t.errors.loadFailed); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const executeAction = async () => {
    if (!confirm) return;
    const { id, action } = confirm; setConfirm(null); setActing(id); setActionError(null);
    try {
      await axios.patch(`/api/admin/users/${id}`, { action });
      setUsers(p => p.map(u => u.id === id ? { ...u, status: action === 'ban' ? 'suspended' : 'active' } : u));
    } catch (e) { setActionError(t.errors.actionFailed); }
    finally { setActing(null); }
  };

  const filtered = useMemo(() => users
    .filter(u => filter === 'all' || u.status === filter || u.status === (filter === 'suspended' ? 'banned' : filter))
    .filter(u => !search || [u.name, u.email, u.role].some(f => (f || '').toLowerCase().includes(search.toLowerCase()))),
    [users, filter, search]
  );
  const pagination = usePagination(filtered);

  if (loading) return <Loader />;
  return (
    <div className="a-fu" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{tu.eyebrow}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{tu.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="a-search">
            <Search size={14} color="var(--text-3)" />
            <input placeholder="Search users..." value={searchRaw} onChange={e => setSearchRaw(e.target.value)} />
          </div>
          <button className="a-btn a-btn-ghost" onClick={load}><RefreshCw size={13} /></button>
          <button className="a-btn a-btn-ghost"><Download size={13} /> Export</button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {actionError && <ErrorBanner message={actionError} />}

      <div style={{ display: 'flex', gap: 6 }}>
        {tu.filters.map((f, i) => (
          <button key={i} className={`a-filter-tab${filter === tu.filterVals[i] ? ' on' : ''}`} onClick={() => setFilter(tu.filterVals[i])}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)', alignSelf: 'center' }}>{filtered.length} users</span>
      </div>

      <div className="a-card">
        <table className="a-table">
          <thead><tr>{tu.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {pagination.slice.length === 0
              ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}><Empty icon={Users} label={tu.noData} /></td></tr>
              : pagination.slice.map(u => {
                const ac = avColor(u.name || '');
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="a-avatar" style={{ width: 34, height: 34, background: ac.bg, color: ac.color, fontSize: 13 }}>
                          {(u.name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{u.name || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, color: 'var(--text-2)' }}>{u.email}</span></td>
                    <td><StatusBadge status={u.role || 'restaurant'} /></td>
                    <td><StatusBadge status={u.status === 'banned' ? 'suspended' : u.status || 'active'} /></td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmtDate(u.created_at)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {(u.status === 'active' || u.status === 'verified')
                          ? <button className="a-btn a-btn-danger a-btn-sm" disabled={acting === u.id} onClick={() => setConfirm({ id: u.id, action: 'ban', message: tu.confirmBan })}><Ban size={12} />{tu.ban}</button>
                          : <button className="a-btn a-btn-success a-btn-sm" disabled={acting === u.id} onClick={() => setConfirm({ id: u.id, action: 'unban', message: tu.confirmUnban })}><UserCheck size={12} />{tu.unban}</button>
                        }
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <PaginationBar {...pagination} t={t} />
      </div>
      {confirm && <ConfirmModal message={confirm.message} onConfirm={executeAction} onCancel={() => setConfirm(null)} t={t} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SUPPLIERS VIEW
// ═══════════════════════════════════════════════════════════════════════════
const SuppliersView = ({ t }) => {
  const ts = t.suppliers;
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw);
  const [acting, setActing] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await axios.get('/api/admin/suppliers');
      setSuppliers(r.data || []);
    } catch (e) { setError(t.errors.loadFailed); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const executeAction = async () => {
    if (!confirm) return;
    const { id, action } = confirm; setConfirm(null); setActing(id); setActionError(null);
    try {
      await axios.patch(`/api/admin/suppliers/${id}`, { action });
      setSuppliers(p => p.map(s => s.id === id ? {
        ...s,
        verified: action === 'approve',
        status: action === 'approve' ? 'verified' : action === 'suspend' ? 'suspended' : 'rejected',
      } : s));
    } catch (e) { setActionError(t.errors.actionFailed); }
    finally { setActing(null); }
  };

  const filtered = useMemo(() => suppliers
    .filter(s => filter === 'all' || (filter === 'verified' && s.verified) || (filter === 'pending' && !s.verified && s.status !== 'suspended') || (filter === 'suspended' && s.status === 'suspended'))
    .filter(s => !search || [s.business_name, s.email, s.region].some(f => (f || '').toLowerCase().includes(search.toLowerCase()))),
    [suppliers, filter, search]
  );
  const pagination = usePagination(filtered);

  if (loading) return <Loader />;
  return (
    <div className="a-fu" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{ts.eyebrow}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{ts.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="a-search">
            <Search size={14} color="var(--text-3)" />
            <input placeholder="Search suppliers..." value={searchRaw} onChange={e => setSearchRaw(e.target.value)} />
          </div>
          <button className="a-btn a-btn-ghost" onClick={load}><RefreshCw size={13} /></button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {actionError && <ErrorBanner message={actionError} />}

      <div style={{ display: 'flex', gap: 6 }}>
        {ts.filters.map((f, i) => (
          <button key={i} className={`a-filter-tab${filter === ts.filterVals[i] ? ' on' : ''}`} onClick={() => setFilter(ts.filterVals[i])}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)', alignSelf: 'center' }}>{filtered.length} suppliers</span>
      </div>

      <div className="a-card">
        <table className="a-table">
          <thead><tr>{ts.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {pagination.slice.length === 0
              ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}><Empty icon={Store} label={ts.noData} /></td></tr>
              : pagination.slice.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: 'var(--warn-bg)', border: '1px solid var(--warn-text)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Store size={14} color="var(--warn-text)" strokeWidth={1.5} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{s.business_name || s.name || '—'}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.email}</span></td>
                  <td><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.region || '—'}</span></td>
                  <td><StatusBadge status={s.verified ? 'verified' : s.status || 'pending'} /></td>
                  <td><span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{s.order_count || 0}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!s.verified && s.status !== 'suspended' && (
                        <>
                          <button className="a-btn a-btn-success a-btn-sm" disabled={acting === s.id} onClick={() => setConfirm({ id: s.id, action: 'approve', message: ts.confirmApprove })}><Check size={12} />{ts.approve}</button>
                          <button className="a-btn a-btn-danger a-btn-sm" disabled={acting === s.id} onClick={() => setConfirm({ id: s.id, action: 'reject', message: ts.confirmReject })}><X size={12} />{ts.reject}</button>
                        </>
                      )}
                      {s.verified && s.status !== 'suspended' && (
                        <button className="a-btn a-btn-warn a-btn-sm" disabled={acting === s.id} onClick={() => setConfirm({ id: s.id, action: 'suspend', message: ts.confirmSuspend })}><Ban size={12} />{ts.suspend}</button>
                      )}
                      {s.status === 'suspended' && (
                        <button className="a-btn a-btn-success a-btn-sm" disabled={acting === s.id} onClick={() => setConfirm({ id: s.id, action: 'reactivate', message: ts.confirmReactivate })}><UserCheck size={12} />{ts.reactivate}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <PaginationBar {...pagination} t={t} />
      </div>
      {confirm && <ConfirmModal message={confirm.message} onConfirm={executeAction} onCancel={() => setConfirm(null)} t={t} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS VIEW
// ═══════════════════════════════════════════════════════════════════════════
const OrdersView = ({ t }) => {
  const to = t.orders;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw);
  const [acting, setActing] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await axios.get('/api/admin/orders');
      setOrders(r.data || []);
    } catch (e) { setError(t.errors.loadFailed); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const executeAction = async () => {
    if (!confirm) return;
    const { id, action } = confirm; setConfirm(null); setActing(id); setActionError(null);
    try {
      await axios.patch(`/api/admin/orders/${id}`, { action });
      setOrders(p => p.map(o => o.id === id ? { ...o, status: action === 'deliver' ? 'delivered' : 'cancelled' } : o));
    } catch (e) { setActionError(t.errors.actionFailed); }
    finally { setActing(null); }
  };

  const filtered = useMemo(() => orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || [o.id, o.restaurant_name, o.supplier_name].some(f => (f || '').toLowerCase().includes(search.toLowerCase()))),
    [orders, filter, search]
  );
  const pagination = usePagination(filtered);

  if (loading) return <Loader />;
  return (
    <div className="a-fu" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{to.eyebrow}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{to.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="a-search">
            <Search size={14} color="var(--text-3)" />
            <input placeholder="Search orders..." value={searchRaw} onChange={e => setSearchRaw(e.target.value)} />
          </div>
          <button className="a-btn a-btn-ghost" onClick={load}><RefreshCw size={13} /></button>
          <button className="a-btn a-btn-ghost"><Download size={13} /> Export</button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {actionError && <ErrorBanner message={actionError} />}

      <div style={{ display: 'flex', gap: 6 }}>
        {to.filters.map((f, i) => (
          <button key={i} className={`a-filter-tab${filter === to.filterVals[i] ? ' on' : ''}`} onClick={() => setFilter(to.filterVals[i])}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)', alignSelf: 'center' }}>{filtered.length} orders</span>
      </div>

      <div className="a-card">
        <table className="a-table">
          <thead><tr>{to.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {pagination.slice.length === 0
              ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px 0' }}><Empty icon={ShoppingBag} label={to.noData} /></td></tr>
              : pagination.slice.map((o, i) => (
                <tr key={o.id}>
                  <td><span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>#{o.id?.slice(0, 8) || String(i + 1).padStart(4, '0')}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{o.restaurant_name || o.restaurant || '—'}</span></td>
                  <td><span style={{ fontSize: 13, color: 'var(--text-2)' }}>{o.supplier_name || o.supplier || '—'}</span></td>
                  <td><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmtDate(o.created_at)}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{fmt(o.total_amount)} MAD</span></td>
                  <td><StatusBadge status={o.status || 'pending'} /></td>
                  <td>
                    {['pending', 'confirmed'].includes(o.status) && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="a-btn a-btn-success a-btn-sm" disabled={acting === o.id} onClick={() => setConfirm({ id: o.id, action: 'deliver', message: to.confirmDeliver })}><Check size={11} />{to.forceDeliver}</button>
                        <button className="a-btn a-btn-danger a-btn-sm" disabled={acting === o.id} onClick={() => setConfirm({ id: o.id, action: 'cancel', message: to.confirmCancel })}><X size={11} />{to.forceCancel}</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <PaginationBar {...pagination} t={t} />
      </div>
      {confirm && <ConfirmModal message={confirm.message} onConfirm={executeAction} onCancel={() => setConfirm(null)} t={t} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS VIEW  (new feature)
// ═══════════════════════════════════════════════════════════════════════════
const AnalyticsView = ({ t }) => {
  const ta = t.analytics;
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('week');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [ordRes, usrRes] = await Promise.all([
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users'),
      ]);
      setOrders(ordRes.data || []);
      setUsers(usrRes.data || []);
    } catch (e) { setError(t.errors.loadFailed); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const volumeByStatus = useMemo(() => [
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').reduce((a, o) => a + (o.total_amount || 0), 0), color: 'rgba(255,152,0,0.85)' },
    { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').reduce((a, o) => a + (o.total_amount || 0), 0), color: 'rgba(33,150,243,0.85)' },
    { label: 'Delivered', value: orders.filter(o => ['delivered', 'completed'].includes(o.status)).reduce((a, o) => a + (o.total_amount || 0), 0), color: 'var(--accent)' },
    { label: 'Cancelled', value: orders.filter(o => ['cancelled', 'rejected'].includes(o.status)).reduce((a, o) => a + (o.total_amount || 0), 0), color: 'rgba(244,67,54,0.85)' },
  ], [orders]);

  const topRestaurants = useMemo(() => Object.values(
    orders.reduce((acc, o) => {
      const name = o.restaurant_name || o.restaurant || 'Unknown';
      if (!acc[name]) acc[name] = { name, count: 0, volume: 0 };
      acc[name].count++; acc[name].volume += (o.total_amount || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.volume - a.volume).slice(0, 8), [orders]);

  const userGrowth = useMemo(() => {
    const months = {};
    users.forEach(u => {
      if (!u.created_at) return;
      const m = new Date(u.created_at).toLocaleDateString('en', { month: 'short', year: '2-digit' });
      months[m] = (months[m] || 0) + 1;
    });
    return Object.entries(months).slice(-6).map(([label, value]) => ({ label, value }));
  }, [users]);

  const maxVol = Math.max(...volumeByStatus.map(v => v.value), 1);

  if (loading) return <Loader />;
  return (
    <div className="a-fu" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{ta.eyebrow}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{ta.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {['week', 'month', 'all'].map((p, i, arr) => (
            <button key={p} className={`a-seg-btn${period === p ? ' on' : ''}`}
              style={{ borderRadius: i === 0 ? '9px 0 0 9px' : i === arr.length - 1 ? '0 9px 9px 0' : 0, borderRight: i < arr.length - 1 ? 'none' : undefined }}
              onClick={() => setPeriod(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Summary metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Completion rate', value: orders.length ? `${Math.round(orders.filter(o => ['delivered','completed'].includes(o.status)).length / orders.length * 100)}%` : '—', icon: CheckCircle2 || Check, color: 'var(--success-text)' },
          { label: 'Cancellation rate', value: orders.length ? `${Math.round(orders.filter(o => ['cancelled','rejected'].includes(o.status)).length / orders.length * 100)}%` : '—', icon: X, color: 'var(--danger-text)' },
          { label: 'Avg order value', value: orders.length ? `${fmt(orders.reduce((a,o)=>a+(o.total_amount||0),0)/orders.length)} MAD` : '—', icon: TrendingUp, color: 'var(--accent)' },
        ].map((m, i) => (
          <div key={i} className="a-card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color, letterSpacing: '-0.5px' }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Volume by status */}
        <div className="a-card">
          <div className="a-card-head">
            <div className="a-card-title">{ta.revTitle}</div>
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {volumeByStatus.map((v, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.color, display: 'inline-block' }} />
                    {v.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{fmt(v.value)} MAD</span>
                </div>
                <div style={{ height: 6, background: 'var(--border-strong)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${(v.value / maxVol) * 100}%`, background: v.color, borderRadius: 99, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <div className="a-card-title">{ta.topRestaurants}</div>
              <div className="a-card-sub">{ta.byVolume}</div>
            </div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 280 }}>
            {topRestaurants.length === 0
              ? <div style={{ padding: '28px', textAlign: 'center' }}><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{ta.noData}</span></div>
              : topRestaurants.map((r, i) => {
                const maxR = topRestaurants[0].volume || 1;
                const ac = avColor(r.name);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div className="a-avatar" style={{ width: 30, height: 30, background: ac.bg, color: ac.color, fontSize: 12, flexShrink: 0 }}>
                      {r.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginLeft: 8 }}>{fmt(r.volume)}</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--border-strong)', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${(r.volume / maxR) * 100}%`, background: 'var(--accent)', borderRadius: 99, opacity: 0.65 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>{r.count} orders</span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* User growth (if data exists) */}
      {userGrowth.length > 0 && (
        <div className="a-card">
          <div className="a-card-head">
            <div className="a-card-title">User registrations</div>
            <div className="a-card-sub">New accounts over time</div>
          </div>
          <div style={{ padding: '18px 20px' }}>
            <SparkBars data={userGrowth} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {userGrowth.map((g, i) => (
                <span key={i} style={{ fontSize: 10, color: 'var(--text-3)' }}>{g.label}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS VIEW
// ═══════════════════════════════════════════════════════════════════════════
const SettingsView = ({ t, theme, toggleTheme, lang, toggleLang }) => {
  const ts = t.settings;
  const [sec, setSec] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [cfg, setCfg] = useState({
    platform_name: 'GreenLeaf Market',
    support_email: 'support@greenleaf.ma',
    default_region: 'Casablanca-Settat',
    maintenance_mode: false,
    registration_open: true,
    supplier_auto_approve: false,
    order_notifications: true,
    user_notifications: true,
    system_notifications: false,
    session_timeout: 30,
    max_upload_mb: 10,
  });

  const validate = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.support_email)) errs.support_email = ts.validation.emailInvalid;
    if (cfg.session_timeout < 5 || cfg.session_timeout > 1440) errs.session_timeout = ts.validation.timeoutRange;
    if (cfg.max_upload_mb < 1 || cfg.max_upload_mb > 100) errs.max_upload_mb = ts.validation.uploadRange;
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await axios.put('/api/admin/settings', cfg);
      setSaved(ts.saved);
      setTimeout(() => setSaved(''), 2400);
    } catch (e) { }
    finally { setSaving(false); }
  };

  const Toggle = ({ k }) => (
    <button className={`a-toggle${cfg[k] ? ' on' : ''}`} onClick={() => setCfg(p => ({ ...p, [k]: !p[k] }))}>
      <div className="a-toggle-knob" />
    </button>
  );

  const Row = ({ label, sub, k, children }) => (
    <div className="a-settings-row">
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginBottom: sub ? 3 : 0 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{sub}</div>}
        {k && validationErrors[k] && <div style={{ fontSize: 12, color: 'var(--danger-text)', marginTop: 4 }}>{validationErrors[k]}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="a-fu" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{ts.eyebrow}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{ts.title}</div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {ts.sections.map((s, i) => (
          <button key={i} className={`a-filter-tab${sec === ts.secIds[i] ? ' on' : ''}`} onClick={() => setSec(ts.secIds[i])}>{s}</button>
        ))}
      </div>

      {/* Appearance — always visible */}
      <div className="a-card" style={{ maxWidth: 640 }}>
        <div className="a-card-head"><div className="a-card-title">Appearance</div></div>
        <Row label="Theme" sub="Interface color scheme">
          <div style={{ display: 'flex', gap: 8 }}>
            {['light', 'dark'].map(th => (
              <button key={th} onClick={toggleTheme} style={{
                padding: '7px 16px', borderRadius: 9, border: '1.5px solid',
                borderColor: theme === th ? 'var(--accent)' : 'var(--border-strong)',
                background: theme === th ? 'var(--subtle)' : 'var(--surface)',
                color: theme === th ? 'var(--accent)' : 'var(--text-2)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>{th.charAt(0).toUpperCase() + th.slice(1)}</button>
            ))}
          </div>
        </Row>
        <Row label="Language" sub="Interface display language">
          <div style={{ display: 'flex', gap: 8 }}>
            {['en', 'fr'].map(l => (
              <button key={l} onClick={toggleLang} style={{
                padding: '7px 16px', borderRadius: 9, border: '1.5px solid',
                borderColor: lang === l ? 'var(--accent)' : 'var(--border-strong)',
                background: lang === l ? 'var(--subtle)' : 'var(--surface)',
                color: lang === l ? 'var(--accent)' : 'var(--text-2)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', textTransform: 'uppercase',
              }}>{l}</button>
            ))}
          </div>
        </Row>
      </div>

      <div className="a-card" style={{ maxWidth: 640 }}>
        <div className="a-card-head">
          <div className="a-card-title">{ts.sections[ts.secIds.indexOf(sec)]}</div>
        </div>

        {sec === 'general' && (
          <>
            <Row label="Platform name" sub="Visible in emails and the interface">
              <input className="a-input" style={{ width: 200 }} value={cfg.platform_name} onChange={e => setCfg(p => ({ ...p, platform_name: e.target.value }))} />
            </Row>
            <Row label="Support email" sub="Contact address for users" k="support_email">
              <input className={`a-input${validationErrors.support_email ? ' error' : ''}`} style={{ width: 220 }} type="email" value={cfg.support_email} onChange={e => setCfg(p => ({ ...p, support_email: e.target.value }))} />
            </Row>
            <Row label="Default region">
              <input className="a-input" style={{ width: 200 }} value={cfg.default_region} onChange={e => setCfg(p => ({ ...p, default_region: e.target.value }))} />
            </Row>
            <Row label="Open registrations" sub="Allow new users to sign up">
              <Toggle k="registration_open" />
            </Row>
            <Row label="Auto-approve suppliers" sub="Skip manual review for new suppliers">
              <Toggle k="supplier_auto_approve" />
            </Row>
          </>
        )}

        {sec === 'security' && (
          <>
            <Row label="Session timeout (min)" sub="Auto-logout after inactivity — 5 to 1440 min" k="session_timeout">
              <input className={`a-input${validationErrors.session_timeout ? ' error' : ''}`} style={{ width: 100 }} type="number" min={5} max={1440} value={cfg.session_timeout} onChange={e => setCfg(p => ({ ...p, session_timeout: +e.target.value }))} />
            </Row>
            <Row label="Max upload size (MB)" sub="File upload limit — 1 to 100 MB" k="max_upload_mb">
              <input className={`a-input${validationErrors.max_upload_mb ? ' error' : ''}`} style={{ width: 100 }} type="number" min={1} max={100} value={cfg.max_upload_mb} onChange={e => setCfg(p => ({ ...p, max_upload_mb: +e.target.value }))} />
            </Row>
          </>
        )}

        {sec === 'notifs' && (
          <>
            <Row label="Order notifications" sub="Alerts for new orders"><Toggle k="order_notifications" /></Row>
            <Row label="User notifications" sub="Alerts for new registrations"><Toggle k="user_notifications" /></Row>
            <Row label="System notifications" sub="Technical and maintenance alerts"><Toggle k="system_notifications" /></Row>
          </>
        )}

        {sec === 'maintenance' && (
          <>
            <Row label="Maintenance mode" sub="Block public access to the platform">
              <Toggle k="maintenance_mode" />
            </Row>
            {cfg.maintenance_mode && (
              <div style={{ margin: '0 20px 16px', padding: '12px 16px', background: 'var(--warn-bg)', border: '1px solid var(--warn-text)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={14} color="var(--warn-text)" />
                <span style={{ fontSize: 13, color: 'var(--warn-text)' }}>The platform is currently inaccessible to users.</span>
              </div>
            )}
            <Row label="Clear server cache" sub="Reset cached data and sessions">
              <button className="a-btn a-btn-ghost"><RefreshCw size={13} /> Purge cache</button>
            </Row>
          </>
        )}

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
          {saved && <span style={{ fontSize: 13, color: 'var(--success-text)', fontWeight: 500 }}>{saved}</span>}
          <button className="a-btn a-btn-primary" onClick={save} disabled={saving}>
            {saving ? ts.saving : ts.save}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
const AdminApp = () => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [view, setView] = useState('overview');
  const [alertCount, setAlertCount] = useState(0);
  const t = T[lang] || T.en;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="a-app">
      <GS theme={theme} />
      <Sidebar view={view} setView={setView} t={t} onLogout={handleLogout} alertCount={alertCount} />
      <div className="a-main">
        <TopBar
          view={view} theme={theme} toggleTheme={toggleTheme}
          lang={lang} toggleLang={toggleLang} t={t}
          alertCount={alertCount} onAlerts={() => setView('overview')}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {view === 'overview'   && <Overview t={t} onAlertCountChange={setAlertCount} />}
            {view === 'users'      && <UsersView t={t} />}
            {view === 'suppliers'  && <SuppliersView t={t} />}
            {view === 'orders'     && <OrdersView t={t} />}
            {view === 'analytics'  && <AnalyticsView t={t} />}
            {view === 'settings'   && <SettingsView t={t} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminApp;