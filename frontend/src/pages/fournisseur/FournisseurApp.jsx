import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Box,
  ChevronDown,
  CircleHelp,
  Eye,
  FileSpreadsheet,
  Home,
  Image as ImageIcon,
  LogOut,
  Mail,
  Megaphone,
  MessageSquare,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Truck,
  Upload,
  Users,
  X,
} from 'lucide-react';
import axios from '../../api/axios';
import Logo from '../../components/Logo';
import NotificationBell from '../../components/NotificationBell';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

const CATEGORY_OPTIONS = [
  { id: 1, label: 'Fruits & Vegetables' },
  { id: 2, label: 'Meat & Fish' },
  { id: 3, label: 'Spices & Condiments' },
  { id: 4, label: 'Dairy Products' },
  { id: 5, label: 'Cereals & Legumes' },
  { id: 6, label: 'Drinks' },
  { id: 7, label: 'Bakery' },
  { id: 8, label: 'Frozen' },
];

const UNITS = [
  { value: 'kg', label: 'kg' },
  { value: 'litre', label: 'litre' },
  { value: 'caisse', label: 'case' },
  { value: 'piece', label: 'piece' },
];

const CITY_OPTIONS = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tanger', 'Agadir'];

const emptyProduct = {
  name: '',
  description: '',
  category_id: '1',
  product_type: '',
  price: '',
  unit: 'kg',
  min_order_qty: '1',
  stock: '0',
  delivery_delay: '2',
  delivery_zones: ['Casablanca'],
  has_options: 'no',
};

function normalizeProducts(payload) {
  const rows = payload?.data || payload || [];
  return Array.isArray(rows) ? rows : [];
}

function productImage(product) {
  const first = product?.images?.[0];
  if (typeof first === 'string') return first;
  return first?.url || first?.image_url || first?.image_path || '';
}

function categoryName(product) {
  if (product?.category?.name) return product.category.name;
  const id = Number(product?.category_id || product?.category?.id);
  return CATEGORY_OPTIONS.find((item) => item.id === id)?.label || 'Food';
}

function cx(...items) {
  return items.filter(Boolean).join(' ');
}

function profileAsset(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  return `${base}/storage/${String(path).replace(/^\/?storage\//, '').replace(/^\//, '')}`;
}

function initials(value) {
  return String(value || 'GL').trim().slice(0, 2).toUpperCase();
}

function updateStoredUser(setUser, nextUser) {
  if (nextUser) setUser(nextUser);
}

async function saveSupplierProfile(data, setUser) {
  const form = new FormData();
  const appendValue = (key, value) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => appendValue(`${key}[${index}]`, item));
    } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
      Object.entries(value).forEach(([childKey, childValue]) => appendValue(`${key}[${childKey}]`, childValue));
    } else {
      form.append(key, value ?? '');
    }
  };
  Object.entries(data).forEach(([key, value]) => {
    appendValue(key, value);
  });
  const response = await axios.put('/api/fournisseur/shop-setup/page', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  updateStoredUser(setUser, response.data?.user);
  return response.data;
}

function Field({ label, children, hint }) {
  return (
    <label className="fd-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button className={cx('fd-toggle', checked && 'on')} type="button" onClick={() => onChange?.(!checked)}>
      <span />
      {label && <em>{checked ? 'On' : 'Off'}</em>}
    </button>
  );
}

