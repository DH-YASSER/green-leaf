import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

const THEMES = {
  dark: {
    '--page-bg':               '#12100E',
    '--page-text':             '#EDE8E2',
    '--text-muted':            'rgba(237,232,226,0.70)',
    '--text-low':              'rgba(237,232,226,0.40)',
    '--page-border':           'rgba(255, 255, 255, 0.06)',
    '--accent-color':          '#D4956A',
    '--accent-gold':           '#E8A87C',
    '--nav-bg':                'rgba(18,16,14,0.98)',
    '--nav-border':            'rgba(255, 255, 255, 0.06)',
    '--nav-link':              'rgba(237,232,226,0.70)',
    '--nav-link-hover':        '#EDE8E2',
    '--nav-active':            '#D4956A',
    '--sidebar-bg':            '#1A1614',
    '--sidebar-border':        'rgba(212, 149, 106, 0.12)',
    '--sidebar-link':          'rgba(237,232,226,0.70)',
    '--sidebar-link-hover':    '#EDE8E2',
    '--sidebar-active-bg':     'rgba(212, 149, 106, 0.15)',
    '--sidebar-active-text':   '#D4956A',
    '--btn-primary-bg':        '#D4956A',
    '--btn-primary-text':      '#1A1614',
    '--btn-primary-hover':     '0.90',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#B0A89E',
    '--btn-secondary-border':  'rgba(255, 255, 255, 0.12)',
    '--btn-icon-border':       'rgba(255, 255, 255, 0.08)',
    '--btn-icon-text':         '#B0A89E',
    '--btn-icon-hover-bg':     'rgba(255, 255, 255, 0.08)',
    '--card-bg':               '#1E1A17',
    '--card-border':           'rgba(212, 149, 106, 0.10)',
    '--card-title':            '#EDE8E2',
    '--card-body':             'rgba(237,232,226,0.70)',
    '--card-hover-bg':         'rgba(255, 255, 255, 0.04)',
    '--input-bg':              'rgba(255, 255, 255, 0.04)',
    '--input-border':          'rgba(212, 149, 106, 0.22)',
    '--input-text':            '#EDE8E2',
    '--input-placeholder':     'rgba(237,232,226,0.40)',
    '--input-focus-border':    '#D4956A',
    '--chat-bubble-self':      'rgba(212, 149, 106, 0.15)',
    '--chat-bubble-other':     '#1E1A17',
    '--chat-text-self':        '#FFFFFF',
    '--chat-text-other':       'rgba(237,232,226,0.75)',
    '--auth-panel-bg':         '#1E1A17',
    '--status-pending-bg':     'rgba(255, 152, 0, 0.12)',
    '--status-pending-text':   'rgba(255, 152, 0, 0.90)',
    '--status-success-bg':     'rgba(212, 149, 106, 0.12)',
    '--status-success-text':   '#D4956A',
    '--status-failed-bg':      'rgba(244, 67, 54, 0.12)',
    '--status-failed-text':    'rgba(244, 67, 54, 0.90)',
    '--status-info-bg':        'rgba(33, 150, 243, 0.12)',
    '--status-info-text':      'rgba(33, 150, 243, 0.90)',
    '--bg':          '#12100E',
    '--bg2':         '#1E1A17',
    '--bg3':         '#141210',
    '--bg4':         '#242019',
    '--bg5':         '#2A2520',
    '--text':        '#EDE8E2',
    '--textMid':     'rgba(237,232,226,0.70)',
    '--textLow':     'rgba(237,232,226,0.40)',
    '--sulu':        '#D4956A',
    '--suluLo':      'rgba(212, 149, 106, 0.10)',
    '--suluMd':      'rgba(212, 149, 106, 0.20)',
    '--silver':      '#B0A89E',
    '--silverLo':    'rgba(255, 255, 255, 0.08)',
    '--silverMd':    'rgba(255, 255, 255, 0.12)',
    '--border':      'rgba(255, 255, 255, 0.06)',
    '--border2':     'rgba(255, 255, 255, 0.10)',
    '--navBg':       'rgba(18,16,14,0.98)',
    '--inputBg':     'rgba(255, 255, 255, 0.04)',
    '--danger':      'rgba(244, 67, 54, 0.90)',
    '--dangerLo':    'rgba(244, 67, 54, 0.10)',
    '--heroFilter':  'brightness(0.20) saturate(0.50)',
    '--imgFilter':   'brightness(0.60) saturate(0.75)',
    '--accent2':     '#E8A87C',
    '--amber':       'rgba(255, 152, 0, 0.90)',
    '--amberLo':     'rgba(255, 152, 0, 0.12)',
    '--blue':        'rgba(33, 150, 243, 0.90)',
    '--blueLo':      'rgba(33, 150, 243, 0.12)',
  },
  light: {
    '--page-bg':               '#FAF7F4',
    '--page-text':             '#2D2520',
    '--text-muted':            'rgba(45,37,32,0.65)',
    '--text-low':              'rgba(45,37,32,0.45)',
    '--page-border':           'rgba(0, 0, 0, 0.06)',
    '--accent-color':          '#B87341',
    '--accent-gold':           '#C98B5A',
    '--nav-bg':                'rgba(255,253,250,0.98)',
    '--nav-border':            'rgba(0, 0, 0, 0.08)',
    '--nav-link':              'rgba(45,37,32,0.65)',
    '--nav-link-hover':        '#2D2520',
    '--nav-active':            '#B87341',
    '--sidebar-bg':            '#F5EDE6',
    '--sidebar-border':        'rgba(184, 115, 65, 0.12)',
    '--sidebar-link':          'rgba(45,37,32,0.70)',
    '--sidebar-link-hover':    '#2D2520',
    '--sidebar-active-bg':     'rgba(184, 115, 65, 0.12)',
    '--sidebar-active-text':   '#B87341',
    '--btn-primary-bg':        '#B87341',
    '--btn-primary-text':      '#FFF9F5',
    '--btn-primary-hover':     '0.92',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#7A6E64',
    '--btn-secondary-border':  'rgba(0, 0, 0, 0.12)',
    '--btn-icon-border':       'rgba(0, 0, 0, 0.08)',
    '--btn-icon-text':         '#7A6E64',
    '--btn-icon-hover-bg':     'rgba(0, 0, 0, 0.05)',
    '--card-bg':               '#FFFCF9',
    '--card-border':           'rgba(184, 115, 65, 0.10)',
    '--card-title':            '#2D2520',
    '--card-body':             'rgba(45,37,32,0.70)',
    '--card-hover-bg':         'rgba(0, 0, 0, 0.02)',
    '--input-bg':              '#FFFFFF',
    '--input-border':          'rgba(184, 115, 65, 0.18)',
    '--input-text':            '#2D2520',
    '--input-placeholder':     'rgba(45,37,32,0.45)',
    '--input-focus-border':    '#B87341',
    '--chat-bubble-self':      'rgba(184, 115, 65, 0.15)',
    '--chat-bubble-other':     '#F5F0EB',
    '--chat-text-self':        '#2D2520',
    '--chat-text-other':       'rgba(45,37,32,0.80)',
    '--auth-panel-bg':         '#FFFFFF',
    '--status-pending-bg':     'rgba(245,158,11,0.12)',
    '--status-pending-text':   'rgba(200,120,0,0.95)',
    '--status-success-bg':     'rgba(184, 115, 65, 0.12)',
    '--status-success-text':   '#B87341',
    '--status-failed-bg':      'rgba(220,53,69,0.12)',
    '--status-failed-text':    'rgba(220,53,69,0.95)',
    '--status-info-bg':        'rgba(25,118,210,0.12)',
    '--status-info-text':      'rgba(25,118,210,0.95)',
    '--bg':          '#FAF7F4',
    '--bg2':         '#FFFCF9',
    '--bg3':         '#F5F0EB',
    '--bg4':         '#EDE6DF',
    '--bg5':         '#E5DDD5',
    '--text':        '#2D2520',
    '--textMid':     'rgba(45,37,32,0.70)',
    '--textLow':     'rgba(45,37,32,0.45)',
    '--sulu':        '#B87341',
    '--suluLo':      'rgba(184, 115, 65, 0.10)',
    '--suluMd':      'rgba(184, 115, 65, 0.20)',
    '--silver':      '#7A6E64',
    '--silverLo':    'rgba(0, 0, 0, 0.08)',
    '--silverMd':    'rgba(0, 0, 0, 0.12)',
    '--border':      'rgba(0, 0, 0, 0.08)',
    '--border2':     'rgba(0, 0, 0, 0.12)',
    '--navBg':       'rgba(255,253,250,0.98)',
    '--inputBg':     '#FFFFFF',
    '--danger':      'rgba(220,53,69,0.95)',
    '--dangerLo':    'rgba(220,53,69,0.10)',
    '--heroFilter':  'brightness(1.05) saturate(0.9)',
    '--imgFilter':   'brightness(0.95) saturate(1)',
    '--accent2':     '#C98B5A',
    '--amber':       'rgba(200,120,0,0.95)',
    '--amberLo':     'rgba(245,158,11,0.12)',
    '--blue':        'rgba(25,118,210,0.95)',
    '--blueLo':      'rgba(25,118,210,0.12)',
  }
};

