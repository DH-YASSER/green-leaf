import React, { useEffect, useState, useRef, useCallback, Suspense, lazy } from 'react';
import { useAppStore } from '../store/appStore';
import ScrollFloat from '../components/ScrollFloat';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';

let hasShownPreloaderThisSession = false;
export const THEMES = {

  dark: {
    // ─── GRANULAR COMPONENT-LEVEL VARIABLES ─────────────────────────────────
    // Global Page Styles
    '--page-bg': '#0B0C0C',
    '--page-text': '#FFFFFF',
    '--text-muted': 'rgba(255,255,255,0.70)',
    '--text-low': 'rgba(255,255,255,0.40)',
    '--page-border': 'rgba(255, 255, 255, 0.08)',
    '--accent-color': '#81C784',   // green reserved for key actions
    '--accent-gold': '#E8B86D',

    // Navbar
    '--nav-bg': 'rgba(11,12,12,0.96)',
    '--nav-border': 'rgba(255, 255, 255, 0.08)',
    '--nav-link': 'rgba(255,255,255,0.70)',
    '--nav-link-hover': '#FFFFFF',
    '--nav-active': '#81C784',   // key action: active state

    // Sidebar
    '--sidebar-bg': '#161717',
    '--sidebar-border': 'rgba(255, 255, 255, 0.08)',
    '--sidebar-link': 'rgba(255,255,255,0.70)',
    '--sidebar-link-hover': '#FFFFFF',
    '--sidebar-active-bg': 'rgba(255, 255, 255, 0.08)',
    '--sidebar-active-text': '#81C784',   // key action: active state

    // Buttons
    '--btn-primary-bg': '#81C784',   // key action: primary CTA
    '--btn-primary-text': '#000000',
    '--btn-primary-hover': '0.88',
    '--btn-secondary-bg': 'transparent',
    '--btn-secondary-text': '#C7CCC9',
    '--btn-secondary-border': 'rgba(199, 204, 201, 0.30)',
    '--btn-icon-border': 'rgba(255, 255, 255, 0.08)',
    '--btn-icon-text': '#C7CCC9',
    '--btn-icon-hover-bg': 'rgba(255, 255, 255, 0.08)',

    // Cards & Panels
    '--card-bg': '#161717',
    '--card-border': 'rgba(255, 255, 255, 0.08)',
    '--card-title': '#FFFFFF',
    '--card-body': 'rgba(255,255,255,0.70)',
    '--card-hover-bg': 'rgba(255, 255, 255, 0.04)',

    // Inputs
    '--input-bg': 'transparent',
    '--input-border': 'rgba(255, 255, 255, 0.08)',
    '--input-text': '#FFFFFF',
    '--input-placeholder': 'rgba(199, 204, 201, 0.45)',
    '--input-focus-border': '#81C784',   // key action: focus state

    // Chat
    '--chat-bubble-self': 'rgba(255, 255, 255, 0.10)',
    '--chat-bubble-other': '#161717',
    '--chat-text-self': '#FFFFFF',
    '--chat-text-other': 'rgba(255,255,255,0.70)',

    // Auth Page
    '--auth-panel-bg': '#161717',

    // Status / Badges
    '--status-pending-bg': 'rgba(245,158,11,0.08)',
    '--status-pending-text': 'rgba(245,158,11,0.85)',
    '--status-success-bg': 'rgba(129,199,132,0.10)',
    '--status-success-text': '#81C784',
    '--status-failed-bg': 'rgba(239,100,100,0.10)',
    '--status-failed-text': 'rgba(239,100,100,0.85)',
    '--status-info-bg': 'rgba(147,197,253,0.08)',
    '--status-info-text': 'rgba(147,197,253,0.85)',

    // ─── BACKWARD COMPATIBLE GLOBAL ALIASES ─────────────────────────────────
    '--bg': '#0B0C0C',
    '--bg2': '#161717',
    '--bg3': '#000000',
    '--bg4': '#1E2020',
    '--bg5': '#252727',
    '--text': '#FFFFFF',
    '--textMid': 'rgba(255,255,255,0.70)',
    '--textLow': 'rgba(255,255,255,0.40)',
    '--sulu': '#81C784',
    '--suluLo': 'rgba(129, 199, 132, 0.10)',
    '--suluMd': 'rgba(129, 199, 132, 0.22)',
    '--silver': '#C7CCC9',
    '--silverLo': 'rgba(199, 204, 201, 0.10)',
    '--silverMd': 'rgba(199, 204, 201, 0.30)',
    '--border': 'rgba(255, 255, 255, 0.08)',
    '--border2': 'rgba(255, 255, 255, 0.14)',
    '--navBg': 'rgba(11,12,12,0.96)',
    '--inputBg': 'transparent',
    '--danger': 'rgba(239,100,100,0.85)',
    '--dangerLo': 'rgba(239,100,100,0.10)',
    '--heroFilter': 'brightness(0.18) saturate(0.45)',
    '--imgFilter': 'brightness(0.55) saturate(0.7)',
    '--accent2': '#E8B86D',
    '--amber': 'rgba(245,158,11,0.85)',
    '--amberLo': 'rgba(245,158,11,0.08)',
    '--blue': 'rgba(147,197,253,0.85)',
    '--blueLo': 'rgba(147,197,253,0.08)',
  },
  light: {
    // ─── GRANULAR COMPONENT-LEVEL VARIABLES ─────────────────────────────────
    // Global Page Styles
    '--page-bg': '#FAFAF9',
    '--page-text': '#241f1f',
    '--text-muted': '#54594F',
    '--text-low': '#84897F',
    '--page-border': 'rgba(31, 36, 33, 0.08)',
    '--accent-color': '#4C7846',   // green reserved for key actions
    '--accent-gold': '#E8B86D',

    // Navbar
    '--nav-bg': 'rgba(250,250,249,0.96)',
    '--nav-border': 'rgba(31, 36, 33, 0.08)',
    '--nav-link': '#54594F',
    '--nav-link-hover': '#1F2421',
    '--nav-active': '#4C7846',   // key action: active state

    // Sidebar
    '--sidebar-bg': '#FFFFFF',
    '--sidebar-border': 'rgba(31, 36, 33, 0.08)',
    '--sidebar-link': '#54594F',
    '--sidebar-link-hover': '#241f1f',
    '--sidebar-active-bg': 'rgba(31, 36, 33, 0.06)',
    '--sidebar-active-text': '#4C7846',   // key action: active state

    // Buttons
    '--btn-primary-bg': '#4C7846',   // key action: primary CTA
    '--btn-primary-text': '#FFFFFF',
    '--btn-primary-hover': '0.88',
    '--btn-secondary-bg': 'transparent',
    '--btn-secondary-text': '#3D4339',
    '--btn-secondary-border': 'rgba(61, 67, 57, 0.30)',
    '--btn-icon-border': 'rgba(31, 36, 33, 0.10)',
    '--btn-icon-text': '#3D4339',
    '--btn-icon-hover-bg': 'rgba(31, 36, 33, 0.06)',

    // Cards & Panels
    '--card-bg': '#FFFFFF',
    '--card-border': 'rgba(31, 36, 33, 0.10)',
    '--card-title': '#241f1f',
    '--card-body': '#54594F',
    '--card-hover-bg': 'rgba(31, 36, 33, 0.03)',

    // Inputs
    '--input-bg': '#FFFFFF',
    '--input-border': 'rgba(31, 36, 33, 0.18)',
    '--input-text': '#241f1f',
    '--input-placeholder': 'rgba(61, 67, 57, 0.45)',
    '--input-focus-border': '#4C7846',   // key action: focus state

    // Chat
    '--chat-bubble-self': 'rgba(31, 36, 33, 0.06)',
    '--chat-bubble-other': '#F1F1EF',
    '--chat-text-self': '#241f1f',
    '--chat-text-other': '#54594F',

    // Auth Page
    '--auth-panel-bg': '#FFFFFF',

    // Status / Badges
    '--status-pending-bg': 'rgba(180,120,0,0.07)',
    '--status-pending-text': 'rgba(180,120,0,0.85)',
    '--status-success-bg': 'rgba(76,120,70,0.08)',
    '--status-success-text': '#4C7846',
    '--status-failed-bg': 'rgba(200,50,50,0.08)',
    '--status-failed-text': 'rgba(200,50,50,0.85)',
    '--status-info-bg': 'rgba(37,99,235,0.07)',
    '--status-info-text': 'rgba(37,99,235,0.85)',

    // ─── BACKWARD COMPATIBLE GLOBAL ALIASES ─────────────────────────────────
    '--bg': '#FAFAF9',
    '--bg2': '#FFFFFF',
    '--bg3': '#E7E8E4',
    '--bg4': '#FFFFFF',
    '--bg5': '#F1F1EF',
    '--text': '#241f1f',
    '--textMid': '#54594F',
    '--textLow': 'rgba(31, 36, 33, 0.40)',
    '--sulu': '#4C7846',
    '--suluLo': 'rgba(76, 120, 70, 0.08)',
    '--suluMd': 'rgba(76, 120, 70, 0.18)',
    '--silver': '#3D4339',
    '--silverLo': 'rgba(31, 36, 33, 0.06)',
    '--silverMd': 'rgba(31, 36, 33, 0.18)',
    '--border': 'rgba(31, 36, 33, 0.08)',
    '--border2': 'rgba(31, 36, 33, 0.15)',
    '--navBg': 'rgba(250,250,249,0.96)',
    '--inputBg': '#FFFFFF',
    '--danger': 'rgba(200,50,50,0.85)',
    '--dangerLo': 'rgba(200,50,50,0.08)',
    '--heroFilter': 'brightness(0.30) saturate(0.55)',
    '--imgFilter': 'brightness(0.75) saturate(0.85)',
    '--accent2': '#E8B86D',
    '--amber': 'rgba(180,120,0,0.85)',
    '--amberLo': 'rgba(180,120,0,0.07)',
    '--blue': 'rgba(37,99,235,0.85)',
    '--blueLo': 'rgba(37,99,235,0.07)',
  }
};
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';
import axios from '../api/axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import ctaBg from '../assets/image.webp';
import ctaBgLight from '../assets/bg-20260520-111942.jpg';
import ctaBgDark from '../assets/bg-20260520-113543.jpg';