function Sidebar({ view, setView, user, onLogout, lang }) {
  const label = {
    home: lang === 'fr' ? 'Accueil' : 'Home',
    orders: lang === 'fr' ? 'Commandes' : 'Orders',
    messages: lang === 'fr' ? 'Messages' : 'Messages',
    products: lang === 'fr' ? 'Produits' : 'Products',
    customers: lang === 'fr' ? 'Clients' : 'Customers',
    marketing: lang === 'fr' ? 'Marketing' : 'Marketing',
    analytics: lang === 'fr' ? 'Statistiques' : 'Analytics',
    shop: lang === 'fr' ? 'Ma boutique' : 'My shop',
    settings: lang === 'fr' ? 'Parametres' : 'Settings',
    shopSettings: lang === 'fr' ? 'Parametres boutique' : 'Shop settings',
    shipping: lang === 'fr' ? 'Livraison' : 'Shipping tools',
    account: lang === 'fr' ? 'Compte' : 'Account settings',
    team: lang === 'fr' ? 'Equipe' : 'Team',
    viewShop: lang === 'fr' ? 'Voir boutique' : 'View shop',
    help: lang === 'fr' ? 'Aide' : 'Help Center',
    logout: lang === 'fr' ? 'Deconnexion' : 'Log out',
  };
  const [settingsOpen, setSettingsOpen] = useState(true);
  const nav = [
    { id: 'home', label: label.home, icon: Home },
    { id: 'orders', label: label.orders, icon: ShoppingBag, caret: true },
    { id: 'messages', label: label.messages, icon: MessageSquare },
    { id: 'products', label: label.products, icon: Package, caret: true },
    { id: 'customers', label: label.customers, icon: Users, caret: true },
    { id: 'marketing', label: label.marketing, icon: Megaphone, caret: true },
    { id: 'analytics', label: label.analytics, icon: BarChart3, caret: true },
    { id: 'shop', label: label.shop, icon: Store },
  ];

  const settingsNav = [
    { id: 'shop-settings', label: label.shopSettings, icon: Settings },
    { id: 'shipping', label: label.shipping, icon: Truck },
    { id: 'account', label: label.account, icon: SlidersHorizontal },
    { id: 'team', label: label.team, icon: Users },
  ];
  const settingsActive = settingsNav.some((item) => item.id === view);

  const profile = user?.fournisseur_profile || {};
  const avatar = profile.company_name || user?.name || 'GL';
  const avatarImage = profileAsset(profile.profile_photo);

  return (
    <aside className="fd-sidebar">
      <div className="fd-sidebar-head">
        <div className="fd-brand">
          <Logo size={28} />
        </div>
        <NotificationBell buttonClassName="fd-bell-btn" iconSize={16} />
        <div className="fd-avatar" style={avatarImage ? { backgroundImage: `url(${avatarImage})` } : undefined}>{!avatarImage && initials(avatar)}</div>
      </div>

      <nav className="fd-nav">
        {nav.map(({ id, label, icon: Icon, caret }) => (
          <button key={id} className={cx(view === id && 'active')} type="button" onClick={() => setView(id)}>
            <Icon size={15} />
            <span>{label}</span>
            {caret && <ChevronDown size={13} />}
          </button>
        ))}
        <button className={cx('fd-parent-row', settingsActive && 'active', settingsOpen && 'open')} type="button" onClick={() => setSettingsOpen((open) => !open)}>
          <Settings size={15} />
          <span>{label.settings}</span>
          <ChevronDown size={13} />
        </button>
        {settingsOpen && (
          <div className="fd-subnav">
            {settingsNav.map(({ id, label, icon: Icon }) => (
              <button key={id} className={cx(view === id && 'active')} type="button" onClick={() => setView(id)}>
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="fd-side-bottom">
        <button type="button" onClick={() => setView('shop-preview')}><Eye size={14} /> {label.viewShop}</button>
        <button type="button"><CircleHelp size={14} /> {label.help}</button>
        <button type="button" onClick={onLogout}><LogOut size={14} /> {label.logout}</button>
      </div>
    </aside>
  );
}

function HomeView({ setView, products, user, onboardingStatus }) {
  const profile = user?.fournisseur_profile || {};
  const shopReady = Boolean(profile.shop_setup_completed_at);
  const checks = onboardingStatus?.checks || {};
  const checklist = [
    ['shop_information', 'Shop information'],
    ['cover_and_profile_images', 'Cover and profile images'],
    ['order_preferences', 'Order preferences'],
    ['two_products', 'At least 2 products'],
  ];

  return (
    <section className="fd-page fd-home">
      <p className="fd-kicker">Hi {user?.name?.split(' ')?.[0] || 'supplier'},</p>
      <h1>{shopReady ? 'Keep building your GreenLeaf shop' : "Let's finish setting up your shop"}</h1>
      <p className="fd-sub">Add at least 2 products to go live to restaurants on GreenLeaf.</p>

      <div className="fd-card fd-upload-card">
        <div>
          <h3>Upload a spreadsheet <span>Easiest</span></h3>
          <p>Import your catalog by uploading a catalog file or fill out our catalog template.</p>
          <button className="fd-dark-btn" type="button"><Upload size={14} /> Upload file</button>
        </div>
        <FileSpreadsheet size={54} strokeWidth={1.2} />
      </div>

      <div className="fd-home-grid">
        <div className="fd-card">
          <h3>Import from Shopify</h3>
          <p>Seamlessly import your product catalog from Shopify. Choose which products to import and keep your catalog safe.</p>
          <button className="fd-light-btn" type="button">Import from Shopify</button>
        </div>
        <div className="fd-card">
          <h3>Add products individually <Plus size={22} /></h3>
          <p>Create new products one by one using a simple product creation form.</p>
          <button className="fd-light-btn" type="button" onClick={() => setView('new-product')}>Add product</button>
        </div>
      </div>

      <div className="fd-card fd-mini-status">
        <strong>{onboardingStatus?.review_status === 'approved' ? 'Shop approved' : `${products.length}/2 products added`}</strong>
        <div><span style={{ width: `${Math.min(products.length / 2, 1) * 100}%` }} /></div>
        <ul className="fd-status-list">
          {checklist.map(([key, label]) => (
            <li className={checks[key] ? 'done' : ''} key={key}>
              <span>{checks[key] ? '✓' : '•'}</span>{label}
            </li>
          ))}
        </ul>
        <p className="fd-status-note">
          {onboardingStatus?.review_status === 'pending'
            ? 'Submitted. Admin review is in progress.'
            : onboardingStatus?.review_status === 'approved'
              ? 'Your shop is visible to restaurants.'
              : 'Complete these steps, then submit your shop for review.'}
        </p>
      </div>
    </section>
  );
}

function ProductsView({ products, loading, setView, refresh, user, setUser, onboardingStatus }) {
  const published = products.filter((item) => item.is_active !== false).length;
  const drafts = products.length - published;
  const profile = user?.fournisseur_profile || {};
  const profileComplete = Boolean(onboardingStatus?.ready_for_review);
  const [reviewMessage, setReviewMessage] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const submitReview = async () => {
    setSubmittingReview(true);
    setReviewMessage('');
    try {
      const response = await axios.post('/api/fournisseur/shop-setup/submit-review');
      updateStoredUser(setUser, response.data?.user);
      await refresh();
      setReviewMessage('Submitted. Admin will review your shop.');
    } catch (err) {
      setReviewMessage(err.response?.data?.message || 'Could not submit your shop for review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <section className="fd-page">
      <div className="fd-page-head">
        <div>
          <h1>Products</h1>
          <p>Upload a minimum of 2 published products to activate your shop on GreenLeaf.</p>
        </div>
        <div className="fd-actions">
          <button className={profileComplete ? 'fd-dark-btn' : 'fd-muted-btn'} disabled={submittingReview || !profileComplete || profile.review_status === 'pending' || profile.review_status === 'approved'} type="button" onClick={submitReview}>
            {submittingReview ? 'Submitting...' : profile.review_status === 'pending' ? 'Submitted for review' : 'Submit for review'}
          </button>
          <button className="fd-dark-btn" type="button" onClick={() => setView('new-product')}>Add products <ChevronDown size={14} /></button>
        </div>
      </div>
      {reviewMessage && <div className={reviewMessage.startsWith('Could') ? 'fd-error' : 'fd-success'}>{reviewMessage}</div>}

      <div className="fd-board">
        <div className="fd-tabs">
          <button className="active">All <span>{products.length}</span></button>
          <button>Published <span>{published}</span></button>
          <button>Unpublished <span>0</span></button>
          <button>Drafts <span>{drafts}</span></button>
        </div>
        <div className="fd-toolbar">
          <label><Search size={15} /><input placeholder="Search products" /></label>
          <button type="button">Sort: A-Z</button>
          <button type="button"><SlidersHorizontal size={14} /> Filter</button>
        </div>

        {loading ? (
          <div className="fd-empty">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="fd-empty">
            <h3>No products yet</h3>
            <p>Add at least 2 products to go live to restaurants on GreenLeaf.</p>
            <div>
              <button className="fd-dark-btn" type="button" onClick={() => setView('new-product')}>Add product</button>
              <button className="fd-light-btn" type="button"><Upload size={14} /> Bulk upload</button>
            </div>
          </div>
        ) : (
          <div className="fd-product-list">
            {products.map((product) => (
              <article key={product.id}>
                <div className="fd-product-thumb">
                  {productImage(product) ? <img src={productImage(product)} alt="" /> : <Package size={18} />}
                </div>
                <div>
                  <strong>{product.name}</strong>
                  <span>{categoryName(product)} · {product.unit || 'unit'}</span>
                </div>
                <b>{Number(product.price || 0).toFixed(2)} MAD</b>
                <span>{product.stock ?? 0} in stock</span>
                <button className="fd-light-btn" type="button" onClick={refresh}>Refresh</button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function NewProductView({ setView, onSaved }) {
  const [form, setForm] = useState(emptyProduct);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const addImages = (event) => {
    const files = Array.from(event.target.files || []);
    setImages((current) => [...current, ...files].slice(0, 5));
  };

  const save = async (publish = true) => {
    setSaving(true);
    setError('');
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('category_id', form.category_id);
      data.append('price', form.price);
      data.append('unit', form.unit);
      data.append('min_order_qty', form.min_order_qty);
      data.append('stock', form.stock);
      data.append('delivery_delay', form.delivery_delay);
      data.append('is_active', publish ? '1' : '0');
      form.delivery_zones.forEach((zone, index) => data.append(`delivery_zones[${index}]`, zone));
      images.forEach((image) => data.append('images[]', image));
      await axios.post('/api/fournisseur/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      await onSaved();
      setView('products');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors)[0][0] : err.response?.data?.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="fd-page fd-new-product">
      <button className="fd-back" type="button" onClick={() => setView('products')}>‹ Products</button>
      <div className="fd-page-head sticky">
        <div>
          <h1>New product</h1>
          <div className="fd-actions left">
            <button className="fd-dark-btn" type="button" disabled={saving} onClick={() => save(true)}>Publish product</button>
            <button className="fd-link-btn" type="button" disabled={saving} onClick={() => save(false)}>Save as draft</button>
          </div>
        </div>
      </div>

      {error && <div className="fd-error">{error}</div>}

      <div className="fd-section">
        <h2>Basic information</h2>
        <p>Build buyer confidence with a clear, detailed product listing.</p>
        <Field label="Name">
          <input value={form.name} maxLength={60} placeholder="Make your name concise and searchable" onChange={(event) => update('name', event.target.value)} />
          <em>{form.name.length}/60</em>
        </Field>
        <Field label="Description">
          <textarea value={form.description} maxLength={3000} placeholder="Tell buyers the materials and details that make this product stand out" onChange={(event) => update('description', event.target.value)} />
          <em>{form.description.length}/3000</em>
        </Field>
      </div>

      <div className="fd-section">
        <h2>Images <button type="button">Edit images</button></h2>
        <p>Use a neutral background and include all product options. Images must be at least 600 x 600 pixels.</p>
        <div className="fd-image-grid">
          <button className="fd-feature-upload" type="button" onClick={() => fileRef.current?.click()}>
            <Upload size={28} />
            <strong>Upload featured image</strong>
            <span>Supported files .png, .jpg, .webp</span>
          </button>
          {Array.from({ length: 8 }).map((_, index) => {
            const image = images[index];
            return (
              <div className="fd-image-slot" key={index}>
                {image ? <img src={URL.createObjectURL(image)} alt="" /> : <ImageIcon size={20} />}
              </div>
            );
          })}
        </div>
        <input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={addImages} />
        <input className="fd-wide-input" placeholder="Press Ctrl+V to paste an image or image URL" />
      </div>

      <div className="fd-section">
        <h2>Product type*</h2>
        <p>Choose a product type that best categorizes this product.</p>
        <Field label="Product type">
          <input value={form.product_type} placeholder="Example: Tomatoes, Olive oil, Cheese" onChange={(event) => update('product_type', event.target.value)} />
        </Field>
        <Field label="Category">
          <select value={form.category_id} onChange={(event) => update('category_id', event.target.value)}>
            {CATEGORY_OPTIONS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </Field>
      </div>

      <div className="fd-section">
        <h2>Product options*</h2>
        <p>Manage any variations of this product, like sizes, units, or packaging.</p>
        <label className="fd-radio"><input type="radio" checked={form.has_options === 'yes'} onChange={() => update('has_options', 'yes')} /> This product has options</label>
        <label className="fd-radio"><input type="radio" checked={form.has_options === 'no'} onChange={() => update('has_options', 'no')} /> This product doesn't have options</label>
      </div>

      <div className="fd-section">
        <h2>Pricing & inventory</h2>
        <div className="fd-form-grid">
          <Field label="Price (MAD)"><input type="number" min="0" value={form.price} onChange={(event) => update('price', event.target.value)} /></Field>
          <Field label="Unit"><select value={form.unit} onChange={(event) => update('unit', event.target.value)}>{UNITS.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></Field>
          <Field label="Stock"><input type="number" min="0" value={form.stock} onChange={(event) => update('stock', event.target.value)} /></Field>
          <Field label="Minimum order quantity"><input type="number" min="1" value={form.min_order_qty} onChange={(event) => update('min_order_qty', event.target.value)} /></Field>
          <Field label="Lead time (days)"><input type="number" min="0" value={form.delivery_delay} onChange={(event) => update('delivery_delay', event.target.value)} /></Field>
        </div>
        <div className="fd-zones">
          {CITY_OPTIONS.map((city) => (
            <button
              className={form.delivery_zones.includes(city) ? 'selected' : ''}
              key={city}
              type="button"
              onClick={() => update('delivery_zones', form.delivery_zones.includes(city) ? form.delivery_zones.filter((item) => item !== city) : [...form.delivery_zones, city])}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopPageView({ user, setView, setUser, onStatusChange }) {
  const profile = user?.fournisseur_profile || {};
  const company = profile.company_name || user?.name || 'GreenLeaf Shop';
  const city = user?.city || 'Casablanca';
  const country = profile.headquartered_in || profile.products_made_in || 'Morocco';
  const [form, setForm] = useState({
    company_name: company,
    description: profile.description || '',
    year_established: profile.year_established || '',
    products_made_in: profile.products_made_in || country,
    headquartered_in: profile.headquartered_in || country,
    instagram_handle: profile.instagram_handle || '',
    brand_values: Array.isArray(profile.brand_values) ? profile.brand_values : [],
  });
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const coverPreview = files.cover_photo ? URL.createObjectURL(files.cover_photo) : profileAsset(profile.cover_photo_url || profile.cover_photo);
  const avatarPreview = files.profile_photo ? URL.createObjectURL(files.profile_photo) : profileAsset(profile.profile_photo_url || profile.profile_photo);
  const featurePreview = files.feature_image ? URL.createObjectURL(files.feature_image) : profileAsset(profile.feature_image_url || profile.feature_image);
  const logoPreview = files.logo_image ? URL.createObjectURL(files.logo_image) : profileAsset(profile.logo_image_url || profile.logo_image);
  const additionalPreview = files.additional_images?.[0] ? URL.createObjectURL(files.additional_images[0]) : profileAsset(profile.additional_image_urls?.[0] || profile.additional_images?.[0]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const pickFile = (key, event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;
    setFiles((current) => ({ ...current, [key]: key === 'additional_images' ? selected.slice(0, 2) : selected[0] }));
  };

  const toggleTag = (tag) => {
    update('brand_values', form.brand_values.includes(tag)
      ? form.brand_values.filter((item) => item !== tag)
      : [...form.brand_values, tag]);
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'brand_values') {
          value.forEach((item, index) => data.append(`brand_values[${index}]`, item));
        } else {
          data.append(key, value ?? '');
        }
      });
      ['profile_photo', 'cover_photo', 'feature_image', 'logo_image'].forEach((key) => {
        if (files[key]) data.append(key, files[key]);
      });
      (files.additional_images || []).forEach((image, index) => data.append(`additional_images[${index}]`, image));
      const response = await axios.put('/api/fournisseur/shop-setup/page', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateStoredUser(setUser, response.data?.user);
      onStatusChange?.();
      setFiles({});
      setMessage('Saved. Your shop preview is updated.');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setMessage(errors ? Object.values(errors)[0][0] : 'Could not save your shop page.');
    } finally {
      setSaving(false);
    }
  };

  const removeMedia = async (field, index) => {
    setSaving(true);
    setMessage('');
    try {
      const url = index === undefined
        ? `/api/fournisseur/shop-setup/media/${field}`
        : `/api/fournisseur/shop-setup/media/${field}/${index}`;
      const response = await axios.delete(url);
      updateStoredUser(setUser, response.data?.user);
      onStatusChange?.();
      setMessage('Removed. Your shop preview is updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not remove this file.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="fd-page fd-shop-page">
      <div className="fd-page-head">
        <div><h1>Shop page</h1><p>Customize your brand's shop page on GreenLeaf.</p></div>
        <div className="fd-actions"><button className="fd-dark-btn" disabled={saving} type="button" onClick={save}>{saving ? 'Saving...' : 'Save'}</button><button className="fd-link-btn" type="button" onClick={() => setView('shop-preview')}>View shop</button></div>
      </div>
      {message && <div className={message.startsWith('Could') ? 'fd-error' : 'fd-success'}>{message}</div>}

      <div className="fd-shop-panel">
        <div className="fd-shop-section">
          <h2>Cover image & profile image</h2>
          <p>These images are featured at the top of your brand's shop page.</p>
          <div className="fd-cover-wrap">
            <div className="fd-cover-preview" style={coverPreview ? { backgroundImage: `url(${coverPreview})` } : undefined}>
              <label><ImageIcon size={16} /><input hidden type="file" accept="image/*" onChange={(event) => pickFile('cover_photo', event)} /></label>
              {coverPreview && <button className="fd-remove-media" type="button" onClick={() => removeMedia('cover_photo')}><X size={14} /></button>}
            </div>
            <label className="fd-profile-bubble" style={avatarPreview ? { backgroundImage: `url(${avatarPreview})` } : undefined}>
              {!avatarPreview && initials(form.company_name)}
              <input hidden type="file" accept="image/*" onChange={(event) => pickFile('profile_photo', event)} />
            </label>
            {avatarPreview && <button className="fd-remove-avatar" type="button" onClick={() => removeMedia('profile_photo')}><X size={14} /></button>}
          </div>
          <small>Note: Images may be edited or replaced to meet our safety guidelines.</small>
        </div>

        <div className="fd-shop-section fd-feature-row">
          <div>
            <h2>Feature image</h2>
            <p>This image will be used to showcase your brand in the marketplace and in marketing emails.</p>
            <label className="fd-feature-image">
              {featurePreview ? <img src={featurePreview} alt="" /> : <ImageIcon size={34} />}
              <span><ImageIcon size={15} /></span>
              <input hidden type="file" accept="image/*" onChange={(event) => pickFile('feature_image', event)} />
              {featurePreview && <button className="fd-remove-media" type="button" onClick={(event) => { event.preventDefault(); removeMedia('feature_image'); }}><X size={14} /></button>}
            </label>
            <small>Note: Images may be edited or replaced to meet our safety guidelines.</small>
          </div>
          <p>For your feature image to be approved, please choose a photo that shows your product(s) in use and contains no text, watermarks, or logos. We'll review your submission within 5-10 business days.</p>
        </div>

        <div className="fd-shop-section fd-logo-section">
          <h2>Logo</h2>
          <p>Your logo will appear in shop pages and at the top of any marketing email campaigns you send to restaurants.</p>
          <label className="fd-logo-picker" style={logoPreview ? { backgroundImage: `url(${logoPreview})` } : undefined}>
            {!logoPreview && <ImageIcon size={16} />}
            <input hidden type="file" accept="image/*" onChange={(event) => pickFile('logo_image', event)} />
          </label>
          {logoPreview && <button className="fd-remove-logo" type="button" onClick={() => removeMedia('logo_image')}><X size={14} /></button>}
        </div>

        <div className="fd-shop-section">
          <h2>Your brand story</h2>
          <textarea value={form.description} placeholder="Tell restaurants what makes your brand special." onChange={(event) => update('description', event.target.value)} />
        </div>

        <div className="fd-shop-section">
          <h2>Additional images</h2>
          <p>Share photos of your process, studio, or other lifestyle imagery. <button className="fd-inline-link" type="button">See Guidelines</button></p>
          <div className="fd-radio-row">
            <label><input type="radio" name="extraImageFormat" defaultChecked /> 1 Rectangle Image</label>
            <label><input type="radio" name="extraImageFormat" /> 2 Square Images</label>
          </div>
          <label className="fd-extra-upload" style={additionalPreview ? { backgroundImage: `url(${additionalPreview})` } : undefined}>
            {!additionalPreview && <><Upload size={24} /><span>Minimum 790x390 pixels</span></>}
            <input hidden type="file" accept="image/*" multiple onChange={(event) => pickFile('additional_images', event)} />
            {additionalPreview && <button className="fd-remove-media" type="button" onClick={(event) => { event.preventDefault(); removeMedia('additional_images', 0); }}><X size={14} /></button>}
          </label>
        </div>

        <div className="fd-shop-section">
          <h2>About your brand</h2>
          <div className="fd-form-grid">
            <Field label="Company name"><input value={form.company_name} onChange={(event) => update('company_name', event.target.value)} /></Field>
            <Field label="Year established"><input value={form.year_established} onChange={(event) => update('year_established', event.target.value)} /></Field>
            <Field label="Products made in"><select value={form.products_made_in} onChange={(event) => update('products_made_in', event.target.value)}><option>Morocco</option><option>Bosnia and Herzegovina</option><option>France</option></select></Field>
            <Field label="Headquartered in"><select value={form.headquartered_in} onChange={(event) => update('headquartered_in', event.target.value)}><option>Morocco</option><option>Bosnia and Herzegovina</option><option>France</option></select></Field>
            <Field label="City"><input value={city} disabled /></Field>
            <Field label="Instagram link"><input placeholder="instagram.com/" value={form.instagram_handle} onChange={(event) => update('instagram_handle', event.target.value)} /></Field>
          </div>
        </div>

        <div className="fd-shop-section">
          <h2>Brand practice tags</h2>
          <p>Choose any tags that accurately reflect your brand's actions. These tags are completely optional and will be displayed on your shop page.</p>
          <div className="fd-tag-row">
            {['Organic', 'Local', 'Sustainable packaging', 'Family owned'].map((tag) => <button className={form.brand_values.includes(tag) ? 'selected' : ''} key={tag} type="button" onClick={() => toggleTag(tag)}>{tag}</button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopPreviewView({ user, products, setView }) {
  const profile = user?.fournisseur_profile || {};
  const company = profile.company_name || user?.name || 'GreenLeaf Shop';
  const city = user?.city || 'Casablanca';
  const country = profile.headquartered_in || profile.products_made_in || 'Morocco';
  const minimum = profile.first_order_minimum || 0;
  const cover = profileAsset(profile.cover_photo);
  const avatar = profileAsset(profile.profile_photo);
  const logo = profileAsset(profile.logo_image);

  return (
    <section className="fd-public-shop">
      <div className="fd-preview-bar">
        Previewing your shop. When you're ready, you can activate this page from your portal.
        <button type="button" onClick={() => setView('shop')}>Go to portal</button>
      </div>

      <header className="fd-public-brand">{logo ? <img src={logo} alt={company} /> : <Logo size={26} />}</header>
      <div className={cx('fd-public-cover', cover && 'has-image')} style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
        <button type="button"><ImageIcon size={16} /></button>
      </div>

      <main className="fd-public-main">
        <div className="fd-public-profile">
          <div className="fd-public-avatar" style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}>{!avatar && initials(company)}</div>
          <div>
            <h1>{company}</h1>
            <p>{city}, {country} · {minimum} min</p>
            <button type="button">Get it by Jul 16 · Shipping details</button>
          </div>
        </div>

        <label className="fd-public-search">
          <Search size={14} />
          <input placeholder={`Search ${company}`} />
        </label>

        <div className="fd-public-products-head">
          <h2>All products</h2>
          <button type="button"><SlidersHorizontal size={14} /> {products.length}</button>
        </div>

        {products.length ? (
          <div className="fd-public-grid">
            {products.map((product) => (
              <article key={product.id}>
                <div>{productImage(product) ? <img src={productImage(product)} alt="" /> : <Package size={22} />}</div>
                <strong>{product.name}</strong>
                <span>{Number(product.price || 0).toFixed(2)} MAD · {product.unit || 'unit'}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="fd-public-empty">
            <Search size={22} />
            <strong>No products found</strong>
            <span>Don't see what you're looking for?</span>
            <button type="button">Request unlisted product</button>
          </div>
        )}
      </main>

      <section className="fd-public-cta">
        <h2>The best selection of local suppliers for your restaurant, all in one place</h2>
        <div><button type="button">Sign up to buy</button><button type="button">Sign up to sell</button></div>
      </section>

      <footer className="fd-public-footer">
        <div>
          <h3>Company</h3>
          {['About us', 'Newsroom', 'Careers', 'Affiliates', 'Blog', 'Hub'].map((item) => <button key={item} type="button">{item}</button>)}
        </div>
        <div>
          <h3>Explore</h3>
          {['Help center', 'GreenLeaf Markets', 'Sign up to sell', 'POS integration', 'How GreenLeaf works', 'Large retailers', 'Refer a brand'].map((item) => <button key={item} type="button">{item}</button>)}
        </div>
        <small>©2026 GreenLeaf Wholesale, Inc.</small>
      </footer>
    </section>
  );
}

function ShopSettingsView({ user, setView, setUser, onStatusChange }) {
  const profile = user?.fournisseur_profile || {};
  const settings = profile.shop_settings || {};
  const [form, setForm] = useState({
    company_name: profile.company_name || '',
    category: profile.category || 'legumes',
    fulfillment_email: profile.fulfillment_email || user?.email || '',
    marketing_email: profile.marketing_email || `sales+${(profile.company_name || 'supplier').toLowerCase().replace(/\s+/g, '')}@greenleaf.ma`,
    first_order_minimum: profile.first_order_minimum || '',
    reorder_minimum: profile.reorder_minimum || '',
    lead_time_days: profile.lead_time_days || '',
  });
  const [leadAuto, setLeadAuto] = useState(Boolean(settings.lead_auto));
  const [scheduled, setScheduled] = useState(settings.scheduled_orders ?? true);
  const [onlineOnly, setOnlineOnly] = useState(settings.online_only ?? true);
  const [social, setSocial] = useState(settings.social_sellers ?? true);
  const [businessUse, setBusinessUse] = useState(settings.business_use_buyers ?? true);
  const [preorders, setPreorders] = useState(settings.qualified_preorders ?? true);
  const [defaultMinimums, setDefaultMinimums] = useState(Boolean(settings.default_minimums));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value ?? ''));
      ['Casablanca'].forEach((zone, index) => data.append(`delivery_zones[${index}]`, zone));
      Object.entries({
        lead_auto: leadAuto,
        scheduled_orders: scheduled,
        online_only: onlineOnly,
        social_sellers: social,
        business_use_buyers: businessUse,
        qualified_preorders: preorders,
        default_minimums: defaultMinimums,
      }).forEach(([key, value]) => data.append(`shop_settings[${key}]`, value ? '1' : '0'));
      const response = await axios.put('/api/fournisseur/shop-setup/page', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateStoredUser(setUser, response.data?.user);
      onStatusChange?.();
      setMessage('Saved. Your settings are updated.');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setMessage(errors ? Object.values(errors)[0][0] : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="fd-page fd-settings">
      <div className="fd-page-head">
        <div><h1>Shop settings</h1><p>Edit your shop information, order options, and more.</p></div>
        <div className="fd-actions"><button className="fd-dark-btn" disabled={saving} type="button" onClick={save}>{saving ? 'Saving...' : 'Save'}</button><button className="fd-link-btn" type="button" onClick={() => setView('shop-preview')}>View shop</button></div>
      </div>
      {message && <div className={message.startsWith('Could') ? 'fd-error' : 'fd-success'}>{message}</div>}

      <div className="fd-section">
        <h2>Shop information</h2>
        <div className="fd-form-grid">
          <Field label="Company name"><input value={form.company_name} onChange={(event) => update('company_name', event.target.value)} /></Field>
          <Field label="Fulfillment email"><input value={form.fulfillment_email} onChange={(event) => update('fulfillment_email', event.target.value)} /></Field>
          <Field label="Primary category"><select value={form.category} onChange={(event) => update('category', event.target.value)}><option value="legumes">Fresh produce</option><option value="viandes">Meat & fish</option><option value="boissons">Drinks</option><option value="epices">Spices</option><option value="produits_secs">Dry goods</option><option value="other">Food products</option></select></Field>
        </div>
      </div>

      <div className="fd-section">
        <h2>Connected accounts</h2>
        <p>Third-party accounts you have authorized GreenLeaf to access on your behalf.</p>
        <div className="fd-connected">
          <Field label="Marketing email address"><input value={form.marketing_email} onChange={(event) => update('marketing_email', event.target.value)} /></Field>
          <button className="fd-dark-btn" type="button" onClick={save}>Update email</button>
        </div>
      </div>

      <div className="fd-section">
        <h2>Shop lead time</h2>
        <p>Tell customers how long it takes to prepare an order before shipping.</p>
        <label className="fd-radio"><input type="radio" checked={leadAuto} onChange={() => setLeadAuto(true)} /> Automatically adjusted</label>
        <label className="fd-radio"><input type="radio" checked={!leadAuto} onChange={() => setLeadAuto(false)} /> Manually set</label>
      </div>

      <div className="fd-section fd-split-lines">
        <h2>Fulfillment options</h2>
        <div><strong>Scheduled orders</strong><p>Allow restaurants to schedule orders up to 6 months in advance.</p><Toggle checked={scheduled} onChange={setScheduled} label /></div>
      </div>

      <div className="fd-section fd-split-lines">
        <h2>Restaurant options</h2>
        <div><strong>Sell to online-only restaurants</strong><Toggle checked={onlineOnly} onChange={setOnlineOnly} label /></div>
        <div><strong>Sell to social sellers</strong><p>These are sellers who exclusively sell on social media platforms.</p><Toggle checked={social} onChange={setSocial} label /></div>
        <div><strong>Sell to business-use buyers</strong><p>Hotels, restaurants, and corporate buyers purchasing for their own use.</p><Toggle checked={businessUse} onChange={setBusinessUse} label /></div>
        <div><strong>Sell preorders to qualified restaurants only</strong><Toggle checked={preorders} onChange={setPreorders} label /></div>
      </div>

      <div className="fd-section">
        <h2>Order minimums</h2>
        <p>Set your first order and reorder minimums.</p>
        <div className="fd-form-grid">
          <Field label="First order minimum"><input value={form.first_order_minimum} placeholder="MAD -" onChange={(event) => update('first_order_minimum', event.target.value)} /></Field>
          <Field label="Reorder minimum"><input value={form.reorder_minimum} placeholder="MAD -" onChange={(event) => update('reorder_minimum', event.target.value)} /></Field>
          <Field label="Lead time days"><input value={form.lead_time_days} placeholder="2" onChange={(event) => update('lead_time_days', event.target.value)} /></Field>
        </div>
        <div className="fd-line-toggle"><span>Apply default order minimums to all regions</span><Toggle checked={defaultMinimums} onChange={setDefaultMinimums} label /></div>
      </div>

      <div className="fd-section">
        <h2>Custom catalog translations</h2>
        <p>Add languages you would like to provide manual translations for.</p>
        <Field label="Add language"><select><option>English (default)</option><option>French</option><option>Arabic</option></select></Field>
      </div>

      <div className="fd-section">
        <h2>Pause mode</h2>
        <p>Pause mode lets you temporarily put your shop on hold. Your products are still visible, but you will not receive new orders.</p>
        <div className="fd-form-grid">
          <Field label="Start Date"><input type="date" /></Field>
          <Field label="End Date"><input type="date" /></Field>
        </div>
      </div>
    </section>
  );
}

function ShippingToolsView({ user, setUser, onStatusChange }) {
  const profile = user?.fournisseur_profile || {};
  const settings = profile.shop_settings || {};
  const [handling, setHandling] = useState(Boolean(settings.handling_fee_enabled));
  const [freeShipping, setFreeShipping] = useState(Boolean(settings.free_shipping_enabled));
  const [flatRate, setFlatRate] = useState(settings.flat_rate || '24');
  const [origin, setOrigin] = useState(settings.shipping_origin || user?.city || 'Casablanca');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await saveSupplierProfile({
        shop_settings: { ...settings, handling_fee_enabled: handling, free_shipping_enabled: freeShipping, flat_rate: flatRate, shipping_origin: origin },
      }, setUser);
      onStatusChange?.();
      setMessage('Saved. Shipping tools are updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save shipping settings.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="fd-page fd-shipping">
      <div className="fd-shipping-hero">
        <div>
          <p>Shipping tools</p>
          <h1>Offer free and predictable shipping to restaurants across Morocco</h1>
          <span>Simplify checkout with predictable delivery prices and clear shipping zones.</span>
          <div><button className="fd-dark-btn" type="button" onClick={() => setFreeShipping(true)}>Set up free shipping</button><button className="fd-light-btn" type="button" onClick={save}>{saving ? 'Saving...' : 'Save shipping'}</button></div>
        </div>
        <div className="fd-checkout-card"><strong>Checkout</strong><span /><span /><b>Shipping MAD 24.00</b></div>
      </div>
      {message && <div className={message.startsWith('Could') ? 'fd-error' : 'fd-success'}>{message}</div>}

      <div className="fd-tabs under"><button className="active">Your shipping zones</button><button>Preferences</button></div>
      <div className="fd-section">
        <h2>Your shipping zones</h2>
        <p>Customize your shipping rates for the regions you sell to.</p>
        <button className="fd-zone-create" type="button"><Plus size={18} /> Create a shipping zone</button>
      </div>
      <div className="fd-faq">
        <h2>You may be wondering...</h2>
        {[
          "How does shipping work if I don't set up any shipping zones?",
          'What if I have a free shipping minimum and a free shipping promotion?',
          'How do free shipping minimums work with GreenLeaf shipping?',
          'What if my actual shipping costs are different from my flat rates?',
        ].map((question) => <button key={question} type="button">{question}<ChevronDown size={17} /></button>)}
      </div>
      <div className="fd-section">
        <h2>Shipping origins</h2>
        <p>Add the locations that you ship products from.</p>
        <Field label="Shipping origin"><input value={origin} onChange={(event) => setOrigin(event.target.value)} /></Field>
        <h2>Packing and handling fee</h2>
        <Field label="Flat rate shipping (MAD)"><input value={flatRate} onChange={(event) => setFlatRate(event.target.value)} /></Field>
        <div className="fd-line-toggle"><span>Charge a handling fee</span><Toggle checked={handling} onChange={setHandling} label /></div>
        <div className="fd-line-toggle"><span>Offer free shipping</span><Toggle checked={freeShipping} onChange={setFreeShipping} label /></div>
        <div className="fd-note">Adding a handling fee increases shipping cost and can impact free shipping coverage.</div>
      </div>
    </section>
  );
}

function AccountSettingsView({ user, setUser }) {
  const [tab, setTab] = useState('payout');
  const profile = user?.fournisseur_profile || {};
  const saved = profile.shop_settings || {};
  const [digest, setDigest] = useState(true);
  const [skipQuiet, setSkipQuiet] = useState(true);
  const [exclusiveHome, setExclusiveHome] = useState(true);
  const [exclusiveDigest, setExclusiveDigest] = useState(true);
  const [qrCode, setQrCode] = useState(true);
  const [images, setImages] = useState(false);
  const [payout, setPayout] = useState(saved.payout || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await saveSupplierProfile({
        shop_settings: { ...saved, payout, digest, skip_quiet: skipQuiet, exclusive_home: exclusiveHome, exclusive_digest: exclusiveDigest, qr_code: qrCode, packing_images: images },
      }, setUser);
      setMessage('Saved. Account settings are updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save account settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="fd-page fd-account">
      <div className="fd-page-head">
        <div><h1>Account settings</h1><p>Your account information, payout details, and settings.</p></div>
        <button className="fd-dark-btn" disabled={saving} type="button" onClick={save}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
      {message && <div className={message.startsWith('Could') ? 'fd-error' : 'fd-success'}>{message}</div>}
      <div className="fd-tabs under">
        {['payout', 'notifications', 'orders'].map((item) => (
          <button className={tab === item ? 'active' : ''} key={item} type="button" onClick={() => setTab(item)}>{item[0].toUpperCase() + item.slice(1)}</button>
        ))}
      </div>

      {tab === 'payout' && (
        <>
          <div className="fd-section">
            <h2>Payout information</h2>
            <p>Add your account information below for payout services.</p>
            <div className="fd-form-grid">
              <Field label="Account holder name"><input value={payout.name || user?.name || ''} onChange={(event) => setPayout((current) => ({ ...current, name: event.target.value }))} /></Field>
              <Field label="Routing number"><input value={payout.routing || ''} onChange={(event) => setPayout((current) => ({ ...current, routing: event.target.value }))} /></Field>
              <Field label="Account number"><input placeholder="Account number" value={payout.account || ''} onChange={(event) => setPayout((current) => ({ ...current, account: event.target.value }))} /></Field>
              <Field label="Confirm account number"><input value={payout.confirm || ''} onChange={(event) => setPayout((current) => ({ ...current, confirm: event.target.value }))} /></Field>
            </div>
          </div>
          <div className="fd-section">
            <h2>Payout options</h2>
            <p>GreenLeaf will initiate payouts at the time you select.</p>
            <div className="fd-two-cols">
              <label className="fd-radio"><input type="radio" name="payout" /> Next-day payout <span>3.0%</span></label>
              <label className="fd-radio"><input type="radio" name="payout" /> 30-day payout <span>Free</span></label>
            </div>
          </div>
        </>
      )}

      {tab === 'notifications' && (
        <>
          <div className="fd-section">
            <h2>Order reminders</h2>
            <p>Choose how you would like to receive reminder emails about open orders.</p>
            <label className="fd-radio"><input type="radio" checked={!digest} onChange={() => setDigest(false)} /> Individual reminders</label>
            <label className="fd-radio"><input type="radio" checked={digest} onChange={() => setDigest(true)} /> Daily digest</label>
            {digest && (
              <div className="fd-digest">
                <p>When would you like to receive your daily digest?</p>
                <select><option>Monday-Friday</option></select>
                <select><option>8:00 AM</option></select>
                <select><option>Europe/Paris (GMT +02:00)</option></select>
                <label><input type="checkbox" checked={skipQuiet} onChange={(event) => setSkipQuiet(event.target.checked)} /> Skip emails on days with no order activity</label>
              </div>
            )}
          </div>
          <div className="fd-section">
            <h2>Sales rep email notifications</h2>
            <label className="fd-radio"><input type="radio" name="sales" /> Always</label>
            <label className="fd-radio"><input type="radio" name="sales" defaultChecked /> 0% commission orders only</label>
            <label className="fd-radio"><input type="radio" name="sales" /> Never</label>
          </div>
          <div className="fd-section fd-split-lines">
            <h2>Exclusivity requests</h2>
            <div><strong>Updates on GreenLeaf Home</strong><Toggle checked={exclusiveHome} onChange={setExclusiveHome} label /></div>
            <div><strong>Weekly digest</strong><Toggle checked={exclusiveDigest} onChange={setExclusiveDigest} label /></div>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          <div className="fd-section">
            <h2>Product sorting</h2>
            <p>Specify how the products in an order should be displayed.</p>
            {['Alphabetically by product name', 'Alphabetically by SKU', 'By category and then alphabetically by SKU', 'By category and then alphabetically by product name'].map((item, index) => (
              <label className="fd-radio" key={item}><input type="radio" name="sorting" defaultChecked={index === 0} /> {item}</label>
            ))}
          </div>
          <div className="fd-section">
            <h2>Order acceptance</h2>
            <label className="fd-radio"><input type="radio" name="acceptance" defaultChecked /> Manually accept</label>
            <label className="fd-radio"><input type="radio" name="acceptance" /> Automatically accept reorders only</label>
            <label className="fd-radio"><input type="radio" name="acceptance" /> Automatically accept all orders</label>
          </div>
          <div className="fd-section fd-split-lines">
            <h2>Packing slips</h2>
            <div><strong>Include product images</strong><Toggle checked={images} onChange={setImages} label /></div>
            <div><strong>Include a QR code for restaurants to leave a review</strong><Toggle checked={qrCode} onChange={setQrCode} label /></div>
          </div>
        </>
      )}

    </section>
  );
}

function TeamView({ user, setUser }) {
  const [tab, setTab] = useState('members');
  const profile = user?.fournisseur_profile || {};
  const displayName = user?.name || profile.company_name || 'Primary admin';
  const displayEmail = user?.email || profile.fulfillment_email || 'admin@greenleaf.local';
  const initials = displayName.slice(0, 2).toUpperCase();
  const [members, setMembers] = useState(Array.isArray(profile.team_members) ? profile.team_members : []);
  const [draft, setDraft] = useState({ name: '', email: '', role: 'Member', status: 'Invited' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const questions = [
    'Which team members should I add to GreenLeaf?',
    'Can I add my sales representatives?',
    'What are the different permission options?',
    "Can I edit or remove a team member's account?",
    'Who will receive emails?',
  ];
  const allMembers = [
    { name: displayName, email: displayEmail, role: 'Owner', status: 'Active', primary: true },
    ...members,
  ];
  const addMember = () => {
    if (!draft.name && !draft.email) return;
    setMembers((current) => [...current, draft]);
    setDraft({ name: '', email: '', role: 'Member', status: 'Invited' });
  };
  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await saveSupplierProfile({ team_members: members }, setUser);
      setMessage('Saved. Team members are updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save team members.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="fd-page fd-team">
      <div className="fd-page-head compact">
        <div>
          <h1>Team</h1>
          <button className="fd-dark-btn" type="button" onClick={addMember}>Add to team <ChevronDown size={14} /></button>
        </div>
      </div>
      {message && <div className={message.startsWith('Could') ? 'fd-error' : 'fd-success'}>{message}</div>}
      <div className="fd-section fd-team-add">
        <Field label="Name"><input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></Field>
        <Field label="Email"><input value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} /></Field>
        <Field label="Role"><select value={draft.role} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))}><option>Member</option><option>Sales representative</option><option>Admin</option></select></Field>
        <button className="fd-light-btn" type="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save team'}</button>
      </div>

      <div className="fd-tabs under">
        <button className={tab === 'members' ? 'active' : ''} type="button" onClick={() => setTab('members')}>Members</button>
        <button className={tab === 'sales' ? 'active' : ''} type="button" onClick={() => setTab('sales')}>Sales Representatives</button>
      </div>

      {tab === 'members' ? (
        <div className="fd-team-table">
          <div className="fd-team-head">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
          </div>
          {allMembers.map((member, index) => (
            <div className="fd-team-row" key={`${member.email}-${index}`}>
              <div className="fd-team-person">
                <div className="fd-team-avatar">{(member.name || member.email || 'TM').slice(0, 2).toUpperCase()}</div>
                <strong>{member.name || 'Team member'}</strong>
                {member.primary && <em>Primary admin</em>}
              </div>
              <span>{member.email}</span>
              <span>{member.role}</span>
              <b>{member.status}</b>
            </div>
          ))}
        </div>
      ) : (
        <div className="fd-team-table">
          <div className="fd-team-head sales">
            <span>Name</span>
            <span>Email</span>
            <span>GreenLeaf Direct link</span>
            <span>Customers</span>
          </div>
          <div className="fd-no-data">No data available</div>
        </div>
      )}

      <div className="fd-faq fd-team-faq">
        <h2>You may be wondering</h2>
        {questions.map((question) => (
          <button key={question} type="button">{question}<ChevronDown size={17} /></button>
        ))}
      </div>
    </section>
  );
}

function OrdersView({ orders, loading, refresh }) {
  const [acting, setActing] = useState(null);
  const [error, setError] = useState('');

  const updateStatus = async (order, status) => {
    setActing(order.id);
    setError('');
    try {
      await axios.patch(`/api/fournisseur/orders/${order.id}/status`, { status });
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update this order.');
    } finally {
      setActing(null);
    }
  };

  return (
    <section className="fd-page">
      <div className="fd-page-head"><div><h1>Orders</h1><p>Review, accept, and fulfill restaurant orders.</p></div></div>
      {error && <div className="fd-error">{error}</div>}
      <div className="fd-board">
        <div className="fd-toolbar"><button>Any status</button><button>Any price</button><button>Sort by Date</button></div>
        {loading ? <div className="fd-empty">Loading orders...</div> : orders.length === 0 ? <div className="fd-empty"><h3>No orders yet</h3><p>New restaurant orders will appear here.</p></div> : (
          <div className="fd-product-list">
            {orders.map((order) => (
              <article key={order.id}>
                <div className="fd-product-thumb"><ShoppingBag size={18} /></div>
                <div><strong>Order #{order.id}</strong><span>{order.restaurant?.name || order.restaurant_name || 'Restaurant'}</span></div>
                <b>{Number(order.total_price || 0).toFixed(2)} MAD</b>
                <span className="fd-pill">{order.status}</span>
                <div className="fd-order-actions">
                  {order.status === 'pending' && (
                    <>
                      <button className="fd-light-btn" disabled={acting === order.id} type="button" onClick={() => updateStatus(order, 'confirmed')}>Accept</button>
                      <button className="fd-light-btn danger" disabled={acting === order.id} type="button" onClick={() => updateStatus(order, 'rejected')}>Reject</button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button className="fd-light-btn" disabled={acting === order.id} type="button" onClick={() => updateStatus(order, 'delivered')}>Delivered</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PlaceholderView({ title, icon: Icon }) {
  return (
    <section className="fd-page">
      <div className="fd-empty tall">
        <Icon size={34} strokeWidth={1.4} />
        <h3>{title}</h3>
        <p>This section is ready for the next GreenLeaf workflow.</p>
      </div>
    </section>
  );
}

function FournisseurApp() {
  const { lang } = useAppStore();
  const { user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [view, setView] = useState('home');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get('/api/fournisseur/products');
      setProducts(normalizeProducts(response.data));
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get('/api/fournisseur/orders');
      setOrders(response.data?.data || response.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadOnboardingStatus = async () => {
    try {
      const response = await axios.get('/api/fournisseur/shop-setup/status');
      setOnboardingStatus(response.data?.status || null);
      updateStoredUser(setUser, response.data?.user);
    } catch {
      setOnboardingStatus(null);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadOnboardingStatus();
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const content = useMemo(() => {
    if (view === 'home') return <HomeView setView={setView} products={products} user={user} onboardingStatus={onboardingStatus} />;
    if (view === 'products') return <ProductsView products={products} loading={loadingProducts} setView={setView} refresh={async () => { await loadProducts(); await loadOnboardingStatus(); }} user={user} setUser={setUser} onboardingStatus={onboardingStatus} />;
    if (view === 'new-product') return <NewProductView setView={setView} onSaved={loadProducts} />;
    if (view === 'shop-preview') return <ShopPreviewView user={user} products={products} setView={setView} />;
    if (view === 'shop') return <ShopPageView user={user} setView={setView} setUser={setUser} onStatusChange={loadOnboardingStatus} />;
    if (view === 'shop-settings') return <ShopSettingsView user={user} setView={setView} setUser={setUser} onStatusChange={loadOnboardingStatus} />;
    if (view === 'shipping') return <ShippingToolsView user={user} setUser={setUser} onStatusChange={loadOnboardingStatus} />;
    if (view === 'account') return <AccountSettingsView user={user} setUser={setUser} />;
    if (view === 'team') return <TeamView user={user} setUser={setUser} />;
    if (view === 'orders') return <OrdersView orders={orders} loading={loadingOrders} refresh={loadOrders} />;
    if (view === 'messages') return <PlaceholderView title="Messages" icon={MessageSquare} />;
    if (view === 'customers') return <PlaceholderView title="Customers" icon={Users} />;
    if (view === 'marketing') return <PlaceholderView title="Marketing" icon={Megaphone} />;
    if (view === 'analytics') return <PlaceholderView title="Analytics" icon={BarChart3} />;
    return <HomeView setView={setView} products={products} user={user} onboardingStatus={onboardingStatus} />;
  }, [view, products, orders, loadingProducts, loadingOrders, user, setUser, onboardingStatus]);

  if (view === 'shop-preview') {
    return (
      <div className="fd-preview-shell">
        {content}
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="fd-shell">
      <Sidebar view={view} setView={setView} user={user} onLogout={onLogout} lang={lang} />
      <main className="fd-main">{content}</main>
      <style>{styles}</style>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=Inter:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; }
.fd-shell { min-height: 100vh; display: grid; grid-template-columns: 210px 1fr; background: var(--page-bg, #f8f7f3); color: var(--page-text, #20211f); font-family: Inter, system-ui, sans-serif; }
.fd-sidebar { height: 100vh; position: sticky; top: 0; display: flex; flex-direction: column; background: var(--sidebar-bg, var(--card-bg)); border-right: 1px solid var(--sidebar-border, #dfded8); overflow-y: auto; }
.fd-sidebar-head { min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 14px 0 18px; }
.fd-brand { min-width: 0; display: flex; align-items: center; }
.fd-brand a { max-width: 132px; overflow: hidden; }
.fd-brand a > div:last-child { min-width: 0; }
.fd-bell-btn { width: 34px; height: 34px; border-radius: 999px; border: 1px solid var(--page-border); background: var(--card-bg); color: var(--page-text); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.fd-bell-btn:hover { background: var(--card-hover-bg); }
.fd-avatar { flex: 0 0 auto; width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #3a713d, #e8be72); background-size: cover; background-position: center; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
.fd-nav { padding: 0 8px; display: flex; flex-direction: column; gap: 2px; }
.fd-nav button, .fd-subnav button, .fd-side-bottom button, .fd-side-bottom a { min-height: 31px; display: flex; align-items: center; gap: 10px; border: 0; background: transparent; color: #3f423d; text-decoration: none; font: 12px Inter, sans-serif; text-align: left; border-radius: 4px; padding: 0 10px; cursor: pointer; }
.fd-nav button span { flex: 1; }
.fd-parent-row svg:last-child { transform: rotate(-90deg); transition: transform .16s ease; }
.fd-parent-row.open svg:last-child { transform: rotate(0deg); }
.fd-nav button.active, .fd-nav button:hover, .fd-subnav button.active, .fd-subnav button:hover, .fd-side-bottom button:hover, .fd-side-bottom a:hover { background: #efefeb; }
.fd-subnav { display: flex; flex-direction: column; gap: 2px; padding-left: 16px; }
.fd-subnav button { color: #555852; }
.fd-side-bottom { margin-top: auto; border-top: 1px solid #ecebe6; padding: 10px 8px 14px; display: flex; flex-direction: column; gap: 2px; }
.fd-main { min-width: 0; height: 100vh; overflow-y: auto; }
.fd-page { max-width: 980px; padding: 34px 34px 80px; }
.fd-page h1 { margin: 0; font-size: 30px; line-height: 1.12; letter-spacing: -.03em; }
.fd-page h2 { margin: 0 0 7px; font-size: 20px; letter-spacing: -.02em; }
.fd-page h3 { margin: 0; font-size: 17px; }
.fd-page p, .fd-sub { color: #5f625b; font-size: 13px; line-height: 1.5; }
.fd-kicker { margin: 0 0 4px; color: #6c6f68; }
.fd-card, .fd-board, .fd-section { background: var(--card-bg); border: 1px solid var(--page-border); border-radius: 2px; }
.fd-card { padding: 28px; }
.fd-upload-card { margin-top: 28px; min-height: 178px; display: flex; justify-content: space-between; align-items: center; }
.fd-upload-card h3 span { font-size: 11px; padding: 3px 7px; background: #edf3e5; color: #516c35; border-radius: 2px; margin-left: 8px; }
.fd-home-grid { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.fd-home-grid .fd-card { min-height: 220px; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; }
.fd-mini-status { margin-top: 20px; padding: 18px 22px; }
.fd-mini-status div { height: 6px; background: #ecebe6; margin-top: 10px; }
.fd-mini-status span { display: block; height: 100%; background: #242424; }
.fd-status-list { list-style: none; padding: 14px 0 0; margin: 0; display: grid; gap: 7px; }
.fd-status-list li { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 12px; }
.fd-status-list li.done { color: var(--page-text); }
.fd-status-list li span { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--card-hover-bg); color: inherit; font-size: 11px; }
.fd-status-note { margin: 14px 0 0; color: var(--text-muted); font-size: 12px; }
.fd-dark-btn, .fd-light-btn, .fd-muted-btn, .fd-link-btn { min-height: 40px; padding: 0 20px; border-radius: 3px; font-weight: 600; font-size: 13px; cursor: pointer; display: inline-flex; gap: 8px; align-items: center; justify-content: center; }
.fd-dark-btn { background: var(--gl-green, #2D9B4F); color: white; border: 1px solid var(--gl-green, #2D9B4F); }
.fd-light-btn { background: var(--card-bg); color: var(--page-text); border: 1px solid var(--page-border); }
.fd-light-btn.danger { color: #9e281f; border-color: #edc1bb; background: #fff8f7; }
.fd-muted-btn { background: #efefeb; color: #989a94; border: 1px solid #efefeb; }
.fd-link-btn { background: transparent; border: 0; text-decoration: underline; padding: 0 4px; min-height: 30px; color: #30312e; }
.fd-page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.fd-page-head.compact { margin-bottom: 18px; }
.fd-page-head.compact .fd-dark-btn { margin-top: 12px; }
.fd-page-head.sticky { position: sticky; top: 0; z-index: 5; background: #f8f7f3; padding: 0 0 18px; border-bottom: 1px solid #e3e2dd; }
.fd-actions { display: flex; gap: 12px; align-items: center; }
.fd-actions.left { justify-content: flex-start; margin-top: 12px; }
.fd-board { overflow: hidden; }
.fd-tabs { height: 54px; display: flex; align-items: center; gap: 26px; padding: 0 28px; border-bottom: 1px solid #e4e3dd; }
.fd-tabs button { border: 0; background: transparent; color: #5f625b; font-size: 13px; cursor: pointer; height: 100%; border-bottom: 2px solid transparent; }
.fd-tabs button.active { color: #20211f; border-bottom-color: #20211f; }
.fd-tabs button span { margin-left: 6px; background: #efefeb; border-radius: 3px; padding: 2px 5px; font-size: 11px; }
.fd-tabs.under { margin-bottom: 22px; padding-left: 0; }
.fd-toolbar { min-height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 28px; }
.fd-toolbar label { width: 280px; height: 38px; border: 1px solid #e0dfda; border-radius: 999px; display: flex; align-items: center; gap: 8px; padding: 0 14px; color: #8d8f89; }
.fd-toolbar input { border: 0; outline: 0; flex: 1; background: transparent; }
.fd-toolbar button { height: 38px; border: 1px solid var(--page-border); background: var(--card-bg); color: var(--page-text); border-radius: 999px; padding: 0 16px; display: inline-flex; gap: 7px; align-items: center; cursor: pointer; }
.fd-empty { min-height: 310px; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 40px; color: #5f625b; }
.fd-empty.tall { min-height: 560px; }
.fd-empty h3 { color: #20211f; margin-bottom: 6px; }
.fd-empty div { display: flex; gap: 12px; margin-top: 16px; }
.fd-product-list article { min-height: 74px; border-top: 1px solid #ecebe6; padding: 14px 24px; display: grid; grid-template-columns: 48px minmax(200px,1fr) 130px 120px 120px; align-items: center; gap: 14px; }
.fd-order-actions { display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
.fd-order-actions .fd-light-btn { min-height: 32px; padding: 0 12px; font-size: 12px; }
.fd-product-thumb { width: 42px; height: 42px; background: #f3f2ee; border: 1px solid #e0dfda; display: flex; align-items: center; justify-content: center; color: #8a8c86; overflow: hidden; }
.fd-product-thumb img { width: 100%; height: 100%; object-fit: cover; }
.fd-product-list strong { display: block; font-size: 14px; }
.fd-product-list span { font-size: 12px; color: #6a6d66; }
.fd-pill { text-transform: capitalize; background: #f3f2ee; padding: 6px 10px; border-radius: 999px; display: inline-flex; justify-content: center; }
.fd-back { border: 0; background: transparent; color: #555851; font-size: 13px; cursor: pointer; margin-bottom: 12px; }
.fd-section { padding: 28px; margin-bottom: 18px; }
.fd-section h2 button { float: right; border: 0; background: transparent; text-decoration: underline; cursor: pointer; }
.fd-field { display: flex; flex-direction: column; gap: 7px; margin-top: 16px; font-size: 13px; font-weight: 500; }
.fd-field input, .fd-field select, .fd-field textarea, .fd-wide-input { width: 100%; border: 1px solid var(--input-border); background: var(--input-bg); color: var(--input-text); min-height: 38px; padding: 9px 12px; outline: 0; font: 13px Inter, sans-serif; }
.fd-field textarea { min-height: 150px; resize: vertical; }
.fd-field em { align-self: flex-end; color: #70736c; font-size: 12px; font-style: normal; }
.fd-field small { color: #70736c; font-weight: 400; }
.fd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 18px; }
.fd-image-grid { display: grid; grid-template-columns: 240px repeat(4, 1fr); gap: 10px; margin: 18px 0 12px; }
.fd-feature-upload { min-height: 240px; grid-row: span 2; border: 1px dashed #777a73; background: #fafaf8; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
.fd-image-slot { min-height: 112px; border: 1px solid #e0dfda; display: flex; align-items: center; justify-content: center; color: #c3c2bc; overflow: hidden; }
.fd-image-slot img { width: 100%; height: 100%; object-fit: cover; }
.fd-radio { display: flex; align-items: center; gap: 9px; margin-top: 12px; font-size: 13px; color: #333530; }
.fd-radio span { margin-left: auto; color: #555851; }
.fd-zones { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.fd-zones button { border: 1px solid var(--page-border); background: var(--card-bg); color: var(--page-text); padding: 8px 12px; border-radius: 999px; cursor: pointer; }
.fd-zones button.selected { background: var(--gl-green, #2D9B4F); color: #fff; border-color: var(--gl-green, #2D9B4F); }
.fd-error { background: #f8e7e4; color: #9e281f; border: 1px solid #edc1bb; padding: 12px 14px; margin-bottom: 18px; }
.fd-success { background: #edf5e8; color: #42692e; border: 1px solid #c7dfb9; padding: 12px 14px; margin-bottom: 18px; }
.fd-shop-page { max-width: 1040px; }
.fd-shop-panel { background: var(--card-bg); border: 1px solid var(--page-border); }
.fd-shop-section { position: relative; padding: 42px 46px; border-top: 1px solid #dfded8; }
.fd-shop-section:first-child { border-top: 0; }
.fd-shop-section h2 { margin-bottom: 8px; }
.fd-shop-section small { display: block; margin-top: 18px; color: #767970; font-size: 12px; }
.fd-cover-wrap { position: relative; margin-top: 26px; padding-bottom: 42px; }
.fd-cover-preview { position: relative; height: 190px; border-radius: 14px; overflow: hidden; background: linear-gradient(135deg, #177579 0%, #20a4bd 52%, #e4b85f 100%); background-size: cover; background-position: center; color: #fff; }
.fd-cover-preview::before { content: ''; position: absolute; inset: 28px 34px; border-radius: 10px; background: linear-gradient(90deg, rgba(255,255,255,.18), rgba(255,255,255,.04)); border: 1px solid rgba(255,255,255,.2); }
.fd-cover-preview::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 78% 35%, rgba(255,255,255,.24), transparent 24%), linear-gradient(90deg, rgba(0,0,0,.05), rgba(0,0,0,0)); }
.fd-cover-preview label, .fd-feature-image span, .fd-logo-picker { position: absolute; right: 18px; bottom: 18px; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--page-border); background: var(--card-bg); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--page-text); z-index: 2; }
.fd-remove-media, .fd-remove-avatar, .fd-remove-logo { position: absolute; border: 1px solid var(--page-border); background: var(--card-bg); color: var(--page-text); width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; z-index: 4; }
.fd-remove-media { right: 66px; bottom: 23px; }
.fd-remove-avatar { left: 92px; bottom: 18px; }
.fd-remove-logo { left: calc(50% + 32px); top: calc(58% + 18px); }
.fd-profile-bubble { position: absolute; left: 34px; bottom: 12px; width: 76px; height: 76px; border-radius: 50%; border: 4px solid #fff; background: linear-gradient(135deg, #3a713d, #e8be72); background-size: cover; background-position: center; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; box-shadow: 0 6px 14px rgba(0,0,0,.08); z-index: 3; cursor: pointer; }
.fd-feature-row { display: grid; grid-template-columns: 300px minmax(240px, 1fr); gap: 70px; align-items: center; }
.fd-feature-image { position: relative; width: 280px; height: 280px; margin-top: 26px; border-radius: 14px; background: #efefeb; border: 1px solid #deddd7; display: flex; align-items: center; justify-content: center; color: #91948d; overflow: hidden; cursor: pointer; }
.fd-feature-image img { width: 100%; height: 100%; object-fit: cover; }
.fd-logo-section { min-height: 340px; }
.fd-logo-picker { left: 50%; top: 58%; right: auto; bottom: auto; transform: translate(-50%, -50%); box-shadow: 0 8px 18px rgba(0,0,0,.08); background-size: cover; background-position: center; }
.fd-shop-section textarea { width: 100%; min-height: 150px; resize: vertical; border: 1px solid #deddd7; padding: 14px; font: 14px Inter, sans-serif; margin-top: 16px; }
.fd-inline-link { border: 0; background: transparent; text-decoration: underline; padding: 0; cursor: pointer; }
.fd-radio-row { display: flex; gap: 34px; margin: 18px 0; }
.fd-radio-row label { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.fd-extra-upload { width: min(620px, 100%); height: 300px; border: 1px dashed #d7d6d1; background: #f6f5f1; background-size: cover; background-position: center; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6b6e67; gap: 12px; cursor: pointer; }
.fd-tag-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; padding-top: 20px; border-top: 1px solid #ecebe6; }
.fd-tag-row button { min-height: 36px; border: 1px solid var(--page-border); background: var(--card-bg); color: var(--page-text); padding: 0 14px; border-radius: 999px; cursor: pointer; }
.fd-tag-row button.selected { background: var(--gl-green, #2D9B4F); color: #fff; border-color: var(--gl-green, #2D9B4F); }
.fd-preview-shell { min-height: 100vh; background: var(--page-bg); color: var(--page-text); font-family: Inter, system-ui, sans-serif; }
.fd-public-shop { min-height: 100vh; background: var(--page-bg); color: var(--page-text); }
.fd-preview-bar { min-height: 38px; padding: 8px 12px; text-align: center; font-size: 11px; color: #555852; border-bottom: 1px solid #ecebe6; }
.fd-preview-bar button { border: 0; background: transparent; text-decoration: underline; margin-left: 4px; cursor: pointer; color: #20211f; }
.fd-public-brand { height: 44px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #ecebe6; }
.fd-public-brand img { max-width: 130px; max-height: 30px; object-fit: contain; }
.fd-public-cover { position: relative; height: 170px; background: linear-gradient(135deg, #177579 0%, #1ba8c0 55%, #e6b75f 100%); background-size: cover; background-position: center; overflow: hidden; }
.fd-public-cover::before { content: 'Pre-register your attendance today'; position: absolute; left: 28px; top: 42px; max-width: 500px; color: #fff; font-size: 34px; line-height: 1.02; font-weight: 800; }
.fd-public-cover::after { content: ''; position: absolute; right: 34px; top: 30px; width: 160px; height: 74px; border: 5px solid rgba(255,255,255,.86); border-radius: 12px; opacity: .8; }
.fd-public-cover.has-image::before, .fd-public-cover.has-image::after { display: none; }
.fd-public-cover button { position: absolute; right: 18px; top: 18px; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--page-border); background: var(--card-bg); display: flex; align-items: center; justify-content: center; color: var(--page-text); cursor: pointer; }
.fd-public-main { max-width: 1040px; margin: 0 auto; padding: 0 18px 28px; }
.fd-public-profile { position: relative; display: flex; gap: 16px; align-items: flex-end; margin-top: -34px; }
.fd-public-avatar { width: 78px; height: 78px; border-radius: 50%; border: 4px solid #fff; background: linear-gradient(135deg, #3a713d, #e8be72); background-size: cover; background-position: center; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; flex: 0 0 auto; }
.fd-public-profile h1 { margin: 0 0 4px; font-size: 21px; }
.fd-public-profile p { margin: 0; color: #5f625b; font-size: 12px; }
.fd-public-profile button { border: 0; background: transparent; color: #20211f; text-decoration: underline; padding: 5px 0 0; font-size: 12px; cursor: pointer; }
.fd-public-search { height: 38px; margin: 22px 0; border: 1px solid #e1e0db; border-radius: 999px; display: flex; align-items: center; gap: 9px; padding: 0 14px; color: #8a8c86; }
.fd-public-search input { border: 0; outline: 0; flex: 1; font-size: 13px; }
.fd-public-products-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.fd-public-products-head h2 { margin: 0; font-family: 'DM Serif Display', Georgia, serif; font-size: 22px; font-weight: 400; }
.fd-public-products-head button { min-width: 46px; height: 34px; border-radius: 999px; border: 0; background: #252525; color: #fff; display: flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; }
.fd-public-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 18px; }
.fd-public-grid article { border: 1px solid var(--page-border); background: var(--card-bg); padding: 12px; }
.fd-public-grid article div { height: 130px; background: #f1f0ec; display: flex; align-items: center; justify-content: center; color: #8a8c86; margin-bottom: 10px; overflow: hidden; }
.fd-public-grid img { width: 100%; height: 100%; object-fit: cover; }
.fd-public-grid strong { display: block; font-size: 13px; }
.fd-public-grid span { color: #62655e; font-size: 12px; }
.fd-public-empty { min-height: 245px; background: #f6f5f1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #5f625b; text-align: center; }
.fd-public-empty strong { color: #20211f; font-size: 13px; }
.fd-public-empty span, .fd-public-empty button { font-size: 12px; }
.fd-public-empty button { border: 0; background: transparent; text-decoration: underline; cursor: pointer; color: #20211f; }
.fd-public-cta { border-top: 1px solid #ecebe6; border-bottom: 1px solid #ecebe6; padding: 38px max(18px, calc((100vw - 1040px) / 2)); }
.fd-public-cta h2 { margin: 0 0 20px; max-width: 720px; font-family: 'DM Serif Display', Georgia, serif; font-weight: 400; font-size: 25px; }
.fd-public-cta div { display: flex; gap: 12px; }
.fd-public-cta button { min-height: 38px; padding: 0 18px; border: 1px solid var(--page-border); background: var(--card-bg); color: var(--page-text); cursor: pointer; }
.fd-public-footer { max-width: 1040px; margin: 0 auto; padding: 34px 18px 44px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.fd-public-footer h3 { margin: 0 0 12px; font-size: 13px; }
.fd-public-footer button { display: block; border: 0; background: transparent; padding: 0; margin: 0 0 10px; font-size: 12px; color: #3f423d; cursor: pointer; }
.fd-public-footer small { grid-column: 1 / -1; color: #555852; font-size: 11px; }
.fd-settings .fd-section, .fd-account .fd-section, .fd-shipping .fd-section { max-width: 760px; }
.fd-connected { display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: end; }
.fd-split-lines > div, .fd-line-toggle { border-top: 1px solid #ecebe6; padding: 18px 0; display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; }
.fd-split-lines > div:first-of-type { border-top: 0; }
.fd-split-lines strong { display: block; font-size: 14px; margin-bottom: 4px; }
.fd-toggle { border: 0; background: transparent; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.fd-toggle span { width: 34px; height: 20px; background: #d8d8d3; border-radius: 999px; position: relative; display: block; }
.fd-toggle span::after { content: ''; position: absolute; width: 16px; height: 16px; top: 2px; left: 2px; border-radius: 50%; background: #fff; transition: left .18s; }
.fd-toggle.on span { background: #111; }
.fd-toggle.on span::after { left: 16px; }
.fd-toggle em { font-style: normal; font-size: 12px; color: #555851; }
.fd-shipping-hero { min-height: 300px; background: #eee3d7; margin: -34px -34px 34px; padding: 52px 80px; display: grid; grid-template-columns: 1fr 280px; gap: 50px; align-items: center; }
.fd-shipping-hero h1 { max-width: 410px; }
.fd-shipping-hero span { display: block; max-width: 430px; color: #555851; font-size: 14px; line-height: 1.5; margin: 14px 0 24px; }
.fd-shipping-hero div div { display: flex; gap: 10px; }
.fd-checkout-card { min-height: 170px; background: var(--card-bg); border-radius: 6px; box-shadow: 0 18px 36px rgba(0,0,0,.12); padding: 28px; display: flex !important; flex-direction: column; gap: 14px !important; }
.fd-checkout-card span { height: 8px; background: #ecebe6; margin: 0; }
.fd-zone-create { width: 100%; height: 72px; background: var(--card-bg); border: 1px solid var(--page-border); color: var(--page-text); display: flex; align-items: center; gap: 14px; padding: 0 24px; cursor: pointer; }
.fd-faq { max-width: 760px; margin: 28px 0; }
.fd-faq button { width: 100%; min-height: 48px; border: 0; border-top: 1px solid #deddd7; background: transparent; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.fd-team-table { max-width: 940px; border-bottom: 1px solid #e3e2dd; margin-bottom: 34px; }
.fd-team-head, .fd-team-row { display: grid; grid-template-columns: 2fr 2fr 1fr 1fr; align-items: center; gap: 16px; min-height: 54px; padding: 0 18px; }
.fd-team-head { background: #f1f0ec; color: #343631; font-size: 11px; font-weight: 700; }
.fd-team-head.sales { grid-template-columns: 1.4fr 1.4fr 2fr 1fr; }
.fd-team-row { border-top: 1px solid #e4e3dd; font-size: 13px; }
.fd-team-person { display: flex; align-items: center; gap: 12px; min-width: 0; }
.fd-team-person strong { font-weight: 500; }
.fd-team-person em { background: #eeeeea; color: #5f625b; font-style: normal; font-size: 11px; padding: 4px 7px; }
.fd-team-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #3a713d, #e8be72); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.fd-team-row b { width: max-content; background: #edf3e7; color: #477037; font-size: 11px; padding: 5px 8px; font-weight: 500; }
.fd-no-data { min-height: 112px; display: flex; align-items: center; justify-content: center; color: #4d504a; font-size: 13px; border-top: 1px solid #e4e3dd; }
.fd-team-faq { margin-top: 20px; }
.fd-team-add { max-width: 940px; display: grid; grid-template-columns: 1fr 1fr 180px auto; gap: 12px; align-items: end; }
.fd-note, .fd-digest { background: #f1f0eb; padding: 18px; color: #565952; font-size: 13px; margin-top: 14px; }
.fd-digest { display: grid; grid-template-columns: 1fr 140px 1fr; gap: 12px; }
.fd-digest p, .fd-digest label { grid-column: 1 / -1; }
.fd-digest select { min-height: 40px; border: 1px solid var(--input-border); padding: 0 12px; background: var(--input-bg); color: var(--input-text); }
.fd-two-cols { max-width: 520px; }
@media (max-width: 900px) {
  .fd-shell { grid-template-columns: 1fr; }
  .fd-sidebar { position: relative; height: auto; min-height: auto; }
  .fd-sidebar-head { min-height: 62px; }
  .fd-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .fd-subnav { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; padding-left: 0; }
  .fd-side-bottom { margin-top: 10px; }
  .fd-main { height: auto; }
  .fd-page { padding: 24px 16px 56px; }
  .fd-page-head { flex-direction: column; }
  .fd-home-grid, .fd-shipping-hero, .fd-form-grid, .fd-connected { grid-template-columns: 1fr; }
  .fd-image-grid { grid-template-columns: repeat(2, 1fr); }
  .fd-feature-upload { grid-row: auto; min-height: 180px; }
  .fd-feature-row { grid-template-columns: 1fr; gap: 24px; }
  .fd-shop-section { padding: 28px 18px; }
  .fd-team-add { grid-template-columns: 1fr; }
  .fd-team-head { display: none; }
  .fd-team-row { grid-template-columns: 1fr; gap: 8px; padding: 14px 8px; }
  .fd-toolbar { flex-wrap: wrap; padding: 12px; }
  .fd-toolbar label { width: 100%; }
  .fd-product-list article { grid-template-columns: 42px 1fr; }
  .fd-product-list article > b, .fd-product-list article > span, .fd-product-list article > button { grid-column: 2; }
  .fd-order-actions { grid-column: 2; justify-content: flex-start; flex-wrap: wrap; }
}
`;

export default FournisseurApp;