import { LogoMark } from '../../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, CreditCard, Users, BarChart2,
  TrendingUp, Bell, HelpCircle, Settings, LogOut, Mail,
  Phone, MessageCircle, X, Check, Truck, RotateCcw, MoreHorizontal,
  Package, Tag, ClipboardList, MessageSquare, ChevronDown,
  Plus, Pencil, Trash2, Send, Megaphone, Search,
  AlertCircle, Globe, Sun, Moon, Camera, ImagePlus,
  ArrowRight, ShoppingBag, BellOff, CheckCheck,
} from 'lucide-react';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    nav: { dashboard:'Dashboard', orders:'Orders', payments:'Payments', customers:'Clients', reports:'Reports', statistics:'Statistics', notifications:'Notifications', help:'Help', settings:'Settings', logout:'Log out', products:'Products', promotions:'Promotions', messages:'Messages', profile:'Profile', backToSite:'Back to site', marketing:'Marketing' },
    orders: {
      title:'Orders',
      filters:['All','Pending','Confirmed','Delivered','Rejected'],
      filterVals:['all','pending','confirmed','delivered','rejected'],
      noOrders:'No orders found',
      confirm:'Confirm', reject:'Reject', deliver:'Mark delivered',
      delivered:'Delivered', cancelled:'Cancelled',
      subtotal:'Subtotal', discount:'Discount', tax:'Tax', total:'Total',
      to:'To:',
    },
    products: {
      eyebrow:'Catalogue', title:'Your Products', add:'Add Product', noProducts:'No products yet',
      cols:['Product','Category','Price','Stock','Status','Actions'],
      modal:{ add:'New Product', edit:'Edit Product', name:'Product name', category:'Category', unit:'Unit', price:'Price (MAD)', stock:'Stock', minQty:'Min order qty', delay:'Delivery delay (days)', zones:'Delivery zones', desc:'Description', images:'Product photos (max 5)', cancel:'Cancel', create:'Create product', update:'Update product' },
      cats:[['legumes','Vegetables'],['viandes','Meats'],['boissons','Beverages'],['epices','Spices'],['secs','Dry Goods']],
    },
    promotions: {
      eyebrow:'Deals & Discounts', title:'Promotions', add:'Create Promo', noPromos:'No promotions yet',
      cols:['Product','Type','Value','Period','Usage','Status','Actions'],
      modal:{ add:'New Promotion', edit:'Edit Promotion', product:'Product', type:'Type', value:'Value', minQty:'Min quantity', limit:'Usage limit', start:'Start date', end:'End date', cancel:'Cancel', create:'Create', update:'Update' },
      types:[['percentage','Percentage %'],['fixed','Fixed amount MAD'],['bundle','Bundle deal'],['flash','Flash sale']],
    },
    messages: {
      title:'Messages', eyebrow:'Inbox',
      noConvs:'No conversations', noMsgs:'No messages yet',
      select:'Select a conversation', buyer:'Restaurant buyer',
      placeholder:'Type a message...',
    },
    profile: {
      eyebrow:'Supplier', title:'Profile',
      tabs:['Business info','Security','Notifications'],
      tabIds:['info','security','notifications'],
      info:{ title:'Information', businessName:'Business name', contactName:'Contact name', email:'Email', phone:'Phone', region:'Region', address:'Address', zones:'Delivery zones', bio:'About', save:'Save changes', saving:'Saving...', changePic:'Change photo' },
      security:{ title:'Account security', current:'Current password', newPwd:'New password', confirm:'Confirm', save:'Update password', saving:'Updating...' },
      notifs:{ title:'Notifications', save:'Save preferences', saving:'Saving...', items:[
        { key:'new_orders', label:'New orders', sub:'Alert when a restaurant places an order' },
        { key:'messages', label:'New messages', sub:'Alert when a buyer sends you a message' },
        { key:'promotions', label:'Promo expiry', sub:'Reminder before a promotion ends' },
        { key:'weekly_report', label:'Weekly report', sub:'Summary of your sales every Monday' },
      ]},
    },
    dashboard:{ title:'Dashboard', stats:['Products','Active Promos','Pending Orders','Revenue'], trend:'Revenue Trend', week:'This week', categories:'Sales by category', pending:'Pending orders', pendingSub:'Awaiting your response', manageAll:'View all', noPending:'No pending orders', accept:'Accept', reject:'Reject', cols:['Order','Customer','Status','Total','Date',''] },
    customers: { eyebrow:'Buyers', title:'Clients', noCustomers:'No customers yet', search:'Search clients...', cols:['Customer','Orders','Total spent','Last order','Status'] },
    marketing: { eyebrow:'Campaigns', title:'Marketing', add:'New Campaign', noCampaigns:'No campaigns yet',
      modal:{ add:'New Campaign', edit:'Edit Campaign', name:'Campaign name', channel:'Channel', reach:'Estimated reach', cancel:'Cancel', create:'Create', update:'Update' },
      channels:['Email','SMS','Push'],
    },
    statistics: { title:'Statistics', totalRevenue:'Total Revenue', avgOrder:'Avg. Order Value', totalOrders:'Total Orders', trend:'Revenue Trend', byStatus:'Orders by Status' },
  },
  fr: {
    nav: { dashboard:'Dashboard', orders:'Commandes', payments:'Paiements', customers:'Clients', reports:'Rapports', statistics:'Statistiques', notifications:'Notifications', help:'Aide', settings:'Paramètres', logout:'Déconnexion', products:'Produits', promotions:'Promotions', messages:'Messages', profile:'Profil', backToSite:'Retour au site', marketing:'Marketing' },
    orders: {
      title:'Commandes',
      filters:['Toutes','En attente','Confirmées','Livrées','Rejetées'],
      filterVals:['all','pending','confirmed','delivered','rejected'],
      noOrders:'Aucune commande',
      confirm:'Confirmer', reject:'Rejeter', deliver:'Marquer livré',
      delivered:'Livré', cancelled:'Annulée',
      subtotal:'Sous-total', discount:'Remise', tax:'Taxe', total:'Total',
      to:'À:',
    },
    products: {
      eyebrow:'Catalogue', title:'Vos Produits', add:'Ajouter produit', noProducts:'Aucun produit',
      cols:['Produit','Catégorie','Prix','Stock','Statut','Actions'],
      modal:{ add:'Nouveau Produit', edit:'Modifier Produit', name:'Nom', category:'Catégorie', unit:'Unité', price:'Prix (MAD)', stock:'Stock', minQty:'Qté min', delay:'Délai (j)', zones:'Zones livraison', desc:'Description', images:'Photos (max 5)', cancel:'Annuler', create:'Créer', update:'Mettre à jour' },
      cats:[['legumes','Légumes'],['viandes','Viandes'],['boissons','Boissons'],['epices','Épices'],['secs','Épicerie sèche']],
    },
    promotions: {
      eyebrow:'Deals & Réductions', title:'Promotions', add:'Créer promo', noPromos:'Aucune promotion',
      cols:['Produit','Type','Valeur','Période','Usage','Statut','Actions'],
      modal:{ add:'Nouvelle Promotion', edit:'Modifier Promotion', product:'Produit', type:'Type', value:'Valeur', minQty:'Qté minimum', limit:'Limite usage', start:'Date début', end:'Date fin', cancel:'Annuler', create:'Créer', update:'Mettre à jour' },
      types:[['percentage','Pourcentage %'],['fixed','Montant fixe MAD'],['bundle','Lot groupé'],['flash','Vente flash']],
    },
    messages: {
      title:'Messages', eyebrow:'Boîte de réception',
      noConvs:'Aucune conversation', noMsgs:'Aucun message',
      select:'Sélectionnez une conversation', buyer:'Acheteur restaurant',
      placeholder:'Tapez votre message...',
    },
    profile: {
      eyebrow:'Fournisseur', title:'Profil',
      tabs:['Infos business','Sécurité','Notifications'],
      tabIds:['info','security','notifications'],
      info:{ title:'Informations', businessName:"Nom de l'entreprise", contactName:'Nom du contact', email:'Email', phone:'Téléphone', region:'Région', address:'Adresse', zones:'Zones de livraison', bio:'À propos', save:'Enregistrer', saving:'Enregistrement...', changePic:'Changer photo' },
      security:{ title:'Sécurité du compte', current:'Mot de passe actuel', newPwd:'Nouveau mot de passe', confirm:'Confirmer', save:'Mettre à jour', saving:'Mise à jour...' },
      notifs:{ title:'Notifications', save:'Enregistrer', saving:'Enregistrement...', items:[
        { key:'new_orders', label:'Nouvelles commandes', sub:'Alerte quand un restaurant passe une commande' },
        { key:'messages', label:'Nouveaux messages', sub:'Alerte quand un acheteur vous contacte' },
        { key:'promotions', label:'Expiration promos', sub:'Rappel avant fin de promotion' },
        { key:'weekly_report', label:'Rapport hebdo', sub:'Résumé de vos ventes chaque lundi' },
      ]},
    },
    dashboard:{ title:'Dashboard', stats:['Produits','Promos actives','Commandes en attente','Revenus'], trend:'Tendance revenus', week:'Cette semaine', categories:'Ventes par catégorie', pending:'Commandes en attente', pendingSub:'En attente de réponse', manageAll:'Voir tout', noPending:'Aucune commande en attente', accept:'Accepter', reject:'Rejeter', cols:['Commande','Restaurant','Statut','Total','Date',''] },
    customers: { eyebrow:'Acheteurs', title:'Clients', noCustomers:'Aucun client', search:'Rechercher un client...', cols:['Client','Commandes','Total dépensé','Dernière commande','Statut'] },
    marketing: { eyebrow:'Campagnes', title:'Marketing', add:'Nouvelle campagne', noCampaigns:'Aucune campagne',
      modal:{ add:'Nouvelle Campagne', edit:'Modifier Campagne', name:'Nom de la campagne', channel:'Canal', reach:'Portée estimée', cancel:'Annuler', create:'Créer', update:'Mettre à jour' },
      channels:['Email','SMS','Push'],
    },
    statistics: { title:'Statistiques', totalRevenue:'Revenu total', avgOrder:'Panier moyen', totalOrders:'Total commandes', trend:'Tendance revenus', byStatus:'Commandes par statut' },
  },
};

const REGIONS = ['Casablanca-Settat','Souss-Massa','Marrakech-Safi','Fès-Meknès','Tanger-Tétouan-Al Hoceïma','Rabat-Salé-Kénitra','Oriental','Béni Mellal-Khénifra','Drâa-Tafilalet','Guelmim-Oued Noun'];