import marquee1 from '../assets/marquee-1.jpg';
import marquee2 from '../assets/marquee-2.jpg';
import marquee3 from '../assets/marquee-3.jpg';
import marquee4 from '../assets/marquee-4.jpg';
import marquee5 from '../assets/marquee-5.jpg';
import marquee6 from '../assets/marquee-6.jpg';
import marquee7 from '../assets/marquee-7.jpg';
import marquee8 from '../assets/marquee-8.jpg';
import marquee9 from '../assets/marquee-9.jpg';
import marquee10 from '../assets/marquee-10.jpg';
import marquee11 from '../assets/marquee-11.jpg';
import marquee12 from '../assets/marquee-12.jpg';
import marquee13 from '../assets/marquee-13.jpg';
import marquee14 from '../assets/marquee-14.jpg';

import veggies from '../assets/veggies.jpg';
import fruits from '../assets/fruits.jpg';
import meat from '../assets/meat.jpg';
import chicken from '../assets/chicken.jpg';
import spices from '../assets/spices.jpg';
import herbs from '../assets/herbs.jpg';
import nuts from '../assets/nuts.jpg';
import beans from '../assets/beans.jpg';
import drinks from '../assets/drinks.jpg';

import {
  ArrowRight, Sun, Moon, Globe, ChevronDown, Plus, CheckCircle,
  Search, ShoppingCart, Truck, Store, ListPlus, Wallet,
  Leaf, MessageCircle, FileText,Handshake, ShieldCheck, X, Menu
} from 'lucide-react';

/* ───────────────────────────────────────────────────────────────────────────
   IMAGES — produce / farm / supplier photography
   ─────────────────────────────────────────────────────────────────────────── */
const IMGS = {
  // hero background is now the Spline 3D scene (set scene URL in HeroSection)

  // marquee — scrolling produce / market photography
  marquee: [
    marquee1, marquee2, marquee3, marquee4, marquee5, marquee6, marquee7, marquee8, marquee9, marquee10, marquee11, marquee12, marquee13, marquee14
  ],

  // about — decorative corner shots

  aboutTL: import.meta.env.BASE_URL + 'about-tl.jpg',
  aboutBL: import.meta.env.BASE_URL + 'about-bl.jpg',
  aboutTR: import.meta.env.BASE_URL + 'about-tr.jpg',
  aboutBR: import.meta.env.BASE_URL + 'about-br.jpg',

  categories: [
    [veggies, fruits],
    [meat, chicken],
    [spices, herbs],
    [nuts, beans],
    [drinks],
  ],

  food: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
};

/* ───────────────────────────────────────────────────────────────────────────
   COPY
   ─────────────────────────────────────────────────────────────────────────── */
const T = {
  fr: {
    nav: { about: 'À propos', how: 'Fonctionnement', suppliers: 'Fournisseurs', join: 'Rejoindre →', login: 'Connexion', dashboard: 'Mon Espace' },
    hero: {
      h1: 'De la terre', h2: 'à votre', h3: 'cuisine.',
      sub: 'GreenLeaf connecte restaurants marocains et coopératives agricoles — sans intermédiaires, sans commissions.',
      cta: "S'inscrire gratuitement", scroll: 'Défiler',
    },
    about: {
      h1: 'À propos de', h2: 'GreenLeaf',
      body: "Depuis 2024, nous donnons aux restaurants marocains un accès direct aux meilleures coopératives et fermes du pays. Zéro commission, paiement sécurisé, livraison garantie en 24h. Nous croyons qu'un bon plat commence par un bon producteur, payé justement.",
      cta: 'Voir comment ça marche',
    },
    services: {
      eyebrow: 'Le parcours', h1: 'Comment ', h2: '',
      items: [
        { name: 'Parcourez', body: "Recherchez dans les inventaires en direct de fermes et coopératives vérifiées partout au Maroc." },
        { name: 'Commandez', body: "Chat intégré, négociation, confirmation logistique — en moins de 5 minutes depuis l'app." },
        { name: 'Recevez', body: "Suivi temps réel. Paiement escrow libéré à réception. Facture générée automatiquement." },
        { name: 'Listez', body: "Les fournisseurs uploadent produits, prix et stocks — visibles instantanément par les restaurants actifs." },
        { name: 'Encaissez', body: "Fonds versés automatiquement à confirmation de livraison. Export comptable disponible." },
      ],
    },
    categories: {
      h1: 'Ce que vous', h2: 'trouverez ici.',
      items: [
        { num: '01', title: 'Légumes & Fruits', desc: 'Produits frais de saison en direct des fermes.' },
        { num: '02', title: 'Viandes & Volailles', desc: 'Viandes locales de première qualité, tracées et certifiées.' },
        { num: '03', title: 'Épices & Herbes', desc: 'Saveurs authentiques du terroir marocain.' },
        { num: '04', title: 'Épicerie Sèche', desc: 'Céréales, farines, légumineuses et huiles.' },
        { num: '05', title: 'Boissons', desc: 'Jus frais, thés, cafés et sirops artisanaux.' },
      ],
    },
    faq: {
      eyebrow: 'Questions fréquentes', h1: 'On est là,', h2: 'à chaque étape.',
      sub: "Des questions sur les paiements, délais ou fournisseurs ? Notre équipe est disponible 7j/7.",
      cta: "Centre d'aide",
      items: [
        { q: 'La livraison est-elle garantie en 24h ?', a: "Oui. Commandes avant 14h = livraison le lendemain matin. Engagement contractuel du fournisseur." },
        { q: 'Comment fonctionne le paiement escrow ?', a: "Votre paiement est bloqué jusqu'à confirmation de réception. Aucun risque de perte." },
        { q: 'Comment les fournisseurs sont-ils vérifiés ?', a: "Contrôle docs légaux + visite terrain + 30 jours d'essai avec suivi qualité continu." },
        { q: "Y a-t-il des frais d'abonnement ou de commission ?", a: "Zéro commission, zéro abonnement. GreenLeaf est 100% gratuit pour tous." },
        { q: 'Puis-je commander chez plusieurs fournisseurs à la fois ?', a: "Oui. Un seul panier, plusieurs fournisseurs. Facturation séparée, suivi centralisé." },
      ],
    },
    finalCta: {
      l1: 'Approvisionnez', l2: 'mieux, dès', l3: "aujourd'hui.",
      cta: 'Créer mon compte',
    },
    rolePicker: {
      title: 'Vous êtes...', sub: 'Choisissez votre profil pour continuer.',
      restaurant: 'Restaurant', restaurantD: "J'achète des produits pour mon restaurant",
      fournisseur: 'Fournisseur', fournisseurD: 'Je vends mes produits à des restaurants',
    },
    email: { title: 'Restez connecté', sub: 'Nouveaux fournisseurs, tendances prix et offres exclusives.', cta: "S'inscrire", done: 'Inscrit · Merci !' },
    footer: {
      desc: 'Première marketplace  du Maroc connectant restaurants et coopératives agricoles.',
      copy: '© 2026 GreenLeaf Maroc',
      cols: [
        { title: 'Régions', links: ['Casablanca-Settat', 'Souss-Massa', 'Marrakech-Safi', 'Fès-Meknès', 'Tanger-Tétouan'] },
{ title: 'Société', links: ['À propos', 'Support', 'Conditions', 'Conditions de marque', 'Confidentialité'] },      ],
      demo: 'Accès démo ·',
    },
  },
  en: {
    nav: { about: 'About', how: 'How it works', suppliers: 'Suppliers', join: 'Join →', login: 'Sign in', dashboard: 'Dashboard' },
    hero: {
      h1: 'From the soil', h2: 'to your', h3: 'kitchen.',
      sub: 'GreenLeaf connects Moroccan restaurants directly to farming cooperatives — no middlemen, no commissions.',
      cta: 'Sign up for free', scroll: 'Scroll',
    },
    about: {
      h1: 'About', h2: 'GreenLeaf',
      body: "Since 2024 we've given Moroccan restaurants direct access to the country's best cooperatives and farms. Zero commission, secure payment, guaranteed 24h delivery. We believe a great dish starts with a producer who's paid fairly.",
      cta: 'See how it works',
    },
    services: {
      eyebrow: 'The journey', h1: 'How ', h2: '',
      items: [
        { name: 'Browse', body: "Search live inventories from verified farms and cooperatives all across Morocco." },
        { name: 'Order', body: "Built-in chat, negotiation, logistics confirmation — under 5 minutes from the app." },
        { name: 'Receive', body: "Real-time tracking. Escrow payment released on receipt. Invoice auto-generated." },
        { name: 'List', body: "Suppliers upload products, prices and stock — instantly visible to active restaurants." },
        { name: 'Get paid', body: "Funds auto-deposited on delivery confirmation. Accounting export available." },
      ],
    },
    categories: {
      h1: 'What you can', h2: 'find here.',
      items: [
        { num: '01', title: 'Vegetables & Fruits', desc: 'Fresh seasonal produce direct from farms.' },
        { num: '02', title: 'Meat & Poultry', desc: 'Premium local meats, tracked and certified.' },
        { num: '03', title: 'Spices & Herbs', desc: 'Authentic flavors from the Moroccan terroir.' },
        { num: '04', title: 'Dry Goods', desc: 'Grains, flours, legumes and oils.' },
        { num: '05', title: 'Drinks', desc: 'Fresh juices, teas, coffees and artisanal syrups.' },
      ],
    },
    faq: {
      eyebrow: 'Frequently asked questions', h1: "We're here,", h2: 'every step.',
      sub: 'Questions about payment security, delivery times or suppliers? Our team is available 7 days a week.',
      cta: 'Help centre',
      items: [
        { q: 'Is 24h delivery really guaranteed?', a: 'Yes. Orders before 2pm = next morning delivery. Contractual commitment from every supplier.' },
        { q: 'How does escrow payment work?', a: 'Payment is held until you confirm receipt. Zero risk of loss.' },
        { q: 'How are suppliers verified?', a: 'Legal docs check + field visit + 30-day trial with ongoing quality monitoring.' },
        { q: 'Are there subscription fees or commissions?', a: 'Zero commission, zero subscription. GreenLeaf is 100% free for everyone.' },
        { q: 'Can I order from multiple suppliers at once?', a: 'Yes. One cart, multiple suppliers. Separate invoicing, centralised tracking.' },
      ],
    },
    finalCta: {
      l1: 'Source smarter,', l2: 'starting', l3: 'today.',
      cta: 'Create my account',
    },
    rolePicker: {
      title: 'You are...', sub: 'Pick your profile to continue.',
      restaurant: 'Restaurant', restaurantD: "I'm buying products for my restaurant",
      fournisseur: 'Supplier', fournisseurD: "I'm selling products to restaurants",
    },
    email: { title: 'Stay connected', sub: 'New suppliers, price trends and exclusive offers.', cta: 'Subscribe', done: 'Subscribed · Thank you!' },
    footer: {
      desc: 'First marketplace in Morocco connecting restaurants and regional farming cooperatives.',
      copy: '© 2026 GreenLeaf Morocco',
      cols: [
        { title: 'Regions', links: ['Casablanca-Settat', 'Souss-Massa', 'Marrakech-Safi', 'Fès-Meknès', 'Tanger-Tétouan'] },
{ title: 'Company', links: ['About', 'Support', 'Terms', 'Brand Terms', 'Privacy'] },      ],
      demo: 'Demo access ·',
    },
  },
};

