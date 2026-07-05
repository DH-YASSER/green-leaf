import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Camera, Image as ImageIcon, X, Upload, FileText, CheckCircle2,
} from 'lucide-react';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { GlobalStyles } from './Home';

const ease = [0.22, 1, 0.36, 1];

// ─── COPY ────────────────────────────────────────────────────────────────
const COPY = {
    fr: {
        step: (n) => `Étape ${n} sur 3`,
        saveExit: 'Enregistrer et quitter',
        s1h: 'Complétez votre page boutique',
        s1sub: 'Ces informations aident les restaurants à vous connaître et vous faire confiance.',
        profilePhoto: 'Photo de profil', coverPhoto: 'Photo de couverture',
        uploadImage: 'Glissez-déposez ou téléchargez une image',
        description: 'Description', descriptionPh: 'Décrivez votre ferme ou coopérative',
        certifications: 'Certifications (optionnel)', certificationsPh: 'Ex. Bio, ONSSA, Label Rouge',
        addCert: 'Ajouter',
        s2h: 'Livraison et préférences de commande',
        s2sub: 'Les restaurants verront ces informations avant de commander.',
        firstOrderMin: 'Minimum de première commande', reorderMin: 'Minimum de réapprovisionnement',
        deliveryZones: 'Zones de livraison', leadTime: 'Délai de préparation moyen',
        leadTimeHint: "Estimez le temps nécessaire pour préparer et expédier une commande. Les restaurants verront une date estimée personnalisée.",
        days: 'jours',
        s3h: 'Documents de vérification',
        s3sub: "Notre équipe vérifie les documents sous 48h. Vous pouvez commencer à ajouter des produits en attendant.",
        rcDoc: "Registre de commerce (RC)", iceDoc: "Certificat d'identifiant commun (ICE)",
        uploadDoc: 'Glissez-déposez ou téléchargez un document',
        next: 'Continuer', back: 'Retour', finish: 'Terminer',
        editLater: 'Vous pouvez modifier ceci plus tard.',
        cities: [['casablanca', 'Casablanca'], ['rabat', 'Rabat'], ['marrakech', 'Marrakech'], ['fes', 'Fès'], ['tanger', 'Tanger'], ['agadir', 'Agadir']],
    },
    en: {
        step: (n) => `Step ${n} of 3`,
        saveExit: 'Save & exit',
        s1h: 'Build your shop page',
        s1sub: 'This helps restaurants get to know you and trust your shop.',
        profilePhoto: 'Profile photo', coverPhoto: 'Cover photo',
        uploadImage: 'Drag and drop or upload an image',
        description: 'Description', descriptionPh: 'Describe your farm or cooperative',
        certifications: 'Certifications (optional)', certificationsPh: 'e.g. Organic, ONSSA, Label Rouge',
        addCert: 'Add',
        s2h: 'Delivery & order preferences',
        s2sub: "Restaurants will see this before placing an order.",
        firstOrderMin: 'First order minimum', reorderMin: 'Reorder minimum',
        deliveryZones: 'Delivery zones', leadTime: 'Average lead time',
        leadTimeHint: 'Estimate the time it takes to prepare and ship an order. Retailers will see a personalized date estimate.',
        days: 'days',
        s3h: 'Verification documents',
        s3sub: 'Our team reviews documents within 48h. You can start listing products in the meantime.',
        rcDoc: 'Business registration (RC)', iceDoc: 'Common company identifier (ICE) certificate',
        uploadDoc: 'Drag and drop or upload a document',
        next: 'Continue', back: 'Back', finish: 'Finish',
        editLater: 'You can edit this later.',
        cities: [['casablanca', 'Casablanca'], ['rabat', 'Rabat'], ['marrakech', 'Marrakech'], ['fes', 'Fes'], ['tanger', 'Tanger'], ['agadir', 'Agadir']],
    },
};