// ─── STATIC CSS ──────────────────────────────────────────────────────────────
const STATIC_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Inter', system-ui, sans-serif; font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; background: var(--page-bg); color: var(--page-text); transition: background 0.3s, color 0.3s; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--btn-icon-border, #d4d4d4); border-radius: 99px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.7s linear infinite; display:inline-block; }

  .pp-sidebar { width: 240px; min-width: 240px; background: var(--sidebar-bg); border-right: 1px solid var(--sidebar-border); display: flex; flex-direction: column; height: 100%; border-radius: 16px; overflow: hidden; flex-shrink: 0; position: relative; transition: background 0.3s, border-color 0.3s; }
  .pp-logo-row { display: flex; align-items: center; gap: 10px; padding: 22px 20px 18px; }
  .pp-logo-text { font-size: 16px; font-weight: 700; color: var(--page-text); letter-spacing: -0.3px; }
  .pp-nav-section { padding: 0 12px; display: flex; flex-direction: column; gap: 2px; }
  .pp-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; font-size: 14px; font-weight: 400; color: var(--sidebar-link); cursor: pointer; border: none; background: none; width: 100%; justify-content: flex-end; text-align: right; flex-direction: row-reverse; text-decoration: none; transition: background 0.15s, color 0.15s; white-space: nowrap; }
  .pp-nav-item:hover { background: var(--sidebar-active-bg); color: var(--sidebar-link-hover); }
  .pp-nav-item.active { background: var(--btn-primary-bg); color: var(--btn-primary-text); font-weight: 500; }
  .pp-nav-item.active svg { color: var(--btn-primary-text); }
  .pp-nav-divider { height: 1px; background: var(--sidebar-border); margin: 10px 12px; }
  .pp-nav-bottom { padding: 12px 12px 16px; position: absolute; bottom: 0; width: 100%; }

  .pp-main { flex: 1; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; min-width: 0; transition: background 0.3s, border-color 0.3s; }

  .pp-topbar { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; border-bottom: 1px solid var(--card-border); flex-shrink: 0; }
  .pp-topbar-title { font-size: 22px; font-weight: 700; color: var(--card-title); letter-spacing: -0.4px; }
  .pp-topbar-right { display: flex; align-items: center; gap: 10px; }
  .pp-icon-btn { width: 36px; height: 36px; border: 1px solid var(--btn-icon-border); border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--btn-icon-hover-bg); cursor: pointer; color: var(--btn-icon-text); transition: all 0.15s; position: relative; }
  .pp-icon-btn:hover { background: var(--btn-icon-hover-bg); color: var(--page-text); border-color: var(--accent-color); }
  .pp-dot { position: absolute; top: -2px; right: -2px; width: 9px; height: 9px; border-radius: 50%; background: #dc2626; border: 2px solid var(--card-bg); }
  .pp-user-chip { display: flex; align-items: center; gap: 8px; padding: 4px; cursor: pointer; }
  .pp-user-name { font-size: 13px; font-weight: 600; color: var(--page-text); }
  .pp-user-email { font-size: 11px; color: var(--text-muted); }

  .pp-filterbar { display: flex; align-items: center; gap: 10px; padding: 16px 24px; border-bottom: 1px solid var(--card-border); flex-shrink: 0; }
  .pp-filter-select { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid var(--input-border); border-radius: 10px; font-size: 13px; font-weight: 500; color: var(--input-text); background: var(--input-bg); cursor: pointer; transition: border-color 0.15s; white-space: nowrap; }
  .pp-filter-select:hover { border-color: var(--input-focus-border); }
  .pp-filter-select select { border: none; outline: none; background: transparent; font-size: 13px; font-weight: 500; color: var(--input-text); cursor: pointer; appearance: none; -webkit-appearance: none; }

  .pp-table { width: 100%; border-collapse: collapse; }
  .pp-table thead th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 500; color: var(--text-low); border-bottom: 1px solid var(--card-border); }
  .pp-table tbody td { padding: 14px 16px; border-bottom: 1px solid var(--page-border); font-size: 14px; color: var(--page-text); vertical-align: middle; }
  .pp-table tbody tr:last-child td { border-bottom: none; }
  .pp-table tbody tr { transition: background 0.1s; cursor: pointer; }
  .pp-table tbody tr:hover { background: var(--card-hover-bg); }
  .pp-table tbody tr.row-selected { background: var(--sidebar-active-bg); }

  .pp-checkbox { width: 20px; height: 20px; border: 1.5px solid var(--input-border); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; background: var(--input-bg); cursor: pointer; }
  .pp-checkbox.checked { background: var(--btn-primary-bg); border-color: var(--btn-primary-bg); }
  .pp-checkbox.minus { background: var(--btn-primary-bg); border-color: var(--btn-primary-bg); }

  .pp-badge { display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1px solid transparent; }
  .pp-badge-paid      { background: var(--status-pending-bg); color: var(--status-pending-text); border-color: var(--status-pending-text); }
  .pp-badge-delivered { background: var(--status-info-bg); color: var(--status-info-text); border-color: var(--status-info-text); }
  .pp-badge-completed { background: var(--status-success-bg); color: var(--status-success-text); border-color: var(--status-success-text); }
  .pp-badge-pending   { background: var(--status-pending-bg); color: var(--status-pending-text); border-color: var(--status-pending-text); }
  .pp-badge-confirmed { background: var(--status-info-bg); color: var(--status-info-text); border-color: var(--status-info-text); }
  .pp-badge-rejected  { background: var(--status-failed-bg); color: var(--status-failed-text); border-color: var(--status-failed-text); }
  .pp-badge-active    { background: var(--status-success-bg); color: var(--status-success-text); border-color: var(--status-success-text); }
  .pp-badge-inactive  { background: var(--status-failed-bg); color: var(--status-failed-text); border-color: var(--status-failed-text); }

  .pp-detail-panel { width: 280px; min-width: 280px; border-left: 1px solid var(--card-border); display: flex; flex-direction: column; background: var(--card-bg); flex-shrink: 0; overflow-y: auto; }
  .pp-avatar { border-radius: 50%; object-fit: cover; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 600; overflow: hidden; }

  .pp-btn-track { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; background: var(--btn-primary-bg); color: var(--btn-primary-text); border: none; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.15s; }
  .pp-btn-track:hover { opacity: var(--btn-primary-hover); }
  .pp-btn-refund { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; background: var(--accent-gold); color: #000; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .pp-btn-refund:hover { opacity: 0.85; }

  .pp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .pp-modal { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; box-shadow: 0 24px 64px rgba(0,0,0,0.15); width: 520px; max-width: 95vw; overflow: hidden; }
  .pp-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid var(--card-border); }
  .pp-modal-title { font-size: 16px; font-weight: 600; color: var(--card-title); }
  .pp-modal-body { padding: 22px; }
  .pp-modal-footer { padding: 16px 22px; border-top: 1px solid var(--card-border); display: flex; justify-content: flex-end; gap: 10px; }

  .pp-label { display: block; font-size: 12px; font-weight: 500; color: var(--text-muted); margin-bottom: 5px; }
  .pp-input, .pp-select, .pp-textarea { width: 100%; padding: 9px 12px; border: 1px solid var(--input-border); border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--input-text); background: var(--input-bg); transition: border-color 0.15s; outline: none; }
  .pp-input:focus, .pp-select:focus, .pp-textarea:focus { border-color: var(--input-focus-border); }
  .pp-input::placeholder, .pp-textarea::placeholder { color: var(--input-placeholder); }
  .pp-select { appearance: none; }
  .pp-field { display: flex; flex-direction: column; }

  .pp-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap; }
  .pp-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .pp-btn-dark { background: var(--btn-primary-bg); color: var(--btn-primary-text); }
  .pp-btn-dark:hover:not(:disabled) { opacity: var(--btn-primary-hover); }
  .pp-btn-ghost { background: var(--btn-secondary-bg); color: var(--btn-secondary-text); border: 1px solid var(--btn-secondary-border); }
  .pp-btn-ghost:hover:not(:disabled) { background: var(--btn-icon-hover-bg); color: var(--page-text); }
  .pp-btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 8px; }
  .pp-btn-danger { background: var(--status-failed-bg); color: var(--status-failed-text); border: 1.5px solid var(--status-failed-text); }
  .pp-btn-danger:hover:not(:disabled) { opacity: 0.85; }

  .pp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 20px; text-align: center; color: var(--text-low); }

  .pp-notif-tab { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; background: none; cursor: pointer; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; }
  .pp-notif-tab.on { background: var(--btn-primary-bg); color: var(--btn-primary-text); }
  .pp-notif-tab:hover:not(.on) { background: var(--card-hover-bg); color: var(--page-text); }