/* ───────────────────────────────────────────────────────────────────────────
   FOOTER "COMPANY" INFO CARDS — content + slug↔icon mapping
   ─────────────────────────────────────────────────────────────────────────── */
const FOOTER_INFO_SLUGS = ['about', 'support', 'terms','brandTerms', 'privacy'];

const LEGAL_CONTENT = {
  about: {
    fr: { title: 'À propos', body: "Depuis 2024, nous donnons aux restaurants marocains un accès direct aux meilleures coopératives et fermes du pays. Zéro commission, paiement sécurisé, livraison garantie en 24h." },
    en: { title: 'About', body: "Since 2024 we've given Moroccan restaurants direct access to the country's best cooperatives and farms. Zero commission, secure payment, guaranteed 24h delivery." },
  },
  support: {
    fr: { title: 'Support', body: "Des questions sur les paiements, délais ou fournisseurs ? Notre équipe est disponible 7j/7. Contactez-nous à support@greenleaf.ma." },
    en: { title: 'Support', body: "Questions about payments, delivery times or suppliers? Our team is available 7 days a week. Contact us at support@greenleaf.ma." },
  },
  terms: {
    fr: { title: 'Conditions générales', body: "En utilisant GreenLeaf, vous acceptez nos conditions d'utilisation, incluant nos politiques de paiement escrow, de livraison et de résolution des litiges." },
    en: { title: 'Terms of Service', body: "By using GreenLeaf, you agree to our terms of use, including our escrow payment, delivery, and dispute resolution policies." },
  },
  brandTerms: {
    fr: { title: 'Conditions de marque', body: "Ces conditions régissent l'utilisation de la marque GreenLeaf par les fournisseurs et partenaires, incluant l'usage du logo, la présentation des produits et les standards de qualité attendus sur la marketplace." },
    en: { title: 'Brand Terms of Service', body: "These terms govern how suppliers and partners use the GreenLeaf brand, including logo usage, product presentation, and the quality standards expected on the marketplace." },
  },
  privacy: {
    fr: { title: 'Confidentialité', body: "Nous protégeons vos données personnelles conformément à la loi marocaine 09-08. Vos informations ne sont jamais vendues à des tiers." },
    en: { title: 'Privacy Policy', body: "We protect your personal data in compliance with Moroccan law 09-08. Your information is never sold to third parties." },
  },
};

const INFO_ICONS = {
  about: Leaf,
  support: MessageCircle,
  terms: FileText,
  brandTerms: Handshake,
  privacy: ShieldCheck,
};

/* ───────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
   ─────────────────────────────────────────────────────────────────────────── */
export const GlobalStyles = ({ theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    :root {
      ${Object.entries(THEMES[theme]).map(([k, v]) => `${k}: ${v};`).join('\n      ')}
    }

    html {
  scroll-behavior: smooth;
}

* {
  -webkit-font-smoothing: antialiased;
}
    body { background: var(--page-bg); color: var(--page-text); transition: background 0.3s, color 0.3s; -webkit-font-smoothing: antialiased; }

    .gl-hero-heading {
      background: linear-gradient(180deg, var(--silver) 0%, var(--sulu) 100%);
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    }

    .gl-nav-link { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.20em; text-transform:uppercase; color:var(--nav-link); text-decoration:none; transition:color .2s; text-shadow:0 1px 6px rgba(0,0,0,.5); }
    .gl-nav-link:hover { color:var(--nav-link-hover); }

   
 .gl-btn-netflix {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 26px;
  background: rgba(0,0,0,0.2);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--nx-color, var(--sulu));
  border: none;
  transition: 0.5s;
}
.gl-btn-netflix:hover {
  filter: drop-shadow(0 0 8px var(--nx-color, var(--sulu))) drop-shadow(0 0 20px var(--nx-color, var(--sulu)));
  letter-spacing: 0.3em;
  color: var(--nx-hover-color, #fff);
}
.gl-btn-netflix span {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--nx-color, var(--sulu));
  pointer-events: none;
  transition: transform 0.15s ease-in-out;
  z-index: -1;
  transform: scaleY(0);
  transform-origin: bottom;
}
.gl-btn-netflix:hover span {
  transform: scaleY(1);
  transform-origin: top;
}
.gl-btn-netflix span:nth-child(even) { transform-origin: top; }
.gl-btn-netflix:hover span:nth-child(even) { transform-origin: bottom; }


    .gl-icon-btn { background:rgba(0,0,0,.32); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,.18); cursor:pointer; padding:7px 14px; display:inline-flex; align-items:center; gap:6px; transition:border-color .2s,background .2s; border-radius:20px; color:rgba(255,255,255,0.85); font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; }
