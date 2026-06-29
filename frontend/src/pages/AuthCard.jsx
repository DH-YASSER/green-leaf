import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
const THEMES = {
  dark: {
    // ─── GRANULAR COMPONENT-LEVEL VARIABLES ─────────────────────────────────
    // Global Page Styles
    '--page-bg':               '#0B0C0C',
    '--page-text':             '#FFFFFF',
    '--text-muted':            'rgba(255,255,255,0.70)',
    '--text-low':              'rgba(255,255,255,0.40)',
    '--page-border':           'rgba(255, 255, 255, 0.08)',
    '--accent-color':          '#81C784',   // green reserved for key actions
    '--accent-gold':           '#E8B86D',

    // Navbar
    '--nav-bg':                'rgba(11,12,12,0.96)',
    '--nav-border':            'rgba(255, 255, 255, 0.08)',
    '--nav-link':              'rgba(255,255,255,0.70)',
    '--nav-link-hover':        '#FFFFFF',
    '--nav-active':            '#81C784',   // key action: active state

    // Sidebar
    '--sidebar-bg':            '#161717',
    '--sidebar-border':        'rgba(255, 255, 255, 0.08)',
    '--sidebar-link':          'rgba(255,255,255,0.70)',
    '--sidebar-link-hover':    '#FFFFFF',
    '--sidebar-active-bg':     'rgba(255, 255, 255, 0.08)',
    '--sidebar-active-text':   '#81C784',   // key action: active state

    // Buttons
    '--btn-primary-bg':        '#81C784',   // key action: primary CTA
    '--btn-primary-text':      '#000000',
    '--btn-primary-hover':     '0.88',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#C7CCC9',
    '--btn-secondary-border':  'rgba(199, 204, 201, 0.30)',
    '--btn-icon-border':       'rgba(255, 255, 255, 0.08)',
    '--btn-icon-text':         '#C7CCC9',
    '--btn-icon-hover-bg':     'rgba(255, 255, 255, 0.08)',

    // Cards & Panels
    '--card-bg':               '#161717',
    '--card-border':           'rgba(255, 255, 255, 0.08)',
    '--card-title':            '#FFFFFF',
    '--card-body':             'rgba(255,255,255,0.70)',
    '--card-hover-bg':         'rgba(255, 255, 255, 0.04)',

    // Inputs
    '--input-bg':              'transparent',
    '--input-border':          'rgba(255, 255, 255, 0.08)',
    '--input-text':            '#FFFFFF',
    '--input-placeholder':     'rgba(199, 204, 201, 0.45)',
    '--input-focus-border':    '#81C784',   // key action: focus state

    // Chat
    '--chat-bubble-self':      'rgba(255, 255, 255, 0.10)',
    '--chat-bubble-other':     '#161717',
    '--chat-text-self':        '#FFFFFF',
    '--chat-text-other':       'rgba(255,255,255,0.70)',

    // Auth Page
    '--auth-panel-bg':         '#161717',

    // Status / Badges
    '--status-pending-bg':     'rgba(245,158,11,0.08)',
    '--status-pending-text':    'rgba(245,158,11,0.85)',
    '--status-success-bg':     'rgba(129,199,132,0.10)',
    '--status-success-text':   '#81C784',
    '--status-failed-bg':      'rgba(239,100,100,0.10)',
    '--status-failed-text':     'rgba(239,100,100,0.85)',
    '--status-info-bg':        'rgba(147,197,253,0.08)',
    '--status-info-text':      'rgba(147,197,253,0.85)',

    // ─── BACKWARD COMPATIBLE GLOBAL ALIASES ─────────────────────────────────
    '--bg':          '#0B0C0C',
    '--bg2':         '#161717',
    '--bg3':         '#000000',
    '--bg4':         '#1E2020',
    '--bg5':         '#252727',
    '--text':        '#FFFFFF',
    '--textMid':     'rgba(255,255,255,0.70)',
    '--textLow':     'rgba(255,255,255,0.40)',
    '--sulu':        '#81C784',
    '--suluLo':      'rgba(129, 199, 132, 0.10)',
    '--suluMd':      'rgba(129, 199, 132, 0.22)',
    '--silver':      '#C7CCC9',
    '--silverLo':    'rgba(199, 204, 201, 0.10)',
    '--silverMd':    'rgba(199, 204, 201, 0.30)',
    '--border':      'rgba(255, 255, 255, 0.08)',
    '--border2':     'rgba(255, 255, 255, 0.14)',
    '--navBg':       'rgba(11,12,12,0.96)',
    '--inputBg':     'transparent',
    '--danger':      'rgba(239,100,100,0.85)',
    '--dangerLo':    'rgba(239,100,100,0.10)',
    '--heroFilter':  'brightness(0.18) saturate(0.45)',
    '--imgFilter':   'brightness(0.55) saturate(0.7)',
    '--accent2':     '#E8B86D',
    '--amber':       'rgba(245,158,11,0.85)',
    '--amberLo':     'rgba(245,158,11,0.08)',
    '--blue':        'rgba(147,197,253,0.85)',
    '--blueLo':      'rgba(147,197,253,0.08)',
  },
  light: {
    // ─── GRANULAR COMPONENT-LEVEL VARIABLES ─────────────────────────────────
    // Global Page Styles
    '--page-bg':               '#FAFAF9',
    '--page-text':             '#241f1f',
    '--text-muted':            '#54594F',
    '--text-low':              '#84897F',
    '--page-border':           'rgba(31, 36, 33, 0.08)',
    '--accent-color':          '#4C7846',   // green reserved for key actions
    '--accent-gold':           '#E8B86D',

    // Navbar
    '--nav-bg':                'rgba(250,250,249,0.96)',
    '--nav-border':            'rgba(31, 36, 33, 0.08)',
    '--nav-link':              '#54594F',
    '--nav-link-hover':        '#1F2421',
    '--nav-active':            '#4C7846',   // key action: active state

    // Sidebar
    '--sidebar-bg':            '#FFFFFF',
    '--sidebar-border':        'rgba(31, 36, 33, 0.08)',
    '--sidebar-link':          '#54594F',
    '--sidebar-link-hover':    '#241f1f',
    '--sidebar-active-bg':     'rgba(31, 36, 33, 0.06)',
    '--sidebar-active-text':   '#4C7846',   // key action: active state

    // Buttons
    '--btn-primary-bg':        '#4C7846',   // key action: primary CTA
    '--btn-primary-text':      '#FFFFFF',
    '--btn-primary-hover':     '0.88',
    '--btn-secondary-bg':      'transparent',
    '--btn-secondary-text':    '#3D4339',
    '--btn-secondary-border':  'rgba(61, 67, 57, 0.30)',
    '--btn-icon-border':       'rgba(31, 36, 33, 0.10)',
    '--btn-icon-text':         '#3D4339',
    '--btn-icon-hover-bg':     'rgba(31, 36, 33, 0.06)',

    // Cards & Panels
    '--card-bg':               '#FFFFFF',
    '--card-border':           'rgba(31, 36, 33, 0.10)',
    '--card-title':            '#241f1f',
    '--card-body':             '#54594F',
    '--card-hover-bg':         'rgba(31, 36, 33, 0.03)',

    // Inputs
    '--input-bg':              '#FFFFFF',
    '--input-border':          'rgba(31, 36, 33, 0.18)',
    '--input-text':            '#241f1f',
    '--input-placeholder':     'rgba(61, 67, 57, 0.45)',
    '--input-focus-border':    '#4C7846',   // key action: focus state

    // Chat
    '--chat-bubble-self':      'rgba(31, 36, 33, 0.06)',
    '--chat-bubble-other':     '#F1F1EF',
    '--chat-text-self':        '#241f1f',
    '--chat-text-other':       '#54594F',

    // Auth Page
    '--auth-panel-bg':         '#FFFFFF',

    // Status / Badges
    '--status-pending-bg':     'rgba(180,120,0,0.07)',
    '--status-pending-text':    'rgba(180,120,0,0.85)',
    '--status-success-bg':     'rgba(76,120,70,0.08)',
    '--status-success-text':   '#4C7846',
    '--status-failed-bg':      'rgba(200,50,50,0.08)',
    '--status-failed-text':     'rgba(200,50,50,0.85)',
    '--status-info-bg':        'rgba(37,99,235,0.07)',
    '--status-info-text':      'rgba(37,99,235,0.85)',

    // ─── BACKWARD COMPATIBLE GLOBAL ALIASES ─────────────────────────────────
    '--bg':          '#FAFAF9',
    '--bg2':         '#FFFFFF',
    '--bg3':         '#E7E8E4',
    '--bg4':         '#FFFFFF',
    '--bg5':         '#F1F1EF',
    '--text':        '#241f1f',
    '--textMid':     '#54594F',
    '--textLow':     'rgba(31, 36, 33, 0.40)',
    '--sulu':        '#4C7846',
    '--suluLo':      'rgba(76, 120, 70, 0.08)',
    '--suluMd':      'rgba(76, 120, 70, 0.18)',
    '--silver':      '#3D4339',
    '--silverLo':    'rgba(31, 36, 33, 0.06)',
    '--silverMd':    'rgba(31, 36, 33, 0.18)',
    '--border':      'rgba(31, 36, 33, 0.08)',
    '--border2':     'rgba(31, 36, 33, 0.15)',
    '--navBg':       'rgba(250,250,249,0.96)',
    '--inputBg':     '#FFFFFF',
    '--danger':      'rgba(200,50,50,0.85)',
    '--dangerLo':    'rgba(200,50,50,0.08)',
    '--heroFilter':  'brightness(0.30) saturate(0.55)',
    '--imgFilter':   'brightness(0.75) saturate(0.85)',
    '--accent2':     '#E8B86D',
    '--amber':       'rgba(180,120,0,0.85)',
    '--amberLo':     'rgba(180,120,0,0.07)',
    '--blue':        'rgba(37,99,235,0.85)',
    '--blueLo':      'rgba(37,99,235,0.07)',
  }
};
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { LogoMark } from '../components/Logo';
import {
  Mail, Lock, Phone, MapPin, ArrowRight, ArrowLeft,
  Sun, Moon, Globe, Eye, EyeOff, Store, Truck,
} from 'lucide-react';
import {
  motion, AnimatePresence, useMotionValue, useTransform, useSpring,
} from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const flipEase = [0.65, 0, 0.35, 1];

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const cardIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};
const shakeVariant = {
  shake: {
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

// ─── ANIMATED INPUT ─────────────────────────────────────────────────────────
const AnimInput = ({ icon: Icon, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{ scale: focused ? 1.012 : 1 }}
      transition={{ duration: 0.2, ease }}
      style={{ position: 'relative' }}
    >
      {Icon && (
        <Icon
          size={14}
          color={focused ? 'var(--sulu)' : 'var(--icon-dim)'}
          style={{
            position: 'absolute', left: 16, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
            transition: 'color 0.2s',
          }}
        />
      )}
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{ ...props.style }}
      />
    </motion.div>
  );
};