`;

let ppStaticInjected = false;

const GlobalStyles = ({ theme }) => {
  useEffect(() => {
    if (!ppStaticInjected) {
      const el = document.createElement('style');
      el.id = 'pp-static';
      el.textContent = STATIC_CSS;
      document.head.appendChild(el);
      ppStaticInjected = true;
    }
    let dynEl = document.getElementById('pp-dynamic');
    if (!dynEl) {
      dynEl = document.createElement('style');
      dynEl.id = 'pp-dynamic';
      document.head.appendChild(dynEl);
    }
    dynEl.textContent = `:root { ${Object.entries(THEMES[theme]).map(([k,v])=>`${k}: ${v};`).join(' ')} }`;
  }, [theme]);
  return null;
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function buildWeeklyRevenue(orders = []) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const map = {};
  days.forEach(d => { map[d] = 0; });
  orders.forEach(o => {
    const d = new Date(o.created_at);
    const day = days[d.getDay() === 0 ? 6 : d.getDay() - 1];
    if (day !== undefined) map[day] = (map[day] || 0) + Number(o.total_amount || 0);
  });
  return days.map(l => ({ label: l, value: map[l] }));
}

const AV_COLORS = [
  { bg:'#fef3c7', color:'#92400e' }, { bg:'#dbeafe', color:'#1e40af' },
  { bg:'#d1fae5', color:'#065f46' }, { bg:'#fce7f3', color:'#9d174d' },
  { bg:'#ede9fe', color:'#5b21b6' }, { bg:'#fee2e2', color:'#991b1b' },
  { bg:'#e0f2fe', color:'#075985' }, { bg:'#fef9c3', color:'#713f12' },
];
const avColor = (name = '') => AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length];

const StatusBadge = ({ status }) => {
  const map = {
    paid:      ['pp-badge-paid',      'Paid'],
    pending:   ['pp-badge-pending',   'Pending'],
    confirmed: ['pp-badge-confirmed', 'Confirmed'],
    delivered: ['pp-badge-delivered', 'Delivered'],
    rejected:  ['pp-badge-rejected',  'Rejected'],
    completed: ['pp-badge-completed', 'Completed'],
    active:    ['pp-badge-active',    'Active'],
    inactive:  ['pp-badge-inactive',  'Inactive'],
  };
  const [cls, label] = map[status] || ['pp-badge-inactive', status || '—'];
  return <span className={`pp-badge ${cls}`}>{label}</span>;
};

const Loader = () => (
  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:80 }}>
    <svg className="spin" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--text-low)" strokeWidth={2}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  </div>
);

const Empty = ({ icon: Icon, label, action, onAction }) => (
  <div className="pp-empty">
    <Icon size={40} strokeWidth={1.2} style={{ marginBottom:12, color:'var(--text-low)' }} />
    <div style={{ fontSize:14, color:'var(--text-muted)', marginBottom: action ? 16 : 0 }}>{label}</div>
    {action && onAction && <button className="pp-btn pp-btn-dark pp-btn-sm" onClick={onAction}>{action}</button>}
  </div>
);

// ─── IMAGE UPLOADER ───────────────────────────────────────────────────────────
const ImageUploader = ({ images, setImages, max = 5 }) => {
  const ref = useRef();
  const add = e => {
    const files = Array.from(e.target.files);
    const next = [...images];
    files.forEach(f => { if (next.length < max) next.push({ file: f, url: URL.createObjectURL(f) }); });
    setImages(next);
  };
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
      {images.map((img, i) => (
        <div key={i} style={{ position:'relative', width:60, height:60, borderRadius:9, overflow:'hidden', border:'1.5px solid var(--input-border)' }}>
          <img src={img.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <button onClick={() => setImages(images.filter((_,j)=>j!==i))} style={{ position:'absolute', top:2, right:2, width:17, height:17, borderRadius:'50%', background:'rgba(0,0,0,0.55)', color:'#fff', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, lineHeight:1 }}>×</button>
        </div>
      ))}
      {images.length < max && (
        <>
          <input ref={ref} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={add} />
          <button onClick={() => ref.current?.click()} style={{ width:60, height:60, borderRadius:9, border:'1.5px dashed var(--input-border)', background:'var(--input-bg)', color:'var(--text-muted)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, fontSize:10 }}>
            <ImagePlus size={15} /> Add
          </button>
        </>
      )}
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ view, setView, t, onLogout }) => {
  const main = [
    { id:'dashboard',  icon:LayoutDashboard, label:t.nav.dashboard },
    { id:'orders',     icon:ShoppingCart,    label:t.nav.orders },
    { id:'messages',   icon:MessageSquare,   label:t.nav.messages },
    { id:'products',   icon:Package,         label:t.nav.products },
    { id:'customers',  icon:Users,           label:t.nav.customers },
    { id:'marketing',  icon:Megaphone,       label:t.nav.marketing || 'Marketing' },
    { id:'statistics', icon:TrendingUp,      label:t.nav.statistics },
  ];
  const bottom = [
    { id:'help',     icon:HelpCircle, label:t.nav.help },
    { id:'settings', icon:Settings,   label:t.nav.settings },
  ];
  return (
    <div className="pp-sidebar">
      <div className="pp-logo-row" style={{ paddingBottom: 22, marginBottom: 6 }}>
        <LogoMark size={28} />
        <span className="pp-logo-text" style={{ fontFamily:'DM Serif Display, Georgia, serif', textTransform:'uppercase', fontSize:15, letterSpacing:'0.04em' }}>Green<span style={{ color:'var(--sulu)' }}>Leaf</span></span>
      </div>
      <div className="pp-nav-section" style={{ paddingLeft: 16 }}>
        {main.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`pp-nav-item ${view === id ? 'active' : ''}`} onClick={() => setView(id)}>
            <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
          </button>
        ))}
      </div>
      <div className="pp-nav-divider" />
      <div className="pp-nav-section" style={{ paddingLeft: 16 }}>
        {bottom.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`pp-nav-item ${view === id ? 'active' : ''}`} onClick={() => setView(id)}>
            <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
          </button>
        ))}
      </div>
      <div className="pp-nav-bottom" style={{ display:'flex', justifyContent:'center' }}>
        <button onClick={onLogout} style={{ display:'flex', alignItems:'center', justifyContent:'flex-start', width:'45px', height:'45px', border:'none', borderRadius:'50%', cursor:'pointer', position:'relative', overflow:'hidden', transition:'width 0.3s, border-radius 0.3s', boxShadow:'2px 2px 10px rgba(0,0,0,0.199)', backgroundColor:'rgb(200, 50, 50, 0.75)' }}
          onMouseEnter={e => { e.currentTarget.style.width='125px'; e.currentTarget.style.borderRadius='40px'; e.currentTarget.querySelector('.lo-sign').style.width='30%'; e.currentTarget.querySelector('.lo-sign').style.paddingLeft='20px'; e.currentTarget.querySelector('.lo-text').style.opacity='1'; e.currentTarget.querySelector('.lo-text').style.width='70%'; }}
          onMouseLeave={e => { e.currentTarget.style.width='45px'; e.currentTarget.style.borderRadius='50%'; e.currentTarget.querySelector('.lo-sign').style.width='100%'; e.currentTarget.querySelector('.lo-sign').style.paddingLeft='0px'; e.currentTarget.querySelector('.lo-text').style.opacity='0'; e.currentTarget.querySelector('.lo-text').style.width='0%'; }}
          onMouseDown={e => e.currentTarget.style.transform='translate(2px, 2px)'}
          onMouseUp={e => e.currentTarget.style.transform='translate(0, 0)'}
        >
          <div className="lo-sign" style={{ width:'100%', transition:'0.3s', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogOut size={17} color="white" strokeWidth={2.2} />
          </div>
          <div className="lo-text" style={{ position:'absolute', right:0, width:'0%', opacity:0, color:'white', fontSize:'1em', fontWeight:600, transition:'0.3s', whiteSpace:'nowrap', overflow:'hidden' }}>
            {t.nav.logout}
          </div>
        </button>
      </div>
    </div>
  );
};

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
const TopBar = ({ title, lang, toggleLang, theme, toggleTheme, profilePic, onNotifications, unreadCount }) => (
  <div className="pp-topbar">
    <span className="pp-topbar-title">{title}</span>
    <div className="pp-topbar-right">
      <button className="pp-icon-btn" onClick={toggleLang} style={{ fontSize:11, fontWeight:600, gap:2, width:'auto', padding:'0 10px' }}>
        <Globe size={14} /> {lang === 'fr' ? 'EN' : 'FR'}
      </button>
      <button className="pp-icon-btn" onClick={onNotifications} title="Notifications">
        <Bell size={15} />
        {unreadCount > 0 && <span className="pp-dot" />}
      </button>
      <button className="pp-icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'} style={{ background: theme === 'dark' ? 'rgba(232, 168, 124, 0.12)' : 'rgba(184, 115, 65, 0.10)', borderColor: theme === 'dark' ? 'rgba(232, 168, 124, 0.25)' : 'rgba(184, 115, 65, 0.20)' }}>
        {theme === 'dark' ? <Sun size={15} style={{ color:'#E8A87C' }} /> : <Moon size={15} style={{ color:'#B87341' }} />}
      </button>
      <div className="pp-user-chip" style={{ border:'1.5px solid var(--card-border)', borderRadius:10, padding:'4px 8px' }}>
        <div className="pp-avatar" style={{ width:32, height:32, background:'#c8b99a', fontSize:13, color:'#5c4a2a', fontWeight:700 }}>
          {profilePic
            ? <img src={profilePic} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
            : 'K'}
        </div>
        <div>
          <div className="pp-user-name">Kristina Evans</div>
          <div className="pp-user-email">kris.evans@gmail.com</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── PLACEHOLDER VIEW ─────────────────────────────────────────────────────────
const PlaceholderView = ({ icon: Icon, title }) => (
  <div style={{ flex:1, display:'flex', flexDirection:'column', padding:28, gap:20 }}>
    <div style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px' }}>{title}</div>
    <div style={{ flex:1, border:'1.5px solid var(--card-border)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Empty icon={Icon} label={`${title} — coming soon`} />
    </div>
  </div>
);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id:'390561', restaurant_name:'Michelle Black',  status:'paid',      total_amount:'780.00',  created_at:'2024-01-08T13:52:00Z', items:[{product_name:'Ryobi ONE drill/driver',unit_price:'409.00'},{product_name:'Socket Systeme Electric',unit_price:'238.00'},{product_name:'DVB-T2 receiver bbk',unit_price:'139.00'}] },
  { id:'663334', restaurant_name:'Janice Chandler', status:'delivered', total_amount:'1250.00', created_at:'2024-01-06T10:00:00Z', items:[] },
  { id:'418135', restaurant_name:'Mildred Hall',    status:'paid',      total_amount:'540.95',  created_at:'2024-01-05T09:00:00Z', items:[] },
  { id:'801999', restaurant_name:'Ana Carter',      status:'paid',      total_amount:'1489.00', created_at:'2024-01-02T08:00:00Z', items:[] },
  { id:'517783', restaurant_name:'John Sherman',    status:'completed', total_amount:'925.00',  created_at:'2023-12-28T07:00:00Z', items:[] },
  { id:'602992', restaurant_name:'James Miller',    status:'paid',      total_amount:'1620.00', created_at:'2023-12-26T06:00:00Z', items:[{product_name:'Ryobi ONE drill/driver',unit_price:'409.00'},{product_name:'Socket Systeme Electric',unit_price:'238.00'},{product_name:'DVB-T2 receiver bbk',unit_price:'139.00'},{product_name:'Inforce oil-free compressor',unit_price:'135.00'},{product_name:'TIG-200 welding inverter',unit_price:'699.00'}] },
  { id:'730345', restaurant_name:'Travis French',   status:'paid',      total_amount:'315.50',  created_at:'2023-12-22T05:00:00Z', items:[] },
  { id:'126955', restaurant_name:'Ralph Hall',      status:'paid',      total_amount:'1267.45', created_at:'2023-12-20T04:00:00Z', items:[] },
  { id:'045321', restaurant_name:'Gary Gilbert',    status:'completed', total_amount:'287.00',  created_at:'2023-12-18T03:00:00Z', items:[] },
  { id:'082848', restaurant_name:'Frances Howell',  status:'delivered', total_amount:'1740.00', created_at:'2023-12-17T02:00:00Z', items:[] },
  { id:'646072', restaurant_name:'Herbert Boyd',    status:'paid',      total_amount:'714.00',  created_at:'2023-12-14T01:00:00Z', items:[] },
  { id:'432019', restaurant_name:'Alan White',      status:'paid',      total_amount:'267.65',  created_at:'2023-12-13T00:00:00Z', items:[] },
  { id:'985927', restaurant_name:'Julie Martin',    status:'delivered', total_amount:'389.00',  created_at:'2023-12-11T23:00:00Z', items:[] },
];

const MOCK_NOTIFS = [
  { id:1, type:'order',   title_en:'New order received',       title_fr:'Nouvelle commande reçue',     body_en:'Restaurant James Miller placed a new order.',        body_fr:'Le restaurant James Miller a passé une commande.',      read:false, created_at:new Date(Date.now()-5*60000).toISOString() },
  { id:2, type:'message', title_en:'New message',              title_fr:'Nouveau message',             body_en:'You have a new message from a restaurant buyer.',    body_fr:'Vous avez un nouveau message d\'un acheteur.',          read:false, created_at:new Date(Date.now()-2*3600000).toISOString() },
  { id:3, type:'order',   title_en:'Order #418135 confirmed',  title_fr:'Commande #418135 confirmée',  body_en:'The order has been confirmed successfully.',          body_fr:'La commande a été confirmée avec succès.',              read:true,  created_at:new Date(Date.now()-26*3600000).toISOString() },
  { id:4, type:'promo',   title_en:'Promotion expiring soon',  title_fr:'Promotion expirant bientôt', body_en:'One of your promotions expires in 2 days.',           body_fr:'Une de vos promotions expire dans 2 jours.',            read:true,  created_at:new Date(Date.now()-3*86400000).toISOString() },
];

const MOCK_CUSTOMERS = [
  { id:1, name:'Michelle Black',  email:'m.black@resto.com',  orders:14, spent:8420,  lastOrder:'2024-01-08', status:'active' },
  { id:2, name:'Janice Chandler', email:'j.chandler@resto.com',orders:9,  spent:5230,  lastOrder:'2024-01-06', status:'active' },
  { id:3, name:'Mildred Hall',    email:'m.hall@resto.com',   orders:3,  spent:1540,  lastOrder:'2023-12-20', status:'inactive' },
  { id:4, name:'Ana Carter',      email:'a.carter@resto.com', orders:21, spent:12980, lastOrder:'2024-01-02', status:'active' },
  { id:5, name:'John Sherman',    email:'j.sherman@resto.com',orders:6,  spent:3100,  lastOrder:'2023-12-28', status:'active' },
];

const MOCK_CAMPAIGNS = [
  { id:1, name:'New Year Bundle',    channel:'Email', reach:1200, clicks:340, status:'active',    created_at:'2024-01-01' },
  { id:2, name:'Flash Sale Spices',  channel:'Push',  reach:800,  clicks:210, status:'active',    created_at:'2024-01-05' },
  { id:3, name:'Loyalty Reminder',   channel:'SMS',   reach:450,  clicks:90,  status:'completed', created_at:'2023-12-20' },
];

// ─── NOTIF HELPERS ────────────────────────────────────────────────────────────
const NotifIcon = ({ type }) => {
  const map = {
    order:   { Icon: ShoppingCart,  bg:'#eff6ff', color:'#1d4ed8' },
    message: { Icon: MessageSquare, bg:'#ecfdf5', color:'#15803d' },
    promo:   { Icon: Tag,           bg:'#fef9c3', color:'#a16207' },
  };
  const { Icon, bg, color } = map[type] || { Icon: Bell, bg:'var(--sidebar-active-bg)', color:'var(--accent-color)' };
  return (
    <div style={{ width:38, height:38, borderRadius:10, background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <Icon size={17} />
    </div>
  );
};

const timeAgo = (ts, lang) => {
  const diff = Math.max(0, Date.now() - new Date(ts).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return lang === 'fr' ? "À l'instant" : 'Just now';
  if (min < 60) return `${min}${lang === 'fr' ? ' min' : 'm ago'}`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}${lang === 'fr' ? 'h' : 'h ago'}`;
  return `${Math.floor(h / 24)}${lang === 'fr' ? 'j' : 'd ago'}`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