.gl-icon-btn:hover { border-color:var(--sulu); background:rgba(0,0,0,.5); color:#FFF; }

    .gl-btn-p { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; background:var(--btn-primary-bg); color:var(--btn-primary-text); border:none; cursor:pointer; padding:15px 32px; display:inline-flex; align-items:center; gap:10px; transition:opacity .2s,transform .15s; font-weight:500; }
    .gl-btn-p:hover { opacity:var(--btn-primary-hover); transform:translateY(-1px); }

    .gl-btn-g { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; background:rgba(0,0,0,.42); backdrop-filter:blur(10px); color:#F2F4F1; border:1px solid rgba(255,255,255,.32); cursor:pointer; padding:15px 32px; display:inline-flex; align-items:center; gap:10px; transition:border-color .2s,color .2s,background .2s,transform .15s; }
    .gl-btn-g:hover { border-color:var(--accent-color); color:#FFF; background:rgba(0,0,0,.58); transform:translateY(-1px); }

    .gl-faq-row { border-bottom:1px solid var(--page-border); }
    .gl-faq-btn { width:100%; text-align:left; background:none; border:none; padding:22px 0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:20px; }
    .gl-faq-answer { padding-bottom:22px; }
    .gl-faq-icon { transition:transform .24s ease; flex-shrink:0; }
    .gl-faq-icon.open { transform:rotate(45deg); }

    .gl-input { width:100%; background:var(--input-bg, rgba(255,255,255,.06)); border:1px solid var(--input-border, rgba(255,255,255,.12)); outline:none; padding:13px 18px; font-family:'DM Mono',monospace; font-size:11px; color:var(--input-text, var(--page-text)); letter-spacing:.10em; transition:border-color .2s; }
    .gl-input::placeholder { color:var(--input-placeholder, rgba(176,184,180,.45)); }
    .gl-input:focus { border-color:var(--accent-color); }

    .gl-marquee-row { display:flex; gap:12px; will-change:transform; }
    .gl-marquee-tile { width:300px; height:200px; border-radius:18px; overflow:hidden; flex-shrink:0; }
    .gl-marquee-tile img { width:100%; height:100%; object-fit:cover; display:block; }

    .gl-about-deco img { transition: transform .4s ease; }
    .gl-about-deco:hover img { transform: scale(1.06) rotate(-2deg); }

    .gl-service-row { border-bottom:1px solid rgba(12,12,12,.15); padding:32px 0; display:flex; align-items:center; gap:32px; transition: padding-left .25s ease, background .25s ease; }
    .gl-service-row:hover { padding-left: 14px; background: rgba(12,12,12,.03); }
    .gl-service-num { font-family:'DM Serif Display',serif; font-size:clamp(2.4rem,7vw,5rem); color:#0C0C0C; line-height:1; flex-shrink:0; width:110px; }

    @keyframes scanline { 0% { transform:translateY(-100%); } 100% { transform:translateY(100vh); } }
    @keyframes modalIn { 0% { opacity:0; transform:scale(.88) translateY(28px); filter:blur(6px); } 60% { opacity:1; transform:scale(1.015) translateY(-3px); filter:blur(0); } 100% { opacity:1; transform:scale(1) translateY(0); } }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes logoExpand { 0% { transform:translate(-50%,-50%) scale(1); opacity:1; } 45% { transform:translate(-50%,-50%) scale(9); opacity:1; } 75% { transform:translate(-50%,-50%) scale(22); opacity:1; } 100% { transform:translate(-50%,-50%) scale(44); opacity:0; } }
    @keyframes bgReveal { 0% { opacity:0; } 28% { opacity:1; } 100% { opacity:1; } }
    @keyframes glowPulse { 0%,100% { filter:drop-shadow(0 0 0 rgba(168,224,99,0)); } 50% { filter:drop-shadow(0 0 44px rgba(168,224,99,.9)); } }
    @keyframes scrollHint { 0%,100% { transform:translateY(0); opacity:.3; } 50% { transform:translateY(8px); opacity:.8; } }
    .gl-scrollhint { animation: scrollHint 2.4s ease infinite; }

    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }

    @media (max-width: 768px) {
      .gl-footer-grid { grid-template-columns: 1fr 1fr !important; }
      .gl-hero-btns { flex-direction:column !important; align-items:stretch !important; }
      .gl-hero-btns a, .gl-hero-btns button { justify-content:center !important; }
      .gl-faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      .gl-about-deco { display:none !important; }
      .gl-service-row { gap:16px !important; flex-direction: column !important; align-items: flex-start !important; }
      .gl-service-num { width: auto !important; }
      .gl-marquee-tile { width: 200px !important; height: 140px !important; }
      .gl-cat-img-half { width: 100% !important; height: 50% !important; }
      .gl-cat-img-full { width: 100% !important; height: 100% !important; }
    }

    @media (min-width: 769px) {
      .gl-cat-img-half { width: 50%; height: 100%; }
      .gl-cat-img-full { width: 100%; height: 100%; }
    }

    @media (max-width: 480px) {
      .gl-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
      .gl-marquee-tile { width: 160px !important; height: 110px !important; }
    }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `}</style>
);


const Preloader = ({ ready, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState(false);
  const readyRef = useRef(ready);

  useEffect(() => { readyRef.current = ready; }, [ready]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const cap = readyRef.current ? 100 : 90; // crawls to 90%, waits for real assets, then finishes
        if (prev >= cap) {
          if (cap === 100) {
            clearInterval(interval);
            setFlash(true); // punch: flash + content snap out first
            setTimeout(onComplete, 480); // then lift the curtain
          }
          return prev;
        }
        return Math.min(cap, prev + Math.floor(Math.random() * 8) + 3);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.15 },
      }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: '#121613', zIndex: 9999, display: 'flex', alignItems: 'flex-end',
        padding: '4vw', borderBottom: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden'
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');`}</style>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
        {/* Bars — quick, simple fade, they've done their job */}
        <motion.div
          animate={flash ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <motion.div animate={{ height: [15, 30, 10, 25, 15] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ width: 4, background: '#2BEE4B' }} />
          <motion.div animate={{ height: [25, 10, 35, 15, 25] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ width: 4, background: '#2BEE4B' }} />
          <motion.div animate={{ height: [10, 25, 15, 30, 10] }} transition={{ repeat: Infinity, duration: 1.1 }} style={{ width: 4, background: '#2BEE4B' }} />
        </motion.div>

        {/* Counter — drifts up-left and shrinks, handing off to the headline settling in above it */}
        <motion.div
          animate={flash
            ? { opacity: 0, x: -40, y: -140, scale: 0.4 }
            : { opacity: 1, x: 0, y: 0, scale: 1 }
          }
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{ fontSize: 'clamp(100px, 15vw, 200px)', fontFamily: '"Playfair Display", serif', color: '#FAFFFA', lineHeight: 0.8, letterSpacing: '-0.04em', transformOrigin: 'bottom right' }}
        >
          {progress}
        </motion.div>
      </div>
    </motion.div>
  );
};
/* ───────────────────────────────────────────────────────────────────────────
   REUSABLE PRIMITIVES
   ─────────────────────────────────────────────────────────────────────────── */
const FadeIn = ({ children, delay = 0, duration = 0.8, x = 0, y = 40, scale = 1, ...rest }) => (
  <motion.div
    initial={{ opacity: 0, x, y, scale }}
    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-80px', amount: 0.25 }}
    transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

// Logo component is imported from components/Logo



const Eyebrow = ({ children, center = false, style = {} }) => (
  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--silver)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 18, textAlign: center ? 'center' : 'left', ...style }}>
    {children}
  </p>
);

