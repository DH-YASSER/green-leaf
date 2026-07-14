import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, X, ArrowRight, Globe } from 'lucide-react';
import axios from '../api/axios';
import { completeGoogleSignIn, startGoogleSignIn } from '../api/firebaseGoogleAuth';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';

const ease = [0.22, 1, 0.36, 1];

// LABELS (login + forgot-password only - register lives on its own page)
const LABELS = {
  fr: {
    restaurant: 'Restaurant', supplier: 'Fournisseur',
    login: {
      eyebrow: 'Bon retour', h1: 'Connexion',
      email: 'Adresse email', password: 'Mot de passe', cta: 'Se connecter',
      continueCta: 'Continuer',
      forgot: 'Mot de passe oublié ?',
      checking: 'Vérification...',
      noAccount: 'Aucun compte trouvé pour cet email.',
      signUpAs: 'Créer un compte en tant que',
    },
    forgotPassword: {
      eyebrow: 'Récupération', h1: 'Mot de passe oublié',
      sub: 'Entrez votre email pour recevoir un code de réinitialisation',
      cta: 'Envoyer',
      switchPrompt: 'Vous vous souvenez de votre mot de passe ?', switchLink: 'Se connecter',
    },
  },
  en: {
    restaurant: 'Restaurant', supplier: 'Supplier',
    login: {
      eyebrow: 'Welcome back', h1: 'Sign In',
      email: 'Email address', password: 'Password', cta: 'Sign in',
      continueCta: 'Continue',
      forgot: 'Forgot password?',
      checking: 'Checking...',
      noAccount: 'No account found for this email.',
      signUpAs: 'Sign up as',
    },
    forgotPassword: {
      eyebrow: 'Recovery', h1: 'Forgot Password',
      sub: 'Enter your email to receive a code to change your password',
      cta: 'Submit',
      switchPrompt: 'Remember your password?', switchLink: 'Log in',
    },
  },
};

