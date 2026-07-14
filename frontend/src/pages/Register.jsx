import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, Phone, MapPin, ArrowRight, ArrowLeft, Eye, EyeOff,
} from 'lucide-react';
import axios from '../api/axios';
import { useAppStore } from '../store/appStore';
import LoginModal from './LoginModal';
import Logo from '../components/Logo';
import { GlobalStyles } from './Home';

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};
const stagger = { show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };

// ─── COPY ────────────────────────────────────────────────────────────────
const COPY = {
    fr: {
        h1: 'Bienvenue ! Commençons',
        subR: 'Trouvez des fournisseurs vérifiés partout au Maroc.',
        subF: 'Mettez votre catalogue devant des centaines de restaurants.',
        firstName: 'Prénom', lastName: 'Nom', email: 'Email professionnel', password: 'Mot de passe',
        passwordHint: '8 caractères minimum',
        company: 'Nom du restaurant', companyS: "Nom de l'entreprise",
        city: 'Ville', phone: 'Téléphone', address: 'Adresse physique',
        language: 'Langue',
        emailOptOut: "Se désabonner des emails d'actualités de GreenLeaf. Vous pouvez modifier vos préférences à tout moment.",
        next: 'Continuer', back: 'Retour', cta: 'Créer mon compte',
        disclaimer: "En continuant, vous acceptez les",
        disclaimerTerms: "Conditions d'utilisation",
        disclaimerBrand: "Conditions de marque",
        disclaimerPrivacy: "Politique de confidentialité",
        switchPrompt: 'Déjà inscrit ?', switchLink: 'Se connecter',
        cities: [['casablanca', 'Casablanca'], ['rabat', 'Rabat'], ['marrakech', 'Marrakech'], ['fes', 'Fès'], ['tanger', 'Tanger'], ['agadir', 'Agadir']],
        languages: [['fr', 'Français'], ['en', 'English (UK)']],
        firstNameRequired: 'Le prénom est requis',
    },
    en: {
        h1: "Welcome! Let's get started",
        subR: 'Source from verified suppliers across Morocco.',
        subF: 'Put your catalog in front of hundreds of restaurants.',
        firstName: 'First name', lastName: 'Last name', email: 'Professional email', password: 'Password',
        passwordHint: '8 characters minimum',
        company: 'Restaurant name', companyS: 'Company name',
        city: 'City', phone: 'Phone', address: 'Physical address',
        language: 'Language',
        emailOptOut: 'Opt out of emails with the latest from GreenLeaf. You can change your preferences anytime.',
        next: 'Next', back: 'Back', cta: 'Create account',
        disclaimer: "By proceeding, you agree to GreenLeaf's",
        disclaimerTerms: "Terms of Service",
        disclaimerBrand: "Brand Terms of Service",
        disclaimerPrivacy: "Privacy Policy",
        switchPrompt: 'Already registered?', switchLink: 'Sign in',
        cities: [['casablanca', 'Casablanca'], ['rabat', 'Rabat'], ['marrakech', 'Marrakech'], ['fes', 'Fes'], ['tanger', 'Tanger'], ['agadir', 'Agadir']],
        languages: [['fr', 'Français'], ['en', 'English (UK)']],
        firstNameRequired: 'Please enter your first name',
    },
};

const Field = ({ label, children, error }) => (
    <div style={{ width: '100%' }}>
        <label className="gl-reg-label" style={error ? { color: '#B3261E' } : undefined}>{label}</label>
        {children}
        {error && <p className="gl-reg-error-text">{error}</p>}
    </div>
);