const Accent = ({ children }) => <em className="gl-hero-heading" style={{ fontStyle: 'italic' }}>{children}</em>;
const ThemeToggle = ({ theme, onToggle, lang }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
    style={{
      position: 'relative', width: 52, height: 26, padding: 0, flexShrink: 0,
      border: '1px solid rgba(255,255,255,0.18)', borderRadius: 14,
      background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(8px)',
      cursor: 'pointer', overflow: 'visible',
    }}
  >
    <motion.div
      animate={{ x: theme === 'dark' ? 26 : 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      style={{
        position: 'absolute', top: 2, left: 2,
        width: 20, height: 20, borderRadius: '50%',
        background: 'var(--sulu)', color: '#0c1410',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.span key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex' }}
          >
            <Moon size={11} />
          </motion.span>
        ) : (
          <motion.span key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex' }}
          >
            <Sun size={11} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  </motion.button>
);
/* ───────────────────────────────────────────────────────────────────────────
   NAVBAR
   ─────────────────────────────────────────────────────────────────────────── */
const Navbar = ({ theme, onTheme, lang, onLang, t, onLogoClick, onLoginClick, onSignupClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const role = user?.role?.toLowerCase() || '';
  const navigate = useNavigate();
  const connexionBtnRef = useRef(null);
const rejoindreBtnRef = useRef(null);

useEffect(() => {
  const initBars = (btn) => {
    if (!btn || btn.dataset.barsInit) return;
    btn.dataset.barsInit = 'true';
    const width = btn.offsetWidth;
    const barCount = 60;
    const spacing = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const span = document.createElement('span');
      span.style.left = `${i * spacing}px`;
      span.style.width = `${spacing + 0.5}px`;
      span.style.transitionDelay = `${Math.random() * 0.25}s`;
      btn.appendChild(span);
    }
  };
  initBars(connexionBtnRef.current);
  initBars(rejoindreBtnRef.current);
}, []);
  const getDashboardPath = useCallback(() => {
  if (role === 'admin') return '/gl/c0ns0le';
  if (role === 'fournisseur') return '/fournisseur/dashboard';
  return '/browse';
}, [role]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [mobileMenuOpen]);

  return (
    <>
      <nav role="navigation" aria-label="Navigation principale" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? 'var(--nav-bg)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none', transition: 'all 0.35s ease' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }} className="px-mobile-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>

            {/* Left Desktop: Toggles */}
            <div className="hidden-mobile" style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
              <ThemeToggle theme={theme} onToggle={onTheme} lang={lang} />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gl-icon-btn"
                onClick={onLang}
                style={{ borderRadius: 20 }}
              >
                <Globe size={12} aria-hidden />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'inline-block' }}
                  >
                    {lang === 'fr' ? 'EN' : 'FR'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Center: Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <button onClick={() => { setMobileMenuOpen(false); onLogoClick(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="GreenLeaf — retour à l'accueil">
                <Logo textColor={scrolled || mobileMenuOpen ? 'var(--text)' : '#ffffff'} leafColor={scrolled || mobileMenuOpen ? 'var(--sulu)' : '#50DE68'} subtextColor={scrolled || mobileMenuOpen ? 'var(--silver)' : 'rgba(255,255,255,0.7)'} />
              </button>
            </div>

            {/* Right Desktop: Auth */}
            <div className="hidden-mobile" style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
              {isAuthenticated ? (
                <Link to={getDashboardPath()} className="gl-nav-link" style={{ color: 'var(--sulu)' }}>{t.nav.dashboard}</Link>
              ) : (
                <>
                  <button
                    ref={connexionBtnRef}
                    onClick={onLoginClick}
                    className="gl-btn-netflix"
                  >
                    {t.nav.login}
                  </button>

                  <button
                    ref={rejoindreBtnRef}
                    onClick={onSignupClick}
                    className="gl-btn-netflix"
                    style={{ '--nx-color': '#0c1410', '--nx-hover-color': 'var(--sulu)', background: 'var(--sulu)' }}
                  >
                    {t.nav.join}
                  </button>
                </>
              )}
            </div>

            {/* Mobile: Hamburger */}
            <div className="mobile-only" style={{ display: 'none', flex: 1, justifyContent: 'flex-end' }}>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: scrolled || mobileMenuOpen ? 'var(--text)' : '#ffffff', cursor: 'pointer', padding: '8px' }}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            {/* Inline CSS just for this component to show/hide mobile button */}
            <style>{`
              @media (max-width: 768px) {
                .mobile-only { display: flex !important; }
              }
            `}</style>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: 70, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 49, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isAuthenticated ? (
                <button onClick={() => { setMobileMenuOpen(false); navigate(getDashboardPath()); }} className="gl-btn-p" style={{ padding: '14px 20px', fontSize: 12, background: 'var(--sulu)', color: '#0c1410', width: '100%' }}>
                  {t.nav.dashboard}
                </button>
              ) : (
                <>
                  <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="gl-nav-link" style={{ color: 'var(--text)', background: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px', fontSize: 14, width: '100%', textAlign: 'center' }}>
                    {t.nav.login}
                  </button>
                  <button onClick={() => { setMobileMenuOpen(false); onSignupClick(); }} className="gl-btn-p" style={{ padding: '14px', fontSize: 14, background: 'var(--sulu)', color: '#0c1410', width: '100%', textAlign: 'center' }}>
                    {t.nav.join}
                  </button>
                </>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: 'var(--textMid)' }}>Theme</span>
              <ThemeToggle theme={theme} onToggle={onTheme} lang={lang} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: 'var(--textMid)' }}>Language</span>
              <button className="gl-icon-btn" onClick={onLang} style={{ borderRadius: 20 }}>
                <Globe size={12} style={{ marginRight: 6 }} />
                <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ───────────────────────────────────────────────────────────────────────────
   1. HERO — Spline 3D scene background, content overlaid on top
   ─────────────────────────────────────────────────────────────────────────── */

const HeroSection = ({ t, revealed = true, onSignupClick }) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  // remove isLoading and hasError states — not needed anymore

  return (
    <section style={{
      height: '100vh',
      minHeight: 'min(700px, 100svh)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      background: 'var(--bg)',
      color: '#FFF' // Ensure text is visible during load
    }}>



      {/* 3. Background Image */}
      <img
        src={ctaBg}
        alt=""
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: isDark
            ? 'brightness(0.5) saturate(0.8)'
            : 'brightness(1.1) saturate(1.2)',
          transition: 'filter 0.8s ease',
        }}
      />

      {/* 4. Overlays (Darken for text readability) */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(168,224,99,0.15) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* 5. Content (Z-Index 2) */}
      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(80px, 15vw, 120px) clamp(16px, 4vw, 32px) 0', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 1.08 }}
          animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: 'var(--silver)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.hero.eyebrow}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 1.12 }}
          animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          <h1 className="gl-hero-heading" style={{ fontFamily: 'DM Serif Display,Georgia,serif', fontWeight: 400, fontSize: 'clamp(48px, 9vw, 132px)', lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: 10 }}>
            {t.hero.h1}<br />{t.hero.h2}<br />{t.hero.h3}
          </h1>
        </motion.div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 clamp(16px, 4vw, 32px) clamp(32px, 6vw, 56px)', gap: 20, flexWrap: 'wrap' }}>
        <FadeIn delay={0.35} y={20}>
          <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 'clamp(11px,1.4vw,15px)', color: 'var(--silver)', letterSpacing: '0.08em', lineHeight: 1.8, maxWidth: 280, textTransform: 'uppercase' }}>
            {t.hero.sub}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="gl-hero-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={onSignupClick} className="gl-btn-p">{t.hero.cta} <ArrowRight size={14} aria-hidden /></button>
        </FadeIn>
      </div>

      <div className="gl-scrollhint" style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} aria-hidden>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'var(--silverLo)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>{t.hero.scroll}</span>
        <ChevronDown size={14} color="var(--silverLo)" />
      </div>
    </section>
  );
};


/* ───────────────────────────────────────────────────────────────────────────
   2. MARQUEE — two rows, scroll-linked, opposite directions
   ─────────────────────────────────────────────────────────────────────────── */