const shakeVariant = {
  shake: { x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
};

const GOOGLE_AFTER_HOST_FIX_KEY = 'gl_continue_google_after_host_fix';

// LoginModal
// Faire-style: login is a modal overlay you can open from anywhere (navbar,
// a gated action, etc.) without losing the page you were on. Register stays
// a dedicated page - see Register.jsx.
const LoginModal = ({ open, onClose }) => {
  const { lang } = useAppStore();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  // RATE LIMITING & ACCOUNT LOCKOUT (same policy as before)
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 5 * 60 * 1000;
  const RATE_WINDOW = 60 * 1000;

  const getStoredAttempts = () => {
    try {
      return JSON.parse(localStorage.getItem('gl_auth_attempts') || '{"count":0,"since":0,"locked_until":0}');
    } catch { return { count: 0, since: 0, locked_until: 0 }; }
  };
  const saveAttempts = (data) => {
    try { localStorage.setItem('gl_auth_attempts', JSON.stringify(data)); } catch {}
  };

  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    if (!open) return;
    const d = getStoredAttempts();
    setLockoutUntil(d.locked_until > Date.now() ? d.locked_until : 0);
  }, [open]);

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

  // VALIDATION
  const [fieldErrors, setFieldErrors] = useState({});
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : (lang === 'fr' ? 'Adresse email invalide' : 'Invalid email address');
  const setFieldError = (k, msg) => setFieldErrors(p => ({ ...p, [k]: msg }));
  const clearFieldError = (k) => setFieldErrors(p => { const n = { ...p }; delete n[k]; return n; });

  // LOGIN STATE
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // 'idle' | 'checking' | 'exists' | 'not_found'
  const [emailStatus, setEmailStatus] = useState('idle');
  const passwordRef = useRef(null);

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // reset transient state each time the modal is (re)opened
  useEffect(() => {
    if (open) {
      setLoginForm({ email: '', password: '' });
      setLoginError('');
      setFieldErrors({});
      setEmailStatus('idle');
      setForgotMode(false);
      setForgotSent(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && isAuthenticated && user) {
      const r = user.role?.toLowerCase() || '';
      onClose?.();
      navigate(r === 'admin' ? '/gl/c0ns0le' : r === 'restaurant' ? '/browse' : '/fournisseur/dashboard');
    }
  }, [isAuthenticated, user, open]);

  useEffect(() => {
    if (!open || isAuthenticated) return;

    let cancelled = false;
    const finishGoogleRedirect = async () => {
      const continueAfterHostFix = localStorage.getItem(GOOGLE_AFTER_HOST_FIX_KEY) === '1';
      if (continueAfterHostFix) {
        localStorage.removeItem(GOOGLE_AFTER_HOST_FIX_KEY);
        await startGoogleSignIn();
        return;
      }

      try {
        const result = await completeGoogleSignIn();
        if (!result || cancelled) return;
        clearAttempts();
        login(result.user, result.token);
        const r = result.user.role?.toLowerCase() || '';
        onClose?.();
        navigate(r === 'admin' ? '/gl/c0ns0le' : r === 'restaurant' ? '/browse' : '/fournisseur/dashboard');
      } catch (err) {
        if (cancelled) return;
        setLoginError(lang === 'fr'
          ? `Connexion Google impossible: ${err.code || err.message || 'configuration Firebase'}`
          : `Google sign-in failed: ${err.code || err.message || 'Firebase configuration'}`);
        setShakeKey(k => k + 1);
      }
    };

    finishGoogleRedirect();
    return () => { cancelled = true; };
  }, [open, isAuthenticated, lang]);

  const handleLoginChange = (e) => {
    setLoginForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setLoginError('');
  };

  // email changes after a check -> status goes stale, back to idle so the
  // password slot collapses and the user has to re-check on submit
  const handleEmailChange = (e) => {
    handleLoginChange(e);
    clearFieldError('loginEmail');
    if (emailStatus !== 'idle') setEmailStatus('idle');
  };

  const checkEmail = async () => {
    const emailErr = validateEmail(loginForm.email);
    if (emailErr) { setFieldError('loginEmail', emailErr); setShakeKey(k => k + 1); return; }
    clearFieldError('loginEmail');
    setLoginError('');
    setEmailStatus('checking');
    try {
      const { data } = await axios.post('/api/auth/check-email', { email: loginForm.email.trim() });
      setEmailStatus(data.exists ? 'exists' : 'not_found');
      if (data.exists) {
        // let the reveal animation mount the field first, then focus it
        setTimeout(() => passwordRef.current?.focus(), 260);
      }
    } catch (err) {
      setEmailStatus('idle');
      setLoginError(lang === 'fr' ? 'Erreur réseau. Réessayez.' : 'Network error. Please try again.');
      setShakeKey(k => k + 1);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (forgotMode) return handleForgotSubmit(e);
    if (lockoutUntil > Date.now()) return;

    // stage 1: no confirmed account yet -> this submit just checks the email
    if (emailStatus !== 'exists') {
      return checkEmail();
    }

    // stage 2: account confirmed, password is on screen -> actually log in
    setLoginLoading(true); setLoginError('');
    try {
      const { data } = await axios.post('/api/login', loginForm);
      clearAttempts();
      const token = data.access_token || data.token;
      login(data.user, token);
      const r = data.user.role?.toLowerCase() || '';
      onClose?.();
      navigate(r === 'admin' ? '/gl/c0ns0le' : r === 'restaurant' ? '/browse' : '/fournisseur/dashboard');
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

  const handleGoogleLogin = async () => {
    if (lockoutUntil > Date.now()) return;
    setLoginLoading(true);
    setLoginError('');
    try {
      if (window.location.hostname === '127.0.0.1') {
        localStorage.setItem(GOOGLE_AFTER_HOST_FIX_KEY, '1');
        window.location.href = window.location.href.replace('127.0.0.1', 'localhost');
        return;
      }
      await startGoogleSignIn();
    } catch (err) {
      setLoginError(
        lang === 'fr'
          ? `Connexion Google impossible: ${err.code || err.message || 'configuration Firebase'}`
          : `Google sign-in failed: ${err.code || err.message || 'Firebase configuration'}`
      );
      setShakeKey(k => k + 1);
    } finally {
      setLoginLoading(false);
    }
  };

  const openForgot = () => {
    setForgotEmail(loginForm.email || '');
    setForgotSent(false);
    setForgotMode(true);
  };
  const closeForgot = () => { setForgotMode(false); setForgotSent(false); };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch (err) {
      setForgotSent(true); // never leak whether the email exists
    } finally {
      setForgotLoading(false);
    }
  };

  const goToRegister = (r) => {
    onClose?.();
    navigate(`/register/${r}`);
  };

  const t = LABELS[lang];
  const lg = t.login;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="gl-login-backdrop"
          className="gl-login-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={onClose}
        >
          <motion.div
            key="gl-login-card"
            className="gl-login-card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={forgotMode ? t.forgotPassword.h1 : lg.h1}
          >
            <button className="gl-login-close" onClick={onClose} aria-label={lang === 'fr' ? 'Fermer' : 'Close'}>
              <X size={16} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--sulu)', letterSpacing: '0.30em', textTransform: 'uppercase' }}>
                {forgotMode ? t.forgotPassword.eyebrow : lg.eyebrow}
              </span>
              <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 28, fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.03em', margin: '8px 0 8px' }}>
                {forgotMode ? t.forgotPassword.h1 : lg.h1}
              </h1>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--textMid)', letterSpacing: '0.08em' }}>
                {forgotMode ? t.forgotPassword.sub : lg.sub}
              </p>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="gl-login-label">{lg.email}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} color="var(--textLow)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    className="gl-login-input" type="email" required
                    style={{ paddingLeft: 44, paddingRight: 36, borderColor: fieldErrors.loginEmail ? '#C23B3B' : undefined }}
                    name="email"
                    value={forgotMode ? forgotEmail : loginForm.email}
                    onChange={forgotMode ? (e => setForgotEmail(e.target.value)) : handleEmailChange}
                    onBlur={() => { if (!forgotMode && emailStatus === 'idle' && loginForm.email.trim()) checkEmail(); }}
                  />
                  {!forgotMode && emailStatus === 'checking' && (
                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.08em' }}>
                      {lg.checking}
                    </span>
                  )}
                </div>
                {fieldErrors.loginEmail && <p className="gl-login-error-text">{fieldErrors.loginEmail}</p>}
              </div>

              <AnimatePresence initial={false}>
                {!forgotMode && emailStatus === 'exists' && (
                  <motion.div
                    key="password-reveal"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.32, ease }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: 2 }}>
                      <label className="gl-login-label">{lg.password}</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={14} color="var(--textLow)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                          ref={passwordRef}
                          className="gl-login-input" name="password" type={showLoginPass ? 'text' : 'password'}
                          required value={loginForm.password} onChange={handleLoginChange}
                          style={{ paddingLeft: 44, paddingRight: 44 }}
                        />
                        <button type="button" onClick={() => setShowLoginPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--textLow)', display: 'flex' }}>
                          {showLoginPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: 8 }}>
                        <button type="button" className="gl-login-forgot" onClick={openForgot}>{lg.forgot}</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {!forgotMode && emailStatus === 'not_found' && (
                  <motion.div
                    key="no-account"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.32, ease }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="gl-login-info-banner" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span>{lg.noAccount}</span>
                      <div style={{ display: 'flex', gap: 14 }}>
                        <button type="button" className="gl-login-link" onClick={() => goToRegister('restaurant')}>
                          {lg.signUpAs} {t.restaurant.toLowerCase()}
                        </button>
                        <button type="button" className="gl-login-link" onClick={() => goToRegister('fournisseur')}>
                          {lg.signUpAs} {t.supplier.toLowerCase()}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {loginError && !forgotMode && (
                  <motion.div key={shakeKey} variants={shakeVariant} animate="shake" initial={{ opacity: 0, height: 0 }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    <div className="gl-login-error-banner">{loginError}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {forgotMode && forgotSent && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    <div className="gl-login-info-banner">
                      {lang === 'fr' ? 'Si ce compte existe, un code a été envoyé.' : 'If that account exists, a code has been sent.'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {lockoutUntil > Date.now() && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    <div className="gl-login-error-banner">
                      {lang === 'fr'
                        ? `Compte bloqué. Réessayez dans ${Math.floor(lockoutSeconds / 60)}:${String(lockoutSeconds % 60).padStart(2, '0')}`
                        : `Account locked. Try again in ${Math.floor(lockoutSeconds / 60)}:${String(lockoutSeconds % 60).padStart(2, '0')}`}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(forgotMode || emailStatus !== 'not_found') && (
                <button
                  type="submit"
                  disabled={(forgotMode ? forgotLoading : loginLoading) || emailStatus === 'checking' || lockoutUntil > Date.now()}
                  className="gl-login-submit"
                >
                  {(forgotMode ? forgotLoading : loginLoading)
                    ? (lang === 'fr' ? 'Chargement...' : 'Loading...')
                    : <>{forgotMode ? t.forgotPassword.cta : (emailStatus === 'exists' ? lg.cta : lg.continueCta)} <ArrowRight size={14} /></>}
                </button>
              )}

              {!forgotMode && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{lang === 'fr' ? 'ou' : 'or'}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                  <button type="button" onClick={handleGoogleLogin} disabled={loginLoading || lockoutUntil > Date.now()} className="gl-login-google">
                    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {lang === 'fr' ? 'Continuer avec Google' : 'Continue with Google'}
                  </button>
                </>
              )}
            </form>

            {forgotMode && (
              <p style={{ textAlign: 'center', marginTop: 16, fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--textLow)', letterSpacing: '0.10em' }}>
                {t.forgotPassword.switchPrompt}{' '}
                <button type="button" className="gl-login-link" onClick={closeForgot}>{t.forgotPassword.switchLink}</button>
              </p>
            )}
          </motion.div>

          <style>{`
            .gl-login-backdrop {
              position: fixed; inset: 0; z-index: 200;
              background: rgba(5,7,6,0.72);
              backdrop-filter: blur(6px);
              display: flex; align-items: center; justify-content: center;
              padding: 20px;
            }
            .gl-login-card {
              position: relative; width: 100%; max-width: 440px;
              max-height: 90vh; overflow-y: auto;
              background: var(--bg2, #161717); border: 1px solid var(--border);
              border-radius: 18px; padding: 34px 30px 28px;
              box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6);
            }
            .gl-login-close {
              position: absolute; top: 16px; right: 16px;
              background: rgba(255,255,255,0.04); border: 1px solid var(--border);
              border-radius: 8px; width: 30px; height: 30px;
              display: flex; align-items: center; justify-content: center;
              color: var(--textMid); cursor: pointer;
            }
            .gl-login-close:hover { color: var(--text); border-color: var(--sulu); }
            .gl-login-tab {
              flex: 1; font-family: 'DM Mono', monospace; font-size: 10px;
              letter-spacing: 0.18em; text-transform: uppercase; border: none;
              cursor: pointer; padding: 12px 0; background: transparent;
              color: var(--textLow); transition: color 0.2s;
            }
            .gl-login-tab.on { color: #0c1410; font-weight: 500; }
            .gl-login-label {
              font-family: 'DM Mono', monospace; font-size: 9px;
              color: var(--textLow);
              letter-spacing: 0.22em; text-transform: uppercase;
              display: block; margin-bottom: 8px;
            }
            .gl-login-input {
              width: 100%; color: var(--text); outline: none;
              padding: 10px 14px; font-family: 'DM Mono', monospace; font-size: 11px;
              letter-spacing: 0.10em; background: var(--inputBg, transparent);
              border-radius: 8px; border: 2px solid var(--border);
              transition: border-color 0.2s;
            }
            .gl-login-input:focus { border-color: var(--sulu); }
            .gl-login-forgot {
              background: none; border: none; padding: 0; cursor: pointer;
              font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.08em;
              color: var(--textLow);
            }
            .gl-login-forgot:hover { color: var(--sulu); text-decoration: underline; }
            .gl-login-link {
              background: none; border: none; padding: 0; cursor: pointer;
              font-family: 'DM Mono', monospace; color: var(--sulu); font-size: 9px;
            }
            .gl-login-link:hover { text-decoration: underline; }
            .gl-login-error-text { font-family: 'DM Mono', monospace; font-size: 9px; color: #F08080; letter-spacing: 0.06em; margin-top: 5px; }
            .gl-login-error-banner {
              padding: 14px 18px; border-radius: 10px; background: rgba(200,60,60,0.10);
              border: 1px solid rgba(200,60,60,0.25); font-family: 'DM Mono', monospace;
              font-size: 10px; color: #F08080; letter-spacing: 0.06em; line-height: 1.6;
            }
            .gl-login-info-banner {
              padding: 14px 18px; border-radius: 10px; background: rgba(129,199,132,0.06);
              border: 1px solid var(--border); font-family: 'DM Mono', monospace;
              font-size: 10px; color: var(--textMid); letter-spacing: 0.06em; line-height: 1.6;
            }
            .gl-login-submit {
              font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.18em;
              text-transform: uppercase; background: var(--sulu); color: #0c1410;
              border: none; cursor: pointer; padding: 14px 32px; border-radius: 10px;
              display: inline-flex; align-items: center; justify-content: center; gap: 10px;
              font-weight: 500; width: 100%; margin-top: 4px;
            }
            .gl-login-submit:disabled { opacity: 0.45; cursor: not-allowed; }
            .gl-login-google {
              width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
              padding: 13px 20px; border-radius: 10px; border: 1px solid var(--border);
              background: var(--inputBg, transparent); cursor: pointer;
              font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em;
              text-transform: uppercase; color: var(--textMid);
            }
            .gl-login-google:hover { border-color: var(--sulu); }
            .gl-login-blur { filter: blur(6px); opacity: 0.45; pointer-events: none; user-select: none; transition: filter 0.4s ease, opacity 0.4s ease; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