const Notifications = ({ lang, onUnreadChange }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const tn = lang === 'fr'
    ? { all:'Toutes', unread:'Non lues', markAllRead:'Tout marquer comme lu', noNotifs:'Aucune notification', noUnread:'Aucune non lue', title:'Notifications', eyebrow:'Centre de notifications' }
    : { all:'All', unread:'Unread', markAllRead:'Mark all as read', noNotifs:'No notifications', noUnread:'No unread notifications', title:'Notifications', eyebrow:'Notification center' };

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/notifications');
      setItems(r.data && r.data.length ? r.data : MOCK_NOTIFS);
    } catch (e) { setItems(MOCK_NOTIFS); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (onUnreadChange) onUnreadChange(items.filter(n => !n.read).length); }, [items]);

  const markRead = async id => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read:true } : n));
    try { await axios.patch(`/api/notifications/${id}`, { read:true }); } catch (e) {}
  };
  const markAllRead = async () => {
    setItems(prev => prev.map(n => ({ ...n, read:true })));
    try { await axios.patch('/api/notifications/read-all'); } catch (e) {}
  };

  const filtered = filter === 'unread' ? items.filter(n => !n.read) : items;
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20, flex:1, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{tn.eyebrow}</div>
          <div style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px' }}>{tn.title}</div>
        </div>
        {unreadCount > 0 && (
          <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={markAllRead}>
            <CheckCheck size={13} /> {tn.markAllRead}
          </button>
        )}
      </div>

      <div style={{ display:'flex', gap:6 }}>
        {[['all', tn.all], ['unread', `${tn.unread}${unreadCount > 0 ? ` (${unreadCount})` : ''}`]].map(([val, label]) => (
          <button key={val} className={`pp-notif-tab${filter === val ? ' on' : ''}`} onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:14, overflow:'hidden' }}>
        {loading ? <Loader /> : filtered.length === 0 ? (
          <Empty icon={BellOff} label={filter === 'unread' ? tn.noUnread : tn.noNotifs} />
        ) : filtered.map((n, i) => (
          <div
            key={n.id}
            onClick={() => !n.read && markRead(n.id)}
            style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--page-border)' : 'none', background: n.read ? 'transparent' : 'var(--sidebar-active-bg)', cursor: n.read ? 'default' : 'pointer', transition:'background 0.15s' }}
          >
            <NotifIcon type={n.type} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
                <span style={{ fontSize:13, fontWeight: n.read ? 500 : 700, color:'var(--card-title)' }}>
                  {lang === 'fr' ? n.title_fr : n.title_en}
                </span>
                <span style={{ fontSize:11, color:'var(--text-low)', whiteSpace:'nowrap' }}>{timeAgo(n.created_at, lang)}</span>
              </div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3, lineHeight:1.5 }}>
                {lang === 'fr' ? n.body_fr : n.body_en}
              </div>
            </div>
            {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent-color)', marginTop:4, flexShrink:0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════════════════
const Orders = ({ t }) => {
  const to = t.orders;
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter]   = useState('$100—$1500');
  const [sortBy, setSortBy]             = useState('date');
  const [selected, setSelected]         = useState(null);
  const [checkedIds, setCheckedIds]     = useState(new Set(['418135','602992','730345','045321']));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await axios.get('/api/fournisseur/orders');
        const data = r.data || [];
        const merged = data.length > 0 ? data : MOCK_ORDERS;
        setOrders(merged);
        setSelected(merged.find(o => o.id === '602992') || merged[0]);
      } catch(e) {
        setOrders(MOCK_ORDERS);
        setSelected(MOCK_ORDERS.find(o => o.id === '602992') || MOCK_ORDERS[0]);
      } finally { setLoading(false); }
    })();
  }, []);

  const handleStatus = async (id, status) => {
    try { await axios.patch(`/api/fournisseur/orders/${id}/status`, { status }); } catch(e) {}
    setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const toggleCheck = (id, e) => {
    e.stopPropagation();
    setCheckedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const priceRanges = { 'Any price':[0,Infinity], '$100—$1500':[100,1500], '$1500+':[1500,Infinity], 'Under $100':[0,100] };

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    const [mn, mx] = priceRanges[priceFilter] || [0, Infinity];
    if (Number(o.total_amount) < mn || Number(o.total_amount) > mx) return false;
    return true;
  });

  const formatDate = ts => new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const sel = selected;
  const selAv = sel ? avColor(sel.restaurant_name) : {};
  const allChecked = filtered.length > 0 && filtered.every(o => checkedIds.has(o.id));

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div className="pp-filterbar">
          <div className="pp-filter-select">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Any status</option>
              {to.filters.slice(1).map((f,i) => <option key={f} value={to.filterVals[i+1]}>{f}</option>)}
            </select>
            <ChevronDown size={14} color="var(--text-low)" />
          </div>
          <div className="pp-filter-select">
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
              {Object.keys(priceRanges).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <ChevronDown size={14} color="var(--text-low)" />
          </div>
          <div style={{ flex:1 }} />
          <div className="pp-filter-select">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="total">Sort by Total</option>
              <option value="name">Sort by Name</option>
            </select>
            <ChevronDown size={14} color="var(--text-low)" />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {loading ? <Loader /> : (
            <table className="pp-table">
              <thead>
                <tr>
                  <th style={{ width:52, paddingLeft:20 }}>
                    <div className={`pp-checkbox ${allChecked ? 'minus' : ''}`} onClick={() => allChecked ? setCheckedIds(new Set()) : setCheckedIds(new Set(filtered.map(o => o.id)))}>
                      {allChecked && <span style={{ width:10, height:2, background:'#fff', display:'block', borderRadius:2 }} />}
                    </div>
                  </th>
                  <th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Date</th><th style={{ width:48 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={7}><Empty icon={ClipboardList} label={to.noOrders} /></td></tr>
                  : filtered.map(o => {
                    const checked = checkedIds.has(o.id);
                    const isSelected = sel?.id === o.id;
                    const ac = avColor(o.restaurant_name);
                    return (
                      <tr key={o.id} className={isSelected ? 'row-selected' : ''} onClick={() => setSelected(o)}>
                        <td style={{ paddingLeft:20, paddingRight:0 }} onClick={e => toggleCheck(o.id, e)}>
                          <div className={`pp-checkbox ${checked ? 'checked' : ''}`}>
                            {checked && <Check size={12} color="#fff" strokeWidth={3} />}
                          </div>
                        </td>
                        <td style={{ fontWeight:500 }}>#{o.id}</td>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div className="pp-avatar" style={{ width:32, height:32, background:ac.bg, color:ac.color, fontSize:13 }}>{o.restaurant_name.charAt(0)}</div>
                            <span style={{ fontWeight:500 }}>{o.restaurant_name}</span>
                          </div>
                        </td>
                        <td><StatusBadge status={o.status} /></td>
                        <td style={{ fontWeight:500 }}>${Number(o.total_amount).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })}</td>
                        <td style={{ color:'var(--text-muted)' }}>{formatDate(o.created_at)}</td>
                        <td><button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-low)', padding:6, display:'flex' }} onClick={e => e.stopPropagation()}><MoreHorizontal size={17} /></button></td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          )}
        </div>
      </div>

      {sel && (
        <div className="pp-detail-panel">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'20px 20px 0' }}>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px', marginBottom:8 }}>Order #{sel.id}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <StatusBadge status={sel.status} />
                <span style={{ fontSize:13, color:'var(--text-muted)' }}>{formatDate(sel.created_at)}, {new Date(sel.created_at).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}</span>
              </div>
            </div>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }} onClick={() => setSelected(null)}><X size={18} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'20px 20px 16px', borderBottom:'1px solid var(--card-border)' }}>
            <div className="pp-avatar" style={{ width:64, height:64, background:selAv.bg, color:selAv.color, fontSize:22, marginBottom:10 }}>{sel.restaurant_name.charAt(0)}</div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--card-title)', marginBottom:12 }}>{sel.restaurant_name}</div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="pp-icon-btn"><Mail size={16} /></button>
              <button className="pp-icon-btn"><Phone size={16} /></button>
              <button className="pp-icon-btn"><MessageCircle size={16} /></button>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            <div style={{ padding:'16px 20px 0' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--card-title)', marginBottom:14 }}>Order items</div>
              {(sel.items || []).length === 0
                ? <div style={{ fontSize:13, color:'var(--text-low)', textAlign:'center', padding:'16px 0' }}>No items</div>
                : (sel.items || []).map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                    <div style={{ width:42, height:42, borderRadius:10, background:'var(--sidebar-active-bg)', border:'1px solid var(--card-border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                      {item.image ? <img src={item.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <Package size={16} color="var(--text-low)" strokeWidth={1.5} />}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:'var(--card-title)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.product_name}</div>
                      <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:1 }}>${item.unit_price}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div style={{ padding:'16px 20px', borderTop:'1px solid var(--card-border)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontSize:14, fontWeight:500, color:'var(--card-title)' }}>Total</span>
              <span style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.5px' }}>${Number(sel.total_amount).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })}</span>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {sel.status === 'pending' ? (
                <>
                  <button className="pp-btn-track" onClick={() => handleStatus(sel.id, 'confirmed')}><Check size={16} /> Confirm</button>
                  <button className="pp-btn-refund" onClick={() => handleStatus(sel.id, 'rejected')}><X size={16} /> Reject</button>
                </>
              ) : sel.status === 'confirmed' ? (
                <>
                  <button className="pp-btn-track" onClick={() => handleStatus(sel.id, 'delivered')}><Truck size={16} strokeWidth={2} /> Track</button>
                  <button className="pp-btn-refund" onClick={() => handleStatus(sel.id, 'rejected')}><RotateCcw size={16} strokeWidth={2} /> Refund</button>
                </>
              ) : (
                <>
                  <button className="pp-btn-track"><Settings size={16} strokeWidth={2} /> Track</button>
                  <button className="pp-btn-refund"><RotateCcw size={16} strokeWidth={2} /> Refund</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const Dashboard = ({ setView, t }) => {
  const td = t.dashboard;
  const [stats, setStats]     = useState({ totalProducts:0, activePromos:0, pendingOrders:0, totalRevenue:0 });
  const [orders, setOrders]   = useState([]);
  const [trend, setTrend]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, o] = await Promise.all([axios.get('/api/fournisseur/dashboard/stats'), axios.get('/api/fournisseur/orders')]);
        const raw = s.data || {};
        setStats({ totalProducts: raw.totalProducts ?? 0, activePromos: raw.activePromos ?? 0, pendingOrders: raw.pendingOrders ?? 0, totalRevenue: raw.totalRevenue ?? 0 });
        const all = o.data || [];
        setOrders(all.slice(0, 8));
        setTrend(buildWeeklyRevenue(all));
      } catch(e) {}
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  const chartBars = trend.length ? trend : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(l => ({ label:l, value:0 }));
  const maxBar = Math.max(...chartBars.map(d => d.value), 1);
  const formatDate = ts => new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric' });

  return (
    <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20, overflowY:'auto', flex:1 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {[
          { label:'Total Products', value:stats.totalProducts,              delta:'+4 this week',        c:'var(--status-success-text)' },
          { label:'Active Promos',  value:stats.activePromos,               delta:'2 expire soon',       c:'var(--status-pending-text)' },
          { label:'Pending Orders', value:stats.pendingOrders,              delta:'Needs response',      c:'var(--status-failed-text)'  },
          { label:'Revenue (MAD)',  value:stats.totalRevenue.toLocaleString(), delta:'↑ 12% vs last week', c:'var(--status-success-text)' },
        ].map(({ label, value, delta, c }) => (
          <div key={label} style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, padding:'18px 20px' }}>
            <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500, marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:26, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.5px', lineHeight:1, marginBottom:6 }}>{value}</div>
            <div style={{ fontSize:11, fontWeight:500, color:c }}>{delta}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, padding:'20px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--card-title)' }}>{td.trend}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{td.week}</div>
          </div>
          <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={() => setView('orders')}>View orders <ArrowRight size={12} /></button>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:90 }}>
          {chartBars.map((d, i) => {
            const h = Math.max(Math.round((d.value / maxBar) * 80), 4);
            return (
              <motion.div key={i} initial={{ height:0 }} animate={{ height:h }} transition={{ delay:i*0.05, duration:0.35 }}
                title={`${d.label}: ${d.value.toLocaleString()}`}
                style={{ flex:1, borderRadius:'5px 5px 0 0', background:'var(--accent-color)', transformOrigin:'bottom', cursor:'pointer', minWidth:0 }}
              />
            );
          })}
        </div>
        <div style={{ display:'flex', marginTop:8 }}>
          {chartBars.map((d,i) => <div key={i} style={{ flex:1, textAlign:'center', fontSize:10, color:'var(--text-low)' }}>{d.label}</div>)}
        </div>
      </div>
      <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid var(--card-border)' }}>
          <span style={{ fontSize:15, fontWeight:600, color:'var(--card-title)' }}>Recent Orders</span>
          <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={() => setView('orders')}>View all <ArrowRight size={12} /></button>
        </div>
        <table className="pp-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Date</th><th style={{ width:40 }}></th></tr></thead>
          <tbody>
            {orders.length === 0
              ? <tr><td colSpan={6}><Empty icon={ShoppingBag} label={td.noPending} /></td></tr>
              : orders.map(o => {
                const ac = avColor(o.restaurant_name || '');
                return (
                  <tr key={o.id}>
                    <td style={{ fontWeight:500 }}>#{o.id}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="pp-avatar" style={{ width:30, height:30, background:ac.bg, color:ac.color, fontSize:12 }}>{(o.restaurant_name||'?').charAt(0)}</div>
                        <span style={{ fontWeight:500 }}>{o.restaurant_name||'—'}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td style={{ fontWeight:500 }}>${Number(o.total_amount||0).toFixed(2)}</td>
                    <td style={{ color:'var(--text-muted)' }}>{formatDate(o.created_at)}</td>
                    <td><button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-low)', padding:6, display:'flex' }}><MoreHorizontal size={16} /></button></td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════
const EMPTY_P = { name:'', category:'', description:'', price:'', unit:'', min_order_qty:'', stock:'', delivery_zones:'', delivery_delay:'' };

const Products = ({ t }) => {
  const tp = t.products;
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_P);
  const [images, setImages]     = useState([]);
  const [saving, setSaving]     = useState(false);

  const load = async () => { setLoading(true); try { const r = await axios.get('/api/fournisseur/products'); setProducts(r.data.data || r.data || []); } catch(e){} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      images.forEach(img => img.file && fd.append('images[]', img.file));
      if (editId) {
        fd.append('_method', 'PUT');
        await axios.post(`/api/fournisseur/products/${editId}`, fd, { headers:{'Content-Type':'multipart/form-data'} });
      } else {
        await axios.post('/api/fournisseur/products', fd, { headers:{'Content-Type':'multipart/form-data'} });
      }
      setModal(null); setEditId(null); setForm(EMPTY_P); setImages([]); load();
    } catch(e){} finally { setSaving(false); }
  };
  const onDelete = async id => { if (!window.confirm('Delete?')) return; try { await axios.delete(`/api/fournisseur/products/${id}`); load(); } catch(e){} };
  const openEdit = p => { setEditId(p.id); setForm({ name:p.name, category:p.category, description:p.description||'', price:p.price, unit:p.unit||'', min_order_qty:p.min_order_qty||'', stock:p.stock||'', delivery_zones:p.delivery_zones||'', delivery_delay:p.delivery_delay||'' }); setImages(p.images ? p.images.map(u=>({url:u})) : []); setModal('edit'); };

  return (
    <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20, flex:1, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{tp.eyebrow}</div>
          <div style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px' }}>{tp.title}</div>
        </div>
        <button className="pp-btn pp-btn-dark" onClick={() => { setForm(EMPTY_P); setImages([]); setEditId(null); setModal('add'); }}><Plus size={14} /> {tp.add}</button>
      </div>
      <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, overflow:'hidden' }}>
        {loading ? <Loader /> : products.length === 0 ? <Empty icon={Package} label={tp.noProducts} action={tp.add} onAction={() => setModal('add')} /> : (
          <div style={{ overflowX:'auto' }}>
            <table className="pp-table">
              <thead><tr>{tp.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:38, height:38, borderRadius:10, background:'var(--sidebar-active-bg)', border:'1px solid var(--card-border)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                          {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <Package size={15} color="var(--text-low)" strokeWidth={1.5} />}
                        </div>
                        <div>
                          <div style={{ fontWeight:500, color:'var(--card-title)' }}>{p.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{p.unit || 'unit'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color:'var(--text-muted)' }}>{p.category}</td>
                    <td style={{ fontWeight:600, color:'var(--card-title)' }}>{p.price} MAD</td>
                    <td style={{ color:'var(--text-muted)' }}>{p.stock ?? '—'}</td>
                    <td><StatusBadge status={p.status || 'active'} /></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={() => openEdit(p)}><Pencil size={11} /> Edit</button>
                        <button className="pp-btn pp-btn-danger pp-btn-sm" onClick={() => onDelete(p.id)}><Trash2 size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="pp-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ type:'spring', stiffness:300, damping:28 }} className="pp-modal">
            <div className="pp-modal-header">
              <span className="pp-modal-title">{modal==='add' ? tp.modal.add : tp.modal.edit}</span>
              <button className="pp-icon-btn" onClick={() => setModal(null)} style={{ width:30, height:30 }}><X size={14} /></button>
            </div>
            <div className="pp-modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13, marginBottom:13 }}>
                <div className="pp-field"><label className="pp-label">{tp.modal.name}</label><input type="text" name="name" value={form.name} onChange={onChange} className="pp-input" /></div>
                <div className="pp-field"><label className="pp-label">{tp.modal.category}</label><select name="category" value={form.category} onChange={onChange} className="pp-select"><option value="">Select</option>{tp.cats.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></div>
                <div className="pp-field"><label className="pp-label">{tp.modal.unit}</label><input type="text" name="unit" value={form.unit} onChange={onChange} className="pp-input" /></div>
                <div className="pp-field"><label className="pp-label">{tp.modal.price}</label><input type="number" name="price" value={form.price} onChange={onChange} className="pp-input" /></div>
                <div className="pp-field"><label className="pp-label">{tp.modal.stock}</label><input type="number" name="stock" value={form.stock} onChange={onChange} className="pp-input" /></div>
                <div className="pp-field"><label className="pp-label">{tp.modal.minQty}</label><input type="number" name="min_order_qty" value={form.min_order_qty} onChange={onChange} className="pp-input" /></div>
                <div className="pp-field"><label className="pp-label">{tp.modal.delay}</label><input type="number" name="delivery_delay" value={form.delivery_delay} onChange={onChange} className="pp-input" /></div>
                <div className="pp-field"><label className="pp-label">{tp.modal.zones}</label><select name="delivery_zones" value={form.delivery_zones} onChange={onChange} className="pp-select"><option value="">Select zone</option>{REGIONS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
              </div>
              <div className="pp-field" style={{ marginBottom:13 }}><label className="pp-label">{tp.modal.desc}</label><textarea name="description" value={form.description} onChange={onChange} className="pp-textarea" rows={3} /></div>
              <div className="pp-field"><label className="pp-label">{tp.modal.images}</label><ImageUploader images={images} setImages={setImages} max={5} /></div>
            </div>
            <div className="pp-modal-footer">
              <button className="pp-btn pp-btn-ghost" onClick={() => setModal(null)}>{tp.modal.cancel}</button>
              <button className="pp-btn pp-btn-dark" onClick={onSubmit} disabled={saving}>{saving ? 'Saving...' : (editId ? tp.modal.update : tp.modal.create)}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROMOTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const EMPTY_PROMO = { product_id:'', type:'', value:'', min_quantity:'', usage_limit:'', start_date:'', end_date:'' };

const Promotions = ({ t }) => {
  const tpm = t.promotions;
  const [promos, setPromos]     = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_PROMO);
  const [saving, setSaving]     = useState(false);

  const load = async () => { setLoading(true); try { const [p,pr] = await Promise.all([axios.get('/api/fournisseur/promotions'),axios.get('/api/fournisseur/products')]); setPromos(p.data.data||p.data||[]); setProducts(pr.data.data||pr.data||[]); } catch(e){} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = async () => { setSaving(true); try { if(editId) await axios.put(`/api/fournisseur/promotions/${editId}`,form); else await axios.post('/api/fournisseur/promotions',form); setModal(null); setEditId(null); setForm(EMPTY_PROMO); load(); } catch(e){} finally { setSaving(false); } };
  const onDelete = async id => { if(!window.confirm('Delete?')) return; try { await axios.delete(`/api/fournisseur/promotions/${id}`); load(); } catch(e){} };
  const openEdit = p => { setEditId(p.id); setForm({ product_id:p.product_id, type:p.type, value:p.value, min_quantity:p.min_quantity||'', usage_limit:p.usage_limit||'', start_date:p.start_date?.split('T')[0]||'', end_date:p.end_date?.split('T')[0]||'' }); setModal('edit'); };

  return (
    <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20, flex:1, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{tpm.eyebrow}</div>
          <div style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px' }}>{tpm.title}</div>
        </div>
        <button className="pp-btn pp-btn-dark" onClick={() => { setForm(EMPTY_PROMO); setEditId(null); setModal('add'); }}><Plus size={14} /> {tpm.add}</button>
      </div>
      <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, overflow:'hidden' }}>
        {loading ? <Loader /> : promos.length === 0 ? <Empty icon={Tag} label={tpm.noPromos} action={tpm.add} onAction={() => setModal('add')} /> : (
          <div style={{ overflowX:'auto' }}>
            <table className="pp-table">
              <thead><tr>{tpm.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight:500 }}>{products.find(pr=>pr.id===p.product_id)?.name||'—'}</td>
                    <td style={{ color:'var(--text-muted)' }}>{p.type}</td>
                    <td style={{ fontWeight:600 }}>{p.value}{p.type==='percentage'?'%':' MAD'}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:12 }}>{p.start_date?.split('T')[0]} – {p.end_date?.split('T')[0]}</td>
                    <td style={{ color:'var(--text-muted)' }}>{p.usage_limit||'N/A'}</td>
                    <td><StatusBadge status={p.status||'active'} /></td>
                    <td><div style={{ display:'flex', gap:6 }}><button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={() => openEdit(p)}><Pencil size={11} /> Edit</button><button className="pp-btn pp-btn-danger pp-btn-sm" onClick={() => onDelete(p.id)}><Trash2 size={11} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="pp-modal-overlay" onClick={e => e.target===e.currentTarget && setModal(null)}>
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ type:'spring', stiffness:300, damping:28 }} className="pp-modal">
            <div className="pp-modal-header"><span className="pp-modal-title">{modal==='add'?tpm.modal.add:tpm.modal.edit}</span><button className="pp-icon-btn" onClick={()=>setModal(null)} style={{width:30,height:30}}><X size={14}/></button></div>
            <div className="pp-modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13 }}>
                <div className="pp-field"><label className="pp-label">{tpm.modal.product}</label><select name="product_id" value={form.product_id} onChange={onChange} className="pp-select"><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div className="pp-field"><label className="pp-label">{tpm.modal.type}</label><select name="type" value={form.type} onChange={onChange} className="pp-select"><option value="">Select type</option>{tpm.types.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
                <div className="pp-field"><label className="pp-label">{tpm.modal.value}</label><input type="number" name="value" value={form.value} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tpm.modal.minQty}</label><input type="number" name="min_quantity" value={form.min_quantity} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tpm.modal.limit}</label><input type="number" name="usage_limit" value={form.usage_limit} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tpm.modal.start}</label><input type="date" name="start_date" value={form.start_date} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field" style={{gridColumn:'1/-1'}}><label className="pp-label">{tpm.modal.end}</label><input type="date" name="end_date" value={form.end_date} onChange={onChange} className="pp-input"/></div>
              </div>
            </div>
            <div className="pp-modal-footer"><button className="pp-btn pp-btn-ghost" onClick={()=>setModal(null)}>{tpm.modal.cancel}</button><button className="pp-btn pp-btn-dark" onClick={onSubmit} disabled={saving}>{saving?'Saving...':(editId?tpm.modal.update:tpm.modal.create)}</button></div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════
const Messages = ({ t }) => {
  const tm = t.messages;
  const [convs, setConvs]     = useState([]);
  const [msgs, setMsgs]       = useState([]);
  const [selId, setSelId]     = useState(null);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  const fetchConvs = async () => { try { const r = await axios.get('/api/messages'); const d = r.data||[]; setConvs(d); if(d.length>0&&!selId) setSelId(d[0].id); } catch(e){} finally { setLoading(false); } };
  useEffect(() => { fetchConvs(); }, []);
  useEffect(() => { if(!selId) return; (async()=>{ try{ const r=await axios.get(`/api/messages/${selId}`); setMsgs(r.data||[]); }catch(e){} })(); }, [selId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const send = async e => { e.preventDefault(); if(!input.trim()||!selId) return; try{ const r=await axios.post('/api/messages',{conversationId:selId,content:input}); setMsgs(p=>[...p,r.data]); setInput(''); fetchConvs(); }catch(e){} };
  const active = convs.find(c=>c.id===selId);

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
      <div style={{ width:260, borderRight:'1px solid var(--card-border)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--card-border)' }}>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--card-title)' }}>{tm.title}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{tm.eyebrow}</div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {loading ? <Loader /> : convs.length===0 ? <Empty icon={MessageSquare} label={tm.noConvs} /> : convs.map(c=>(
            <div key={c.id} onClick={()=>setSelId(c.id)} style={{ display:'flex', flexDirection:'column', padding:'13px 16px', borderBottom:'1px solid var(--page-border)', cursor:'pointer', background:selId===c.id?'var(--sidebar-active-bg)':'transparent', transition:'background 0.1s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:4 }}>
                <div className="pp-avatar" style={{ width:28,height:28,background:'var(--sidebar-active-bg)',color:'var(--text-muted)',fontSize:12 }}>{c.contact_name?.charAt(0)?.toUpperCase()||'?'}</div>
                <span style={{ fontSize:13,fontWeight:500,color:'var(--card-title)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.contact_name||'—'}</span>
                {c.unread_count>0 && <span style={{ background:'var(--accent-color)',color:'#fff',fontSize:10,fontWeight:700,padding:'1px 7px',borderRadius:99 }}>{c.unread_count}</span>}
              </div>
              <div style={{ fontSize:11,color:'var(--text-muted)',paddingLeft:37,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.last_message_preview||'—'}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0 }}>
        {!selId ? (
          <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10 }}>
            <MessageSquare size={32} color="var(--text-low)" strokeWidth={1.5} />
            <span style={{ fontSize:13,color:'var(--text-muted)' }}>{tm.select}</span>
          </div>
        ) : (
          <>
            <div style={{ padding:'14px 20px',borderBottom:'1px solid var(--card-border)',display:'flex',alignItems:'center',gap:12 }}>
              <div className="pp-avatar" style={{ width:36,height:36,background:'var(--sidebar-active-bg)',color:'var(--text-muted)',fontSize:14 }}>{active?.contact_name?.charAt(0)?.toUpperCase()}</div>
              <div>
                <div style={{ fontSize:14,fontWeight:600,color:'var(--card-title)' }}>{active?.contact_name}</div>
                <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:2 }}>
                  <div style={{ width:6,height:6,borderRadius:'50%',background:'#22c55e' }}/>
                  <span style={{ fontSize:11,color:'var(--text-muted)' }}>{tm.buyer}</span>
                </div>
              </div>
            </div>
            <div style={{ flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:10 }}>
              {msgs.length===0 ? <div style={{ textAlign:'center',paddingTop:40,fontSize:13,color:'var(--text-low)' }}>{tm.noMsgs}</div>
                : msgs.map((msg,i)=>(
                  <div key={i} style={{ alignSelf:msg.sender==='self'?'flex-end':'flex-start' }}>
                    <div style={{ maxWidth:'75%',padding:'10px 14px',borderRadius:18,fontSize:13,lineHeight:1.5,background:msg.sender==='self'?'var(--accent-color)':'var(--sidebar-active-bg)',color:msg.sender==='self'?'#fff':'var(--card-title)',borderBottomRightRadius:msg.sender==='self'?4:18,borderBottomLeftRadius:msg.sender==='self'?18:4 }}>{msg.content}</div>
                    <div style={{ fontSize:10,color:'var(--text-low)',marginTop:4,textAlign:msg.sender==='self'?'right':'left' }}>{new Date(msg.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                ))
              }
              <div ref={endRef}/>
            </div>
            <div style={{ padding:'14px 20px',borderTop:'1px solid var(--card-border)' }}>
              <form onSubmit={send} style={{ display:'flex',gap:10 }}>
                <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder={tm.placeholder} className="pp-input" style={{ flex:1 }}/>
                <button type="submit" className="pp-btn pp-btn-dark" disabled={!input.trim()}><Send size={14}/> Send</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
const Profile = ({ t }) => {
  const tp = t.profile;
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm]   = useState({});
  const [saving, setSaving] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(()=>{ (async()=>{ try{ const r=await axios.get('/api/fournisseur/profile'); setForm(r.data||{}); setProfilePic(r.data?.profile_pic); }catch(e){} })(); },[]);
  const onChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const onSaveInfo = async ()=>{ setSaving(true); try{ const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v)); if(profilePic instanceof File) fd.append('profile_pic',profilePic); fd.append('_method', 'PUT'); await axios.post('/api/fournisseur/profile',fd,{headers:{'Content-Type':'multipart/form-data'}}); }catch(e){} finally{ setSaving(false); } };
  const onSaveSecurity = async ()=>{ setSaving(true); try{ await axios.patch('/api/fournisseur/profile/security',form); }catch(e){} finally{ setSaving(false); } };
  const onSaveNotifs = async ()=>{ setSaving(true); try{ await axios.patch('/api/fournisseur/profile/notifications',form); }catch(e){} finally{ setSaving(false); } };

  return (
    <div style={{ padding:'24px 28px',display:'flex',flexDirection:'column',gap:20,flex:1,overflowY:'auto' }}>
      <div>
        <div style={{ fontSize:11,color:'#8e8e93',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4 }}>{tp.eyebrow}</div>
        <div style={{ fontSize:22,fontWeight:700,color:'#1c1c1e',letterSpacing:'-0.4px' }}>{tp.title}</div>
      </div>
      <div style={{ background:'#fff',border:'1.5px solid #f2f2f2',borderRadius:14,overflow:'hidden' }}>
        <div style={{ display:'flex',borderBottom:'1px solid #f2f2f2' }}>
          {tp.tabs.map((tab,i)=>(
            <button key={tp.tabIds[i]} onClick={()=>setActiveTab(tp.tabIds[i])} style={{ padding:'14px 22px',fontSize:13,fontWeight:500,border:'none',background:'none',cursor:'pointer',color:activeTab===tp.tabIds[i]?'#1c1c1e':'#8e8e93',borderBottom:activeTab===tp.tabIds[i]?'2px solid #1c1c1e':'2px solid transparent',transition:'all 0.15s' }}>{tab}</button>
          ))}
        </div>
        <div style={{ padding:22 }}>
          {activeTab==='info' && (
            <div>
              <div style={{ fontSize:14,fontWeight:600,color:'#1c1c1e',marginBottom:18 }}>{tp.info.title}</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18 }}>
                <div className="pp-field"><label className="pp-label">{tp.info.businessName}</label><input type="text" name="business_name" value={form.business_name||''} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tp.info.contactName}</label><input type="text" name="contact_name" value={form.contact_name||''} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tp.info.email}</label><input type="email" name="email" value={form.email||''} onChange={onChange} className="pp-input" disabled style={{opacity:0.6}}/></div>
                <div className="pp-field"><label className="pp-label">{tp.info.phone}</label><input type="text" name="phone" value={form.phone||''} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tp.info.region}</label><select name="region" value={form.region||''} onChange={onChange} className="pp-select"><option value="">Select</option>{REGIONS.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
                <div className="pp-field"><label className="pp-label">{tp.info.address}</label><input type="text" name="address" value={form.address||''} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field" style={{gridColumn:'1/-1'}}><label className="pp-label">{tp.info.zones}</label><input type="text" name="delivery_zones" value={form.delivery_zones||''} onChange={onChange} className="pp-input"/></div>
              </div>
              <div className="pp-field" style={{marginBottom:18}}><label className="pp-label">{tp.info.bio}</label><textarea name="bio" value={form.bio||''} onChange={onChange} className="pp-textarea" rows={3}/></div>
              <div style={{ display:'flex',alignItems:'center',gap:16 }}>
                <div className="pp-avatar" style={{ width:60,height:60,background:'#f0f0f0',color:'#666',fontSize:22 }}>
                  {profilePic ? <img src={typeof profilePic==='string'?profilePic:URL.createObjectURL(profilePic)} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/> : (form.contact_name?.charAt(0)?.toUpperCase()||'F')}
                </div>
                <div>
                  <input type="file" id="pp-pic" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&setProfilePic(e.target.files[0])} accept="image/*"/>
                  <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={()=>document.getElementById('pp-pic').click()}><Camera size={13}/> {tp.info.changePic}</button>
                </div>
                <button className="pp-btn pp-btn-dark" onClick={onSaveInfo} disabled={saving} style={{marginLeft:'auto'}}>{saving?tp.info.saving:tp.info.save}</button>
              </div>
            </div>
          )}
          {activeTab==='security' && (
            <div>
              <div style={{ fontSize:14,fontWeight:600,color:'#1c1c1e',marginBottom:18 }}>{tp.security.title}</div>
              <div style={{ display:'flex',flexDirection:'column',gap:14,maxWidth:420 }}>
                <div className="pp-field"><label className="pp-label">{tp.security.current}</label><input type="password" name="current_password" value={form.current_password||''} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tp.security.newPwd}</label><input type="password" name="new_password" value={form.new_password||''} onChange={onChange} className="pp-input"/></div>
                <div className="pp-field"><label className="pp-label">{tp.security.confirm}</label><input type="password" name="confirm_password" value={form.confirm_password||''} onChange={onChange} className="pp-input"/></div>
                <button className="pp-btn pp-btn-dark" onClick={onSaveSecurity} disabled={saving} style={{alignSelf:'flex-start'}}>{saving?tp.security.saving:tp.security.save}</button>
              </div>
            </div>
          )}
          {activeTab==='notifications' && (
            <div>
              <div style={{ fontSize:14,fontWeight:600,color:'#1c1c1e',marginBottom:18 }}>{tp.notifs.title}</div>
              <div style={{ display:'flex',flexDirection:'column',maxWidth:520 }}>
                {tp.notifs.items.map((item,i)=>(
                  <div key={item.key} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0',borderBottom:i<tp.notifs.items.length-1?'1px solid #f2f2f2':'none' }}>
                    <div>
                      <div style={{ fontSize:14,fontWeight:500,color:'#1c1c1e' }}>{item.label}</div>
                      <div style={{ fontSize:12,color:'#8e8e93',marginTop:2 }}>{item.sub}</div>
                    </div>
                    <button onClick={()=>setForm(p=>({...p,[item.key]:!p[item.key]}))} style={{ background:'none',border:'none',cursor:'pointer',padding:0 }}>
                      <div style={{ width:44,height:24,borderRadius:99,background:form[item.key]?'#1c1c1e':'#e0e0e0',position:'relative',transition:'background 0.2s' }}>
                        <div style={{ position:'absolute',top:3,left:form[item.key]?23:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                      </div>
                    </button>
                  </div>
                ))}
                <button className="pp-btn pp-btn-dark" onClick={onSaveNotifs} disabled={saving} style={{alignSelf:'flex-start',marginTop:20}}>{saving?tp.notifs.saving:tp.notifs.save}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMERS (functional: search, sort, status toggle)
// ═══════════════════════════════════════════════════════════════════════════════
const Customers = ({ t }) => {
  const tc = t.customers;
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('spent');

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/fournisseur/customers');
      setCustomers(r.data?.length ? r.data : MOCK_CUSTOMERS);
    } catch (e) { setCustomers(MOCK_CUSTOMERS); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggleStatus = async (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    try { await axios.patch(`/api/fournisseur/customers/${id}`, { status: 'toggle' }); } catch (e) {}
  };

  const filtered = customers
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.email||'').toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy === 'spent' ? b.spent - a.spent : sortBy === 'orders' ? b.orders - a.orders : a.name.localeCompare(b.name));

  return (
    <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20, flex:1, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{tc.eyebrow}</div>
          <div style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px' }}>{tc.title}</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <div style={{ position:'relative', flex:1, maxWidth:320 }}>
          <Search size={14} color="var(--text-low)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={tc.search} className="pp-input" style={{ paddingLeft:34 }} />
        </div>
        <div className="pp-filter-select">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="spent">Sort by Spent</option>
            <option value="orders">Sort by Orders</option>
            <option value="name">Sort by Name</option>
          </select>
          <ChevronDown size={14} color="var(--text-low)" />
        </div>
      </div>

      <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, overflow:'hidden' }}>
        {loading ? <Loader /> : filtered.length === 0 ? (
          <Empty icon={Users} label={tc.noCustomers} />
        ) : (
          <table className="pp-table">
            <thead><tr>{tc.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c => {
                const ac = avColor(c.name);
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="pp-avatar" style={{ width:32, height:32, background:ac.bg, color:ac.color, fontSize:13 }}>{c.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight:500 }}>{c.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.orders}</td>
                    <td style={{ fontWeight:600 }}>{c.spent.toLocaleString()} MAD</td>
                    <td style={{ color:'var(--text-muted)' }}>{c.lastOrder}</td>
                    <td style={{ cursor:'pointer' }} onClick={() => toggleStatus(c.id)}><StatusBadge status={c.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING (functional: create / edit / delete campaigns)
// ═══════════════════════════════════════════════════════════════════════════════
const EMPTY_CAMPAIGN = { name:'', channel:'', reach:'' };

const Marketing = ({ t }) => {
  const tmk = t.marketing;
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY_CAMPAIGN);
  const [saving, setSaving]       = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/fournisseur/campaigns');
      setCampaigns(r.data?.length ? r.data : MOCK_CAMPAIGNS);
    } catch (e) { setCampaigns(MOCK_CAMPAIGNS); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async () => {
    setSaving(true);
    const payload = { name: form.name, channel: form.channel, reach: Number(form.reach) || 0, clicks: 0, status: 'active', created_at: new Date().toISOString().split('T')[0] };
    try {
      if (editId) {
        try { await axios.put(`/api/fournisseur/campaigns/${editId}`, payload); } catch (e) {}
        setCampaigns(prev => prev.map(c => c.id === editId ? { ...c, ...payload } : c));
      } else {
        let created = { id: Date.now(), ...payload };
        try {
          const r = await axios.post('/api/fournisseur/campaigns', payload);
          if (r.data?.id) created = r.data;
        } catch (e) {}
        setCampaigns(prev => [created, ...prev]);
      }
      setModal(null); setEditId(null); setForm(EMPTY_CAMPAIGN);
    } finally { setSaving(false); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    setCampaigns(prev => prev.filter(c => c.id !== id));
    try { await axios.delete(`/api/fournisseur/campaigns/${id}`); } catch (e) {}
  };

  const toggleStatus = async (id) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'completed' : 'active' } : c));
    try { await axios.patch(`/api/fournisseur/campaigns/${id}/status`); } catch (e) {}
  };

  const openEdit = c => { setEditId(c.id); setForm({ name:c.name, channel:c.channel, reach:c.reach }); setModal('edit'); };

  return (
    <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20, flex:1, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{tmk.eyebrow}</div>
          <div style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px' }}>{tmk.title}</div>
        </div>
        <button className="pp-btn pp-btn-dark" onClick={() => { setForm(EMPTY_CAMPAIGN); setEditId(null); setModal('add'); }}><Plus size={14} /> {tmk.add}</button>
      </div>

      {loading ? <Loader /> : campaigns.length === 0 ? (
        <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14 }}>
          <Empty icon={Megaphone} label={tmk.noCampaigns} action={tmk.add} onAction={() => setModal('add')} />
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {campaigns.map(c => (
            <div key={c.id} style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, padding:'18px 20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--card-title)' }}>{c.name}</div>
                <div style={{ cursor:'pointer' }} onClick={() => toggleStatus(c.id)}><StatusBadge status={c.status} /></div>
              </div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>{c.channel}</div>
              <div style={{ display:'flex', gap:20, marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:11, color:'var(--text-low)' }}>Reach</div>
                  <div style={{ fontSize:16, fontWeight:700, color:'var(--card-title)' }}>{Number(c.reach).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'var(--text-low)' }}>Clicks</div>
                  <div style={{ fontSize:16, fontWeight:700, color:'var(--card-title)' }}>{Number(c.clicks || 0).toLocaleString()}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={() => openEdit(c)}><Pencil size={11} /> Edit</button>
                <button className="pp-btn pp-btn-danger pp-btn-sm" onClick={() => onDelete(c.id)}><Trash2 size={11} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="pp-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ type:'spring', stiffness:300, damping:28 }} className="pp-modal">
            <div className="pp-modal-header">
              <span className="pp-modal-title">{modal==='add' ? tmk.modal.add : tmk.modal.edit}</span>
              <button className="pp-icon-btn" onClick={() => setModal(null)} style={{ width:30, height:30 }}><X size={14} /></button>
            </div>
            <div className="pp-modal-body">
              <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
                <div className="pp-field"><label className="pp-label">{tmk.modal.name}</label><input type="text" name="name" value={form.name} onChange={onChange} className="pp-input" /></div>
                <div className="pp-field"><label className="pp-label">{tmk.modal.channel}</label><select name="channel" value={form.channel} onChange={onChange} className="pp-select"><option value="">Select</option>{tmk.channels.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="pp-field"><label className="pp-label">{tmk.modal.reach}</label><input type="number" name="reach" value={form.reach} onChange={onChange} className="pp-input" /></div>
              </div>
            </div>
            <div className="pp-modal-footer">
              <button className="pp-btn pp-btn-ghost" onClick={() => setModal(null)}>{tmk.modal.cancel}</button>
              <button className="pp-btn pp-btn-dark" onClick={onSubmit} disabled={saving || !form.name || !form.channel}>{saving ? 'Saving...' : (editId ? tmk.modal.update : tmk.modal.create)}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTICS (computed live from real order data)
// ═══════════════════════════════════════════════════════════════════════════════
const Statistics = ({ t }) => {
  const ts = t.statistics;
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get('/api/fournisseur/orders');
        setOrders(r.data?.length ? r.data : MOCK_ORDERS);
      } catch (e) { setOrders(MOCK_ORDERS); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  const trend = buildWeeklyRevenue(orders);
  const maxBar = Math.max(...trend.map(d => d.value), 1);
  const totalRevenue = orders.reduce((s,o) => s + Number(o.total_amount||0), 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const byStatus = orders.reduce((m,o) => { m[o.status] = (m[o.status]||0)+1; return m; }, {});

  return (
    <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20, flex:1, overflowY:'auto' }}>
      <div style={{ fontSize:22, fontWeight:700, color:'var(--card-title)', letterSpacing:'-0.4px' }}>{ts.title}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:ts.totalRevenue, value:`${totalRevenue.toLocaleString()} MAD` },
          { label:ts.avgOrder,     value:`${avgOrder.toFixed(0)} MAD` },
          { label:ts.totalOrders,  value:orders.length },
        ].map(({ label, value }) => (
          <div key={label} style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, padding:'18px 20px' }}>
            <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500, marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color:'var(--card-title)' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, padding:'20px 24px' }}>
        <div style={{ fontSize:15, fontWeight:600, color:'var(--card-title)', marginBottom:20 }}>{ts.trend}</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:90 }}>
          {trend.map((d,i) => (
            <div key={i} title={`${d.label}: ${d.value.toLocaleString()}`} style={{ flex:1, height:Math.max(Math.round((d.value/maxBar)*80),4), borderRadius:'5px 5px 0 0', background:'var(--accent-color)' }} />
          ))}
        </div>
        <div style={{ display:'flex', marginTop:8 }}>
          {trend.map((d,i) => <div key={i} style={{ flex:1, textAlign:'center', fontSize:10, color:'var(--text-low)' }}>{d.label}</div>)}
        </div>
      </div>
      <div style={{ background:'var(--card-bg)', border:'1.5px solid var(--card-border)', borderRadius:14, padding:'20px 24px' }}>
        <div style={{ fontSize:15, fontWeight:600, color:'var(--card-title)', marginBottom:16 }}>{ts.byStatus}</div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', border:'1px solid var(--card-border)', borderRadius:10 }}>
              <StatusBadge status={status} /><span style={{ fontSize:13, fontWeight:600 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
const FournisseurApp = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, lang, toggleLang } = useAppStore();
  const [view, setView] = useState('orders');
  const navigate = useNavigate();

  const t = T[lang] || T.en;
  const onLogout = () => { logout(); navigate('/login'); };

  const viewTitles = {
    dashboard:'Dashboard', orders: t.orders.title,
    payments: t.nav.payments, customers: t.customers.title,
    reports: t.nav.reports, statistics: t.statistics.title,
    notifications: t.nav.notifications, help: t.nav.help,
    settings: t.nav.settings, products: t.products.title,
    promotions: t.promotions.title, messages: t.messages.title,
    profile: t.profile.title, marketing: t.marketing.title,
  };

  const renderContent = () => {
    switch(view) {
      case 'dashboard':    return <Dashboard setView={setView} t={t} />;
      case 'orders':       return <Orders t={t} />;
      case 'products':     return <Products t={t} />;
      case 'promotions':   return <Promotions t={t} />;
      case 'messages':     return <Messages t={t} />;
      case 'profile':      return <Profile t={t} />;
      case 'customers':    return <Customers t={t} />;
      case 'marketing':    return <Marketing t={t} />;
      case 'statistics':   return <Statistics t={t} />;
      case 'payments':     return <PlaceholderView icon={CreditCard} title={t.nav.payments} />;
      case 'reports':      return <PlaceholderView icon={BarChart2} title={t.nav.reports} />;
      case 'notifications':return <Notifications lang={lang} />;
      case 'help':         return <PlaceholderView icon={HelpCircle} title={t.nav.help} />;
      case 'settings':     return <PlaceholderView icon={Settings} title={t.nav.settings} />;
      default:             return <PlaceholderView icon={LayoutDashboard} title={view} />;
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', padding:16, gap:12, background:'var(--page-bg)', overflow:'hidden', transition: 'background 0.3s' }}>
      <GlobalStyles theme={theme} />
      <Sidebar view={view} setView={setView} t={t} onLogout={onLogout} />
      <div className="pp-main">
        <TopBar
          title={viewTitles[view] || view}
          lang={lang} toggleLang={toggleLang}
          theme={theme} toggleTheme={toggleTheme}
          profilePic={user?.profile_pic}
          onNotifications={() => setView('notifications')}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity:0, y:6 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-6 }}
            transition={{ duration:0.15 }}
            style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FournisseurApp;