const MarqueeSection = () => {
  const row1 = [...IMGS.marquee.slice(0, 7), ...IMGS.marquee.slice(0, 7), ...IMGS.marquee.slice(0, 7)];
  const row2 = [...IMGS.marquee.slice(7), ...IMGS.marquee.slice(7), ...IMGS.marquee.slice(7)];

  return (
    <section style={{ background: 'var(--bg)', padding: '60px 0', overflow: 'hidden' }} aria-label="Notre marché">
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .gl-marquee-track-left {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: marquee-left 28s linear infinite;
        }
        .gl-marquee-track-right {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: marquee-right 32s linear infinite;
          margin-top: 12px;
        }
        .gl-marquee-track-left:hover,
        .gl-marquee-track-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div style={{ overflow: 'hidden' }}>
        <div className="gl-marquee-track-left">
          {row1.map((src, i) => (
            <div key={i} className="gl-marquee-tile">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="gl-marquee-track-right">
          {row2.map((src, i) => (
            <div key={i} className="gl-marquee-tile">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────────────────────────────────
   3. ABOUT
   ─────────────────────────────────────────────────────────────────────────── */
const AboutSection = ({ t }) => (
  <section id="about" style={{ background: 'var(--bg)', position: 'relative', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', overflow: 'hidden' }}>
    <FadeIn delay={0.1} x={-80} duration={0.9} className="gl-about-deco" style={{ position: 'absolute', top: '6%', left: '4%' }}>
      <img src={IMGS.aboutTL} alt="" loading="lazy" style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 20, filter: 'var(--imgFilter)' }} />
    </FadeIn>
    <FadeIn delay={0.25} x={-80} duration={0.9} className="gl-about-deco" style={{ position: 'absolute', bottom: '8%', left: '8%' }}>
      <img src={IMGS.aboutBL} alt="" loading="lazy" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 20, filter: 'var(--imgFilter)' }} />
    </FadeIn>
    <FadeIn delay={0.15} x={80} duration={0.9} className="gl-about-deco" style={{ position: 'absolute', top: '6%', right: '4%' }}>
      <img src={IMGS.aboutTR} alt="" loading="lazy" style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 20, filter: 'var(--imgFilter)' }} />
    </FadeIn>
    <FadeIn delay={0.3} x={80} duration={0.9} className="gl-about-deco" style={{ position: 'absolute', bottom: '8%', right: '8%' }}>
      <img src={IMGS.aboutBR} alt="" loading="lazy" style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 20, filter: 'var(--imgFilter)' }} />
    </FadeIn>

    <FadeIn delay={0} y={20}>
      <Eyebrow center>{t.about.eyebrow}</Eyebrow>
    </FadeIn>
    <FadeIn delay={0.1} y={40}>
      <h2 className="gl-hero-heading" style={{
        fontFamily: 'DM Serif Display,serif', fontWeight: 400, fontSize: 'clamp(40px,8vw,100px)'
        , textTransform: 'uppercase', lineHeight: 0.95, textAlign: 'center', marginBottom: 40
      }}>
        {t.about.h1}<br />{t.about.h2}
      </h2>
    </FadeIn>
    <FadeIn delay={0.2} y={20}>
      <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 'clamp(13px,1.6vw,16px)', color: 'var(--textMid)', textAlign: 'center', lineHeight: 1.9, letterSpacing: '0.03em', maxWidth: 580 }}>
        {t.about.body}
      </p>
    </FadeIn>
  </section>
);



const SERVICE_ICONS = [Search, ShoppingCart, Truck, ListPlus, Wallet];

const ServicesSection = ({ t }) => (
  <section id="how" style={{ background: '#FFFFFF', borderRadius: '40px 40px 0 0', padding: '100px 24px' }} aria-label="Comment ça marche">
    <div style={{
      marginBottom: 70, fontFamily: 'DM Serif Display,serif', fontWeight: 400, fontSize: 'clamp(40px,7vw,90px)'
      , color: '#0C0C0C', textTransform: 'uppercase', lineHeight: 0.95, textAlign: 'center'
    }}>
      <ScrollFloat animationDuration={2} ease="back.inOut(2)" scrollStart="center bottom+=50%" scrollEnd="bottom bottom-=40%" stagger={0.03}>
        {`${t.services.h1} ${t.services.h2}`}
      </ScrollFloat>
    </div>
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {t.services.items.map((s, i) => {
        const Ic = SERVICE_ICONS[i % SERVICE_ICONS.length];
        const fromLeft = i % 2 === 0;
        return (
          <FadeIn key={i} delay={i * 0.1} x={fromLeft ? -40 : 40} y={0}>
            <div className="gl-service-row">
              <span className="gl-service-num" style={{ color: '#1F8F4E' }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid rgba(12,12,12,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ic size={18} color="#1F8F4E" strokeWidth={1.6} aria-hidden />
              </div>
              <div>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: 'clamp(14px,2.2vw,20px)', fontWeight: 500, color: '#0C0C0C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{s.name}</div>
                <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 'clamp(11px,1.5vw,13px)', color: '#0C0C0C', opacity: 0.6, lineHeight: 1.8, maxWidth: 520 }}>{s.body}</p>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  </section>
);

const CategoriesSection = ({ t, lang }) => (
  <section id="suppliers" style={{
    background: 'var(--bg)', borderRadius: '40px 40px 0 0', position: 'relative', zIndex: 10, padding: '80px 24px 0px', marginTop: -60
  }}>
    <div style={{ overflow: 'hidden' }}>
      <h2 style={{
        fontFamily: 'DM Serif Display,serif',
        fontWeight: 400,
        fontSize: 'clamp(28px,7vw,110px)',
        textTransform: 'uppercase',
        lineHeight: 0.95,
        textAlign: 'center',
        marginBottom: 60
      }}>
        <FadeIn delay={0.1} y={40}>
          <span style={{ display: 'block', whiteSpace: 'nowrap', color: 'var(--text)' }}>{t.categories.h1}</span>
        </FadeIn>
        <FadeIn delay={0.22} y={40}>
          <span className="gl-hero-heading" style={{ display: 'block', whiteSpace: 'nowrap' }}>{t.categories.h2}</span>
        </FadeIn>
      </h2>
    </div>

    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <ScrollStack key={lang} useWindowScroll={true} itemDistance={137} itemStackDistance={40} stackPosition="25%" scaleEndPosition="5%">
        {t.categories.items.map((cat, i) => (
          <ScrollStackItem key={i}>
            <div style={{
              borderRadius: 36,
              border: '2px solid var(--border2)',
              background: 'var(--bg2)',
              padding: 'clamp(28px, 4vw, 40px) clamp(24px, 4vw, 48px)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              height: 'clamp(380px, 55vh, 480px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex' }} className="flex-col-mobile">
                {IMGS.categories[i].map((imgSrc, imgIdx, arr) => (
                  <img key={imgIdx} src={imgSrc} alt="" loading="lazy" className={arr.length > 1 ? 'gl-cat-img-half' : 'gl-cat-img-full'} style={{ objectFit: 'cover', filter: 'brightness(1)' }} />
                ))}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              </div>
              <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'DM Serif Display,serif', fontSize: 'clamp(3rem, 7vw, 4.5rem)', color: 'var(--sulu)', lineHeight: 1 }}>{cat.num}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 'clamp(28px, 4.5vw, 48px)', color: '#FFF', textTransform: 'uppercase', marginBottom: 16 }}>{cat.title}</h3>
                  <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 'clamp(12px, 1.5vw, 15px)', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', maxWidth: 400, lineHeight: 1.6 }}>{cat.desc}</p>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  </section>
);

/* ───────────────────────────────────────────────────────────────────────────
   FAQ  ·  FINAL CTA  ·  EMAIL  ·  FOOTER
   ─────────────────────────────────────────────────────────────────────────── */
const FAQ = ({ t }) => {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ background: 'var(--bg2)', padding: 'clamp(48px, 10vw, 96px) clamp(16px, 4vw, 32px)', border: 'none', position: 'relative' }} aria-label="Questions fréquentes">

      {/* top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 200, pointerEvents: 'none', zIndex: 2,
        background: 'linear-gradient(to bottom, var(--bg), transparent)'
      }} />

      {/* bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, pointerEvents: 'none', zIndex: 2,
        background: 'linear-gradient(to top, #000, transparent)'
      }} />

      <div style={{ position: 'relative', zIndex: 3, maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 76 }} className="gl-faq-grid">
        <div>
          <Eyebrow>{t.faq.eyebrow}</Eyebrow>
          <h2 style={{ fontFamily: 'DM Serif Display,serif', fontWeight: 400, fontSize: 'clamp(28px,4vw,50px)', color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1, marginBottom: 28 }}>
            {t.faq.h1}<br /><Accent>{t.faq.h2}</Accent>
          </h2>
          <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, color: 'var(--silver)', lineHeight: 1.9, letterSpacing: '0.07em', marginBottom: 36 }}>{t.faq.sub}</p>
          <Link to="/support" className="gl-btn-g" style={{ fontSize: 10, padding: '12px 24px' }}>{t.faq.cta} <ArrowRight size={13} aria-hidden /></Link>
        </div>
        <div>
          {t.faq.items.map((faq, i) => (
            <div key={i} className="gl-faq-row">
              <button className="gl-faq-btn" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`faq-answer-${i}`} id={`faq-btn-${i}`}>
                <span style={{ fontFamily: 'DM Serif Display,serif', fontSize: 17, color: open === i ? 'var(--blue)' : 'var(--textMid)', lineHeight: 1.3, transition: 'color 0.18s' }}>{faq.q}</span>
                <Plus size={14} color="var(--silverMd)" className={`gl-faq-icon${open === i ? ' open' : ''}`} aria-hidden />
              </button>
              {open === i && (
                <div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="gl-faq-answer">
                  <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, color: 'var(--silver)', lineHeight: 1.9, letterSpacing: '0.06em' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────────────────────────────────
   FINAL CTA
   ─────────────────────────────────────────────────────────────────────────── */

const FinalCTA = ({ t, onSignupClick }) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <section style={{
      position: 'relative',
      minHeight: 540,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
    }} aria-label="Inscription">

      <style>{`
        @keyframes tvFlicker {
          0%,100% { opacity: 1; }
          92%      { opacity: 1; }
          93%      { opacity: 0.85; }
          94%      { opacity: 1; }
          96%      { opacity: 0.9; }
          97%      { opacity: 1; }
        }
        @keyframes tvGlowPulse {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.04); }
        }
      `}</style>



      {/* ── ACTUAL IMAGE via img tag ── */}
      <img
        src={isDark ? ctaBgDark : ctaBgLight}
        alt=""
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: isDark
            ? 'brightness(0.4) saturate(0.6)'
            : 'brightness(0.85) saturate(1)',
          transition: 'filter 0.8s ease',
        }}
      />

      {/* ── CINEMATIC VIGNETTE ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `radial-gradient(ellipse 60% 55% at 50% 50%, 
          transparent 0%, 
          rgba(0,0,0,0.35) 40%, 
          rgba(0,0,0,0.75) 70%, 
          rgba(0,0,0,0.95) 100%)`,
        pointerEvents: 'none',
      }} />

      {/* ── DARK MODE ONLY ── */}
      {isDark && (
        <>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: `radial-gradient(ellipse 60% 55% at 50% 50%, 
              transparent 0%, 
              rgba(0,0,0,0.4) 45%, 
              rgba(0,0,0,0.82) 75%, 
              rgba(0,0,0,0.97) 100%)`,
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%', height: '80%',
            background: 'radial-gradient(ellipse, rgba(160,200,255,0.45) 0%, rgba(100,150,255,0.20) 40%, transparent 70%)',
            filter: 'blur(35px)',
            animation: 'tvGlowPulse 4s ease-in-out infinite',
            zIndex: 2,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }} />

          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30%', height: '35%',
            background: 'radial-gradient(ellipse, rgba(220,235,255,0.35) 0%, transparent 65%)',
            filter: 'blur(20px)',
            animation: 'tvGlowPulse 4s ease-in-out infinite 0.5s',
            zIndex: 2,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }} />
        </>
      )}
      {/* ── CONTENT ── */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(48px, 10vw, 80px) clamp(16px, 4vw, 32px)',
        width: '100%',
      }}>
        <Eyebrow center style={{ marginBottom: 22, color: isDark ? 'rgba(140,180,255,0.7)' : 'var(--silver)' }}>
          {t.finalCta.eyebrow}
        </Eyebrow>
        <h2 style={{
          fontFamily: 'DM Serif Display,serif',
          fontSize: 'clamp(34px,6vw,78px)',
          fontWeight: 400,
          textTransform: 'uppercase',
          lineHeight: 0.95,
          letterSpacing: '0.04em',
          marginBottom: 46,
          color: isDark ? '#e8f0ff' : '#FFF',
          textShadow: isDark ? '0 0 60px rgba(120,160,255,0.25), 0 2px 20px rgba(0,0,0,0.8)' : 'none',
          transition: 'all 0.8s ease',
        }}>
          {t.finalCta.l1}<br /><Accent>{t.finalCta.l2}</Accent><br />{t.finalCta.l3}
        </h2>
        <div className="gl-hero-btns" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={onSignupClick} className="gl-btn-p" style={{ padding: '10px 20px', fontSize: 10, background: 'var(--sulu)', color: '#0c1410' }}>
            {t.finalCta.cta}
          </button>
        </div>
      </div>
    </section>
  );
};

