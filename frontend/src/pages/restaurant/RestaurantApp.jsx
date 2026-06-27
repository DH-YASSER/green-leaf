import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { HelpCircle } from 'lucide-react';
const THEMES = {
  dark: {
  // Global Page Styles
  '--page-bg':               '#0A0E12',     // Softer dark (not pure black)
  '--page-text':             '#E8E8E8',     // Softer white
  '--text-muted':            'rgba(232,232,232,0.70)',
  '--text-low':              'rgba(232,232,232,0.40)',
  '--page-border':           'rgba(255, 255, 255, 0.06)',
  '--accent-color':          '#4CAF50',     // Brighter green
  '--accent-gold':           '#FFB74D',     // Brighter gold

  // Navbar
  '--nav-bg':                'rgba(10,14,18,0.98)',
  '--nav-border':            'rgba(255, 255, 255, 0.06)',
  '--nav-link':              'rgba(232,232,232,0.70)',
  '--nav-link-hover':        '#E8E8E8',
  '--nav-active':            '#4CAF50',

  // Sidebar (Darker teal-green)
  '--sidebar-bg':            '#0D2B24',
  '--sidebar-border':        'rgba(76, 175, 80, 0.10)',
  '--sidebar-link':          'rgba(232,232,232,0.70)',
  '--sidebar-link-hover':    '#E8E8E8',
  '--sidebar-active-bg':     'rgba(76, 175, 80, 0.15)',
  '--sidebar-active-text':   '#4CAF50',

  // Buttons
  '--btn-primary-bg':        '#4CAF50',
  '--btn-primary-text':      '#FFFFFF',
  '--btn-primary-hover':     '0.90',
  '--btn-secondary-bg':      'transparent',
  '--btn-secondary-text':    '#B0B0B0',
  '--btn-secondary-border':  'rgba(255, 255, 255, 0.12)',
  '--btn-icon-border':       'rgba(255, 255, 255, 0.08)',
  '--btn-icon-text':         '#B0B0B0',
  '--btn-icon-hover-bg':     'rgba(255, 255, 255, 0.08)',

  // Cards & Panels
  '--card-bg':               '#141B1F',
  '--card-border':           'rgba(76, 175, 80, 0.08)',
  '--card-title':            '#E8E8E8',
  '--card-body':             'rgba(232,232,232,0.70)',
  '--card-hover-bg':         'rgba(255, 255, 255, 0.04)',

  // Inputs
  '--input-bg':              'rgba(255, 255, 255, 0.04)',
  '--input-border':          'rgba(76, 175, 80, 0.20)',
  '--input-text':            '#E8E8E8',
  '--input-placeholder':     'rgba(232,232,232,0.40)',
  '--input-focus-border':    '#4CAF50',

  // Chat
  '--chat-bubble-self':      'rgba(76, 175, 80, 0.15)',
  '--chat-bubble-other':     '#141B1F',
  '--chat-text-self':        '#FFFFFF',
  '--chat-text-other':       'rgba(232,232,232,0.75)',

  // Auth Page
  '--auth-panel-bg':         '#141B1F',

  // Status / Badges
  '--status-pending-bg':     'rgba(255, 152, 0, 0.12)',
  '--status-pending-text':   'rgba(255, 152, 0, 0.90)',
  '--status-success-bg':     'rgba(76, 175, 80, 0.12)',
  '--status-success-text':   '#4CAF50',
  '--status-failed-bg':      'rgba(244, 67, 54, 0.12)',
  '--status-failed-text':    'rgba(244, 67, 54, 0.90)',
  '--status-info-bg':        'rgba(33, 150, 243, 0.12)',
  '--status-info-text':      'rgba(33, 150, 243, 0.90)',

  // Backward Compatible Aliases
  '--bg':          '#0A0E12',
  '--bg2':         '#141B1F',
  '--bg3':         '#0D0D0D',
  '--bg4':         '#1A2025',
  '--bg5':         '#202629',
  '--text':        '#E8E8E8',
  '--textMid':     'rgba(232,232,232,0.70)',
  '--textLow':     'rgba(232,232,232,0.40)',
  '--sulu':        '#4CAF50',
  '--suluLo':      'rgba(76, 175, 80, 0.10)',
  '--suluMd':      'rgba(76, 175, 80, 0.20)',
  '--silver':      '#B0B0B0',
  '--silverLo':    'rgba(255, 255, 255, 0.08)',
  '--silverMd':    'rgba(255, 255, 255, 0.12)',
  '--border':      'rgba(255, 255, 255, 0.06)',
  '--border2':     'rgba(255, 255, 255, 0.10)',
  '--navBg':       'rgba(10,14,18,0.98)',
  '--inputBg':     'rgba(255, 255, 255, 0.04)',
  '--danger':      'rgba(244, 67, 54, 0.90)',
  '--dangerLo':    'rgba(244, 67, 54, 0.10)',
  '--heroFilter':  'brightness(0.20) saturate(0.50)',
  '--imgFilter':   'brightness(0.60) saturate(0.75)',
  '--accent2':     '#FFB74D',
  '--amber':       'rgba(255, 152, 0, 0.90)',
  '--amberLo':     'rgba(255, 152, 0, 0.12)',
  '--blue':        'rgba(33, 150, 243, 0.90)',
  '--blueLo':      'rgba(33, 150, 243, 0.12)',
},
  light: {
    // ─── GRANULAR COMPONENT-LEVEL VARIABLES ─────────────────────────────────
    // Light Mode Color Variables
 
  // Global Page Styles
  '--page-bg':               '#2c2c2c',     // Very light gray
  '--page-text':             '#1A1A1A',     // Dark text
  '--text-muted':            'rgba(26,26,26,0.65)',
  '--text-low':              'rgba(26,26,26,0.45)',
  '--page-border':           'rgba(250, 27, 27, 0.08)',
  '--accent-color':          '#2D9B4F',     // Darker green for light mode
  '--accent-gold':           '#D4A574',     // Muted gold

  // Navbar
  '--nav-bg':                'rgba(255,255,255,0.98)',
  '--nav-border':            'rgba(0, 0, 0, 0.08)',
  '--nav-link':              'rgba(26,26,26,0.65)',
  '--nav-link-hover':        '#1A1A1A',
  '--nav-active':            '#2D9B4F',

  // Sidebar (Soft sage green)
  '--sidebar-bg':            '#E8F5E9',
  '--sidebar-border':        'rgba(0, 0, 0, 0.06)',
  '--sidebar-link':          'rgba(26,26,26,0.70)',
  '--sidebar-link-hover':    '#1A1A1A',
  '--sidebar-active-bg':     'rgba(45,155,79,0.10)',
  '--sidebar-active-text':   '#2D9B4F',

  // Buttons
  '--btn-primary-bg':        '#2D9B4F',
  '--btn-primary-text':      '#F5F5F5',
  '--btn-primary-hover':     '0.92',
  '--btn-secondary-bg':      'transparent',
  '--btn-secondary-text':    '#666666',
  '--btn-secondary-border':  'rgba(0, 0, 0, 0.15)',
  '--btn-icon-border':       'rgba(0, 0, 0, 0.08)',
  '--btn-icon-text':         '#666666',
  '--btn-icon-hover-bg':     'rgba(0, 0, 0, 0.05)',

  // Cards & Panels
  '--card-bg':               '#FAF9F6',
  '--card-border':           'rgba(0, 0, 0, 0.08)',
  '--card-title':            '#1A1A1A',
  '--card-body':             'rgba(26,26,26,0.70)',
  '--card-hover-bg':         'rgba(0, 0, 0, 0.02)',

  // Inputs
  '--input-bg':              '#FFFFFF',
  '--input-border':          'rgba(0, 0, 0, 0.12)',
  '--input-text':            '#1A1A1A',
  '--input-placeholder':     'rgba(26,26,26,0.45)',
  '--input-focus-border':    '#2D9B4F',

  // Chat
  '--chat-bubble-self':      'rgba(45,155,79,0.15)',
  '--chat-bubble-other':     '#F5F5F5',
  '--chat-text-self':        '#1A1A1A',
  '--chat-text-other':       'rgba(26,26,26,0.80)',

  // Auth Page
  '--auth-panel-bg':         '#FFFFFF',

  // Status / Badges
  '--status-pending-bg':     'rgba(245,158,11,0.12)',
  '--status-pending-text':   'rgba(200,120,0,0.95)',
  '--status-success-bg':     'rgba(45,155,79,0.12)',
  '--status-success-text':   '#2D9B4F',
  '--status-failed-bg':      'rgba(220,53,69,0.12)',
  '--status-failed-text':    'rgba(220,53,69,0.95)',
  '--status-info-bg':        'rgba(25,118,210,0.12)',
  '--status-info-text':      'rgba(25,118,210,0.95)',

  // Backward Compatible Aliases
  '--bg':          '#F8FAFB',
  '--bg2':         '#FFFFFF',
  '--bg3':         '#F5F5F5',
  '--bg4':         '#EFEFEF',
  '--bg5':         '#E8E8E8',
  '--text':        '#1A1A1A',
  '--textMid':     'rgba(26,26,26,0.70)',
  '--textLow':     'rgba(26,26,26,0.45)',
  '--sulu':        '#2D9B4F',
  '--suluLo':      'rgba(45,155,79,0.10)',
  '--suluMd':      'rgba(45,155,79,0.20)',
  '--silver':      '#666666',
  '--silverLo':    'rgba(0, 0, 0, 0.08)',
  '--silverMd':    'rgba(0, 0, 0, 0.15)',
  '--border':      'rgba(0, 0, 0, 0.08)',
  '--border2':     'rgba(0, 0, 0, 0.12)',
  '--navBg':       'rgba(255,255,255,0.98)',
  '--inputBg':     '#FFFFFF',
  '--danger':      'rgba(220,53,69,0.95)',
  '--dangerLo':    'rgba(220,53,69,0.10)',
  '--heroFilter':  'brightness(1.05) saturate(0.9)',
  '--imgFilter':   'brightness(0.95) saturate(1)',
  '--accent2':     '#D4A574',
  '--amber':       'rgba(200,120,0,0.95)',
  '--amberLo':     'rgba(245,158,11,0.12)',
  '--blue':        'rgba(25,118,210,0.95)',
  '--blueLo':      'rgba(25,118,210,0.12)',
 }
};
import { LogoMark } from '../../components/Logo';
import { useAppStore } from '../../store/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardList, MessageSquare, User, LogOut,
  Globe, Bell, Sun, Moon, ArrowRight,
  ShoppingBag, Clock, CheckCircle2, TrendingUp, ChevronRight,
  Eye, Printer, X, AlertCircle, Check, Send, CheckCheck,
  Utensils, Lock, ToggleLeft, ToggleRight, ShoppingCart,
  Camera, Package, MoreHorizontal, Mail, Phone, MessageCircle,
  Tag, Plus, Search, Settings, BellRing, BellOff, ShieldCheck,
  Trash2, Download, KeyRound, Languages, Palette,
} from 'lucide-react';

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────
const T = {
  fr: {
    nav: { dashboard: 'Dashboard', orders: 'Commandes', messages: 'Messages', profile: 'Profil', browse: 'Catalogue', logout: 'Déconnexion', notifications: 'Notifications', help: 'Aide', settings: 'Paramètres' },
    topbar: { restaurant: 'Restaurant' },
    common: {
      error: 'Erreur de chargement', retry: 'Réessayer', yes: 'Oui', no: 'Non',
      confirmCancel: 'Confirmer l\'annulation ?', pwdMismatch: 'Les mots de passe ne correspondent pas',
      avatarError: 'Échec de l\'envoi de la photo, réessayez',
    },
    dashboard: {
      eyebrow: 'Vue d\'ensemble', title: 'Dashboard',
      welcome: 'Bonjour', welcomeSub: 'Portail d\'approvisionnement',
      stats: ['Commandes totales', 'En attente', 'Livrées', 'Dépenses totales'],
      trend: 'Tendance dépenses', week: 'Cette semaine',
      statusChart: 'Répartition statuts',
      recent: 'Commandes récentes', recentSub: 'Aperçu de vos achats',
      viewAll: 'Tout voir', noOrders: 'Aucune commande récente',
      cols: ['Commande', 'Fournisseur', 'Statut', 'Total', 'Date', ''],
      restock: 'Besoin de réapprovisionner ?',
      restockSub: 'Parcourez les fournisseurs vérifiés et passez votre prochaine commande.',
      restockCta: 'Parcourir le catalogue',
    },
    orders: {
      eyebrow: 'Gestion commandes', title: 'Mes Commandes',
      filters: ['Toutes', 'En attente', 'Confirmées', 'Livrées', 'Rejetées'],
      filterVals: ['all', 'pending', 'confirmed', 'delivered', 'rejected'],
      cols: ['', '#', 'Fournisseur', 'Date', 'Total', 'Statut', ''],
      noOrders: 'Aucune commande dans cette catégorie',
      items: 'Articles commandés', summary: 'Résumé facture',
      ops: 'Opérations', invoice: 'Générer facture',
      cancel: 'Annuler la commande',
      locked: 'Commande verrouillée en état',
      invoiceTitle: 'Aperçu Facture', print: 'Imprimer',
      subtotal: 'Sous-total', discount: 'Remise', tax: 'Taxe', total: 'Total',
      to: 'À :', view: 'Voir', hide: 'Masquer',
    },
    messages: {
      eyebrow: 'Boîte de réception', title: 'Messages',
      noConvs: 'Aucune conversation', noMsgs: 'Aucun message',
      select: 'Sélectionnez une conversation', supplier: 'Fournisseur GreenLeaf',
      placeholder: 'Tapez votre message...',
      hint: 'Pour démarrer une conversation, visitez le profil d\'un fournisseur.',
    },
    profile: {
      eyebrow: 'Restaurant', title: 'Mon Profil',
      tabs: ['Informations', 'Sécurité', 'Notifications'],
      tabIds: ['info', 'security', 'notifications'],
      info: { businessName: 'Nom du restaurant', contactName: 'Nom du contact', email: 'Email', phone: 'Téléphone', region: 'Ville', address: 'Adresse', bio: 'À propos', save: 'Enregistrer', saving: 'Enregistrement...', saved: '✓ Enregistré', changePic: 'Changer photo' },
      security: { title: 'Sécurité du compte', section: 'Mot de passe', current: 'Mot de passe actuel', newPwd: 'Nouveau mot de passe', confirm: 'Confirmer', save: 'Mettre à jour', saving: 'Mise à jour...', saved: '✓ Mis à jour' },
      notifs: {
        title: 'Notifications', section: 'Préférences', save: 'Enregistrer', saving: 'Enregistrement...', items: [
          { key: 'order_updates', label: 'Mises à jour commandes', sub: 'Alertes sur l\'état de vos commandes' },
          { key: 'messages', label: 'Nouveaux messages', sub: 'Alerte quand un fournisseur vous répond' },
          { key: 'promos', label: 'Nouvelles promotions', sub: 'Offres et réductions fournisseurs' },
          { key: 'weekly', label: 'Résumé hebdomadaire', sub: 'Résumé de vos achats chaque lundi' },
        ]
      },
    },
    settings: {
      eyebrow: 'Préférences', title: 'Paramètres',
      appearance: 'Apparence', theme: 'Thème', light: 'Clair', dark: 'Sombre',
      language: 'Langue', languageSub: 'Langue utilisée dans l\'interface',
      account: 'Compte', exportData: 'Exporter mes données', exportSub: 'Télécharger un export de vos commandes et informations',
      changePwd: 'Changer le mot de passe', changePwdSub: 'Mettre à jour votre mot de passe de connexion',
      dangerZone: 'Zone de danger', deleteAccount: 'Supprimer le compte', deleteSub: 'Cette action est irréversible',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer votre compte ?',
      save: 'Enregistrer', saving: 'Enregistrement...', saved: '✓ Enregistré',
    },
    notifications: {
      eyebrow: 'Centre de notifications', title: 'Notifications',
      all: 'Toutes', unread: 'Non lues',
      markAllRead: 'Tout marquer comme lu', noNotifs: 'Aucune notification', noUnread: 'Aucune notification non lue',
      justNow: 'À l\'instant', minAgo: 'min', hAgo: 'h', dAgo: 'j',
    },
  },
  en: {
    nav: { notifications: 'Notifications', help: 'Help', settings: 'Settings', dashboard: 'Dashboard', orders: 'Orders', messages: 'Messages', profile: 'Profile', browse: 'Catalogue', logout: 'Logout' },
    topbar: { restaurant: 'Restaurant' },
    common: {
      error: 'Failed to load', retry: 'Retry', yes: 'Yes', no: 'No',
      confirmCancel: 'Confirm cancellation?', pwdMismatch: 'Passwords don\'t match',
      avatarError: 'Failed to upload photo, try again',
    },
    dashboard: {
      eyebrow: 'Overview', title: 'Dashboard',
      welcome: 'Hello', welcomeSub: 'Sourcing Portal',
      stats: ['Total Orders', 'Pending', 'Delivered', 'Total Spent'],
      trend: 'Spending Trend', week: 'This week',
      statusChart: 'Order breakdown',
      recent: 'Recent Orders', recentSub: 'Your sourcing overview',
      viewAll: 'View all', noOrders: 'No recent orders',
      cols: ['Order', 'Supplier', 'Status', 'Total', 'Date', ''],
      restock: 'Need to restock?',
      restockSub: 'Browse verified suppliers and place your next order instantly.',
      restockCta: 'Browse catalogue',
    },
    orders: {
      eyebrow: 'Order Management', title: 'My Orders',
      filters: ['All', 'Pending', 'Confirmed', 'Delivered', 'Rejected'],
      filterVals: ['all', 'pending', 'confirmed', 'delivered', 'rejected'],
      cols: ['', '#', 'Supplier', 'Date', 'Total', 'Status', ''],
      noOrders: 'No orders in this category',
      items: 'Order items', summary: 'Invoice summary',
      ops: 'Operations', invoice: 'Generate invoice',
      cancel: 'Cancel order',
      locked: 'Order locked in status',
      invoiceTitle: 'Invoice Preview', print: 'Print',
      subtotal: 'Subtotal', discount: 'Discount', tax: 'Tax', total: 'Total',
      to: 'To:', view: 'View', hide: 'Hide',
    },
    messages: {
      eyebrow: 'Inbox', title: 'Messages',
      noConvs: 'No conversations yet', noMsgs: 'No messages yet',
      select: 'Select a conversation', supplier: 'GreenLeaf Supplier',
      placeholder: 'Type a message...',
      hint: 'To start a conversation, visit a supplier\'s profile.',
    },
    profile: {
      eyebrow: 'Restaurant', title: 'My Profile',
      tabs: ['Information', 'Security', 'Notifications'],
      tabIds: ['info', 'security', 'notifications'],
      info: { businessName: 'Restaurant name', contactName: 'Contact name', email: 'Email', phone: 'Phone', region: 'City', address: 'Address', bio: 'About', save: 'Save changes', saving: 'Saving...', saved: '✓ Saved', changePic: 'Change photo' },
      security: { title: 'Account Security', section: 'Password', current: 'Current password', newPwd: 'New password', confirm: 'Confirm', save: 'Update password', saving: 'Updating...', saved: '✓ Updated' },
      notifs: {
        title: 'Notifications', section: 'Preferences', save: 'Save preferences', saving: 'Saving...', items: [
          { key: 'order_updates', label: 'Order updates', sub: 'Alerts on your order status changes' },
          { key: 'messages', label: 'New messages', sub: 'Alert when a supplier replies' },
          { key: 'promos', label: 'New promotions', sub: 'Supplier deals and discounts' },
          { key: 'weekly', label: 'Weekly summary', sub: 'Summary of your purchases every Monday' },
        ]
      },
    },
    settings: {
      eyebrow: 'Preferences', title: 'Settings',
      appearance: 'Appearance', theme: 'Theme', light: 'Light', dark: 'Dark',
      language: 'Language', languageSub: 'Language used across the interface',
      account: 'Account', exportData: 'Export my data', exportSub: 'Download a copy of your orders and account info',
      changePwd: 'Change password', changePwdSub: 'Update your login password',
      dangerZone: 'Danger zone', deleteAccount: 'Delete account', deleteSub: 'This action cannot be undone',
      confirmDelete: 'Are you sure you want to delete your account?',
      save: 'Save changes', saving: 'Saving...', saved: '✓ Saved',
    },
    notifications: {
      eyebrow: 'Notification center', title: 'Notifications',
      all: 'All', unread: 'Unread',
      markAllRead: 'Mark all as read', noNotifs: 'No notifications', noUnread: 'No unread notifications',
      justNow: 'Just now', minAgo: 'm ago', hAgo: 'h ago', dAgo: 'd ago',
    },
  },
};

