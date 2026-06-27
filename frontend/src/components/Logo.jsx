import React from 'react';
import { Link } from 'react-router-dom';

export const LogoMark = ({ size = 34 }) => {
  const cell = Math.floor(size * 0.44);
  const gap  = Math.max(1, Math.floor(size * 0.06));
  const b    = Math.max(1, Math.floor(size * 0.06));
  const r    = '999px';
  const squares = [
    { backgroundColor: '#50DE68',        borderRadius: `${r} ${r} 0 ${r}`,   borderLeft: `${b}px solid var(--logo-border, #fff)`, borderTop:    `${b}px solid var(--logo-border-top, #f7f7f7)` },
    { backgroundColor: 'rgb(32,80,46)',  borderRadius: `${r} ${r} ${r} 0`,   borderRight:`${b}px solid var(--logo-border, #fff)`, borderTop:    `${b}px solid var(--logo-border-top, #f7f7f7)` },
    { backgroundColor: 'rgb(0,220,50)',  borderRadius: `${r} 0 ${r} ${r}`,   borderLeft: `${b}px solid var(--logo-border, #fff)`, borderBottom: `${b}px solid var(--logo-border-top, #f7f7f7)` },
    { backgroundColor: 'rgb(32,182,32)', borderRadius: `0 ${r} ${r} ${r}`,   borderRight:`${b}px solid var(--logo-border, #fff)`, borderBottom: `${b}px solid var(--logo-border-top, #f7f7f7)` },
  ];
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      display: 'grid',
      gridTemplateColumns: `${cell}px ${cell}px`,
      gridTemplateRows: `${cell}px ${cell}px`,
      gap: `${gap}px`,
    }}>
      {squares.map((s, i) => (
        <div key={i} style={{ boxSizing: 'border-box', ...s }} />
      ))}
    </div>
  );
};

export const Logo = ({ size = 32, showText = true, textColor = 'var(--text)', leafColor = 'var(--sulu)', subtextColor = 'var(--silver)' }) => {
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            color: textColor,
            fontSize: size * 0.53,
            fontWeight: 400,
            letterSpacing: '0.09em',
            textTransform: 'uppercase'
          }}>
            Green<span style={{ color: leafColor }}>Leaf</span>
          </span>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: size * 0.22,
            color: subtextColor,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginTop: 2,
            opacity: 0.7
          }}>
            
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