const EmailSignup = ({ t }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const handleSubmit = (e) => { e.preventDefault(); if (!email) return; setStatus('loading'); setTimeout(() => setStatus('done'), 1200); };
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(40px, 8vw, 76px) clamp(16px, 4vw, 32px)', borderTop: '1px solid var(--border)' }} aria-label="Newsletter">
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 30, fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{t.email.title}</h3>
        <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: 'var(--silver)', letterSpacing: '0.11em', marginBottom: 28 }}>{t.email.sub}</p>
        {status === 'done' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '18px 24px', border: '1px solid var(--border)', background: 'var(--suluLo)' }}>
            <CheckCircle size={16} color="var(--sulu)" aria-hidden />
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: 'var(--sulu)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{t.email.done}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', border: '1px solid var(--border)' }}>
            <label htmlFor="email-signup" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Email</label>
            <input id="email-signup" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="EMAIL" required className="gl-input" style={{ flex: 1, border: 'none' }} />
            <button type="submit" className="gl-btn-p" style={{ borderRadius: 0 }} disabled={status === 'loading'}>{status === 'loading' ? '...' : <>{t.email.cta} <ArrowRight size={13} aria-hidden /></>}</button>
          </form>
        )}
      </div>
    </section>
  );
};

const Footer = ({ t, onOpenInfo }) => (
  <footer style={{ background: 'var(--bg3)', borderTop: '1px solid var(--border)', padding: 'clamp(32px, 6vw, 60px) clamp(16px, 4vw, 32px) 28px' }}>
    <div style={{ maxWidth: 1320, margin: '0 auto' }}>
      <div className="gl-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 44, paddingBottom: 44, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
        <div>
          <div style={{ marginBottom: 18 }}><Logo /></div>
          <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: 'var(--silver)', lineHeight: 1.9, letterSpacing: '0.07em', maxWidth: 260, marginBottom: 8 }}>{t.footer.desc}</p>
          <p style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.12em' }}>{t.footer.copy}</p>
        </div>
        {t.footer.cols.map(({ title, links }, colIdx) => {
          const isCompanyCol = colIdx === t.footer.cols.length - 1; // "Société" / "Company" column — always last
          return (
            <nav key={title} aria-label={title}>
              <h4 style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 18 }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((l, i) => (
                  <li key={l}>
                    {isCompanyCol ? (
                      <button
                        onClick={() => onOpenInfo(FOOTER_INFO_SLUGS[i])}
                        style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: 'var(--silver)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', letterSpacing: '0.08em', transition: 'color 0.18s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
                      >
                        {l}
                      </button>
                    ) : (
                      <Link to="#" style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: 'var(--silver)', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 0.18s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}>{l}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{t.footer.demo}</span>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.08em' }}>restaurant@demo.com · fournisseur@demo.com · admin@demo.com</span>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'var(--silver)', letterSpacing: '0.11em' }}>MDP: demo123</span>
      </div>
    </div>
  </footer>
);

/* ───────────────────────────────────────────────────────────────────────────
   FOOTER "COMPANY" INFO CARD — animated modal with blurred backdrop
   ─────────────────────────────────────────────────────────────────────────── */
const InfoCard = ({ slug, lang, onClose }) => {
  const entry = LEGAL_CONTENT[slug];
  if (!entry) return null;
  const { title, body } = entry[lang] || entry.fr;
  const Icon = INFO_ICONS[slug] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, y: 30, scale: 0.94, transition: { duration: 0.22 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', perspective: 1000,
          background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 28,
          padding: '48px', maxWidth: 540, width: '100%', maxHeight: '78vh', overflowY: 'auto',
          boxShadow: '0 40px 90px rgba(0,0,0,0.45)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, var(--sulu) 0%, transparent 70%)',
            filter: 'blur(30px)', pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: 'relative', width: 56, height: 56, borderRadius: '50%',
            background: 'var(--suluLo)', border: '1px solid var(--sulu)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26,
          }}
        >
          <Icon size={22} color="var(--sulu)" strokeWidth={1.6} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          style={{
            position: 'relative', fontFamily: 'DM Serif Display,serif',
            fontSize: 'clamp(26px,4.5vw,38px)', color: 'var(--card-title)',
            textTransform: 'uppercase', marginBottom: 22, letterSpacing: '0.02em',
          }}
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            position: 'relative', fontFamily: 'DM Mono,monospace', fontSize: 13.5,
            color: 'var(--card-body)', lineHeight: 1.9, letterSpacing: '0.02em',
          }}
        >
          {body}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
/* ───────────────────────────────────────────────────────────────────────────
   ADMIN EASTER EGG — kept as-is (functional, not decorative)
   ─────────────────────────────────────────────────────────────────────────── */
const AdminModal = ({ onClose, onLogin, email, setEmail, pass, setPass, code, setCode, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Accès staff">
    <style>{`
      .admin-modal { animation: modalIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
      .admin-field { animation: fadeInUp 0.4s ease forwards; opacity: 0; }
      .admin-field:nth-child(1) { animation-delay: 0.12s; } .admin-field:nth-child(2) { animation-delay: 0.22s; }
      .admin-field:nth-child(3) { animation-delay: 0.32s; } .admin-field:nth-child(4) { animation-delay: 0.42s; } .admin-field:nth-child(5) { animation-delay: 0.52s; }
      .scanline { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(to bottom, transparent, rgba(168,224,99,0.08), transparent); animation: scanline 3s linear infinite; }
    `}</style>
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}><div className="scanline" /></div>
    <div className="admin-modal" style={{ position: 'relative', zIndex: 2, background: '#030d06', border: '1px solid rgba(168,224,99,0.25)', padding: '44px', width: 380, display: 'flex', flexDirection: 'column', gap: 16 }} onClick={e => e.stopPropagation()}>
      {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', ...pos, width: 14, height: 14, borderTop: pos.top === 0 ? '1px solid var(--sulu)' : 'none', borderBottom: pos.bottom === 0 ? '1px solid var(--sulu)' : 'none', borderLeft: pos.left === 0 ? '1px solid var(--sulu)' : 'none', borderRight: pos.right === 0 ? '1px solid var(--sulu)' : 'none' }} />
      ))}
      <div className="admin-field">
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 8, color: 'var(--sulu)', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.6 }}>/// Accès restreint</span>
        <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 32, fontWeight: 400, color: '#FFF', textTransform: 'uppercase', marginTop: 6, letterSpacing: '0.04em' }}>Staff</h2>
      </div>
      <div className="admin-field"><input className="gl-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ background: 'rgba(168,224,99,0.03)', borderColor: 'rgba(168,224,99,0.15)' }} /></div>
      <div className="admin-field"><input className="gl-input" type="password" placeholder="Mot de passe" value={pass} onChange={e => setPass(e.target.value)} style={{ background: 'rgba(168,224,99,0.03)', borderColor: 'rgba(168,224,99,0.15)' }} /></div>
      <div className="admin-field"><input className="gl-input" type="text" placeholder="Code d'accès staff" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && onLogin()} style={{ background: 'rgba(168,224,99,0.03)', borderColor: 'rgba(168,224,99,0.15)' }} /></div>
      {error && <div className="admin-field" role="alert"><span style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'var(--danger)', letterSpacing: '0.12em', background: 'var(--dangerLo)', padding: '8px 12px', display: 'block' }}>{error}</span></div>}
      <div className="admin-field"><button className="gl-btn-p" style={{ width: '100%', justifyContent: 'center', background: 'var(--sulu)', color: '#030d06' }} onClick={onLogin}>Entrer →</button></div>
    </div>
  </div>
);