const ImageDrop = ({ label, file, onChange, tall }) => {
    const inputId = `img-${label.replace(/\s/g, '')}`;
    const previewUrl = file ? URL.createObjectURL(file) : null;
    return (
        <div className="gl-ss-field">
            <label className="gl-ss-label">{label}</label>
            <label htmlFor={inputId} className={`gl-ss-dropzone ${tall ? 'gl-ss-dropzone-tall' : ''}`} style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined}>
                {!previewUrl && (
                    <div className="gl-ss-drop-content">
                        <ImageIcon size={22} strokeWidth={1.5} />
                    </div>
                )}
                {previewUrl && (
                    <button type="button" className="gl-ss-remove" onClick={(e) => { e.preventDefault(); onChange(null); }}>
                        <X size={13} />
                    </button>
                )}
                <input id={inputId} type="file" accept="image/*" hidden onChange={(e) => onChange(e.target.files?.[0] || null)} />
            </label>
        </div>
    );
};

const DocDrop = ({ label, file, onChange }) => {
    const inputId = `doc-${label.replace(/\s/g, '')}`;
    return (
        <div className="gl-ss-field">
            <label className="gl-ss-label">{label}</label>
            <label htmlFor={inputId} className="gl-ss-docdrop">
                {file ? (
                    <div className="gl-ss-doc-picked">
                        <FileText size={16} />
                        <span>{file.name}</span>
                        <button type="button" onClick={(e) => { e.preventDefault(); onChange(null); }}><X size={13} /></button>
                    </div>
                ) : (
                    <div className="gl-ss-drop-content">
                        <Upload size={18} strokeWidth={1.5} />
                    </div>
                )}
                <input id={inputId} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={(e) => onChange(e.target.files?.[0] || null)} />
            </label>
        </div>
    );
};

