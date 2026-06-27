import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, Moon, Globe } from 'lucide-react';

const THEMES = {
  dark: {
    '--bg':      '#0B2818',
    '--bg2':     '#46554c',
    '--bg3':     '#000000',
    '--text':    '#FFFFFF',
    '--textMid': 'rgba(255,255,255,0.55)',
    '--textLow': 'rgba(255,255,255,0.28)',
    '--sulu':    '#A8E063',
    '--suluLo':  'rgba(168,224,99,0.10)',
    '--suluMd':  'rgba(168,224,99,0.22)',
    '--silver':  '#B0B8B4',
    '--silverLo':'rgba(176,184,180,0.12)',
    '--silverMd':'rgba(176,184,180,0.30)',
    '--border':  'rgba(176,184,180,0.10)',
    '--navBg':   'rgba(11,40,24,0.96)',
    '--inputBg': 'transparent',
  },
  light: {
    '--bg':      '#F4F6F2',
    '--bg2':     '#E8EDE5',
    '--bg3':     '#DCE3D8',
    '--text':    '#0B2818',
    '--textMid': 'rgba(11,40,24,0.60)',
    '--textLow': 'rgba(11,40,24,0.35)',
    '--sulu':    '#5A9C1A',
    '--suluLo':  'rgba(90,156,26,0.08)',
    '--suluMd':  'rgba(90,156,26,0.18)',
    '--silver':  '#6E7870',
    '--silverLo':'rgba(110,120,112,0.10)',
    '--silverMd':'rgba(110,120,112,0.28)',
    '--border':  'rgba(110,120,112,0.15)',
    '--navBg':   'rgba(244,246,242,0.96)',
    '--inputBg': '#FFFFFF',
  },
};