const LogoTransition = () => (
  <>
    <style>{`.logo-expand { animation: logoExpand 1.8s cubic-bezier(0.16,1,0.3,1) forwards, glowPulse 0.9s ease infinite; } .bg-reveal { animation: bgReveal 0.4s ease forwards; }`}</style>
    <div className="bg-reveal" style={{ position: 'fixed', inset: 0, zIndex: 9998, background: '#030d06' }} />
    <div className="logo-expand" style={{ position: 'fixed', left: '50%', top: '50%', zIndex: 9999 }}>
      <svg width="48" height="48" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="3.5" stroke="#A8E063" strokeWidth="1.5" fill="none" />
        <path d="M6 25 C6 13 16 6 26 7 C26 18 20 26 6 25 Z" fill="none" stroke="#A8E063" strokeWidth="1.6" strokeLinejoin="round" />
        <text x="7" y="22" fontFamily="DM Serif Display,serif" fontSize="11" fill="#A8E063" fontStyle="italic">G</text>
        <text x="16" y="22" fontFamily="DM Serif Display,serif" fontSize="11" fill="#B0B8B4" fontStyle="italic">L</text>
      </svg>
    </div>
  </>
);

/* ───────────────────────────────────────────────────────────────────────────
   ROOT
   ─────────────────────────────────────────────────────────────────────────── */
/* ───────────────────────────────────────────────────────────────────────────
   ROLE PICKER — shown after the single "Sign up" CTA, before /register/:role
   ─────────────────────────────────────────────────────────────────────────── */
const RolePickerModal = ({ open, onClose, onSelect, t }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,7,6,0.72)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        onMouseDown={onClose}
        role="dialog" aria-modal="true" aria-label={t.rolePicker.title}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onMouseDown={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 420, background: 'var(--bg2, #161717)', border: '1px solid var(--border)', borderRadius: 18, padding: '30px 26px', position: 'relative' }}
        >
          <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--textMid)', cursor: 'pointer' }}>
            <X size={16} />
          </button>

          <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, fontWeight: 400, color: 'var(--text)', margin: '0 0 6px' }}>{t.rolePicker.title}</h2>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--textMid)', letterSpacing: '0.04em', marginBottom: 22 }}>{t.rolePicker.sub}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => onSelect('restaurant')}
              style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%', background: 'transparent', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sulu)'; e.currentTarget.style.background = 'rgba(129,199,132,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Store size={20} color="var(--sulu)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 15, color: 'var(--text)' }}>{t.rolePicker.restaurant}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--textLow)', marginTop: 2 }}>{t.rolePicker.restaurantD}</div>
              </div>
            </button>
            <button
              onClick={() => onSelect('fournisseur')}
              style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%', background: 'transparent', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sulu)'; e.currentTarget.style.background = 'rgba(129,199,132,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Truck size={20} color="var(--sulu)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 15, color: 'var(--text)' }}>{t.rolePicker.fournisseur}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--textLow)', marginTop: 2 }}>{t.rolePicker.fournisseurD}</div>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Home = () => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const t = T[lang];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!hasShownPreloaderThisSession);
  const [assetsReady, setAssetsReady] = useState(false);
  const [logoAnimating] = useState(false);
  const [openInfoSlug, setOpenInfoSlug] = useState(null);
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    const onLenisScroll = () => ScrollTrigger.update();
    const onTick = (time) => { lenis.raf(time * 1000); };
    lenis.on('scroll', onLenisScroll);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (hasShownPreloaderThisSession) return;
    let cancelled = false;
    const imageUrls = [ctaBg, ctaBgLight, ctaBgDark];
    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.all([...imageUrls.map(loadImage), fontsReady]).then(() => {
      if (!cancelled) setAssetsReady(true);
    });
    const safety = setTimeout(() => { if (!cancelled) setAssetsReady(true); }, 6000);
    return () => { cancelled = true; clearTimeout(safety); };
  }, []);

  const [loginOpen, setLoginOpen] = useState(false);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const handleRoleSelect = (role) => {
    setRolePickerOpen(false);
    navigate(`/register/${role}`);
  };

  const handleLogoClick = useCallback(() => {
    logoClicksRef.current += 1;
    const clicks = logoClicksRef.current;
    clearTimeout(logoTimerRef.current);
    if (clicks === 5) {
      logoClicksRef.current = 0;
      navigate('/404');
      return;
    }
    logoTimerRef.current = setTimeout(() => { logoClicksRef.current = 0; }, 2000);
  }, [navigate]);

  return (
    <>
      <GlobalStyles theme={theme} />

      <AnimatePresence mode="wait">
        {loading && (
          <Preloader
            ready={assetsReady}
            onComplete={() => {
              hasShownPreloaderThisSession = true;
              setLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      <a href="#main-content" style={{ position: 'absolute', left: -9999, top: 0, zIndex: 9999, background: 'var(--sulu)', color: '#030d06', padding: '8px 16px', fontFamily: 'DM Mono,monospace', fontSize: 11 }}
        onFocus={e => { e.currentTarget.style.left = '0'; }} onBlur={e => { e.currentTarget.style.left = '-9999px'; }}>
        Aller au contenu principal
      </a>

      <Navbar theme={theme} onTheme={toggleTheme} lang={lang} onLang={toggleLang} t={t} onLogoClick={handleLogoClick} onLoginClick={() => setLoginOpen(true)} onSignupClick={() => setRolePickerOpen(true)} />

      <main id="main-content" style={{ overflowX: 'clip' }}>
        <HeroSection t={t} revealed={!loading} onSignupClick={() => setRolePickerOpen(true)} />
        <MarqueeSection />
        <AboutSection t={t} />
        <ServicesSection t={t} lang={lang} />
        <CategoriesSection t={t} lang={lang} />
        <FAQ t={t} />
        <FinalCTA t={t} onSignupClick={() => setRolePickerOpen(true)} />
        <EmailSignup t={t} />
      </main>

      <Footer t={t} onOpenInfo={setOpenInfoSlug} />

      {logoAnimating && <LogoTransition />}

      <AnimatePresence>
        {openInfoSlug && (
          <InfoCard slug={openInfoSlug} lang={lang} onClose={() => setOpenInfoSlug(null)} />
        )}
      </AnimatePresence>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RolePickerModal open={rolePickerOpen} onClose={() => setRolePickerOpen(false)} onSelect={handleRoleSelect} t={t} />
    </>
  );
};

export default Home;