import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';

const NotFound = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [buttonGone, setButtonGone] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);
  const [keyInserted, setKeyInserted] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const holdTimerRef = useRef(null);
  const keyRef = useRef(null);
  const zeroRef = useRef(null);

  const startHold = useCallback(() => {
    holdTimerRef.current = setTimeout(() => {
      setButtonGone(true);
      setTimeout(() => setKeyVisible(true), 500);
    }, 5000);
  }, []);

  const endHold = useCallback(() => {
    clearTimeout(holdTimerRef.current);
  }, []);

  const checkDrop = useCallback(() => {
    setIsDragging(false);
    if (!keyRef.current || !zeroRef.current) return;
    const keyRect = keyRef.current.getBoundingClientRect();
    const zeroRect = zeroRef.current.getBoundingClientRect();
    const keyCX = keyRect.left + keyRect.width / 2;
    const keyCY = keyRect.top + keyRect.height / 2;
    const zeroCX = zeroRect.left + zeroRect.width / 2;
    const zeroCY = zeroRect.top + zeroRect.height / 2;
    const dist = Math.sqrt(Math.pow(keyCX - zeroCX, 2) + Math.pow(keyCY - zeroCY, 2));
    if (dist < 80) {
      setKeyInserted(true);
      setTimeout(() => setGateOpen(true), 300);
      setTimeout(() => setShowModal(true), 1200);
    }
  }, []);

  const handleLogin = useCallback(async () => {
    setError('');
    try {
      const { data } = await axios.post('/api/auth/login', { email, password: pass });
      if (data.user?.role !== 'admin') { setError('Accès refusé.'); return; }
      useAuthStore.getState().login(data.user, data.token);
      setShowModal(false);
      navigate('/gl/c0ns0le');
    } catch {
      setError('Identifiants incorrects.');
    }
  }, [email, pass, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030d06',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* bg glow */}
      <motion.div
        animate={gateOpen ? { opacity: 1, scale: 1.4 } : { opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(129,199,132,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        {/* 404 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, position: 'relative', perspective: 800 }}>
          
          <span style={{ fontFamily: 'DM Serif Display,serif', fontSize: 'clamp(120px,20vw,220px)', color: 'rgba(255,255,255,0.06)', display: 'inline-block' }}>4</span>

          {/* 0 — split door */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div ref={zeroRef} style={{ position: 'relative', display: 'inline-block' }}>
              
              {/* Left door half */}
              <motion.div
                animate={gateOpen ? { rotateY: -110, x: -20 } : { rotateY: 0, x: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  transformOrigin: 'left center',
                  overflow: 'hidden',
                  width: '50%',
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                }}
              >
                <span style={{
                  fontFamily: 'DM Serif Display,serif',
                  fontSize: 'clamp(120px,20vw,220px)',
                  color: keyInserted ? 'rgba(129,199,132,0.5)' : 'rgba(255,255,255,0.06)',
                  display: 'inline-block',
                  transition: 'color 0.4s ease',
                  whiteSpace: 'nowrap',
                }}>0</span>
              </motion.div>

              {/* Right door half */}
              <motion.div
                animate={gateOpen ? { rotateY: 110, x: 20 } : { rotateY: 0, x: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  transformOrigin: 'right center',
                  overflow: 'hidden',
                  width: '50%',
                  position: 'absolute', right: 0, top: 0, bottom: 0,
                }}
              >
                <span style={{
                  fontFamily: 'DM Serif Display,serif',
                  fontSize: 'clamp(120px,20vw,220px)',
                  color: keyInserted ? 'rgba(129,199,132,0.5)' : 'rgba(255,255,255,0.06)',
                  display: 'inline-block',
                  transition: 'color 0.4s ease',
                  whiteSpace: 'nowrap',
                  position: 'absolute', right: 0,
                }}>0</span>
              </motion.div>

              {/* Invisible 0 for layout */}
              <span style={{
                fontFamily: 'DM Serif Display,serif',
                fontSize: 'clamp(120px,20vw,220px)',
                color: 'transparent',
                display: 'inline-block',
              }}>0</span>
            </div>

            {/* Green light behind door */}
            <AnimatePresence>
              {gateOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  style={{
                    position: 'absolute', top: '10%', left: '15%',
                    width: '70%', height: '80%',
                    background: 'radial-gradient(ellipse, rgba(129,199,132,0.25) 0%, transparent 70%)',
                    filter: 'blur(12px)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Keyhole hint */}
            <AnimatePresence>
              {keyVisible && !keyInserted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <svg width="28" height="42" viewBox="0 0 28 42" fill="none">
                    <circle cx="14" cy="12" r="9" stroke="rgba(129,199,132,0.35)" strokeWidth="1.5" />
                    <path d="M10 20 L8 38 L14 34 L20 38 L18 20Z" stroke="rgba(129,199,132,0.35)" strokeWidth="1.5" fill="rgba(129,199,132,0.06)" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span style={{ fontFamily: 'DM Serif Display,serif', fontSize: 'clamp(120px,20vw,220px)', color: 'rgba(255,255,255,0.06)', display: 'inline-block' }}>4</span>
        </div>

        <p style={{
          fontFamily: 'DM Mono,monospace', fontSize: 11,
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.28em',
          textTransform: 'uppercase', marginTop: 16, marginBottom: 48,
        }}>
          Page introuvable
        </p>

        {/* Button + Key */}
        <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <AnimatePresence>
            {!buttonGone && (
              <motion.button
                exit={{ y: 50, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                onClick={() => navigate('/')}
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                style={{
                  fontFamily: 'DM Mono,monospace', fontSize: 10,
                  color: 'rgba(255,255,255,0.35)',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '14px 32px', cursor: 'pointer',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                ← Retour à l'accueil
              </motion.button>
            )}
          </AnimatePresence>

          {/* Key */}
          <AnimatePresence>
            {keyVisible && !keyInserted && (
              <motion.div
                ref={keyRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                drag
                dragMomentum={false}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={checkDrop}
                whileDrag={{ scale: 1.15 }}
                style={{ cursor: 'grab', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
              >
                <motion.div
                  animate={{ filter: isDragging ? 'drop-shadow(0 0 16px rgba(129,199,132,0.9))' : 'drop-shadow(0 0 6px rgba(129,199,132,0.3))' }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                    <circle cx="18" cy="18" r="11" stroke="#81C784" strokeWidth="1.5" fill="none" />
                    <circle cx="18" cy="18" r="4" fill="rgba(129,199,132,0.2)" stroke="#81C784" strokeWidth="1" />
                    <line x1="27" y1="27" x2="44" y2="44" stroke="#81C784" strokeWidth="2" strokeLinecap="round" />
                    <line x1="38" y1="38" x2="38" y2="44" stroke="#81C784" strokeWidth="2" strokeLinecap="round" />
                    <line x1="33" y1="42" x2="33" y2="46" stroke="#81C784" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.div>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 8, color: 'rgba(129,199,132,0.4)', letterSpacing: '0.2em' }}>DRAG TO 0</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Admin Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 9999, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(20px)',
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#030d06',
                border: '1px solid rgba(129,199,132,0.2)',
                padding: '48px',
                width: 360,
                display: 'flex', flexDirection: 'column', gap: 16,
                position: 'relative',
              }}
              onClick={e => e.stopPropagation()}
            >
              {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute', ...pos, width: 12, height: 12,
                  borderTop: pos.top === 0 ? '1px solid #81C784' : 'none',
                  borderBottom: pos.bottom === 0 ? '1px solid #81C784' : 'none',
                  borderLeft: pos.left === 0 ? '1px solid #81C784' : 'none',
                  borderRight: pos.right === 0 ? '1px solid #81C784' : 'none',
                }} />
              ))}

              <div>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 8, color: 'rgba(129,199,132,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>/// Accès restreint</span>
                <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 28, fontWeight: 400, color: '#fff', textTransform: 'uppercase', marginTop: 8, letterSpacing: '0.04em' }}>Staff</h2>
              </div>

              <input
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ background: 'rgba(129,199,132,0.03)', border: '1px solid rgba(129,199,132,0.12)', outline: 'none', padding: '12px 16px', fontFamily: 'DM Mono,monospace', fontSize: 11, color: '#fff', width: '100%', letterSpacing: '0.08em' }}
              />
              <input
                type="password" placeholder="Mot de passe" value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ background: 'rgba(129,199,132,0.03)', border: '1px solid rgba(129,199,132,0.12)', outline: 'none', padding: '12px 16px', fontFamily: 'DM Mono,monospace', fontSize: 11, color: '#fff', width: '100%', letterSpacing: '0.08em' }}
              />

              {error && (
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 9, color: 'rgba(239,100,100,0.85)', background: 'rgba(239,100,100,0.08)', padding: '8px 12px', letterSpacing: '0.1em' }}>
                  {error}
                </span>
              )}

              <button
                onClick={handleLogin}
                style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#81C784', color: '#030d06', border: 'none', cursor: 'pointer', padding: '14px', fontWeight: 500, marginTop: 4 }}
              >
                Entrer →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotFound;