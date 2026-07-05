import React, { useEffect, useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import axios from '../api/axios';

const COPY = {
    fr: {
        text: 'Confirmez votre email pour activer pleinement votre compte.',
        resend: 'Renvoyer',
        sent: 'Envoyé !',
        wait: (s) => `Renvoyer (${s}s)`,
    },
    en: {
        text: 'Confirm your email to fully activate your account.',
        resend: 'Resend',
        sent: 'Sent!',
        wait: (s) => `Resend (${s}s)`,
    },
};

const COOLDOWN = 30;

const EmailVerificationBanner = () => {
    const { lang } = useAppStore();
    const { user } = useAuthStore();
    const c = COPY[lang];

    const [dismissed, setDismissed] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // Nothing to show once verified, dismissed, or if there's no user yet.
    if (!user || user.email_verified_at || dismissed) return null;

    const handleResend = async () => {
        if (sending || cooldown > 0) return;
        setSending(true);
        try {
            await axios.post('/api/email/verification-notification');
            setSent(true);
            setCooldown(COOLDOWN);
            setTimeout(() => setSent(false), 3000);
        } catch (e) {
            // Already verified (400) or rate-limited (429) — either way, nothing
            // actionable for the user beyond what the button already shows.
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="gl-evb">
            <Mail size={16} />
            <span className="gl-evb-text">{c.text}</span>
            <button className="gl-evb-resend" onClick={handleResend} disabled={sending || cooldown > 0}>
                {sent ? c.sent : cooldown > 0 ? c.wait(cooldown) : c.resend}
            </button>
            <button className="gl-evb-close" onClick={() => setDismissed(true)} aria-label="Dismiss">
                <X size={14} />
            </button>

            <style>{`
        .gl-evb {
          display: flex; align-items: center; gap: 10px;
          background: var(--db-amber-dim); border-bottom: 1px solid var(--db-amber);
          color: var(--db-amber); padding: 10px 20px;
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.04em;
        }
        .gl-evb-text { flex: 1; color: var(--db-text); }
        .gl-evb-resend {
          background: none; border: 1px solid var(--db-amber); border-radius: 6px;
          padding: 5px 12px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.06em;
          color: var(--db-amber); cursor: pointer; white-space: nowrap;
        }
        .gl-evb-resend:disabled { opacity: 0.6; cursor: not-allowed; }
        .gl-evb-close {
          background: none; border: none; cursor: pointer; color: var(--db-low);
          display: flex; padding: 2px;
        }
      `}</style>
        </div>
    );
};

export default EmailVerificationBanner;