const REGIONS = ['Casablanca-Settat', 'Souss-Massa', 'Marrakech-Safi', 'Fès-Meknès', 'Tanger-Tétouan-Al Hoceïma', 'Rabat-Salé-Kénitra', 'Oriental', 'Béni Mellal-Khénifra', 'Drâa-Tafilalet', 'Guelmim-Oued Noun'];

const fmt = n => Number(n || 0).toLocaleString('fr-MA');

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────
const GS = ({ theme }) => {
  const t = THEMES[theme] || THEMES.dark;
  const isDark = theme === 'dark';
  
  // Map THEMES configuration properties to RestaurantApp's local theme variable tokens
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
    '--danger-border':  t['--status-failed-text'],
    '--warn-bg':        t['--accent-gold'],
    '--warn-text':      t['--btn-primary-text'],
    '--input-bg':       t['--input-bg'],
    '--sidebar-bg':     t['--sidebar-bg'],
    '--sidebar-border': t['--sidebar-border'],
    '--sidebar-link':   t['--sidebar-link'],
    '--sidebar-link-hover': t['--sidebar-link-hover'],
    '--sidebar-active-bg': t['--sidebar-active-bg'],
    '--sidebar-active-text': t['--sidebar-active-text'],
    '--shadow':         isDark ? '0 24px 64px rgba(0,0,0,0.55)' : '0 24px 64px rgba(0,0,0,0.15)',
  };

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      body {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 14px; line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--btn-icon-border, #d4d4d4); border-radius: 99px; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .spin { animation: spin 0.7s linear infinite; display:inline-block; }

      .r-app {
        ${Object.entries(localVars).map(([k, v]) => `${k}: ${v};`).join('\n        ')}
      }
      body { background: var(--page-bg); color: var(--text-1); transition: background 0.3s, color 0.3s; }

      /* SIDEBAR styles (now dynamic, using variables from themes.js) */
      .r-sidebar {
        width: 240px; min-width: 240px;
        background: var(--sidebar-bg);
        border-right: 1px solid var(--sidebar-border);
        display: flex; flex-direction: column;
        height: 100%; border-radius: 16px;
        overflow: hidden; flex-shrink: 0;
        transition: background 0.3s, border-color 0.3s;
      }
      .r-logo-row {
        display: flex; align-items: center; gap: 10px;
        padding: 22px 20px 18px;
      }
      .r-logo-icon {
        width: 32px; height: 32px;
        background: var(--sidebar-active-bg);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
      }
      .r-logo-text { font-size: 16px; font-weight: 700; color: var(--text-1); letter-spacing: -0.3px; }
      .r-nav-section { padding: 0 12px; display: flex; flex-direction: column; gap: 2px; }
      .r-nav-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 12px; border-radius: 10px;
        font-size: 14px; font-weight: 400;
        color: var(--sidebar-link);
        cursor: pointer; border: none; background: none;
        width: 100%; text-align: left; text-decoration: none;
        transition: background 0.15s, color 0.15s; white-space: nowrap;
      }
      .r-nav-item:hover { background: var(--sidebar-active-bg); color: var(--sidebar-link-hover); }
      .r-nav-item.active { background: var(--btn-primary-bg); color: var(--btn-primary-text); font-weight: 500; }
      .r-nav-item.active svg { color: var(--btn-primary-text); }
      .r-nav-divider { height: 1px; background: var(--sidebar-border); margin: 10px 12px; }
      .r-nav-bottom { margin-top: auto; padding: 12px 12px 16px; }


    /* MAIN */
    .r-main {
      flex: 1; background: var(--surface); border-radius: 16px;
      display: flex; flex-direction: column;
      overflow: hidden; min-width: 0;
      transition: background 0.2s;
    }

    /* TOPBAR */
    .r-topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 28px; border-bottom: 1px solid var(--border); flex-shrink: 0;
    }
    .r-topbar-title { font-size: 22px; font-weight: 700; color: var(--text-1); letter-spacing: -0.4px; }
    .r-topbar-right { display: flex; align-items: center; gap: 10px; }
    .r-icon-btn {
      width: 36px; height: 36px; border: 1.5px solid var(--border-strong); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface); cursor: pointer; color: var(--text-2); transition: all 0.15s;
      position: relative;
    }
    .r-icon-btn:hover { background: var(--hover); color: var(--text-1); border-color: var(--border-strong); }
    .r-icon-btn .r-dot {
      position: absolute; top: -2px; right: -2px;
      width: 9px; height: 9px; border-radius: 50%;
      background: #dc2626; border: 2px solid var(--surface);
    }

    /* FILTER TABS */
    .r-filter-tab {
      padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
      border: none; background: none; cursor: pointer; color: var(--text-2);
      transition: all 0.15s; white-space: nowrap;
    }
    .r-filter-tab.on { background: var(--accent); color: var(--accent-text); }
    .r-filter-tab:hover:not(.on) { background: var(--hover); color: var(--text-1); }

    /* TABLE */
    .r-table { width: 100%; border-collapse: collapse; }
    .r-table thead th {
      padding: 12px 16px; text-align: left;
      font-size: 13px; font-weight: 500; color: var(--text-2);
      border-bottom: 1.5px solid var(--border);
    }
    .r-table tbody td {
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      font-size: 14px; color: var(--text-1); vertical-align: middle;
    }
    .r-table tbody tr:last-child td { border-bottom: none; }
    .r-table tbody tr { transition: background 0.1s; cursor: pointer; }
    .r-table tbody tr:hover { background: var(--hover); }
    .r-table tbody tr.row-selected { background: var(--subtle); }

    /* CHECKBOX */
    .r-checkbox {
      width: 20px; height: 20px; border: 1.5px solid var(--border-strong); border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.15s; background: var(--surface); cursor: pointer;
    }
    .r-checkbox.checked { background: var(--accent); border-color: var(--accent); }

    /* BADGES */
    .r-badge {
      display: inline-block; padding: 4px 10px; border-radius: 8px;
      font-size: 13px; font-weight: 500; border: 1px solid transparent;
    }
    .r-badge-pending   { background: #fef9c3; color: #a16207; border-color: #fde047; }
    .r-badge-confirmed { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
    .r-badge-delivered { background: #dcfce7; color: #15803d; border-color: #86efac; }
    .r-badge-rejected  { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
    .r-badge-cancelled { background: #f5f5f5; color: #888;    border-color: #e0e0e0; }

    /* DETAIL PANEL */
    .r-detail-panel {
      width: 280px; min-width: 280px;
      border-left: 1px solid var(--border);
      display: flex; flex-direction: column;
      background: var(--surface); flex-shrink: 0; overflow-y: auto;
    }

    /* STAT CARDS */
    .r-stat-card {
      background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px;
      padding: 18px 20px;
    }
    .r-card {
      background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px;
    }

    /* FORMS */
    .r-label { display: block; font-size: 12px; font-weight: 500; color: var(--text-2); margin-bottom: 5px; }
    .r-input, .r-select, .r-textarea {
      width: 100%; padding: 9px 12px;
      border: 1.5px solid var(--border-strong); border-radius: 9px;
      font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text-1);
      background: var(--input-bg); transition: border-color 0.15s; outline: none;
    }
    .r-input:focus, .r-select:focus, .r-textarea:focus { border-color: var(--text-2); }
    .r-input::placeholder, .r-textarea::placeholder { color: var(--text-3); }
    .r-select { appearance: none; }
    .r-field { display: flex; flex-direction: column; }

    /* BUTTONS */
    .r-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 18px; border-radius: 10px;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap;
    }
    .r-btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .r-btn-dark { background: var(--accent); color: var(--accent-text); }
    .r-btn-dark:hover:not(:disabled) { opacity: 0.85; }
    .r-btn-ghost { background: var(--surface); color: var(--text-2); border: 1.5px solid var(--border-strong); }
    .r-btn-ghost:hover:not(:disabled) { background: var(--hover); color: var(--text-1); }
    .r-btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 8px; }
    .r-btn-danger { background: var(--danger-bg); color: var(--danger-text); border: 1.5px solid var(--danger-border); }
    .r-btn-danger:hover:not(:disabled) { opacity: 0.85; }
    .r-btn-warn { background: var(--warn-bg); color: var(--warn-text); border: none; }
    .r-btn-warn:hover:not(:disabled) { opacity: 0.85; }

    /* ACTION PAIR */
    .r-action-btn {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 12px; border: none; border-radius: 12px;
      font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.15s;
    }

    /* MODAL */
    .r-modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .r-modal {
      background: var(--surface); border-radius: 16px;
      box-shadow: var(--shadow);
      width: 480px; max-width: 95vw; overflow: hidden;
    }

    /* AVATAR */
    .r-avatar {
      border-radius: 50%; object-fit: cover; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; overflow: hidden;
    }

    /* CHAT */
    .r-msg-self  { background: var(--accent); color: var(--accent-text); padding: 10px 14px; max-width: 72%; font-size: 13px; border-radius: 18px; border-bottom-right-radius: 4px; line-height: 1.5; }
    .r-msg-other { background: var(--subtle); color: var(--text-1); padding: 10px 14px; max-width: 72%; font-size: 13px; border-radius: 18px; border-bottom-left-radius: 4px; line-height: 1.5; }

    /* EMPTY */
    .r-empty {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 56px 20px; text-align: center; color: var(--text-3); gap: 12px;
    }

    /* TOGGLE */
    .r-toggle {
      width: 44px; height: 24px; border-radius: 99px; position: relative;
      transition: background 0.2s; border: none; cursor: pointer; padding: 0;
    }
    .r-toggle-knob {
      position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%;
      background: #fff; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    /* THEME SWATCH (settings page) */
    .r-theme-card {
      flex: 1; border: 1.5px solid var(--border-strong); border-radius: 12px;
      padding: 14px; cursor: pointer; transition: all 0.15s; background: var(--surface);
    }
    .r-theme-card.on { border-color: var(--text-1); }
    .r-theme-preview {
      height: 48px; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 4px;
    }

    @media print {
      body * { visibility: hidden; }
      .print-invoice, .print-invoice * { visibility: visible; }
      .print-invoice { position: absolute; top: 0; left: 0; width: 100%; padding: 24px; background: #fff; color: #000; }
      .no-print { display: none !important; }
    }
  `}</style>
  );
};

// ─── AVATAR COLOR ──────────────────────────────────────────────────────────
const AV_COLORS = [
  { bg: '#fef3c7', color: '#92400e' }, { bg: '#dbeafe', color: '#1e40af' },
  { bg: '#d1fae5', color: '#065f46' }, { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#ede9fe', color: '#5b21b6' }, { bg: '#fee2e2', color: '#991b1b' },
  { bg: '#e0f2fe', color: '#075985' }, { bg: '#fef9c3', color: '#713f12' },
];
const avColor = (name = '') => AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length];

// ─── HELPERS ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending: ['r-badge-pending', 'Pending'],
    confirmed: ['r-badge-confirmed', 'Confirmed'],
    accepted: ['r-badge-confirmed', 'Accepted'],
    shipped: ['r-badge-confirmed', 'Shipped'],
    delivered: ['r-badge-delivered', 'Delivered'],
    completed: ['r-badge-delivered', 'Completed'],
    rejected: ['r-badge-rejected', 'Rejected'],
    cancelled: ['r-badge-cancelled', 'Cancelled'],
  };
  const [cls, label] = map[status] || ['r-badge-pending', status || '—'];
  return <span className={`r-badge ${cls}`}>{label}</span>;
};

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 80 }}>
    <svg className="spin" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth={2}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  </div>
);

const Empty = ({ icon: Icon, label }) => (
  <div className="r-empty">
    <Icon size={36} strokeWidth={1.2} />
    <span style={{ fontSize: 13 }}>{label}</span>
  </div>
);

const ErrorState = ({ label, retryLabel, onRetry }) => (
  <div className="r-empty">
    <AlertCircle size={32} color="#fca5a5" strokeWidth={1.4} />
    <span style={{ fontSize: 13, color: '#dc2626' }}>{label}</span>
    <button className="r-btn r-btn-ghost r-btn-sm" onClick={onRetry}>{retryLabel}</button>
  </div>
);

// ─── SIDEBAR ───────────────────────────────────────────────────────────────
const Sidebar = ({ view, setView, t, onLogout }) => {
  const cartCount = useCartStore(s => s.totalItems());
  const main = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
    { id: 'orders', icon: ClipboardList, label: t.nav.orders },
    { id: 'messages', icon: MessageSquare, label: t.nav.messages },
    { id: 'profile', icon: User, label: t.nav.profile },
  ];
  const bottom = [
    { id: 'help', icon: HelpCircle, label: t.nav.help },
    { id: 'settings', icon: Settings, label: t.nav.settings },
  ];
  return (
    <div className="r-sidebar">
      <div className="r-logo-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <LogoMark size={28} />
        <span className="r-logo-text" style={{ fontFamily: 'DM Serif Display, Georgia, serif', textTransform: 'uppercase', fontSize: 15, letterSpacing: '0.04em' }}>Green<span style={{ color: 'var(--sulu)' }}>Leaf</span></span>
      </div>

      <div className="r-nav-section">
        {main.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`r-nav-item${view === id ? ' active' : ''}`} onClick={() => setView(id)}>
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="r-nav-divider" />

      <div className="r-nav-section">
        <Link to="/browse" className="r-nav-item">
          <Globe size={17} strokeWidth={1.8} />
          <span>{t.nav.browse}</span>
        </Link>
        <Link to="/cart" className="r-nav-item" style={{ position: 'relative' }}>
          <ShoppingCart size={17} strokeWidth={1.8} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span style={{ marginLeft: 'auto', background: '#1c1c1e', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99 }}>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </Link>
      </div>

      <div className="r-nav-divider" />

      <div className="r-nav-section">
        {bottom.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`r-nav-item${view === id ? ' active' : ''}`} onClick={() => setView(id)}>
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="r-nav-bottom" style={{ display: 'flex', justifyContent: 'center', padding: '12px 12px 16px' }}>
        <button onClick={onLogout} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '45px',
          height: '45px',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'width 0.3s, border-radius 0.3s',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.199)',
          backgroundColor: 'rgba(200, 50, 50, 0.75)',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.width = '125px';
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
          onMouseDown={e => e.currentTarget.style.transform = 'translate(2px, 2px)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translate(0, 0)'}
        >
          <div className="lo-sign" style={{ width: '100%', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={17} color="white" strokeWidth={2.2} />
          </div>
          <div className="lo-text" style={{ position: 'absolute', right: 0, width: '0%', opacity: 0, color: 'white', fontSize: '1em', fontWeight: 600, transition: '0.3s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {t.nav.logout}
          </div>
        </button>
      </div>
    </div>
  );
};

// ─── TOP BAR ───────────────────────────────────────────────────────────────
const TopBar = ({ view, theme, toggleTheme, lang, toggleLang, t, profilePic, onNotifications, unreadCount }) => {
  const titles = {
    dashboard: t.nav.dashboard, orders: t.nav.orders,
    messages: t.nav.messages, profile: t.nav.profile,
    settings: t.nav.settings, help: t.nav.help,
    notifications: t.nav.notifications,
  };
  return (
    <div className="r-topbar">
      <span className="r-topbar-title">{titles[view] || view}</span>
      <div className="r-topbar-right">
        <button className="r-icon-btn" onClick={onNotifications} title="Notifications">
          <Bell size={15} />
          {unreadCount > 0 && <span className="r-dot" />}
        </button>
        <button className="r-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button
          className="r-icon-btn"
          onClick={toggleLang}
          style={{ fontSize: 11, fontWeight: 600, width: 'auto', padding: '0 10px', gap: 4 }}
        >
          <Globe size={14} /> {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px', border: '1.5px solid var(--border)', borderRadius: 10 }}>
          <div className="r-avatar" style={{ width: 32, height: 32, background: '#c8b99a', color: '#5c4a2a', fontSize: 13, fontWeight: 700 }}>
            {profilePic
              ? <img src={profilePic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : 'R'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Chef</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{t.topbar.restaurant}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PLACEHOLDER VIEW ─────────────────────────────────────────────────────
const PlaceholderView = ({ icon: Icon, title }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 28, gap: 20 }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{title}</div>
    <div className="r-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty icon={Icon} label={`${title} — coming soon`} />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
const Dashboard = ({ setView, t }) => {
  const td = t.dashboard;
  const tc = t.common;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const r = await axios.get('/api/restaurant/orders');
      setOrders(r.data || []);
    } catch (e) { setError(true); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    deliveredOrders: orders.filter(o => ['delivered', 'completed'].includes(o.status)).length,
    totalSpent: orders.filter(o => !['rejected', 'cancelled'].includes(o.status)).reduce((a, o) => a + (o.total_amount || 0), 0),
  }), [orders]);

  const recent = useMemo(() => (
    [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8)
  ), [orders]);

  // Weekly chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartBars = days.map((label, i) => ({
    label,
    value: orders.reduce((a, o, idx) => idx % 7 === i ? a + (o.total_amount || 0) : a, 0),
  }));
  const maxBar = Math.max(...chartBars.map(d => d.value), 1);

  const formatDate = ts => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) return <Loader />;
  if (error) return <ErrorState label={tc.error} retryLabel={tc.retry} onRetry={load} />;

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', flex: 1 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { label: td.stats[0], value: stats.totalOrders, delta: 'All time', c: '#16a34a' },
          { label: td.stats[1], value: stats.pendingOrders, delta: 'Awaiting suppliers', c: '#ca8a04' },
          { label: td.stats[2], value: stats.deliveredOrders, delta: 'Successfully received', c: '#16a34a' },
          { label: td.stats[3], value: `${fmt(stats.totalSpent)} MAD`, delta: 'Total expenditure', c: '#1d4ed8' },
        ].map(({ label, value, delta, c }) => (
          <div key={label} className="r-stat-card">
            <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 6 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: c }}>{delta}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        {/* Bar chart */}
        <div className="r-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>{td.trend}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{td.week}</div>
            </div>
            <button className="r-btn r-btn-ghost r-btn-sm" onClick={() => setView('orders')}>
              View orders <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90 }}>
            {chartBars.map((d, i) => {
              const h = Math.max(Math.round((d.value / maxBar) * 80), 4);
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  title={`${d.label}: ${d.value.toLocaleString()}`}
                  style={{ flex: 1, borderRadius: '5px 5px 0 0', background: 'var(--accent)', cursor: 'pointer', minWidth: 0 }}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            {chartBars.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-3)' }}>{d.label}</div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="r-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 18 }}>{td.statusChart}</div>
          {[
            { label: 'Pending', value: stats.pendingOrders, color: '#a16207', bg: '#fef9c3' },
            { label: 'Active', value: Math.max(0, stats.totalOrders - stats.pendingOrders - stats.deliveredOrders), color: '#1d4ed8', bg: '#eff6ff' },
            { label: 'Delivered', value: stats.deliveredOrders, color: '#15803d', bg: '#dcfce7' },
          ].filter(d => d.value > 0).map(d => {
            const pct = Math.round((d.value / (stats.totalOrders || 1)) * 100);
            return (
              <div key={d.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{d.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: d.color }}>{d.value}</span>
                </div>
                <div style={{ height: 6, background: 'var(--subtle)', borderRadius: 99 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ height: 6, background: d.color, borderRadius: 99 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent orders table */}
      <div className="r-card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>{td.recent}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{td.recentSub}</div>
          </div>
          <button className="r-btn r-btn-ghost r-btn-sm" onClick={() => setView('orders')}>
            {td.viewAll} <ChevronRight size={12} />
          </button>
        </div>
        {recent.length > 0 ? (
          <table className="r-table">
            <thead>
              <tr>{td.cols.map(c => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {recent.map(o => {
                const ac = avColor(o.fournisseur_name || '');
                return (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 500 }}>#{o.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="r-avatar" style={{ width: 30, height: 30, background: ac.bg, color: ac.color, fontSize: 12 }}>
                          {(o.fournisseur_name || '?').charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{o.fournisseur_name || '—'}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td style={{ fontWeight: 500 }}>{fmt(o.total_amount)} MAD</td>
                    <td style={{ color: 'var(--text-2)' }}>{formatDate(o.created_at)}</td>
                    <td>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 6, display: 'flex' }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Empty icon={ShoppingBag} label={td.noOrders} />
        )}
      </div>

      {/* Restock CTA */}
      <div style={{ background: '#1c1c1e', borderRadius: 14, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{td.restock}</div>
          <div style={{ fontSize: 12, color: '#8e8e93' }}>{td.restockSub}</div>
        </div>
        <Link to="/browse" className="r-btn r-btn-warn" style={{ textDecoration: 'none' }}>
          {td.restockCta} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════════════
const POLL_INTERVAL = 5000;

const Orders = ({ t }) => {
  const to = t.orders;
  const tc = t.common;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = async f => {
    setLoading(true); setError(false);
    try {
      const r = await axios.get('/api/restaurant/orders', { params: f !== 'all' ? { status: f } : {} });
      const data = r.data || [];
      setOrders(data);
      if (data.length > 0 && !selected) setSelected(data[0]);
    } catch (e) { setError(true); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(filter); }, [filter]);

  const toggleCheck = (id, e) => {
    e.stopPropagation();
    setCheckedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const allChecked = orders.length > 0 && orders.every(o => checkedIds.has(o.id));

  const doCancelOrder = async id => {
    setCancelling(true);
    try {
      await axios.patch(`/api/orders/${id}`, { status: 'cancelled' });
      setConfirmCancelId(null);
      load(filter);
    } catch (e) { }
    finally { setCancelling(false); }
  };

  const formatDate = ts => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const sel = selected;
  const selAc = sel ? avColor(sel.fournisseur_name || '') : {};

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Table section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '14px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {to.filters.map((label, i) => (
            <button
              key={i}
              className={`r-filter-tab${filter === to.filterVals[i] ? ' on' : ''}`}
              onClick={() => setFilter(to.filterVals[i])}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? <Loader />
            : error ? <ErrorState label={tc.error} retryLabel={tc.retry} onRetry={() => load(filter)} />
              : orders.length === 0 ? <Empty icon={ClipboardList} label={to.noOrders} />
                : (
                  <table className="r-table">
                    <thead>
                      <tr>
                        <th style={{ width: 52, paddingLeft: 20 }}>
                          <div
                            className={`r-checkbox${allChecked ? ' checked' : ''}`}
                            onClick={() => allChecked
                              ? setCheckedIds(new Set())
                              : setCheckedIds(new Set(orders.map(o => o.id)))
                            }
                          >
                            {allChecked && <span style={{ width: 10, height: 2, background: '#fff', display: 'block', borderRadius: 2 }} />}
                          </div>
                        </th>
                        <th>#</th>
                        <th>Supplier</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th style={{ width: 48 }} />
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => {
                        const checked = checkedIds.has(o.id);
                        const isSelected = sel?.id === o.id;
                        const ac = avColor(o.fournisseur_name || '');
                        return (
                          <tr
                            key={o.id}
                            className={isSelected ? 'row-selected' : ''}
                            onClick={() => setSelected(o)}
                          >
                            <td style={{ paddingLeft: 20, paddingRight: 0 }} onClick={e => toggleCheck(o.id, e)}>
                              <div className={`r-checkbox${checked ? ' checked' : ''}`}>
                                {checked && <Check size={12} color="#fff" strokeWidth={3} />}
                              </div>
                            </td>
                            <td style={{ fontWeight: 500, color: 'var(--text-2)', fontSize: 13 }}>#{o.id}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="r-avatar" style={{ width: 32, height: 32, background: ac.bg, color: ac.color, fontSize: 13 }}>
                                  {(o.fournisseur_name || '?').charAt(0)}
                                </div>
                                <span style={{ fontWeight: 500 }}>{o.fournisseur_name || '—'}</span>
                              </div>
                            </td>
                            <td style={{ color: 'var(--text-2)' }}>{formatDate(o.created_at)}</td>
                            <td style={{ fontWeight: 600 }}>{fmt(o.total_amount)} MAD</td>
                            <td><StatusBadge status={o.status} /></td>
                            <td>
                              <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 6, display: 'flex' }}
                                onClick={e => e.stopPropagation()}
                              >
                                <MoreHorizontal size={17} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )
          }
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div className="r-detail-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 20px 0' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px', marginBottom: 8 }}>
                Order #{sel.id}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusBadge status={sel.status} />
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{formatDate(sel.created_at)}</span>
              </div>
            </div>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', padding: 4 }}
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Supplier avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
            <div className="r-avatar" style={{ width: 64, height: 64, background: selAc.bg, color: selAc.color, fontSize: 22, marginBottom: 10 }}>
              {(sel.fournisseur_name || '?').charAt(0)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 12 }}>{sel.fournisseur_name || '—'}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="r-icon-btn"><Mail size={15} /></button>
              <button className="r-icon-btn"><Phone size={15} /></button>
              <button className="r-icon-btn" onClick={() => { }}><MessageCircle size={15} /></button>
            </div>
          </div>

          {/* Order items */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '16px 20px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 14 }}>{to.items}</div>
              {(sel.items || []).length === 0
                ? <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '16px 0' }}>—</div>
                : (sel.items || []).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--subtle)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {item.image
                        ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Package size={16} color="var(--text-3)" strokeWidth={1.5} />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product_name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>× {item.quantity} {item.unit || 'kg'} · {fmt(item.unit_price)} MAD</div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Summary */}
            <div style={{ margin: '12px 20px', padding: '14px', background: 'var(--subtle)', borderRadius: 10 }}>
              {[[to.subtotal, sel.subtotal], [to.discount, sel.discount || 0], [to.tax, sel.tax || 0]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{l}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-1)' }}>{fmt(v)} MAD</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-strong)' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{to.total}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{fmt(sel.total_amount)} MAD</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <button
              className="r-action-btn"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)', marginBottom: 8, width: '100%' }}
              onClick={() => setInvoiceOrder(sel)}
            >
              <Printer size={15} /> {to.invoice}
            </button>
            {sel.status === 'pending' && (
              confirmCancelId === sel.id ? (
                <div style={{ background: 'var(--danger-bg)', borderRadius: 10, padding: '12px', marginTop: 4 }}>
                  <div style={{ fontSize: 12, color: 'var(--danger-text)', marginBottom: 10, fontWeight: 500 }}>{tc.confirmCancel}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="r-btn r-btn-danger r-btn-sm" style={{ flex: 1, justifyContent: 'center' }} disabled={cancelling} onClick={() => doCancelOrder(sel.id)}>
                      {cancelling ? '...' : tc.yes}
                    </button>
                    <button className="r-btn r-btn-ghost r-btn-sm" style={{ flex: 1, justifyContent: 'center' }} disabled={cancelling} onClick={() => setConfirmCancelId(null)}>
                      {tc.no}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="r-action-btn"
                  style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', width: '100%' }}
                  onClick={() => setConfirmCancelId(sel.id)}
                >
                  <X size={15} /> {to.cancel}
                </button>
              )
            )}
            {sel.status !== 'pending' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px', background: 'var(--subtle)', borderRadius: 8, marginTop: 4 }}>
                <AlertCircle size={13} color="var(--text-3)" />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{to.locked}: {sel.status}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice modal */}
      {invoiceOrder && (
        <div className="r-modal-overlay" onClick={e => e.target === e.currentTarget && setInvoiceOrder(null)}>
          <div className="r-modal print-invoice">
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>{to.invoiceTitle}</span>
              <button className="r-icon-btn" onClick={() => setInvoiceOrder(null)} style={{ width: 30, height: 30 }}><X size={14} /></button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)' }}>GreenLeaf</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>B2B Invoice</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>#{invoiceOrder.id}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{new Date(invoiceOrder.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 16 }}>
                {to.to} <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{invoiceOrder.fournisseur_name}</span>
              </div>
              {(invoiceOrder.items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.product_name} × {item.quantity}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{fmt(item.unit_price)} MAD</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{to.total}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)' }}>{fmt(invoiceOrder.total_amount)} MAD</span>
              </div>
              <button className="r-btn r-btn-dark no-print" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.print()}>
                <Printer size={14} /> {to.print}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════════════════════
const Messages = ({ t }) => {
  const tm = t.messages;
  const tc = t.common;
  const [convs, setConvs] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [selId, setSelId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const endRef = useRef(null);
  const selIdRef = useRef(null);
  selIdRef.current = selId;

  const fetchConvs = async () => {
    setError(false);
    try {
      const r = await axios.get('/api/messages');
      const d = r.data || [];
      setConvs(d);
      if (d.length > 0 && !selIdRef.current) setSelId(d[0].id);
    } catch (e) { setError(true); }
    finally { setLoading(false); }
  };
  const fetchMsgs = async (id, { silent } = {}) => {
    if (!id) return;
    try {
      const r = await axios.get(`/api/messages/${id}`);
      setMsgs(r.data || []);
    } catch (e) { }
  };

  useEffect(() => { fetchConvs(); }, []);
  useEffect(() => { if (selId) fetchMsgs(selId); }, [selId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => {
    const iv = setInterval(() => {
      if (selIdRef.current) fetchMsgs(selIdRef.current, { silent: true });
      fetchConvs();
    }, POLL_INTERVAL);
    return () => clearInterval(iv);
  }, []);

  const send = async e => {
    e.preventDefault(); if (!input.trim() || !selId) return;
    const content = input;
    try {
      const r = await axios.post('/api/messages', { conversationId: selId, content });
      setMsgs(p => [...p, r.data]);
      setInput('');
      setConvs(prev => prev.map(c => c.id === selId ? { ...c, last_message_preview: content, unread_count: 0 } : c));
    } catch (e) { }
  };

  const active = convs.find(c => c.id === selId);

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Conversations list */}
      <div style={{ width: 260, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>{tm.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{tm.eyebrow}</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? <Loader />
            : error ? <ErrorState label={tc.error} retryLabel={tc.retry} onRetry={() => { setLoading(true); fetchConvs(); }} />
              : convs.length === 0 ? (
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Empty icon={MessageSquare} label={tm.noConvs} />
                  <div style={{ padding: '12px', background: 'var(--subtle)', borderRadius: 10, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
                    {tm.hint}
                  </div>
                </div>
              ) : convs.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelId(c.id)}
                  style={{ display: 'flex', flexDirection: 'column', padding: '13px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selId === c.id ? 'var(--subtle)' : 'transparent', borderLeft: selId === c.id ? '3px solid var(--text-1)' : '3px solid transparent', transition: 'all 0.1s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                    <div className="r-avatar" style={{ width: 28, height: 28, background: 'var(--subtle)', color: 'var(--text-2)', fontSize: 12 }}>
                      {c.contact_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.contact_name || '—'}
                    </span>
                    {c.unread_count > 0 && (
                      <span style={{ background: 'var(--accent)', color: 'var(--accent-text)', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99 }}>
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', paddingLeft: 37, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.last_message_preview || '—'}
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* Chat panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {!selId ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <MessageSquare size={32} color="var(--text-3)" strokeWidth={1.5} />
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{tm.select}</span>
          </div>
        ) : (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="r-avatar" style={{ width: 36, height: 36, background: 'var(--subtle)', color: 'var(--text-2)', fontSize: 14 }}>
                {active?.contact_name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{active?.contact_name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{tm.supplier}</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {msgs.length === 0
                ? <div style={{ textAlign: 'center', paddingTop: 40, fontSize: 13, color: 'var(--text-3)' }}>{tm.noMsgs}</div>
                : msgs.map((m, i) => {
                  const self = m.sender === 'user';
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: self ? 'flex-end' : 'flex-start' }}>
                      <div className={self ? 'r-msg-self' : 'r-msg-other'}>
                        <div>{m.content}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4, opacity: 0.5, fontSize: 10 }}>
                          {m.timestamp && new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {self && <CheckCheck size={10} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              <div ref={endRef} />
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
              <form onSubmit={send} style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text" value={input} onChange={e => setInput(e.target.value)}
                  placeholder={tm.placeholder} className="r-input" style={{ flex: 1 }}
                />
                <button type="submit" className="r-btn r-btn-dark" disabled={!input.trim()}>
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════════════
const Profile = ({ t, profilePic, setProfilePic }) => {
  const tp = t.profile;
  const tc = t.common;
  const [tab, setTab] = useState('info');
  const [info, setInfo] = useState({ business_name: '', contact_name: '', email: '', phone: '', address: '', region: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdError, setPwdError] = useState('');
  const [notifs, setNotifs] = useState({ order_updates: true, messages: true, promos: false, weekly: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const avatarRef = useRef();

  const loadProfile = async () => {
    setLoading(true); setError(false);
    try {
      const r = await axios.get('/api/restaurant/profile');
      setInfo(r.data || {});
    } catch (e) { setError(true); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadProfile(); }, []);

  const flash = msg => { setSaved(msg); setTimeout(() => setSaved(''), 2800); };
  const saveInfo = async () => { setSaving(true); try { await axios.put('/api/restaurant/profile', info); flash(tp.info.saved); } catch (e) { } finally { setSaving(false); } };
  const savePwd = async () => {
    setPwdError('');
    if (pwd.newPwd !== pwd.confirm) { setPwdError(tc.pwdMismatch); return; }
    setSaving(true);
    try {
      await axios.put('/api/restaurant/password', { current_password: pwd.current, new_password: pwd.newPwd });
      setPwd({ current: '', newPwd: '', confirm: '' });
      flash(tp.security.saved);
    } catch (e) { }
    finally { setSaving(false); }
  };
  const saveNotifs = async () => { setSaving(true); try { await axios.put('/api/restaurant/notifications', notifs); flash('✓'); } catch (e) { } finally { setSaving(false); } };

  const handleAvatar = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    setAvatarError(false);
    setProfilePic(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const r = await axios.post('/api/restaurant/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (r.data?.avatar_url) setProfilePic(r.data.avatar_url);
    } catch (err) { setAvatarError(true); }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState label={tc.error} retryLabel={tc.retry} onRetry={loadProfile} />;

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{tp.eyebrow}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{tp.title}</div>
      </div>

      <div className="r-card" style={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {tp.tabs.map((label, i) => (
            <button
              key={tp.tabIds[i]}
              onClick={() => setTab(tp.tabIds[i])}
              style={{ padding: '14px 22px', fontSize: 13, fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', color: tab === tp.tabIds[i] ? 'var(--text-1)' : 'var(--text-2)', borderBottom: tab === tp.tabIds[i] ? '2px solid var(--text-1)' : '2px solid transparent', transition: 'all 0.15s' }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: 22 }}>
          {/* INFO */}
          {tab === 'info' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div className="r-field" style={{ gridColumn: '1/-1' }}>
                  <label className="r-label">{tp.info.businessName}</label>
                  <input className="r-input" value={info.business_name || ''} onChange={e => setInfo(p => ({ ...p, business_name: e.target.value }))} placeholder="Le Bistro Vert" />
                </div>
                <div className="r-field"><label className="r-label">{tp.info.contactName}</label><input className="r-input" value={info.contact_name || ''} onChange={e => setInfo(p => ({ ...p, contact_name: e.target.value }))} /></div>
                <div className="r-field"><label className="r-label">{tp.info.email}</label><input className="r-input" type="email" value={info.email || ''} onChange={e => setInfo(p => ({ ...p, email: e.target.value }))} /></div>
                <div className="r-field"><label className="r-label">{tp.info.phone}</label><input className="r-input" value={info.phone || ''} onChange={e => setInfo(p => ({ ...p, phone: e.target.value }))} placeholder="+212 6..." /></div>
                <div className="r-field">
                  <label className="r-label">{tp.info.region}</label>
                  <select className="r-select" value={info.region || ''} onChange={e => setInfo(p => ({ ...p, region: e.target.value }))}>
                    <option value="">—</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="r-field" style={{ gridColumn: '1/-1' }}><label className="r-label">{tp.info.address}</label><input className="r-input" value={info.address || ''} onChange={e => setInfo(p => ({ ...p, address: e.target.value }))} /></div>
                <div className="r-field" style={{ gridColumn: '1/-1' }}><label className="r-label">{tp.info.bio}</label><textarea className="r-textarea" rows={3} value={info.bio || ''} onChange={e => setInfo(p => ({ ...p, bio: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              </div>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <div className="r-avatar" style={{ width: 60, height: 60, background: 'var(--subtle)', color: 'var(--text-2)', fontSize: 22 }}>
                  {profilePic
                    ? <img src={profilePic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    : (info.business_name || 'R').charAt(0).toUpperCase()
                  }
                </div>
                <div>
                  <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
                  <button className="r-btn r-btn-ghost r-btn-sm" onClick={() => avatarRef.current?.click()}>
                    <Camera size={13} /> {tp.info.changePic}
                  </button>
                  {avatarError && <div style={{ fontSize: 11, color: 'var(--danger-text)', marginTop: 6 }}>{tc.avatarError}</div>}
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {saved && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>{saved}</span>}
                  <button className="r-btn r-btn-dark" onClick={saveInfo} disabled={saving}>
                    {saving ? tp.info.saving : tp.info.save}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {tab === 'security' && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 18 }}>{tp.security.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
                {[[tp.security.current, 'current'], [tp.security.newPwd, 'newPwd'], [tp.security.confirm, 'confirm']].map(([label, key]) => (
                  <div key={key} className="r-field">
                    <label className="r-label">{label}</label>
                    <input
                      className="r-input"
                      type="password"
                      value={pwd[key]}
                      onChange={e => { setPwd(p => ({ ...p, [key]: e.target.value })); if (pwdError) setPwdError(''); }}
                      placeholder="••••••••"
                      style={key === 'confirm' && pwdError ? { borderColor: '#dc2626' } : {}}
                    />
                    {key === 'confirm' && pwdError && <div style={{ fontSize: 11, color: 'var(--danger-text)', marginTop: 4 }}>{pwdError}</div>}
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {saved && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>{saved}</span>}
                  <button className="r-btn r-btn-dark" onClick={savePwd} disabled={saving}>
                    {saving ? tp.security.saving : tp.security.save}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 18 }}>{tp.notifs.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 520 }}>
                {tp.notifs.items.map((item, i) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < tp.notifs.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <button
                      onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                      className="r-toggle"
                      style={{ background: notifs[item.key] ? 'var(--accent)' : 'var(--border-strong)' }}
                    >
                      <div className="r-toggle-knob" style={{ left: notifs[item.key] ? 23 : 3 }} />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  {saved && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>{saved}</span>}
                  <button className="r-btn r-btn-dark" onClick={saveNotifs} disabled={saving}>
                    {saving ? tp.notifs.saving : tp.notifs.save}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
const Settings_ = ({ t, theme, toggleTheme, lang, toggleLang }) => {
  const ts = t.settings;
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [exporting, setExporting] = useState(false);

  const flash = msg => { setSaved(msg); setTimeout(() => setSaved(''), 2400); };

  const handleExport = async () => {
    setExporting(true);
    try {
      const r = await axios.get('/api/restaurant/export', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'greenleaf-export.json'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { }
    finally { setExporting(false); }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    try { await axios.delete('/api/restaurant/account'); } catch (e) { }
    finally { setSaving(false); setConfirmDelete(false); }
  };

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{ts.eyebrow}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{ts.title}</div>
      </div>

      {/* Appearance */}
      <div className="r-card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 16 }}>{ts.appearance}</div>

        <div style={{ marginBottom: 18 }}>
          <label className="r-label" style={{ marginBottom: 10 }}>{ts.theme}</label>
          <div style={{ display: 'flex', gap: 12, maxWidth: 400 }}>
            <div className={`r-theme-card${theme === 'light' ? ' on' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}>
              <div className="r-theme-preview" style={{ background: '#f3f3f3', border: '1px solid #e5e5e5' }}>
                <Sun size={16} color="#ca8a04" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', textAlign: 'center' }}>{ts.light}</div>
            </div>
            <div className={`r-theme-card${theme === 'dark' ? ' on' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}>
              <div className="r-theme-preview" style={{ background: '#1a1a1c', border: '1px solid #2c2c2e' }}>
                <Moon size={16} color="#c8c8ce" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', textAlign: 'center' }}>{ts.dark}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 460, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Languages size={14} /> {ts.language}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{ts.languageSub}</div>
          </div>
          <button className="r-btn r-btn-ghost r-btn-sm" onClick={toggleLang}>
            <Globe size={13} /> {lang === 'fr' ? 'Français' : 'English'}
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="r-card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 16 }}>{ts.account}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <KeyRound size={14} /> {ts.changePwd}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{ts.changePwdSub}</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.profile.tabs[1]} →</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Download size={14} /> {ts.exportData}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{ts.exportSub}</div>
          </div>
          <button className="r-btn r-btn-ghost r-btn-sm" onClick={handleExport} disabled={exporting}>
            <Download size={13} /> {exporting ? '...' : ts.exportData}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="r-card" style={{ padding: 22, borderColor: 'var(--danger-border)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--danger-text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={15} /> {ts.dangerZone}
        </div>
        {confirmDelete ? (
          <div style={{ background: 'var(--danger-bg)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--danger-text)', marginBottom: 12, fontWeight: 500 }}>{ts.confirmDelete}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="r-btn r-btn-danger r-btn-sm" disabled={saving} onClick={handleDeleteAccount}>
                {saving ? '...' : t.common.yes}
              </button>
              <button className="r-btn r-btn-ghost r-btn-sm" disabled={saving} onClick={() => setConfirmDelete(false)}>
                {t.common.no}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{ts.deleteAccount}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{ts.deleteSub}</div>
            </div>
            <button className="r-btn r-btn-danger r-btn-sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={13} /> {ts.deleteAccount}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
const MOCK_NOTIFS = [
  { id: 1, type: 'order', title_en: 'Order #602992 confirmed', title_fr: 'Commande #602992 confirmée', body_en: 'GreenLeaf Supplier accepted your order.', body_fr: 'Le fournisseur GreenLeaf a accepté votre commande.', read: false, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 2, type: 'message', title_en: 'New message', title_fr: 'Nouveau message', body_en: 'You have a new message from a supplier.', body_fr: 'Vous avez un nouveau message d\'un fournisseur.', read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 3, type: 'order', title_en: 'Order #418135 delivered', title_fr: 'Commande #418135 livrée', body_en: 'Your order has been marked as delivered.', body_fr: 'Votre commande a été marquée comme livrée.', read: true, created_at: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: 4, type: 'promo', title_en: 'New promotion available', title_fr: 'Nouvelle promotion disponible', body_en: 'A supplier you follow just launched a discount.', body_fr: 'Un fournisseur que vous suivez a lancé une réduction.', read: true, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
];

const NotifIcon = ({ type }) => {
  const map = {
    order: { Icon: ClipboardList, bg: '#eff6ff', color: '#1d4ed8' },
    message: { Icon: MessageSquare, bg: '#ecfdf5', color: '#15803d' },
    promo: { Icon: Tag, bg: '#fef9c3', color: '#a16207' },
  };
  const { Icon, bg, color } = map[type] || { Icon: Bell, bg: 'var(--subtle)', color: 'var(--text-2)' };
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={17} />
    </div>
  );
};

const timeAgo = (ts, t) => {
  const tn = t.notifications;
  const diff = Math.max(0, Date.now() - new Date(ts).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return tn.justNow;
  if (min < 60) return `${min}${tn.minAgo}`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}${tn.hAgo}`;
  return `${Math.floor(h / 24)}${tn.dAgo}`;
};

const Notifications = ({ t, lang, onUnreadChange }) => {
  const tn = t.notifications;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/notifications');
      setItems(r.data && r.data.length ? r.data : MOCK_NOTIFS);
    } catch (e) { setItems(MOCK_NOTIFS); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (onUnreadChange) onUnreadChange(items.filter(n => !n.read).length);
  }, [items]);

  const markRead = async id => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try { await axios.patch(`/api/notifications/${id}`, { read: true }); } catch (e) { }
  };
  const markAllRead = async () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
    try { await axios.patch('/api/notifications/read-all'); } catch (e) { }
  };

  const filtered = filter === 'unread' ? items.filter(n => !n.read) : items;
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{tn.eyebrow}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>{tn.title}</div>
        </div>
        {unreadCount > 0 && (
          <button className="r-btn r-btn-ghost r-btn-sm" onClick={markAllRead}>
            <CheckCheck size={13} /> {tn.markAllRead}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button className={`r-filter-tab${filter === 'all' ? ' on' : ''}`} onClick={() => setFilter('all')}>{tn.all}</button>
        <button className={`r-filter-tab${filter === 'unread' ? ' on' : ''}`} onClick={() => setFilter('unread')}>
          {tn.unread}{unreadCount > 0 ? ` (${unreadCount})` : ''}
        </button>
      </div>

      <div className="r-card" style={{ overflow: 'hidden' }}>
        {loading ? <Loader /> : filtered.length === 0 ? (
          <Empty icon={BellOff} label={filter === 'unread' ? tn.noUnread : tn.noNotifs} />
        ) : (
          <div>
            {filtered.map((n, i) => (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '16px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  background: n.read ? 'transparent' : 'var(--subtle)',
                  cursor: n.read ? 'default' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <NotifIcon type={n.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: 'var(--text-1)' }}>
                      {lang === 'fr' ? n.title_fr : n.title_en}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{timeAgo(n.created_at, t)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3, lineHeight: 1.5 }}>
                    {lang === 'fr' ? n.body_fr : n.body_en}
                  </div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1d4ed8', marginTop: 4, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
const RestaurantApp = () => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const { logout } = useAuthStore();
  const [view, setView] = useState('dashboard');
  const [profilePic, setProfilePic] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const t = T[lang] || T.en;

  return (
    <div className="r-app" data-theme={theme === 'dark' ? 'dark' : 'light'} style={{ display: 'flex', height: '100vh', padding: 16, gap: 12, background: 'var(--page-bg)', overflow: 'hidden', transition: 'background 0.3s' }}>
      <GS theme={theme} />
      <Sidebar view={view} setView={setView} t={t} onLogout={logout} />
      <div className="r-main">
        <TopBar
          view={view} theme={theme} toggleTheme={toggleTheme}
          lang={lang} toggleLang={toggleLang} t={t} profilePic={profilePic}
          onNotifications={() => setView('notifications')}
          unreadCount={unreadCount}
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
            {view === 'dashboard' && <Dashboard setView={setView} t={t} />}
            {view === 'orders' && <Orders t={t} />}
            {view === 'messages' && <Messages t={t} />}
            {view === 'profile' && <Profile t={t} profilePic={profilePic} setProfilePic={setProfilePic} />}
            {view === 'notifications' && <Notifications t={t} lang={lang} onUnreadChange={setUnreadCount} />}
            {view === 'settings' && <Settings_ t={t} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />}
            {view === 'help' && <PlaceholderView icon={HelpCircle} title={t.nav.help} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RestaurantApp;