// ─── REGISTER (faire.com-style light onboarding form) ───────────────────────
const Register = () => {
    const { lang, toggleLang, theme } = useAppStore();
    const navigate = useNavigate();
    const { role: urlRole } = useParams();
    const c = COPY[lang];

    // role now comes only from the URL (/register/restaurant or /register/fournisseur) —
    // no in-page toggle.
    const role = urlRole === 'fournisseur' ? 'fournisseur' : 'restaurant';
    const [step, setStep] = useState(1);
    const [loginOpen, setLoginOpen] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailOptOut, setEmailOptOut] = useState(false);

    const [regForm, setRegForm] = useState({
        email: '', password: '',
        company_name: '', city: 'casablanca', phone: '', address: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [showRegPass, setShowRegPass] = useState(false);
    const [regError, setRegError] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : (lang === 'fr' ? 'Adresse email invalide' : 'Invalid email address');
    const validatePassword = (v) => {
        if (!v) return lang === 'fr' ? 'Mot de passe requis' : 'Password is required';
        if (v.length < 8) return lang === 'fr' ? '8 caractères minimum' : 'Minimum 8 characters';
        if (!/[A-Z]/.test(v)) return lang === 'fr' ? 'Au moins une majuscule' : 'At least one uppercase letter';
        if (!/[0-9]/.test(v)) return lang === 'fr' ? 'Au moins un chiffre' : 'At least one number';
        return '';
    };

    const setReg = (k, v) => setRegForm(p => ({ ...p, [k]: v }));
    const clearFieldError = (k) => setFieldErrors(p => { const n = { ...p }; delete n[k]; return n; });

    const handleRegNext = (e) => {
        e.preventDefault();
        const errs = {};
        if (!firstName.trim()) errs.regFirstName = c.firstNameRequired;
        const emailErr = validateEmail(regForm.email);
        if (emailErr) errs.regEmail = emailErr;
        const passErr = validatePassword(regForm.password);
        if (passErr) errs.regPassword = passErr;
        if (Object.keys(errs).length) { setFieldErrors(p => ({ ...p, ...errs })); return; }
        setStep(2);
    };

    const doRegister = async () => {
        setRegError(''); setRegLoading(true);
        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
            const payload = { ...regForm, name: fullName, password_confirmation: regForm.password, role };
            if (role === 'restaurant') {
                payload.cuisine_type = 'Divers';
                payload.rc_patente = 'N/A';
            } else {
                payload.ice_number = 'N/A';
                payload.category = 'other';
            }
            await axios.post('/api/register', payload);
            await axios.post('/api/logout');
            navigate('/login');
        } catch (err) {
            const errors = err.response?.data?.errors;
            const msg = err.response?.data?.message;
            setRegError(errors ? Object.values(errors)[0][0] : msg || (lang === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'));
        } finally {
            setRegLoading(false);
        }
    };

    const handleRegSubmit = (e) => { e.preventDefault(); doRegister(); };

    const handleRestaurantSubmit = (e) => {
        e.preventDefault();
        const errs = {};
        if (!firstName.trim()) errs.regFirstName = c.firstNameRequired;
        const emailErr = validateEmail(regForm.email);
        if (emailErr) errs.regEmail = emailErr;
        const passErr = validatePassword(regForm.password);
        if (passErr) errs.regPassword = passErr;
        if (Object.keys(errs).length) { setFieldErrors(p => ({ ...p, ...errs })); return; }
        doRegister();
    };

    // ─── SINGLE TOP LOADING BAR (à la faire.com) ────────────────────────────
    // Restaurant: one bar, fraction of all fields filled.
    // Fournisseur: step 1 fills the first half, step 2 fills the second half —
    // each half itself fills gradually as its fields get typed in.
    const step1Filled = [firstName, regForm.email, regForm.password].filter(v => v?.trim()).length;
    const step1Fill = step1Filled / 3;
    const step2Fields = ['company_name', 'phone', 'address'];
    const step2Fill = step2Fields.filter(f => regForm[f]?.trim()).length / step2Fields.length;

    const restaurantFields = [firstName, regForm.email, regForm.password, regForm.company_name, regForm.phone, regForm.address];
    const restaurantProgress = restaurantFields.filter(v => v?.trim()).length / restaurantFields.length;

    const fournisseurProgress = step === 1 ? step1Fill * 0.5 : 0.5 + step2Fill * 0.5;

    const progress = role === 'restaurant' ? restaurantProgress : fournisseurProgress;

    return (
        <div className="gl-reg-page">
            <GlobalStyles theme={theme} />
            <div className="gl-reg-topbar">
                <button className="gl-reg-back-arrow" onClick={() => navigate('/')} aria-label={c.back}>
                    <ArrowLeft size={24} />
                </button>
                <div className="gl-reg-logo">
                   <Logo textColor="#1F2421" leafColor="#4C7846" subtextColor="#5B605A" />
                 </div>
                <button className="gl-reg-signin-link" onClick={() => setLoginOpen(true)}>
                    {c.switchPrompt} <strong>{c.switchLink}</strong>
                </button>
                <div className="gl-reg-progress-track">
                    <motion.div className="gl-reg-progress-fill" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.25, ease }} />
                </div>
            </div>

            <div className="gl-reg-center">
                <motion.div className="gl-reg-content" variants={stagger} initial="hidden" animate="show">
                    <motion.h1 variants={fadeUp} className="gl-reg-h1">{c.h1}</motion.h1>
                    <motion.p variants={fadeUp} className="gl-reg-sub">
                        {role === 'restaurant' ? c.subR : c.subF}
                    </motion.p>

                    {role === 'restaurant' ? (
                        <motion.form
                            onSubmit={handleRestaurantSubmit}
                            variants={fadeUp}
                            style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
                        >
                            <div className="gl-reg-row">
                                <Field label={c.firstName} error={fieldErrors.regFirstName}>
                                    <input
                                        className="gl-reg-input" type="text" required
                                        value={firstName}
                                        onChange={e => { setFirstName(e.target.value); clearFieldError('regFirstName'); }}
                                        style={fieldErrors.regFirstName ? { borderColor: '#B3261E' } : undefined}
                                    />
                                </Field>
                                <Field label={c.lastName}>
                                    <input
                                        className="gl-reg-input" type="text"
                                        value={lastName} onChange={e => setLastName(e.target.value)}
                                    />
                                </Field>
                            </div>
                            <Field label={c.email} error={fieldErrors.regEmail}>
                                <input
                                    className="gl-reg-input" type="email" required
                                    value={regForm.email}
                                    onChange={e => { setReg('email', e.target.value); clearFieldError('regEmail'); }}
                                    style={fieldErrors.regEmail ? { borderColor: '#B3261E' } : undefined}
                                />
                            </Field>
                            <Field label={c.password} error={fieldErrors.regPassword}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="gl-reg-input" type={showRegPass ? 'text' : 'password'} required
                                        style={{ paddingRight: 44, ...(fieldErrors.regPassword ? { borderColor: '#B3261E' } : {}) }}
                                        value={regForm.password}
                                        onChange={e => { setReg('password', e.target.value); clearFieldError('regPassword'); }}
                                    />
                                    <button type="button" onClick={() => setShowRegPass(p => !p)} className="gl-reg-eye">
                                        {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {!fieldErrors.regPassword && <p className="gl-reg-hint">{c.passwordHint}</p>}
                            </Field>
                            <Field label={c.company}>
                                <input
                                    className="gl-reg-input" type="text" required
                                    value={regForm.company_name} onChange={e => setReg('company_name', e.target.value)}
                                />
                            </Field>
                            <div className="gl-reg-row">
                                <Field label={c.city}>
                                    <select className="gl-reg-input" value={regForm.city} onChange={e => setReg('city', e.target.value)}>
                                        {c.cities.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                                    </select>
                                </Field>
                                <Field label={c.phone}>
                                    <input className="gl-reg-input" type="tel" required value={regForm.phone} onChange={e => setReg('phone', e.target.value)} />
                                </Field>
                            </div>
                            <Field label={c.address}>
                                <input className="gl-reg-input" type="text" required value={regForm.address} onChange={e => setReg('address', e.target.value)} />
                            </Field>
                            <Field label={c.language}>
                                <select className="gl-reg-input" value={lang} onChange={e => { if (e.target.value !== lang) toggleLang?.(); }}>
                                    {c.languages.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                                </select>
                            </Field>

                            <label className="gl-reg-checkbox">
                                <input type="checkbox" checked={emailOptOut} onChange={e => setEmailOptOut(e.target.checked)} />
                                <span>{c.emailOptOut}</span>
                            </label>

                            {regError && <div className="gl-reg-error-banner">{regError}</div>}

                            <button type="submit" disabled={regLoading} className="gl-reg-submit">
                                {regLoading ? '…' : c.cta}
                            </button>
                        </motion.form>
                    ) : (
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form
                                    key="step1" onSubmit={handleRegNext}
                                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
                                >
                                    <div className="gl-reg-row">
                                        <Field label={c.firstName} error={fieldErrors.regFirstName}>
                                            <input
                                                className="gl-reg-input" type="text" required
                                                value={firstName}
                                                onChange={e => { setFirstName(e.target.value); clearFieldError('regFirstName'); }}
                                                style={fieldErrors.regFirstName ? { borderColor: '#B3261E' } : undefined}
                                            />
                                        </Field>
                                        <Field label={c.lastName}>
                                            <input
                                                className="gl-reg-input" type="text"
                                                value={lastName} onChange={e => setLastName(e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                    <Field label={c.email} error={fieldErrors.regEmail}>
                                        <input
                                            className="gl-reg-input" type="email" required
                                            value={regForm.email}
                                            onChange={e => { setReg('email', e.target.value); clearFieldError('regEmail'); }}
                                            style={fieldErrors.regEmail ? { borderColor: '#B3261E' } : undefined}
                                        />
                                    </Field>
                                    <Field label={c.password} error={fieldErrors.regPassword}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                className="gl-reg-input" type={showRegPass ? 'text' : 'password'} required
                                                style={{ paddingRight: 44, ...(fieldErrors.regPassword ? { borderColor: '#B3261E' } : {}) }}
                                                value={regForm.password}
                                                onChange={e => { setReg('password', e.target.value); clearFieldError('regPassword'); }}
                                            />
                                            <button type="button" onClick={() => setShowRegPass(p => !p)} className="gl-reg-eye">
                                                {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {!fieldErrors.regPassword && <p className="gl-reg-hint">{c.passwordHint}</p>}
                                    </Field>
                                    <Field label={c.language}>
                                        <select className="gl-reg-input" value={lang} onChange={e => { if (e.target.value !== lang) toggleLang?.(); }}>
                                            {c.languages.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                                        </select>
                                    </Field>

                                    <label className="gl-reg-checkbox">
                                        <input type="checkbox" checked={emailOptOut} onChange={e => setEmailOptOut(e.target.checked)} />
                                        <span>{c.emailOptOut}</span>
                                    </label>

                                    <button type="submit" className="gl-reg-submit">{c.next}</button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="step2" onSubmit={handleRegSubmit}
                                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
                                >
                                    <Field label={c.companyS}>
                                        <input
                                            className="gl-reg-input" type="text" required
                                            value={regForm.company_name} onChange={e => setReg('company_name', e.target.value)}
                                        />
                                    </Field>
                                    <div className="gl-reg-row">
                                        <Field label={c.city}>
                                            <select className="gl-reg-input" value={regForm.city} onChange={e => setReg('city', e.target.value)}>
                                                {c.cities.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                                            </select>
                                        </Field>
                                        <Field label={c.phone}>
                                            <input className="gl-reg-input" type="tel" required value={regForm.phone} onChange={e => setReg('phone', e.target.value)} />
                                        </Field>
                                    </div>
                                    <Field label={c.address}>
                                        <input className="gl-reg-input" type="text" required value={regForm.address} onChange={e => setReg('address', e.target.value)} />
                                    </Field>

                                    {regError && <div className="gl-reg-error-banner">{regError}</div>}

                                    <div className="gl-reg-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
                                        <button type="button" className="gl-reg-back" onClick={() => setStep(1)}><ArrowLeft size={13} /> {c.back}</button>
                                        <p className="gl-reg-disclaimer">
                                            {c.disclaimer}{' '}
                                            <Link to="#">{c.disclaimerTerms}</Link>,{' '}
                                            <Link to="#">{c.disclaimerBrand}</Link>, {lang === 'fr' ? 'et la' : 'and'}{' '}
                                            <Link to="#">{c.disclaimerPrivacy}</Link>.
                                        </p>
                                        <button type="submit" disabled={regLoading} className="gl-reg-submit">
                                            {regLoading ? '…' : c.cta}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    )}
                </motion.div>
            </div>

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

            <style>{`
        .gl-reg-page { min-height: 100vh; background: #FFFFFF; color: #1F2421; }

        .gl-reg-topbar { position: relative; padding: 26px 0 0; text-align: center; }
        .gl-reg-logo { display: inline-flex; text-decoration: none; }
        .gl-reg-back-arrow {
          position: absolute; top: 24px; left: clamp(20px, 5vw, 56px);
          background: none; border: none; cursor: pointer; padding: 6px;
          color: #1F2421; display: flex; align-items: center; justify-content: center;
        }
        .gl-reg-back-arrow:hover { color: #4C7846; }
        .gl-reg-signin-link {
          position: absolute; top: 30px; right: clamp(20px, 5vw, 56px);
          background: none; border: none; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.04em;
          color: #6B6F67;
        }
        .gl-reg-signin-link strong { color: #1F2421; font-weight: 500; }
        .gl-reg-signin-link:hover strong { text-decoration: underline; }
        .gl-reg-progress-track { margin-top: 26px; height: 3px; width: 100%; background: #ECECE7; overflow: hidden; }
        .gl-reg-progress-fill { height: 100%; background: #1F2421; }

        .gl-reg-center { display: flex; justify-content: center; padding: clamp(40px, 8vh, 88px) 20px 100px; }
        .gl-reg-content { width: 100%; max-width: 480px; }

        .gl-reg-h1 { font-family: 'DM Serif Display', Georgia, serif; font-weight: 400; font-size: 32px; line-height: 1.25; margin-bottom: 12px; }
        @media (max-width: 480px) { .gl-reg-h1 { font-size: 26px; } }
        .gl-reg-sub { font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.6; color: #5B605A; margin-bottom: 34px; }

        .gl-reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .gl-reg-label { font-family: 'DM Mono', monospace; font-size: 12px; color: #1F2421; letter-spacing: 0.01em; display: block; margin-bottom: 8px; transition: color 0.15s; }
        .gl-reg-input {
          width: 100%; color: #1F2421; outline: none; padding: 12px 14px;
          font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.01em;
          background: #FFFFFF; border-radius: 4px; border: 1px solid #D8D8D3;
          transition: border-color 0.15s; appearance: none;
        }
        .gl-reg-input:focus { border-color: #1F2421; }
        .gl-reg-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #8A8F87; display: flex;
        }
        .gl-reg-hint { font-family: 'DM Mono', monospace; font-size: 11px; color: #8A8F87; margin-top: 6px; }
         .gl-reg-disclaimer {
  font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.7;
  color: #8A8F87; text-align: center; margin-top: 4px;
}
.gl-reg-disclaimer a { color: #5B605A; text-decoration: underline; }
.gl-reg-disclaimer a:hover { color: #1F2421; }
        .gl-reg-error-text { font-family: 'DM Mono', monospace; font-size: 11px; color: #B3261E; margin-top: 6px; }
        .gl-reg-error-banner { padding: 14px 16px; border-radius: 6px; background: #FBEAE9; border: 1px solid #F2C9C6; font-family: 'DM Mono', monospace; font-size: 12px; color: #B3261E; line-height: 1.6; }

        .gl-reg-checkbox { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
        .gl-reg-checkbox input { margin-top: 3px; width: 15px; height: 15px; accent-color: #1F2421; cursor: pointer; flex-shrink: 0; }
        .gl-reg-checkbox span { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.6; color: #5B605A; }

        .gl-reg-submit {
          font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.02em;
          background: #EFEFEA; color: #1F2421; border: 1px solid #D8D8D3; cursor: pointer;
          padding: 15px 24px; border-radius: 4px; width: 100%; font-weight: 500;
          transition: background 0.15s, border-color 0.15s;
        }
        .gl-reg-submit:hover:not(:disabled) { background: #E4E4DE; border-color: #C6C6C0; }
        .gl-reg-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .gl-reg-back {
          font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.02em;
          background: transparent; border: 1px solid #D8D8D3; color: #5B605A; border-radius: 4px;
          padding: 14px 0; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        }
        .gl-reg-back:hover { border-color: #1F2421; color: #1F2421; }
      `}</style>
        </div>
    );
};

export default Register;