const ShopSetup = () => {
    const { lang, theme } = useAppStore();
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();
    const c = COPY[lang];

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // step 1
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [description, setDescription] = useState(user?.fournisseur_profile?.description || '');
    const [certInput, setCertInput] = useState('');
    const [certifications, setCertifications] = useState([]);

    // step 2
    const [firstOrderMin, setFirstOrderMin] = useState('');
    const [reorderMin, setReorderMin] = useState('');
    const [zones, setZones] = useState([]);
    const [leadTime, setLeadTime] = useState('');

    // step 3
    const [rcDoc, setRcDoc] = useState(null);
    const [iceDoc, setIceDoc] = useState(null);

    const toggleZone = (slug) => setZones(z => z.includes(slug) ? z.filter(v => v !== slug) : [...z, slug]);

    const addCert = () => {
        const v = certInput.trim();
        if (v && !certifications.includes(v)) setCertifications([...certifications, v]);
        setCertInput('');
    };

    const goDashboard = () => navigate('/fournisseur/dashboard');

    const submitStep1 = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const fd = new FormData();
            if (profilePhoto) fd.append('profile_photo', profilePhoto);
            if (coverPhoto) fd.append('cover_photo', coverPhoto);
            if (description) fd.append('description', description);
            certifications.forEach((cert, i) => fd.append(`certifications[${i}]`, cert));
            await axios.put('/api/fournisseur/shop-setup/page', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || (lang === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'));
        } finally {
            setLoading(false);
        }
    };

    const submitStep2 = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await axios.put('/api/fournisseur/shop-setup/order-preferences', {
                first_order_minimum: firstOrderMin,
                reorder_minimum: reorderMin,
                delivery_zones: zones,
                lead_time_days: leadTime,
            });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || (lang === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'));
        } finally {
            setLoading(false);
        }
    };

    const submitStep3 = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const fd = new FormData();
            fd.append('rc_document', rcDoc);
            fd.append('ice_document', iceDoc);
            const res = await axios.post('/api/fournisseur/shop-setup/verification-docs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data?.profile) {
                setUser({ ...user, fournisseur_profile: res.data.profile });
            }
            goDashboard();
        } catch (err) {
            setError(err.response?.data?.message || (lang === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gl-ss-page">
            <GlobalStyles theme={theme} />

            <div className="gl-ss-topbar">
                {step > 1 ? (
                    <button className="gl-ss-back-arrow" onClick={() => setStep(step - 1)}><ArrowLeft size={20} /></button>
                ) : <span />}
                <button className="gl-ss-save-exit" onClick={goDashboard}>{c.saveExit}</button>
                <div className="gl-ss-progress-track">
                    <div className="gl-ss-progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
                </div>
            </div>

            <div className="gl-ss-center">
                <div className="gl-ss-content">
                    <div className="gl-ss-stepnum">{c.step(step)}</div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form key="s1" onSubmit={submitStep1} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                <div>
                                    <h1 className="gl-ss-h1">{c.s1h}</h1>
                                    <p className="gl-ss-sub">{c.s1sub}</p>
                                </div>

                                <ImageDrop label={c.coverPhoto} file={coverPhoto} onChange={setCoverPhoto} tall />
                                <ImageDrop label={c.profilePhoto} file={profilePhoto} onChange={setProfilePhoto} />

                                <div className="gl-ss-field">
                                    <label className="gl-ss-label">{c.description}</label>
                                    <textarea className="gl-ss-input gl-ss-textarea" placeholder={c.descriptionPh} value={description} onChange={e => setDescription(e.target.value)} />
                                </div>

                                <div className="gl-ss-field">
                                    <label className="gl-ss-label">{c.certifications}</label>
                                    <div className="gl-ss-cert-row">
                                        <input className="gl-ss-input" placeholder={c.certificationsPh} value={certInput}
                                            onChange={e => setCertInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCert(); } }} />
                                        <button type="button" className="gl-ss-addbtn" onClick={addCert}>{c.addCert}</button>
                                    </div>
                                    {certifications.length > 0 && (
                                        <div className="gl-ss-chips">
                                            {certifications.map(cert => (
                                                <span key={cert} className="gl-ss-chip">
                                                    {cert}
                                                    <button type="button" onClick={() => setCertifications(certifications.filter(v => v !== cert))}><X size={11} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {error && <div className="gl-ss-error-banner">{error}</div>}
                                <button type="submit" disabled={loading} className="gl-ss-submit">{loading ? '…' : c.next}</button>
                                <p className="gl-ss-editlater">{c.editLater}</p>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form key="s2" onSubmit={submitStep2} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                <div>
                                    <h1 className="gl-ss-h1">{c.s2h}</h1>
                                    <p className="gl-ss-sub">{c.s2sub}</p>
                                </div>

                                <div className="gl-ss-row">
                                    <div className="gl-ss-field">
                                        <label className="gl-ss-label">{c.firstOrderMin}</label>
                                        <div className="gl-ss-input-prefix">
                                            <span>MAD</span>
                                            <input className="gl-ss-input" type="number" min="0" required value={firstOrderMin} onChange={e => setFirstOrderMin(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="gl-ss-field">
                                        <label className="gl-ss-label">{c.reorderMin}</label>
                                        <div className="gl-ss-input-prefix">
                                            <span>MAD</span>
                                            <input className="gl-ss-input" type="number" min="0" required value={reorderMin} onChange={e => setReorderMin(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="gl-ss-field">
                                    <label className="gl-ss-label">{c.deliveryZones}</label>
                                    <div className="gl-ss-zones">
                                        {c.cities.map(([slug, name]) => (
                                            <button type="button" key={slug} className={`gl-ss-zone ${zones.includes(slug) ? 'gl-ss-zone-active' : ''}`} onClick={() => toggleZone(slug)}>
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="gl-ss-field">
                                    <label className="gl-ss-label">{c.leadTime}</label>
                                    <div className="gl-ss-input-suffix">
                                        <input className="gl-ss-input" type="number" min="0" max="30" required value={leadTime} onChange={e => setLeadTime(e.target.value)} />
                                        <span>{c.days}</span>
                                    </div>
                                    <p className="gl-ss-hint">{c.leadTimeHint}</p>
                                </div>

                                {error && <div className="gl-ss-error-banner">{error}</div>}
                                <button type="submit" disabled={loading || zones.length === 0} className="gl-ss-submit">{loading ? '…' : c.next}</button>
                                <p className="gl-ss-editlater">{c.editLater}</p>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form key="s3" onSubmit={submitStep3} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                <div>
                                    <h1 className="gl-ss-h1">{c.s3h}</h1>
                                    <p className="gl-ss-sub">{c.s3sub}</p>
                                </div>

                                <DocDrop label={c.rcDoc} file={rcDoc} onChange={setRcDoc} />
                                <DocDrop label={c.iceDoc} file={iceDoc} onChange={setIceDoc} />

                                {error && <div className="gl-ss-error-banner">{error}</div>}
                                <button type="submit" disabled={loading || !rcDoc || !iceDoc} className="gl-ss-submit gl-ss-submit-final">
                                    {loading ? '…' : <>{c.finish} <CheckCircle2 size={15} /></>}
                                </button>
                                <p className="gl-ss-editlater">{c.editLater}</p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
        .gl-ss-page { min-height: 100vh; background: var(--page-bg, #FFFFFF); color: var(--page-text, #1F2421); }

        .gl-ss-topbar { position: relative; padding: 24px clamp(20px, 5vw, 56px) 0; display: flex; align-items: center; justify-content: space-between; }
        .gl-ss-back-arrow { background: none; border: none; cursor: pointer; padding: 6px; color: var(--page-text, #1F2421); display: flex; }
        .gl-ss-back-arrow:hover { color: var(--accent-color, #4C7846); }
        .gl-ss-save-exit {
          background: none; border: none; cursor: pointer; margin-left: auto;
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.04em; color: var(--textLow, #6B6F67);
        }
        .gl-ss-save-exit:hover { color: var(--page-text, #1F2421); text-decoration: underline; }
        .gl-ss-progress-track { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--page-border, #ECECE7); }
        .gl-ss-progress-fill { height: 100%; background: var(--page-text, #1F2421); transition: width 0.3s ease; }

        .gl-ss-center { display: flex; justify-content: center; padding: clamp(30px, 6vh, 64px) 20px 100px; }
        .gl-ss-content { width: 100%; max-width: 520px; }
        .gl-ss-stepnum { font-family: 'DM Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--textLow, #8A8F87); margin-bottom: 10px; }

        .gl-ss-h1 { font-family: 'DM Serif Display', Georgia, serif; font-weight: 400; font-size: 28px; line-height: 1.25; margin-bottom: 10px; }
        .gl-ss-sub { font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.6; color: var(--textMid, #5B605A); margin: 0; }

        .gl-ss-field { width: 100%; display: flex; flex-direction: column; gap: 8px; }
        .gl-ss-label { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--page-text, #1F2421); letter-spacing: 0.01em; }

        .gl-ss-input {
          width: 100%; color: var(--input-text, #1F2421); outline: none; padding: 12px 14px;
          font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.01em;
          background: var(--input-bg, #FFFFFF); border-radius: 4px; border: 1px solid var(--input-border, #D8D8D3);
          transition: border-color 0.15s; appearance: none;
        }
        .gl-ss-input:focus { border-color: var(--input-focus-border, #4C7846); }
        .gl-ss-textarea { min-height: 100px; resize: vertical; font-family: 'DM Mono', monospace; }

        .gl-ss-dropzone {
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          border: 1px dashed var(--input-border, #D8D8D3); border-radius: 6px; height: 110px;
          background-size: cover; background-position: center; position: relative; color: var(--textLow, #8A8F87);
        }
        .gl-ss-dropzone-tall { height: 150px; }
        .gl-ss-drop-content { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .gl-ss-remove {
          position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.55); color: #fff;
          border: none; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .gl-ss-docdrop {
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          border: 1px dashed var(--input-border, #D8D8D3); border-radius: 6px; height: 64px; color: var(--textLow, #8A8F87);
          padding: 0 14px;
        }
        .gl-ss-doc-picked { display: flex; align-items: center; gap: 8px; font-family: 'DM Mono', monospace; font-size: 12px; color: var(--page-text, #1F2421); width: 100%; }
        .gl-ss-doc-picked span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gl-ss-doc-picked button { background: none; border: none; cursor: pointer; color: var(--textLow, #8A8F87); display: flex; }

        .gl-ss-cert-row { display: flex; gap: 8px; }
        .gl-ss-addbtn {
          font-family: 'DM Mono', monospace; font-size: 12px; padding: 0 16px; border-radius: 4px;
          background: var(--card-bg, #EFEFEA); border: 1px solid var(--input-border, #D8D8D3); color: var(--page-text, #1F2421); cursor: pointer;
        }
        .gl-ss-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .gl-ss-chip {
          display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 20px;
          background: var(--card-bg, #EFEFEA); border: 1px solid var(--input-border, #D8D8D3);
          font-family: 'DM Mono', monospace; font-size: 11px; color: var(--page-text, #1F2421);
        }
        .gl-ss-chip button { background: none; border: none; cursor: pointer; color: var(--textLow, #8A8F87); display: flex; }

        .gl-ss-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .gl-ss-input-prefix, .gl-ss-input-suffix { display: flex; align-items: center; border: 1px solid var(--input-border, #D8D8D3); border-radius: 4px; background: var(--input-bg, #FFFFFF); overflow: hidden; }
        .gl-ss-input-prefix span, .gl-ss-input-suffix span { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--textLow, #8A8F87); padding: 0 12px; }
        .gl-ss-input-prefix .gl-ss-input, .gl-ss-input-suffix .gl-ss-input { border: none; }

        .gl-ss-zones { display: flex; flex-wrap: wrap; gap: 8px; }
        .gl-ss-zone {
          font-family: 'DM Mono', monospace; font-size: 12px; padding: 8px 14px; border-radius: 20px; cursor: pointer;
          background: var(--input-bg, #FFFFFF); border: 1px solid var(--input-border, #D8D8D3); color: var(--textMid, #5B605A);
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .gl-ss-zone-active { background: var(--accent-color, #4C7846); border-color: var(--accent-color, #4C7846); color: #fff; }

        .gl-ss-hint { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--textLow, #8A8F87); margin: 0; line-height: 1.6; }
        .gl-ss-editlater { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--textLow, #8A8F87); text-align: center; margin: 0; }
        .gl-ss-error-banner { padding: 14px 16px; border-radius: 6px; background: var(--dangerLo, #FBEAE9); border: 1px solid var(--danger, #F2C9C6); font-family: 'DM Mono', monospace; font-size: 12px; color: var(--danger, #B3261E); line-height: 1.6; }

        .gl-ss-submit {
          font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.02em;
          background: var(--card-bg, #EFEFEA); color: var(--page-text, #1F2421); border: 1px solid var(--input-border, #D8D8D3); cursor: pointer;
          padding: 15px 24px; border-radius: 4px; width: 100%; font-weight: 500;
          transition: background 0.15s, border-color 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .gl-ss-submit:hover:not(:disabled) { background: var(--card-hover-bg, #E4E4DE); border-color: var(--border2, #C6C6C0); }
        .gl-ss-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .gl-ss-submit-final { background: var(--accent-color, #4C7846); border-color: var(--accent-color, #4C7846); color: #fff; }
        .gl-ss-submit-final:hover:not(:disabled) { opacity: 0.9; background: var(--accent-color, #4C7846); }

        @media (max-width: 480px) {
          .gl-ss-row { grid-template-columns: 1fr; }
          .gl-ss-h1 { font-size: 24px; }
        }
      `}</style>
        </div>
    );
};

export default ShopSetup;