const GlobalStyles = ({ theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    :root {
      ${Object.entries(THEMES[theme]).map(([k,v]) => `${k}: ${v};`).join('\n      ')}
    }
    body { background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s; }
    .gl-icon-btn {
      background: none; border: 1px solid var(--border); cursor: pointer;
      padding: 7px 13px; display: inline-flex; align-items: center; gap: 6px;
      transition: border-color 0.2s, background 0.2s; border-radius: 2px;
      color: var(--silver); font-family: 'DM Mono', monospace; font-size: 10px;
      letter-spacing: 0.12em; text-transform: uppercase;
    }
    .gl-icon-btn:hover { border-color: var(--sulu); background: var(--suluLo); color: var(--text); }
    .gl-btn-p {
      font-family: 'DM Mono', monospace; font-size: 11px;
      letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none;
      background: var(--sulu); color: var(--bg3); border: none; cursor: pointer;
      padding: 15px 32px; display: inline-flex; align-items: center; gap: 10px;
      transition: opacity 0.2s; font-weight: 500;
    }
    .gl-btn-p:hover { opacity: 0.88; }
    .gl-btn-g {
      font-family: 'DM Mono', monospace; font-size: 11px;
      letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none;
      background: transparent; color: var(--silver);
      border: 1px solid var(--silverMd); cursor: pointer;
      padding: 15px 32px; display: inline-flex; align-items: center; gap: 10px;
      transition: border-color 0.2s, color 0.2s;
    }
    .gl-btn-g:hover { border-color: var(--silver); color: var(--text); }
  `}</style>
);

// Logo component is imported from components/Logo


const About = () => {
  const { theme, lang, toggleTheme, toggleLang } = useAppStore();
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const T = {
    fr: {
      nav: { home: 'Accueil', join: 'Rejoindre →' },
      hero: {
        eyebrow: 'Notre histoire',
        h1: 'Nés du', h2: 'terrain,', h3: 'pour le terrain.',
        sub: 'GreenLeaf est né d\'un constat simple : les restaurants marocains payaient trop cher, et les agriculteurs gagnaient trop peu. Il fallait changer ça.',
      },
      mission: {
        eyebrow: 'Notre mission',
        title: 'Éliminer les intermédiaires.',
        body: 'Nous connectons directement les restaurants aux coopératives agricoles et fournisseurs locaux. Pas de grossiste, pas de commission cachée, pas de délais inutiles. Une relation directe, transparente et équitable entre ceux qui produisent et ceux qui cuisinent.',
      },
      problem: {
        eyebrow: 'Le problème',
        title: 'Un circuit trop long.',
        body: 'Avant GreenLeaf, un restaurant à Casablanca commandait ses légumes à un grossiste, qui les achetait à un distributeur, qui les achetait à un transporteur, qui les achetait à l\'agriculteur. Chaque intermédiaire prenait sa marge. Résultat : des prix élevés pour les restaurants, et des revenus misérables pour les agriculteurs.',
      },
      solution: {
        eyebrow: 'Notre solution',
        title: 'Direct. Transparent. Sécurisé.',
        items: [
          { title: 'Commande directe', body: 'Le restaurant commande directement au fournisseur. Aucun intermédiaire, aucune marge cachée.' },
          { title: 'Paiement escrow', body: 'Les fonds sont sécurisés jusqu\'à confirmation de réception. Zéro risque pour les deux parties.' },
          { title: 'Livraison 24h', body: 'Engagement contractuel de livraison le lendemain pour toute commande passée avant 14h.' },
          { title: 'Fournisseurs vérifiés', body: 'Chaque fournisseur passe par un contrôle documentaire et une visite terrain avant d\'être listé.' },
        ],
      },
      vision: {
        eyebrow: 'Notre vision',
        title: 'La référence B2B alimentaire du Maroc.',
        body: 'D\'ici 2027, nous voulons être la plateforme de référence pour l\'approvisionnement professionnel au Maroc — de Tanger à Agadir, du restaurant étoilé à la cantine scolaire. Un écosystème où chaque acteur de la chaîne alimentaire marocaine trouve sa place.',
      },
      team: {
        eyebrow: 'L\'équipe',
        title: 'Construits par des Marocains,\npour le Maroc.',
        body: 'GreenLeaf est un projet né à Fès, développé par une équipe passionnée par la tech et l\'agriculture locale. Nous croyons que la technologie peut transformer des industries entières — et l\'agroalimentaire marocain en a besoin.',
      },
      cta: {
        eyebrow: 'Rejoignez-nous',
        title: 'Prêt à changer\nvotre façon de vous approvisionner ?',
        cta1: 'Inscrire mon restaurant',
        cta2: 'Inscrire mon exploitation',
      },
    },
    en: {
      nav: { home: 'Home', join: 'Join →' },
      hero: {
        eyebrow: 'Our story',
        h1: 'Born from', h2: 'the field,', h3: 'for the field.',
        sub: 'GreenLeaf was born from a simple observation: Moroccan restaurants were paying too much, and farmers were earning too little. Something had to change.',
      },
      mission: {
        eyebrow: 'Our mission',
        title: 'Eliminate the middlemen.',
        body: 'We connect restaurants directly to agricultural cooperatives and local suppliers. No wholesaler, no hidden commission, no unnecessary delays. A direct, transparent and fair relationship between those who produce and those who cook.',
      },
      problem: {
        eyebrow: 'The problem',
        title: 'A supply chain too long.',
        body: 'Before GreenLeaf, a restaurant in Casablanca ordered vegetables from a wholesaler, who bought from a distributor, who bought from a transporter, who bought from the farmer. Every middleman took their margin. Result: high prices for restaurants, and miserable income for farmers.',
      },
      solution: {
        eyebrow: 'Our solution',
        title: 'Direct. Transparent. Secure.',
        items: [
          { title: 'Direct ordering', body: 'The restaurant orders directly from the supplier. No middlemen, no hidden margins.' },
          { title: 'Escrow payment', body: 'Funds are secured until delivery is confirmed. Zero risk for both parties.' },
          { title: '24h delivery', body: 'Contractual next-day delivery commitment for all orders placed before 2pm.' },
          { title: 'Verified suppliers', body: 'Every supplier goes through a document check and field visit before being listed.' },
        ],
      },
      vision: {
        eyebrow: 'Our vision',
        title: 'Morocco\'s B2B food reference.',
        body: 'By 2027, we want to be the reference platform for professional sourcing in Morocco — from Tangier to Agadir, from starred restaurants to school canteens. An ecosystem where every actor in the Moroccan food chain finds their place.',
      },
      team: {
        eyebrow: 'The team',
        title: 'Built by Moroccans,\nfor Morocco.',
        body: 'GreenLeaf is a project born in Fès, developed by a team passionate about tech and local agriculture. We believe technology can transform entire industries — and Moroccan agri-food needs it.',
      },
      cta: {
        eyebrow: 'Join us',
        title: 'Ready to change\nhow you source?',
        cta1: 'Register my restaurant',
        cta2: 'Register my farm',
      },
    },
  };

  const t = T[lang];
  const mono = { fontFamily: 'DM Mono,monospace' };
  const serif = { fontFamily: 'DM Serif Display,serif' };

  return (
    <>
      <GlobalStyles theme={theme} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'var(--navBg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: 70 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="gl-icon-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <><Sun size={12}/><span>Day</span></> : <><Moon size={12}/><span>Night</span></>}
              </button>
              <button className="gl-icon-btn" onClick={toggleLang}>
                <Globe size={12}/><span>{lang === 'fr' ? 'EN' : 'FR'}</span>
              </button>
            </div>
            <Logo />
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Link to="/" style={{ ...mono, fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--textMid)', textDecoration: 'none' }}>{t.nav.home}</Link>
              <Link to="/register/restaurant" className="gl-btn-p" style={{ padding: '10px 20px', fontSize: 10 }}>{t.nav.join}</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 96, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 28, height: 1, background: 'var(--silver)' }} />
            <span style={{ ...mono, fontSize: 9, color: 'var(--silver)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.hero.eyebrow}</span>
          </div>
          <h1 style={{ ...serif, fontSize: 'clamp(52px,8vw,96px)', fontWeight: 400, lineHeight: 0.92, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 36 }}>
            {t.hero.h1}<br />
            <em style={{ color: 'var(--sulu)', fontStyle: 'italic' }}>{t.hero.h2}</em><br />
            {t.hero.h3}
          </h1>
          <p style={{ ...mono, fontSize: 13, color: 'var(--silver)', letterSpacing: '0.08em', lineHeight: 1.85, maxWidth: 580 }}>{t.hero.sub}</p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '96px 32px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div>
            <span style={{ ...mono, fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.mission.eyebrow}</span>
            <div style={{ width: 40, height: 1, background: 'var(--sulu)', marginTop: 14 }} />
          </div>
          <div>
            <h2 style={{ ...serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.0, letterSpacing: '0.04em', marginBottom: 28 }}>{t.mission.title}</h2>
            <p style={{ ...mono, fontSize: 12, color: 'var(--silver)', letterSpacing: '0.07em', lineHeight: 1.9 }}>{t.mission.body}</p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: '96px 32px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div>
            <span style={{ ...mono, fontSize: 9, color: 'var(--silver)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.problem.eyebrow}</span>
            <div style={{ width: 40, height: 1, background: 'var(--silverMd)', marginTop: 14 }} />
          </div>
          <div>
            <h2 style={{ ...serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.0, letterSpacing: '0.04em', marginBottom: 28 }}>{t.problem.title}</h2>
            <p style={{ ...mono, fontSize: 12, color: 'var(--silver)', letterSpacing: '0.07em', lineHeight: 1.9 }}>{t.problem.body}</p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section style={{ padding: '96px 32px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 60 }}>
            <span style={{ ...mono, fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.solution.eyebrow}</span>
            <h2 style={{ ...serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.0, letterSpacing: '0.04em', marginTop: 16 }}>{t.solution.title}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {t.solution.items.map((item, i) => (
              <div key={i} style={{ padding: '36px 28px', background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ ...mono, fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>0{i+1}</div>
                <h3 style={{ ...serif, fontSize: 20, fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 14 }}>{item.title}</h3>
                <p style={{ ...mono, fontSize: 10, color: 'var(--silver)', letterSpacing: '0.07em', lineHeight: 1.8 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section style={{ padding: '96px 32px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div>
            <span style={{ ...mono, fontSize: 9, color: 'var(--silver)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.vision.eyebrow}</span>
            <div style={{ width: 40, height: 1, background: 'var(--silverMd)', marginTop: 14 }} />
          </div>
          <div>
            <h2 style={{ ...serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.0, letterSpacing: '0.04em', marginBottom: 28 }}>{t.vision.title}</h2>
            <p style={{ ...mono, fontSize: 12, color: 'var(--silver)', letterSpacing: '0.07em', lineHeight: 1.9 }}>{t.vision.body}</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '96px 32px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div>
            <span style={{ ...mono, fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.team.eyebrow}</span>
            <div style={{ width: 40, height: 1, background: 'var(--sulu)', marginTop: 14 }} />
          </div>
          <div>
            <h2 style={{ ...serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.0, letterSpacing: '0.04em', marginBottom: 28, whiteSpace: 'pre-line' }}>{t.team.title}</h2>
            <p style={{ ...mono, fontSize: 12, color: 'var(--silver)', letterSpacing: '0.07em', lineHeight: 1.9 }}>{t.team.body}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '96px 32px', background: 'var(--bg3)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ ...mono, fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>{t.cta.eyebrow}</span>
          <h2 style={{ ...serif, fontSize: 'clamp(32px,5vw,60px)', fontWeight: 400, color: '#FFFFFF', textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '0.04em', margin: '24px 0 44px', whiteSpace: 'pre-line' }}>{t.cta.title}</h2>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register/restaurant" className="gl-btn-p">{t.cta.cta1} <ArrowRight size={14}/></Link>
            <Link to="/register/fournisseur" className="gl-btn-g">{t.cta.cta2}</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;