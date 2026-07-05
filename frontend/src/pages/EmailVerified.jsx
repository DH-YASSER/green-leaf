import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import axios from '../api/axios';
import { GlobalStyles } from './Home';

const COPY = {
    fr: {
        okTitle: 'Email confirmé !',
        okBody: 'Votre adresse email a bien été vérifiée. Vous pouvez continuer à utiliser GreenLeaf normalement.',
        invalidTitle: 'Lien invalide ou expiré',
        invalidBody: "Ce lien de vérification n'est plus valide. Reconnectez-vous pour en recevoir un nouveau depuis votre tableau de bord.",
        cta: 'Aller à mon espace',
        loginCta: 'Se connecter',
    },
    en: {
        okTitle: 'Email confirmed!',
        okBody: 'Your email address has been verified. You can keep using GreenLeaf as normal.',
        invalidTitle: 'Invalid or expired link',
        invalidBody: 'This verification link is no longer valid. Log in to get a fresh one from your dashboard.',
        cta: 'Go to my dashboard',
        loginCta: 'Sign in',
    },
};

const roleHome = (role) => {
    if (role === 'fournisseur') return '/fournisseur/dashboard';
    if (role === 'restaurant') return '/restaurant/dashboard';
    return '/';
};

const EmailVerified = () => {
    const { lang, theme } = useAppStore();
    const { user, isAuthenticated, setUser } = useAuthStore();
    const navigate = useNavigate();
    const c = COPY[lang];

    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const status = params.get('status') === 'invalid' ? 'invalid' : 'ok';

    const [refreshed, setRefreshed] = useState(false);

    useEffect(() => {
        // The verification itself already happened server-side (that's how we
        // got here). If we're logged in, refresh the cached user so the
        // reminder banner disappears immediately instead of on next reload.
        if (status === 'ok' && isAuthenticated) {
            axios.get('/api/me')
                .then(res => setUser(res.data))
                .catch(() => {})
                .finally(() => setRefreshed(true));
        } else {
            setRefreshed(true);
        }
    }, [status, isAuthenticated]);

    const isOk = status === 'ok';

    return (
        <div className="gl-ev-page">
            <GlobalStyles theme={theme} />
            <div className="gl-ev-center">
                <div className="gl-ev-content">
                    {isOk ? <CheckCircle2 size={40} strokeWidth={1.5} /> : <AlertCircle size={40} strokeWidth={1.5} />}
                    <h1 className="gl-ev-h1">{isOk ? c.okTitle : c.invalidTitle}</h1>
                    <p className="gl-ev-sub">{isOk ? c.okBody : c.invalidBody}</p>

                    {isOk && isAuthenticated ? (
                        <button className="gl-ev-cta" onClick={() => navigate(roleHome(user?.role))}>
                            {c.cta}
                        </button>
                    ) : (
                        <Link to="/" className="gl-ev-cta" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            {c.loginCta}
                        </Link>
                    )}
                </div>
            </div>

            <style>{`
        .gl-ev-page { min-height: 100vh; background: var(--page-bg, #FFFFFF); color: var(--page-text, #1F2421); }
        .gl-ev-center { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .gl-ev-content { max-width: 440px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .gl-ev-h1 { font-family: 'DM Serif Display', Georgia, serif; font-weight: 400; font-size: 28px; margin: 0; }
        .gl-ev-sub { font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.6; color: var(--textMid, #5B605A); margin: 0; }
        .gl-ev-cta {
          font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.02em;
          background: var(--card-bg, #EFEFEA); color: var(--page-text, #1F2421); border: 1px solid var(--input-border, #D8D8D3);
          cursor: pointer; padding: 14px 28px; border-radius: 4px; font-weight: 500; margin-top: 8px;
          transition: background 0.15s, border-color 0.15s;
        }
        .gl-ev-cta:hover { background: var(--card-hover-bg, #E4E4DE); border-color: var(--border2, #C6C6C0); }
      `}</style>
        </div>
    );
};

export default EmailVerified;