// ─── SWAP (crossfades text/content when its key changes — used for lang) ───
const Swap = ({ k, children, y = 8, style }) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.span
      key={k}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -y }}
      transition={{ duration: 0.25, ease }}
      style={{ display: 'inline-block', ...style }}
    >
      {children}
    </motion.span>
  </AnimatePresence>
);

// ─── ROLE ICON (crossfades + slides when switching restaurant ↔ supplier) ──
const RoleIcon = ({ role, size = 14 }) => (
  <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={role}
        initial={{ opacity: 0, x: role === 'restaurant' ? -10 : 10, rotate: -45, scale: 0.5 }}
        animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, x: role === 'restaurant' ? 10 : -10, rotate: 45, scale: 0.5 }}
        transition={{ duration: 0.3, ease }}
        style={{ position: 'absolute', inset: 0, display: 'flex' }}
      >
        {role === 'restaurant' ? <Store size={size} color="var(--sulu)" /> : <Truck size={size} color="var(--sulu)" />}
      </motion.span>
    </AnimatePresence>
  </span>
);

// ─── FIELD WRAPPER (used on the register face) ─────────────────────────────
const Field = ({ label, children }) => (
  <div style={{ width: '100%' }}>
    <label style={{
      fontFamily: 'DM Mono, monospace', fontSize: 9,
      color: 'var(--label-color)', letterSpacing: '0.22em',
      textTransform: 'uppercase', display: 'block', marginBottom: 8,
      transition: 'color 0.5s ease',
    }}><Swap k={label}>{label}</Swap></label>
    {children}
  </div>
);

// ─── LOGO ICON SVG (shared between nav + loading screen) ──────────────────
// ─── LOGO MARK (static 4-square, matches the loading screen — no spin) ──────

// ─── LOGO ───────────────────────────────────────────────────────────────────
const Logo = () => (
  <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
    {/* same layoutId as the loading screen logo — Framer Motion flies it here */}
    <motion.div layoutId="brand-logo" transition={{ type: 'spring', stiffness: 180, damping: 22 }}>
      <LogoMark size={34} />
    </motion.div>
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        fontFamily: 'DM Serif Display, Georgia, serif',
        color: '#fff', fontSize: 16, fontWeight: 400,
        letterSpacing: '0.09em', textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      Green<span style={{ color: '#50DE68' }}>Leaf</span>
    </motion.span>
  </Link>
);

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const GlobalStyles = ({ theme }) => {
  const isDark = theme === 'dark';
  const cardVars = isDark ? {
    '--card-bg': 'rgba(7,10,8,0.82)',
    '--card-border': 'rgba(255,255,255,0.1)',
    '--card-text': '#ffffff',
    '--card-text-dim': 'rgba(255,255,255,0.5)',
    '--card-text-faint': 'rgba(255,255,255,0.4)',
    '--card-shadow': '0 30px 80px -20px rgba(0,0,0,0.7)',
    '--input-bg': 'rgba(255,255,255,0.05)',
    '--input-bg-focus': 'rgba(255,255,255,0.08)',
    '--input-border': 'rgba(255,255,255,0.09)',
    '--input-text': '#ffffff',
    '--input-placeholder': 'rgba(255,255,255,0.3)',
    '--input-shadow': '4px 4px 10px rgba(0,0,0,0.8), 1px 1px 6px rgba(255,255,255,0.05)',
    '--input-shadow-focus': '4px 4px 10px rgba(0,0,0,0.8), 1px 1px 6px rgba(80,222,104,0.15), inset 2px 2px 6px rgba(0,0,0,0.6), inset -1px -1px 4px rgba(80,222,104,0.1)',
    '--label-color': 'rgba(255,255,255,0.45)',
    '--tab-border': 'rgba(255,255,255,0.1)',
    '--tab-inactive': 'rgba(255,255,255,0.45)',
    '--tab-inactive-hover': 'rgba(255,255,255,0.75)',
    '--demo-bg': 'rgba(155,235,106,0.06)',
    '--demo-border': 'rgba(255,255,255,0.08)',
    '--icon-dim': 'rgba(255,255,255,0.4)',
    '--error-bg': 'rgba(200,60,60,0.10)',
    '--error-border': 'rgba(200,60,60,0.25)',
    '--error-text': '#F08080',
    '--scrollbar-thumb': 'rgba(255,255,255,0.15)',
  } : {
    '--card-bg': 'rgba(255,255,255,0.88)',
    '--card-border': 'rgba(17,32,26,0.10)',
    '--card-text': '#11201a',
    '--card-text-dim': 'rgba(17,32,26,0.55)',
    '--card-text-faint': 'rgba(17,32,26,0.45)',
    '--card-shadow': '0 30px 80px -20px rgba(20,40,20,0.25)',
    '--input-bg': 'rgba(17,32,26,0.04)',
    '--input-bg-focus': 'rgba(17,32,26,0.07)',
    '--input-border': 'rgba(17,32,26,0.12)',
    '--input-text': '#11201a',
    '--input-placeholder': 'rgba(17,32,26,0.4)',
    '--input-shadow': '3px 3px 8px rgba(17,32,26,0.12), -1px -1px 5px rgba(255,255,255,0.8)',
    '--input-shadow-focus': '3px 3px 8px rgba(17,32,26,0.15), -1px -1px 5px rgba(255,255,255,0.9), inset 2px 2px 5px rgba(17,32,26,0.08), inset -1px -1px 3px rgba(80,222,104,0.15)',
    '--label-color': 'rgba(17,32,26,0.5)',
    '--tab-border': 'rgba(17,32,26,0.12)',
    '--tab-inactive': 'rgba(17,32,26,0.5)',
    '--tab-inactive-hover': 'rgba(17,32,26,0.8)',
    '--demo-bg': 'rgba(86,176,40,0.10)',
    '--demo-border': 'rgba(17,32,26,0.08)',
    '--icon-dim': 'rgba(17,32,26,0.45)',
    '--error-bg': 'rgba(200,60,60,0.08)',
    '--error-border': 'rgba(200,60,60,0.25)',
    '--error-text': '#C23B3B',
    '--scrollbar-thumb': 'rgba(17,32,26,0.18)',
  };

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        ${Object.entries(THEMES[theme]).map(([k, v]) => `${k}: ${v};`).join('\n        ')}
        ${Object.entries(cardVars).map(([k, v]) => `${k}: ${v};`).join('\n        ')}
      }
      body { background: #000; transition: background 0.3s; }

      @keyframes loading-rotate {
        0%   { transform: scale(1)   rotate(0deg);   }
        20%  { transform: scale(1)   rotate(72deg);  }
        40%  { transform: scale(0.5) rotate(144deg); }
        60%  { transform: scale(0.5) rotate(216deg); }
        80%  { transform: scale(1)   rotate(288deg); }
        100% { transform: scale(1)   rotate(360deg); }
      }
      .gl-loader {
        width: 85px; height: 85px;
        display: flex; flex-wrap: wrap;
        justify-content: space-between; align-content: space-between;
        animation: loading-rotate 3s linear infinite;
      }
      .gl-loader-item { width: 40px; height: 40px; display: block; box-sizing: border-box; }
      .gl-loader-item:nth-of-type(1) { background-color:#50DE68; border-radius:20px 20px 0 20px; border-left:#fff 4px solid; border-top:#f7f7f7 4px solid; }
      .gl-loader-item:nth-of-type(2) { background-color:rgb(32,80,46); border-radius:20px 20px 20px 0; border-right:#fff 4px solid; border-top:#f7f7f7 4px solid; }
      .gl-loader-item:nth-of-type(3) { background-color:rgb(0,255,55); border-radius:20px 0 20px 20px; border-left:#fff 4px solid; border-bottom:#f7f7f7 4px solid; }
      .gl-loader-item:nth-of-type(4) { background-color:rgb(32,182,32); border-radius:0 20px 20px 20px; border-right:#fff 4px solid; border-bottom:#f7f7f7 4px solid; }

      @keyframes borderBeam { to { stroke-dashoffset: -200; } }
      @keyframes spin { to { transform: rotate(360deg); } }

      .gl-flip-shell { perspective: 1700px; }
      .gl-flipper {
        position: relative; width: 100%; height: 100%;
        transform-style: preserve-3d;
      }
      .gl-face {
        position: absolute; inset: 0;
        -webkit-backface-visibility: hidden; backface-visibility: hidden;
        display: flex; flex-direction: column;
        border: 1px solid var(--card-border);
        border-radius: 18px;
        padding: 28px 30px;
        background: var(--card-bg);
        backdrop-filter: blur(24px) saturate(120%);
        -webkit-backdrop-filter: blur(24px) saturate(120%);
        box-shadow: var(--card-shadow);
        transition: background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
      }
      /* flex children default to a min-width based on their content, which was
         pushing rows (demo hint, button labels, etc.) wider than the card and
         getting sliced off by the overflow/backface clipping above. Force them
         to actually shrink/wrap instead. */
      .gl-face, .gl-face * { min-width: 0; }
      .gl-face-back { transform: rotateY(180deg); }

      .gl-face-scroll {
        flex: 1 1 auto; overflow-y: auto; overflow-x: hidden;
        padding-right: 6px; margin-right: -6px;
      }
      .gl-face-scroll::-webkit-scrollbar { width: 4px; }
      .gl-face-scroll::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }

      .gl-icon-btn {
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
        padding: 7px 13px; display: inline-flex; align-items: center; gap: 6px;
        transition: border-color 0.2s, background 0.2s; border-radius: 20px;
        color: rgba(255,255,255,0.8); font-family: 'DM Mono', monospace; font-size: 10px;
        letter-spacing: 0.12em; text-transform: uppercase;
      }
      .gl-icon-btn:hover { border-color: var(--sulu); background: rgba(255,255,255,0.08); color: #fff; }

      .gl-btn-p {
        font-family: 'DM Mono', monospace; font-size: 11px;
        letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none;
        background: var(--sulu); color: #0c1410;
        border: none; cursor: pointer; padding: 14px 32px;
        border-radius: 10px;
        display: inline-flex; align-items: center; gap: 10px;
        font-weight: 500; width: 100%; justify-content: center;
        position: relative; overflow: hidden;
      }
      .gl-btn-p::after {
        content:''; position:absolute; inset:0;
        background: linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);
        transform: translateX(-100%);
        animation: btnShimmer 2.5s ease-in-out 1s infinite;
      }
      @keyframes btnShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      .gl-btn-p:disabled { opacity: 0.45; cursor: not-allowed; }

      .gl-btn-ghost {
        font-family: 'DM Mono', monospace; font-size: 10px;
        letter-spacing: 0.14em; text-transform: uppercase;
        background: transparent; border: 1px solid var(--tab-border);
        color: var(--card-text-dim); border-radius: 10px;
        padding: 13px 0; cursor: pointer; transition: border-color 0.2s, color 0.2s;
      }
      .gl-btn-ghost:hover { border-color: var(--tab-inactive-hover); color: var(--card-text); }

      .gl-input {
        width: 100%;
        color: var(--input-text);
        outline: none;
        padding: 10px 14px;
        font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.10em;
        background: var(--input-bg);
        border-radius: 8px;
        border: 2px solid var(--input-border);
        box-shadow: var(--input-shadow);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        appearance: none;
      }
      .gl-input::placeholder {
        color: var(--input-placeholder);
        transition: opacity 0.25s ease;
      }
      .gl-input:focus::placeholder { opacity: 0; }
      .gl-input:focus {
        transform: scale(1.02);
        border-color: var(--sulu);
        box-shadow: var(--input-shadow-focus);
      }

      .gl-select-wrap { position: relative; }
      .gl-select-wrap::after {
        content: ''; position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
        width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent;
        border-top: 5px solid var(--icon-dim); pointer-events: none;
      }
      .gl-select-wrap select.gl-input { padding-right: 36px; cursor: pointer; }
      .gl-select-wrap select.gl-input option { background: #1a1f1c; color: #fff; }

      .gl-tab-seg {
        flex: 1; font-family: 'DM Mono', monospace; font-size: 10px;
        letter-spacing: 0.18em; text-transform: uppercase; border: none;
        cursor: pointer; padding: 12px 0; transition: color 0.2s;
        background: transparent; color: var(--tab-inactive); position: relative;
      }
      .gl-tab-seg.on { color: #0c1410; font-weight: 500; }
      .gl-tab-seg:not(.on):hover { color: var(--tab-inactive-hover); }

      .gl-step-dot {
        width: 24px; height: 24px; border: 1px solid var(--tab-border);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-family: 'DM Mono', monospace; font-size: 9px; color: var(--label-color);
        flex-shrink: 0; transition: all 0.2s;
      }
      .gl-step-dot.done { background: var(--sulu); border-color: var(--sulu); color: #0c1410; font-weight: 500; }
      .gl-step-dot.active { border-color: var(--sulu); color: var(--sulu); }

      .gl-link-btn {
        background: none; border: none; padding: 0; cursor: pointer;
        font-family: 'DM Mono', monospace; color: var(--sulu);
        font-size: inherit; letter-spacing: inherit; text-decoration: none;
      }
      .gl-link-btn:hover { text-decoration: underline; }

      .gl-forgot-link {
        background: none; border: none; padding: 0; cursor: pointer;
        font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.08em;
        color: var(--card-text-faint); text-decoration: none;
        transition: color 0.2s;
      }
      .gl-forgot-link:hover { color: var(--sulu); text-decoration: underline; }

      /* When forgot-password mode is active, everything in the login face
         blurs and goes inert except elements wrapped in .gl-stay-sharp */
      .gl-blur-target {
        filter: blur(6px);
        opacity: 0.45;
        pointer-events: none;
        user-select: none;
        transition: filter 0.4s ease, opacity 0.4s ease;
      }
      .gl-stay-sharp {
        filter: none !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        user-select: auto !important;
        position: relative;
        z-index: 4;
      }
    `}</style>
  );
};

// ─── LOADING SCREEN ─────────────────────────────────────────────────────────
const LoadingScreen = ({ visible }) => (
  <>
    {/* ① Background fades out independently */}
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9997,
            background: '#070a08',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        />
      )}
    </AnimatePresence>

    {/* ② Logo — same layoutId as navbar Logo, so when this unmounts it
           flies to its final position in the top bar instead of just fading */}
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-logo"
          layoutId="brand-logo"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 1 }}           /* don't fade — let layoutId move it */
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          style={{
            position: 'fixed', zIndex: 9998,
            top: '50%', left: '50%',
            x: '-50%', y: '-50%',
          }}
        >
          {/* Framer Motion rotate — stops cleanly on exit unlike CSS animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <LogoMark size={80} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);


const ThemeToggle = ({ theme, onToggle, lang }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    aria-label={
      lang === 'fr'
        ? (theme === 'dark' ? 'Passer en mode jour' : 'Passer en mode nuit')
        : (theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode')
    }
    style={{
      position: 'relative', width: 52, height: 26, padding: 0, flexShrink: 0,
      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14,
      background: 'rgba(255,255,255,0.04)', cursor: 'pointer', overflow: 'visible',
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

// ─── BEAM BORDER (single continuous light tracing the card outline) ────────
const BeamBorder = ({ theme }) => {
  const isDark = theme === 'dark';
  const coreColor = isDark ? '#bdf28f' : '#2f8f1f';
  const glow = isDark ? 'rgba(155,235,106,0.85)' : 'rgba(47,143,31,0.6)';

  return (
    <svg
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible', zIndex: 1,
      }}
    >
      <rect
        x="1" y="1"
        width="calc(100% - 2px)" height="calc(100% - 2px)"
        rx="17" ry="17"
        fill="none"
        pathLength="200"
        stroke={coreColor}
        strokeOpacity="0.95"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="36 164"
        style={{
          animation: 'borderBeam 4s linear infinite',
          filter: `drop-shadow(0 0 5px ${glow})`,
        }}
      />
    </svg>
  );
};

// ─── VIDEO BACKGROUND (native seamless loop, fade-in, day/night grade) ─────
const VideoBackground = ({ theme, onReady }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf;
    const FADE = 0.6;

    const start = () => {
      onReady?.();
      const fadeIn = () => {
        if (!video) return;
        const opacity = Math.min(video.currentTime / FADE, 1);
        video.style.opacity = opacity;
        if (opacity < 1) raf = requestAnimationFrame(fadeIn);
      };
      video.style.opacity = 0;
      video.play().catch(() => {});
      raf = requestAnimationFrame(fadeIn);
    };

    // canplay fires as soon as the browser has buffered enough to start
    if (video.readyState >= 3) {
      start();
    } else {
      video.addEventListener('canplay', start, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('canplay', start);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <>
      <video
        ref={videoRef}
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0, zIndex: 0,
          filter: isDark
            ? 'brightness(0.42) saturate(0.75) contrast(1.15) hue-rotate(200deg)'
            : 'brightness(1) saturate(1) contrast(1) hue-rotate(0deg)',
          transition: 'filter 0.9s ease',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,16,46,0.55) 0%, rgba(8,12,34,0.35) 50%, rgba(5,8,22,0.6) 100%)',
        opacity: isDark ? 1 : 0,
        transition: 'opacity 0.9s ease',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(7,10,8,0.75) 0%, rgba(7,10,8,0.35) 35%, rgba(7,10,8,0.35) 65%, rgba(7,10,8,0.85) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(7,10,8,0.55) 0%, transparent 70%)',
      }} />
    </>
  );
};

// ─── LABELS ─────────────────────────────────────────────────────────────────
const LABELS = {
  fr: {
    home: 'Accueil', restaurant: 'Restaurant', supplier: 'Fournisseur',
    login: {
      eyebrow: 'Bon retour', h1: 'Connexion',
      sub: 'Gérez vos commandes professionnelles',
      email: 'Adresse email', password: 'Mot de passe', cta: 'Se connecter',
      switchPrompt: 'Pas encore inscrit ?', switchLink: 'Créer un compte',
      forgot: 'Mot de passe oublié ?',
    },
    forgotPassword: {
      eyebrow: 'Récupération', h1: 'Mot de passe oublié',
      sub: 'Entrez votre email pour recevoir un code de réinitialisation',
      cta: 'Envoyer',
      switchPrompt: 'Vous vous souvenez de votre mot de passe ?', switchLink: 'Se connecter',
    },
    register: {
      eyebrow: 'Inscription', h1: 'Créer un compte',
      sub: 'Rejoignez le réseau B2B direct du Maroc',
      step1: 'Compte', step2: 'Profil',
      name: 'Nom complet', email: 'Email professionnel', password: 'Mot de passe',
      company: 'Nom du restaurant', companyS: "Nom de l'entreprise",
      city: 'Ville', phone: 'Téléphone', address: 'Adresse physique',
      next: 'Continuer', back: 'Retour', cta: 'Créer mon compte',
      switchPrompt: 'Déjà inscrit ?', switchLink: 'Se connecter',
      cities: [['casablanca', 'Casablanca'], ['rabat', 'Rabat'], ['marrakech', 'Marrakech'], ['fes', 'Fès'], ['tanger', 'Tanger'], ['agadir', 'Agadir']],
    },
  },
  en: {
    home: 'Home', restaurant: 'Restaurant', supplier: 'Supplier',
    login: {
      eyebrow: 'Welcome back', h1: 'Sign In',
      email: 'Email address', password: 'Password', cta: 'Sign in',
      switchPrompt: 'No account yet?', switchLink: 'Create account',
      forgot: 'Forgot password?',
    },
    forgotPassword: {
      eyebrow: 'Recovery', h1: 'Forgot Password',
      sub: 'Enter your email to receive a code to change your password',
      cta: 'Submit',
      switchPrompt: 'Remember your password?', switchLink: 'Log in',
    },
    register: {
      eyebrow: 'Registration', h1: 'Create account',
      step1: 'Account', step2: 'Profile',
      name: 'Full name', email: 'Professional email', password: 'Password',
      company: 'Restaurant name', companyS: 'Company name',
      city: 'City', phone: 'Phone', address: 'Physical address',
      next: 'Continue', back: 'Back', cta: 'Create account',
      switchPrompt: 'Already registered?', switchLink: 'Sign in',
      cities: [['casablanca', 'Casablanca'], ['rabat', 'Rabat'], ['marrakech', 'Marrakech'], ['fes', 'Fes'], ['tanger', 'Tanger'], ['agadir', 'Agadir']],
    },
  },
};

// ─── AUTH CARD (Login + Register, flips between them) ──────────────────────
const AuthCard = ({ initialMode }) => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { role: urlRole } = useParams();
  const { login, isAuthenticated, user } = useAuthStore();

  const resolvedInitialMode =
    initialMode || (location.pathname.startsWith('/register') ? 'register' : 'login');

  const [mode, setMode] = useState(resolvedInitialMode); // 'login' | 'register'
  const [role, setRole] = useState(
    urlRole === 'fournisseur' ? 'fournisseur' : 'restaurant'
  );
  const [videoReady, setVideoReady] = useState(false);

  // ─── RATE LIMITING & ACCOUNT LOCKOUT ────────────────────────────────────
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in ms
  const RATE_WINDOW = 60 * 1000; // 1 minute window
  const RATE_LIMIT = 10; // max 10 attempts per minute (across tabs, stored in localStorage)

  const getStoredAttempts = () => {
    try {
      return JSON.parse(localStorage.getItem('gl_auth_attempts') || '{"count":0,"since":0,"locked_until":0}');
    } catch { return { count: 0, since: 0, locked_until: 0 }; }
  };
  const saveAttempts = (data) => {
    try { localStorage.setItem('gl_auth_attempts', JSON.stringify(data)); } catch {}
  };

  const [lockoutUntil, setLockoutUntil] = useState(() => {
    const d = getStoredAttempts();
    return d.locked_until > Date.now() ? d.locked_until : 0;
  });
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    if (!lockoutUntil) return;
    const tick = () => {
      const rem = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (rem <= 0) { setLockoutUntil(0); setLockoutSeconds(0); return; }
      setLockoutSeconds(rem);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockoutUntil]);

  const recordFailedAttempt = () => {
    const now = Date.now();
    const d = getStoredAttempts();
    const windowStart = now - RATE_WINDOW;
    const sinceLast = d.since < windowStart ? 0 : d.count;
    const newCount = sinceLast + 1;
    if (newCount >= MAX_ATTEMPTS) {
      const until = now + LOCKOUT_DURATION;
      saveAttempts({ count: newCount, since: d.since < windowStart ? now : d.since, locked_until: until });
      setLockoutUntil(until);
    } else {
      saveAttempts({ count: newCount, since: d.since < windowStart ? now : d.since, locked_until: 0 });
    }
    return newCount;
  };

  const clearAttempts = () => {
    saveAttempts({ count: 0, since: 0, locked_until: 0 });
    setLockoutUntil(0);
  };

  // ─── INPUT VALIDATION ────────────────────────────────────────────────────
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : (lang === 'fr' ? 'Adresse email invalide' : 'Invalid email address');
  const validatePassword = (v, isRegister = false) => {
    if (!v) return lang === 'fr' ? 'Mot de passe requis' : 'Password is required';
    if (isRegister && v.length < 8) return lang === 'fr' ? '8 caractères minimum' : 'Minimum 8 characters';
    if (isRegister && !/[A-Z]/.test(v)) return lang === 'fr' ? 'Au moins une majuscule' : 'At least one uppercase letter';
    if (isRegister && !/[0-9]/.test(v)) return lang === 'fr' ? 'Au moins un chiffre' : 'At least one number';
    return '';
  };
  const validatePhone = (v) => /^(\+?212|0)[5-7]\d{8}$/.test(v.replace(/[\s-]/g, '')) ? '' : (lang === 'fr' ? 'Numéro marocain invalide' : 'Invalid Moroccan number');

  const setFieldError = (k, msg) => setFieldErrors(p => ({ ...p, [k]: msg }));
  const clearFieldError = (k) => setFieldErrors(p => { const n = { ...p }; delete n[k]; return n; });

  // ─── LOGIN FACE STATE ────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: `${role}@demo.com`, password: 'demo123' });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // forgot-password overlay state (shown on top of the login face)
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // register face state
  const [step, setStep] = useState(1);
  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '',
    company_name: '', city: 'casablanca', phone: '', address: '',
  });
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // 3D tilt for whichever face is showing
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);
  const rawRotateX = useTransform(cardMouseY, [-300, 300], [6, -6]);
  const rawRotateY = useTransform(cardMouseX, [-300, 300], [-6, 6]);
  const tiltRotateX = useSpring(rawRotateX, { stiffness: 200, damping: 24 });
  const tiltRotateY = useSpring(rawRotateY, { stiffness: 200, damping: 24 });

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cardMouseX.set(e.clientX - rect.left - rect.width / 2);
    cardMouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleCardMouseLeave = () => { cardMouseX.set(0); cardMouseY.set(0); };

  useEffect(() => {
    if (isAuthenticated && user) {
      const r = user.role?.toLowerCase() || '';
      if (r === 'admin') navigate('/gl/c0ns0le');
      else if (r === 'restaurant') navigate('/restaurant/dashboard');
      else if (r === 'fournisseur') navigate('/fournisseur/dashboard');
      else navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const goToRegister = () => {
    setMode('register');
    // This app uses HashRouter — real routes live after the #.
    // Only rewrite the hash, leave window.location.pathname (the
    // deployed base, e.g. /green-leaf/) untouched, and use
    // replaceState (not navigate()) so no hashchange/popstate fires
    // and this component stays mounted for the flip animation.
    window.history.replaceState(
      null, '',
      `${window.location.pathname}${window.location.search}#/register/${role}`
    );
  };
  const goToLogin = () => {
    setMode('login');
    window.history.replaceState(
      null, '',
      `${window.location.pathname}${window.location.search}#/login`
    );
  };

  const handleRoleChange = (r) => {
    setRole(r);
    setLoginForm({ email: `${r}@demo.com`, password: 'demo123' });
    setLoginError('');
  };

  const handleLoginChange = (e) => {
    setLoginForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Lockout guard
    if (lockoutUntil > Date.now()) return;
    // Client-side validation
    const emailErr = validateEmail(loginForm.email);
    if (emailErr) { setFieldError('loginEmail', emailErr); setShakeKey(k => k + 1); return; }
    setLoginLoading(true); setLoginError('');
    try {
      const { data } = await axios.post('/api/auth/login', loginForm);
      clearAttempts();
      login(data.user, data.token);
      const r = data.user.role?.toLowerCase() || '';
      navigate(
        r === 'admin' ? '/gl/c0ns0le'
          : r === 'restaurant' ? '/restaurant/dashboard'
            : '/fournisseur/dashboard'
      );
    } catch (err) {
      const attempts = recordFailedAttempt();
      const remaining = MAX_ATTEMPTS - attempts;
      let msg = err.response?.data?.message || (lang === 'fr' ? 'Identifiants incorrects. Vérifiez et réessayez.' : 'Incorrect credentials. Please try again.');
      if (remaining > 0 && remaining <= 2) {
        msg += lang === 'fr' ? ` (${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''})` : ` (${remaining} attempt${remaining > 1 ? 's' : ''} left)`;
      }
      setLoginError(msg);
      setShakeKey(k => k + 1);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth — adjust URL to match your API base
    window.location.href = `${axios.defaults.baseURL || ''}/api/auth/google?role=${role}`;
  };

  const openForgot = () => {
    setForgotEmail(loginForm.email || '');
    setForgotSent(false);
    setForgotMode(true);
  };
  const closeForgot = () => {
    setForgotMode(false);
    setForgotSent(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch (err) {
      setForgotSent(true); // avoid leaking whether the email exists
    } finally {
      setForgotLoading(false);
    }
  };

  const setReg = (k, v) => setRegForm(p => ({ ...p, [k]: v }));

  const handleRegNext = (e) => {
    e.preventDefault();
    const errs = {};
    if (!regForm.name.trim()) errs.regName = lang === 'fr' ? 'Nom requis' : 'Name is required';
    const emailErr = validateEmail(regForm.email);
    if (emailErr) errs.regEmail = emailErr;
    const passErr = validatePassword(regForm.password, true);
    if (passErr) errs.regPassword = passErr;
    if (Object.keys(errs).length) { setFieldErrors(p => ({ ...p, ...errs })); return; }
    setStep(2);
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegError(''); setRegLoading(true);
    try {
      const { data } = await axios.post('/register', { ...regForm, role });
      login(data.user, data.token);
      navigate(data.user.role === 'fournisseur' ? '/fournisseur/dashboard' : '/restaurant/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = err.response?.data?.message;
      setRegError(errors ? Object.values(errors)[0][0] : msg || 'Une erreur est survenue.');
    } finally {
      setRegLoading(false);
    }
  };

  const t = LABELS[lang];
  const lg = t.login;
  const rg = t.register;

  return (
    <>
      <GlobalStyles theme={theme} />
      <LoadingScreen visible={!videoReady} />

      <div style={{
        minHeight: '100vh', width: '100vw', position: 'relative',
        background: '#070a08', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(12px, 3vw, 24px)',
      }}>
        <VideoBackground theme={theme} onReady={() => setVideoReady(true)} />

        {/* top bar */}
        <div style={{
          position: 'absolute', top: 'clamp(12px, 3vw, 24px)', left: 'clamp(12px, 3vw, 24px)', right: 'clamp(12px, 3vw, 24px)', zIndex: 3,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
        }}>
          <Logo />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)',
              padding: '8px 14px', borderRadius: 20, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              background: 'rgba(255,255,255,0.04)',
            }}>
              <ArrowLeft size={13} /><Swap k={`home-${lang}`}>{t.home}</Swap>
            </Link>
            <ThemeToggle theme={theme} onToggle={toggleTheme} lang={lang} />
            <button className="gl-icon-btn" onClick={toggleLang}>
              <Globe size={12} /><Swap k={`langbtn-${lang}`}>{lang === 'fr' ? 'EN' : 'FR'}</Swap>
            </button>
          </div>
        </div>

        {/* flip card */}
        <motion.div
          variants={cardIn} initial="hidden" animate="show"
          className="gl-flip-shell"
          style={{
            width: '100%', maxWidth: 480,
            height: 'min(680px, 90vh)',
            position: 'relative', zIndex: 2,
            rotateX: tiltRotateX, rotateY: tiltRotateY,
          }}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <motion.div
            className="gl-flipper"
            initial={false}
            animate={{ rotateY: mode === 'login' ? 0 : 180 }}
            transition={{ duration: 0.85, ease: flipEase }}
          >
            {/* ───── FRONT: LOGIN ───── */}
            <div className="gl-face">
              <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 18, flex: '0 0 auto' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>
                    <Swap k={`lg-eyebrow-${forgotMode}-${lang}`}>{forgotMode ? t.forgotPassword.eyebrow : lg.eyebrow}</Swap>
                  </span>
                  <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 30, fontWeight: 400, color: 'var(--card-text)', textTransform: 'uppercase', letterSpacing: '0.03em', margin: '8px 0 8px', transition: 'color 0.5s ease' }}>
                    <Swap k={`lg-h1-${forgotMode}-${lang}`}>{forgotMode ? t.forgotPassword.h1 : lg.h1}</Swap>
                  </h1>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--card-text-dim)', letterSpacing: '0.08em', transition: 'color 0.5s ease' }}>
                    <Swap k={`lg-sub-${forgotMode}-${lang}`}>{forgotMode ? t.forgotPassword.sub : lg.sub}</Swap>
                  </p>
                </motion.div>

                <div
                  className={forgotMode ? 'gl-blur-target' : ''}
                  style={{ display: 'flex', border: '1px solid var(--tab-border)', borderRadius: 10, marginBottom: 18, position: 'relative', overflow: 'hidden', flex: '0 0 auto' }}
                >
                  <motion.div layoutId="loginRoleTabIndicator" style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: 'var(--sulu)', borderRadius: 10, left: role === 'restaurant' ? '0%' : '50%' }} transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
                  <motion.button whileTap={{ scale: 0.96 }} className={`gl-tab-seg${role === 'restaurant' ? ' on' : ''}`} onClick={() => handleRoleChange('restaurant')} style={{ zIndex: 1 }}><Swap k={`tab-r-${lang}`}>{t.restaurant}</Swap></motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} className={`gl-tab-seg${role === 'fournisseur' ? ' on' : ''}`} onClick={() => handleRoleChange('fournisseur')} style={{ zIndex: 1 }}><Swap k={`tab-f-${lang}`}>{t.supplier}</Swap></motion.button>
                </div>

                <div className="gl-face-scroll">
                  <form onSubmit={forgotMode ? handleForgotSubmit : handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="gl-stay-sharp">
                      <label style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--label-color)', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: 8, transition: 'color 0.5s ease' }}><Swap k={`lg-email-${lang}`}>{lg.email}</Swap></label>
                      <AnimInput
                        icon={Mail} className="gl-input" name="email" type="email" required
                        placeholder="contact@restaurant.ma"
                        value={forgotMode ? forgotEmail : loginForm.email}
                        onChange={forgotMode ? (e => setForgotEmail(e.target.value)) : (e => { handleLoginChange(e); clearFieldError('loginEmail'); })}
                        style={{ paddingLeft: 44, borderColor: fieldErrors.loginEmail ? 'var(--error-border)' : undefined }}
                      />
                      {fieldErrors.loginEmail && (
                        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--error-text)', letterSpacing: '0.06em', marginTop: 5 }}>{fieldErrors.loginEmail}</p>
                      )}
                    </div>

                    <div className={forgotMode ? 'gl-blur-target' : ''}>
                      <label style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--label-color)', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: 8, transition: 'color 0.5s ease' }}><Swap k={`lg-password-${lang}`}>{lg.password}</Swap></label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={14} color="var(--icon-dim)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input className="gl-input" name="password" type={showLoginPass ? 'text' : 'password'} required placeholder="••••••••" value={loginForm.password} onChange={handleLoginChange} style={{ paddingLeft: 44, paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowLoginPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--icon-dim)', display: 'flex' }}>
                          {showLoginPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: 8 }}>
                        <button type="button" className="gl-forgot-link" onClick={openForgot}>
                          <Swap k={`lg-forgot-${lang}`}>{lg.forgot}</Swap>
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {loginError && !forgotMode && (
                        <motion.div key={shakeKey} variants={shakeVariant} animate="shake" initial={{ opacity: 0, height: 0 }} whileInView={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--error-bg)', border: '1px solid var(--error-border)', fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--error-text)', letterSpacing: '0.06em', lineHeight: 1.6 }}>{loginError}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {forgotMode && forgotSent && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                          <div className="gl-stay-sharp" style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--demo-bg)', border: '1px solid var(--demo-border)', fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--card-text-dim)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                            <Swap k={`lg-forgot-sent-${lang}`}>{lang === 'fr' ? 'Si ce compte existe, un code a été envoyé.' : "If that account exists, a code has been sent."}</Swap>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ─── LOCKOUT BANNER ─── */}
                    <AnimatePresence>
                      {lockoutUntil > Date.now() && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--error-bg)', border: '1px solid var(--error-border)', fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--error-text)', letterSpacing: '0.06em', lineHeight: 1.7, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            {lang === 'fr'
                              ? `Compte bloqué. Réessayez dans ${Math.floor(lockoutSeconds / 60)}:${String(lockoutSeconds % 60).padStart(2, '0')}`
                              : `Account locked. Try again in ${Math.floor(lockoutSeconds / 60)}:${String(lockoutSeconds % 60).padStart(2, '0')}`}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={(forgotMode ? forgotLoading : loginLoading) || lockoutUntil > Date.now()}
                      className="gl-btn-p gl-stay-sharp"
                      style={{ marginTop: 4 }}
                      whileHover={!(forgotMode ? forgotLoading : loginLoading) ? { opacity: 0.9, scale: 1.01 } : {}}
                      whileTap={!(forgotMode ? forgotLoading : loginLoading) ? { scale: 0.97 } : {}}
                      transition={{ duration: 0.15 }}
                    >
                      <AnimatePresence mode="wait">
                        {forgotMode ? (
                          forgotLoading ? (
                            <motion.span key="forgot-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0c1410', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                              {lang === 'fr' ? 'Envoi...' : 'Sending...'}
                            </motion.span>
                          ) : (
                            <motion.span key={`forgot-idle-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {t.forgotPassword.cta}
                              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}><ArrowRight size={14} /></motion.span>
                            </motion.span>
                          )
                        ) : (
                          loginLoading ? (
                            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0c1410', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                              Connexion...
                            </motion.span>
                          ) : (
                            <motion.span key={`idle-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {lg.cta}
                              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}><ArrowRight size={14} /></motion.span>
                            </motion.span>
                          )
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* ─── DIVIDER + GOOGLE AUTH ─── */}
                    {!forgotMode && (
                      <div className="gl-stay-sharp">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                          <div style={{ flex: 1, height: 1, background: 'var(--tab-border)' }} />
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--label-color)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            <Swap k={`or-${lang}`}>{lang === 'fr' ? 'ou' : 'or'}</Swap>
                          </span>
                          <div style={{ flex: 1, height: 1, background: 'var(--tab-border)' }} />
                        </div>
                        <motion.button
                          type="button"
                          onClick={handleGoogleLogin}
                          disabled={lockoutUntil > Date.now()}
                          whileHover={{ opacity: 0.88, scale: 1.01 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            padding: '13px 20px', borderRadius: 10, border: '1px solid var(--tab-border)',
                            background: 'var(--input-bg)', cursor: lockoutUntil > Date.now() ? 'not-allowed' : 'pointer',
                            fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: 'var(--card-text-dim)', transition: 'border-color 0.2s, background 0.2s',
                            opacity: lockoutUntil > Date.now() ? 0.4 : 1,
                          }}
                        >
                          {/* Google G icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          <Swap k={`google-${lang}`}>{lang === 'fr' ? 'Continuer avec Google' : 'Continue with Google'}</Swap>
                        </motion.button>
                      </div>
                    )}
                  </form>
                </div>

                <motion.p variants={fadeUp} style={{ textAlign: 'center', marginTop: 14, fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--card-text-faint)', letterSpacing: '0.10em', transition: 'color 0.5s ease', flex: '0 0 auto' }}>
                  {forgotMode ? (
                    <Swap k={`lg-forgot-switch-${lang}`}>
                      {t.forgotPassword.switchPrompt}{' '}
                      <button type="button" className="gl-link-btn" style={{ fontSize: 9, letterSpacing: '0.10em', textTransform: 'none' }} onClick={closeForgot}>
                        {t.forgotPassword.switchLink}
                      </button>
                    </Swap>
                  ) : (
                    <Swap k={`lg-switch-${lang}`}>
                      {lg.switchPrompt}{' '}
                      <button type="button" className="gl-link-btn" style={{ fontSize: 9, letterSpacing: '0.10em', textTransform: 'none' }} onClick={goToRegister}>
                        {lg.switchLink}
                      </button>
                    </Swap>
                  )}
                </motion.p>
              </motion.div>
            </div>

            {/* ───── BACK: REGISTER ───── */}
            <div className="gl-face gl-face-back">
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: 14, flex: '0 0 auto' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.30em', textTransform: 'uppercase' }}><Swap k={`rg-eyebrow-${lang}`}>{rg.eyebrow}</Swap></span>
                  <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: 'var(--card-text)', textTransform: 'uppercase', letterSpacing: '0.03em', margin: '6px 0 6px', transition: 'color 0.5s ease' }}><Swap k={`rg-h1-${lang}`}>{rg.h1}</Swap></h1>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--card-text-dim)', letterSpacing: '0.06em', transition: 'color 0.5s ease' }}><Swap k={`rg-sub-${lang}`}>{rg.sub}</Swap></p>
                </div>

                <div style={{ display: 'flex', border: '1px solid var(--tab-border)', borderRadius: 10, marginBottom: 14, position: 'relative', overflow: 'hidden', flex: '0 0 auto' }}>
                  <motion.div layoutId="registerRoleTabIndicator" style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: 'var(--sulu)', borderRadius: 10, left: role === 'restaurant' ? '0%' : '50%' }} transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
                  <motion.button whileTap={{ scale: 0.96 }} className={`gl-tab-seg${role === 'restaurant' ? ' on' : ''}`} onClick={() => setRole('restaurant')} style={{ zIndex: 1 }}><Swap k={`rtab-r-${lang}`}>{t.restaurant}</Swap></motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} className={`gl-tab-seg${role === 'fournisseur' ? ' on' : ''}`} onClick={() => setRole('fournisseur')} style={{ zIndex: 1 }}><Swap k={`rtab-f-${lang}`}>{t.supplier}</Swap></motion.button>
                </div>

                {/* step progress */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14, flex: '0 0 auto' }}>
                  <div className={`gl-step-dot ${step >= 1 ? 'done' : 'active'}`}>{step > 1 ? '✓' : '1'}</div>
                  <div style={{ flex: 1, height: 1, background: step >= 2 ? 'var(--sulu)' : 'var(--tab-border)', transition: 'background 0.3s', margin: '0 8px' }} />
                  <div className={`gl-step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                  <div style={{ marginLeft: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: step === 1 ? 'var(--sulu)' : 'var(--label-color)', letterSpacing: '0.12em', textTransform: 'uppercase' }}><Swap k={`step1-${lang}`}>{rg.step1}</Swap></span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: step === 2 ? 'var(--sulu)' : 'var(--label-color)', letterSpacing: '0.12em', textTransform: 'uppercase' }}><Swap k={`step2-${lang}`}>{rg.step2}</Swap></span>
                    <RoleIcon role={role} size={12} />
                  </div>
                </div>

                <div className="gl-face-scroll">
                  {step === 1 && (
                    <form onSubmit={handleRegNext} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <Field label={rg.name}>
                        <input className="gl-input" type="text" required placeholder="Yassine El Amrani" value={regForm.name}
                          onChange={e => { setReg('name', e.target.value); clearFieldError('regName'); }}
                          style={{ borderColor: fieldErrors.regName ? 'var(--error-border)' : undefined }}
                        />
                        {fieldErrors.regName && <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--error-text)', letterSpacing: '0.06em', marginTop: 5 }}>{fieldErrors.regName}</p>}
                      </Field>
                      <Field label={rg.email}>
                        <div style={{ position: 'relative' }}>
                          <Mail size={14} color="var(--icon-dim)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          <input className="gl-input" type="email" required placeholder="contact@restaurant.ma" style={{ paddingLeft: 44, borderColor: fieldErrors.regEmail ? 'var(--error-border)' : undefined }} value={regForm.email}
                            onChange={e => { setReg('email', e.target.value); clearFieldError('regEmail'); }}
                          />
                        </div>
                        {fieldErrors.regEmail && <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--error-text)', letterSpacing: '0.06em', marginTop: 5 }}>{fieldErrors.regEmail}</p>}
                      </Field>
                      <Field label={rg.password}>
                        <div style={{ position: 'relative' }}>
                          <Lock size={14} color="var(--icon-dim)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          <input className="gl-input" type={showRegPass ? 'text' : 'password'} required placeholder="••••••••"
                            style={{ paddingLeft: 44, paddingRight: 44, borderColor: fieldErrors.regPassword ? 'var(--error-border)' : undefined }}
                            value={regForm.password}
                            onChange={e => { setReg('password', e.target.value); clearFieldError('regPassword'); }}
                          />
                          <button type="button" onClick={() => setShowRegPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--icon-dim)', display: 'flex' }}>
                            {showRegPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        {fieldErrors.regPassword
                          ? <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--error-text)', letterSpacing: '0.06em', marginTop: 5 }}>{fieldErrors.regPassword}</p>
                          : regForm.password && (
                            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                              {[8, 12, 16].map((len, i) => (
                                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: regForm.password.length >= len && /[A-Z]/.test(regForm.password) && /[0-9]/.test(regForm.password) ? 'var(--sulu)' : regForm.password.length >= len ? 'var(--amber)' : 'var(--tab-border)', transition: 'background 0.3s' }} />
                              ))}
                            </div>
                          )
                        }
                      </Field>
                      <button type="submit" className="gl-btn-p" style={{ marginTop: 6 }}>
                        <Swap k={`rnext-${lang}`}>{rg.next}</Swap> <ArrowRight size={14} />
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleRegSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <Field label={role === 'restaurant' ? rg.company : rg.companyS}>
                        <input className="gl-input" type="text" required placeholder={role === 'restaurant' ? 'Le Bistro Vert' : 'Atlas Fruits & Légumes'} value={regForm.company_name} onChange={e => setReg('company_name', e.target.value)} />
                      </Field>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Field label={rg.city}>
                          <div className="gl-select-wrap">
                            <select className="gl-input" value={regForm.city} onChange={e => setReg('city', e.target.value)}>
                              {rg.cities.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                            </select>
                          </div>
                        </Field>
                        <Field label={rg.phone}>
                          <div style={{ position: 'relative' }}>
                            <Phone size={14} color="var(--icon-dim)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input className="gl-input" type="tel" required placeholder="+212 600-000000" style={{ paddingLeft: 44 }} value={regForm.phone} onChange={e => setReg('phone', e.target.value)} />
                          </div>
                        </Field>
                      </div>

                      <Field label={rg.address}>
                        <div style={{ position: 'relative' }}>
                          <MapPin size={14} color="var(--icon-dim)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          <input className="gl-input" type="text" required placeholder="Zone Industrielle ou Boulevard principal" style={{ paddingLeft: 44 }} value={regForm.address} onChange={e => setReg('address', e.target.value)} />
                        </div>
                      </Field>

                      {regError && (
                        <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--error-bg)', border: '1px solid var(--error-border)', fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--error-text)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                          {regError}
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginTop: 4 }}>
                        <button type="button" className="gl-btn-ghost" onClick={() => setStep(1)}>← <Swap k={`rback-${lang}`}>{rg.back}</Swap></button>
                        <button type="submit" disabled={regLoading} className="gl-btn-p">
                          {regLoading ? '…' : <Swap k={`rcta-${lang}`}>{rg.cta}</Swap>} {!regLoading && <ArrowRight size={14} />}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <p style={{ textAlign: 'center', marginTop: 12, fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--card-text-faint)', letterSpacing: '0.10em', transition: 'color 0.5s ease', flex: '0 0 auto' }}>
                  <Swap k={`rg-switch-${lang}`}>
                    {rg.switchPrompt}{' '}
                    <button type="button" className="gl-link-btn" style={{ fontSize: 9, letterSpacing: '0.10em', textTransform: 'none' }} onClick={goToLogin}>
                      {rg.switchLink}
                    </button>
                  </Swap>
                </p>
              </div>
            </div>
          </motion.div>

          <BeamBorder theme={theme} />
        </motion.div>
      </div>
    </>
  );
};

export default AuthCard;
export const Login = AuthCard;
export const Register = AuthCard;