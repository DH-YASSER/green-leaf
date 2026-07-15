// Mock API Engine for Green Leaf
// Intercepts API requests and provides a fully interactive experience using localStorage.

import {
  MOCK_FOURNISSEURS,
  MOCK_PRODUCTS,
  MOCK_REVIEWS,
  MOCK_ORDERS,
  MOCK_MESSAGES,
  MOCK_PROMOTIONS
} from './mockData';

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────
const initStorage = () => {
  if (!localStorage.getItem('gl_fournisseurs')) localStorage.setItem('gl_fournisseurs', JSON.stringify(MOCK_FOURNISSEURS));
  if (!localStorage.getItem('gl_products'))     localStorage.setItem('gl_products',     JSON.stringify(MOCK_PRODUCTS));
  if (!localStorage.getItem('gl_reviews'))      localStorage.setItem('gl_reviews',      JSON.stringify(MOCK_REVIEWS));
  if (!localStorage.getItem('gl_orders'))       localStorage.setItem('gl_orders',       JSON.stringify(MOCK_ORDERS));
  if (!localStorage.getItem('gl_messages'))     localStorage.setItem('gl_messages',     JSON.stringify(MOCK_MESSAGES));
  if (!localStorage.getItem('gl_promotions'))   localStorage.setItem('gl_promotions',   JSON.stringify(MOCK_PROMOTIONS));
};
initStorage();

const get = (key) => JSON.parse(localStorage.getItem(key));
const set = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const delay = (ms = 280) => new Promise(r => setTimeout(r, ms));

// ─── ORDER MAPPER ─────────────────────────────────────────────────────────
const mapOrder = (o) => {
  const items = (o.products || []).map(p => ({
    product_name: p.name || 'Produit',
    quantity: p.quantity || 1,
    unit: p.unit || 'Kg',
    unit_price: p.price || 0,
  }));
  return {
    ...o,
    total_amount: o.total,
    items,
    items_count: (o.products || []).reduce((a, p) => a + (p.quantity || 1), 0),
    subtotal: o.total,
    discount: 0,
    tax: 0,
  };
};

// ─── CURRENT USER ─────────────────────────────────────────────────────────
const currentUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) || { id: 'rest-1', name: 'Chef Youssef', company_name: 'Le Bistro Vert', role: 'restaurant' }; }
  catch { return { id: 'rest-1', name: 'Chef Youssef', company_name: 'Le Bistro Vert', role: 'restaurant' }; }
};

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────
export const handleMockRequest = async (config) => {
  await delay();

  const { url, method, data: rawData, params } = config;
  let data = {};
  if (rawData) {
    if (rawData instanceof FormData) {
      // Handle FormData (product image upload)
      rawData.forEach((v, k) => { data[k] = v; });
    } else if (typeof rawData === 'string' && rawData.length > 0) {
      try { data = JSON.parse(rawData); } catch { data = {}; }
    } else if (typeof rawData === 'object') {
      data = rawData;
    }
  }

  const path = url.replace(/^\/api/, '');
  const m = method.toLowerCase();
  console.log(`[Mock API] ${m.toUpperCase()} ${path}`, { params, data });

  // ── AUTH ──────────────────────────────────────────────────────────────
  if (path === '/auth/check-email' && m === 'post') {
    const email = String(data.email || '').trim();
    if (!email) return { data: { exists: false }, status: 200 };
    return { data: { exists: true }, status: 200 };
  }
  if ((path === '/auth/login' || path === '/login' || path === '/admin/login') && m === 'post') {
    const { email } = data;
    let user;
    if (email === 'admin@demo.com' || path === '/admin/login') {
      user = { id: 'admin-1', name: 'Yasser Admin', email: 'admin@greenleaf.com', role: 'admin' };
    } else if (email === 'fournisseur@demo.com') {
      user = { id: 'f1', name: 'Mohamed El Alami', company_name: 'Atlas Prime Maraîcher', email: 'atlas.prime@gmail.com', role: 'fournisseur', city: 'casablanca' };
    } else {
      user = { id: 'rest-1', name: 'Chef Youssef', company_name: 'Le Bistro Vert', email: 'restaurant@greenleaf.com', role: 'restaurant', city: 'casablanca' };
    }
    return { data: { user, token: 'mock-jwt-token-xyz' }, status: 200 };
  }

  if ((path === '/register' || path === '/auth/register') && m === 'post') {
    const role = data.role === 'fournisseur' || data.role === 'company' ? 'fournisseur' : 'restaurant';
    const user = { id: `usr-${Date.now()}`, name: data.name || 'Nouveau Membre', email: data.email, role, company_name: data.company_name || 'Mon Entreprise', city: data.city || 'casablanca' };
    if (role === 'fournisseur') {
      const suppliers = get('gl_fournisseurs');
      suppliers.push({ id: user.id, company_name: user.company_name, name: user.name, city: user.city, email: user.email, phone: data.phone || '+212 660-000000', address: data.address || 'Adresse Professionnelle', description: 'Nouveau fournisseur sur la plateforme Green Leaf.', is_verified: false, avg_rating: 0, reviews_count: 0, created_at: new Date().toISOString().split('T')[0] });
      set('gl_fournisseurs', suppliers);
    }
    return { data: { user, token: 'mock-jwt-token-new' }, status: 200 };
  }

  // ── PUBLIC PRODUCTS (Browse page) ────────────────────────────────────
  if (path === '/products' && m === 'get') {
    const products = get('gl_products');
    const suppliers = get('gl_fournisseurs');
    let filtered = products.filter(p => p.is_active !== false); // only active products show on Browse

    if (params?.category?.length > 0) {
      const cats = params.category.split(',');
      filtered = filtered.filter(p => cats.includes(p.category));
    }
    if (params?.city) {
      const cityIds = suppliers.filter(s => s.city.toLowerCase() === params.city.toLowerCase()).map(s => s.id);
      filtered = filtered.filter(p => cityIds.includes(p.fournisseur_id));
    }
    if (params?.minPrice) filtered = filtered.filter(p => p.price >= parseFloat(params.minPrice));
    if (params?.maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(params.maxPrice));
    if (params?.verifiedOnly === 'true' || params?.verifiedOnly === true) {
      const verifiedIds = suppliers.filter(s => s.is_verified).map(s => s.id);
      filtered = filtered.filter(p => verifiedIds.includes(p.fournisseur_id));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }

    return { data: { products: filtered, fournisseurs: suppliers, total: filtered.length }, status: 200 };
  }

  // ── FOURNISSEUR PRODUCTS (Dashboard) ─────────────────────────────────
  // GET all products for this supplier
  if (path === '/fournisseur/products' && m === 'get') {
    const user = currentUser();
    const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
    const products = get('gl_products').filter(p => p.fournisseur_id === supplierId);
    return { data: products, status: 200 };
  }

  // POST — create new product (saves to gl_products → shows in Browse)
  if (path === '/fournisseur/products' && m === 'post') {
    const user = currentUser();
    const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
    const products = get('gl_products');

    // Handle image: if file uploaded create object URL, else use placeholder
    let imageUrl = null;
    if (data.images instanceof File) {
      imageUrl = URL.createObjectURL(data.images);
    }

    const newProduct = {
      id: `p-${Date.now()}`,
      fournisseur_id: supplierId,
      name: data.name || 'Nouveau Produit',
      description: data.description || '',
      category: data.category || 'legumes',
      price: parseFloat(data.price) || 0,
      unit: data.unit || 'Kg',
      stock: parseInt(data.stock) || 100,
      min_order_qty: parseInt(data.min_order_qty) || 1,
      delivery_zones: data.delivery_zones || '',
      delivery_delay: parseInt(data.delivery_delay) || 1,
      has_active_promo: false,
      promo_discount: 0,
      is_active: true,
      images: imageUrl ? [imageUrl] : [],
      created_at: new Date().toISOString(),
    };

    products.push(newProduct);
    set('gl_products', products);
    console.log(`[Mock API] ✅ Product "${newProduct.name}" saved — now visible in Browse`);
    return { data: newProduct, status: 201 };
  }

  // PUT — update existing product
  if (path.startsWith('/fournisseur/products/') && m === 'put') {
    const id = path.split('/').pop();
    let products = get('gl_products');
    let updated = null;
    products = products.map(p => {
      if (p.id === id) {
        updated = {
          ...p,
          name: data.name ?? p.name,
          description: data.description ?? p.description,
          category: data.category ?? p.category,
          price: data.price ? parseFloat(data.price) : p.price,
          unit: data.unit ?? p.unit,
          stock: data.stock ? parseInt(data.stock) : p.stock,
          min_order_qty: data.min_order_qty ? parseInt(data.min_order_qty) : p.min_order_qty,
          delivery_zones: data.delivery_zones ?? p.delivery_zones,
          delivery_delay: data.delivery_delay ? parseInt(data.delivery_delay) : p.delivery_delay,
        };
        return updated;
      }
      return p;
    });
    set('gl_products', products);
    return { data: updated, status: 200 };
  }

  // DELETE product
  if (path.startsWith('/fournisseur/products/') && m === 'delete') {
    const id = path.split('/').pop();
    const products = get('gl_products').filter(p => p.id !== id);
    set('gl_products', products);
    return { data: { success: true }, status: 200 };
  }

  // ── FOURNISSEUR PROFILE ───────────────────────────────────────────────
  if (path === '/fournisseur/profile' && m === 'get') {
    const user = currentUser();
    const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
    const supplier = get('gl_fournisseurs').find(s => s.id === supplierId) || {};
    return { data: { business_name: supplier.company_name, contact_name: supplier.name, email: supplier.email, phone: supplier.phone, address: supplier.address, region: supplier.city, delivery_zones: supplier.delivery_zones || '', bio: supplier.description || '', avatar: supplier.avatar || null }, status: 200 };
  }

  if (path === '/fournisseur/profile' && m === 'put') {
    const user = currentUser();
    const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
    const suppliers = get('gl_fournisseurs');
    const updated = suppliers.map(s => s.id === supplierId ? { ...s, company_name: data.business_name ?? s.company_name, name: data.contact_name ?? s.name, email: data.email ?? s.email, phone: data.phone ?? s.phone, address: data.address ?? s.address, city: data.region ?? s.city, delivery_zones: data.delivery_zones ?? s.delivery_zones, description: data.bio ?? s.description } : s);
    set('gl_fournisseurs', updated);
    return { data: { success: true }, status: 200 };
  }

  if (path === '/fournisseur/avatar' && m === 'post') {
    // In mock, we just return success — profilePic is handled in React state
    return { data: { success: true, avatar_url: '' }, status: 200 };
  }

  if (path === '/fournisseur/password' && m === 'put') {
    return { data: { success: true }, status: 200 };
  }

  if (path === '/fournisseur/notifications' && m === 'put') {
    return { data: { success: true }, status: 200 };
  }

  // ── PROMOTIONS ────────────────────────────────────────────────────────
  if (path === '/fournisseur/promotions' && m === 'get') {
    const user = currentUser();
    const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
    const promos = get('gl_promotions').filter(p => p.fournisseur_id === supplierId);
    // Enrich with product name
    const products = get('gl_products');
    const enriched = promos.map(pr => ({ ...pr, product_name: products.find(p => p.id === pr.product_id)?.name || pr.title || '—', is_active: pr.active !== false, usage_current: pr.usage_current || 0 }));
    return { data: enriched, status: 200 };
  }

  if (path === '/fournisseur/promotions' && m === 'post') {
    const user = currentUser();
    const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
    const promos = get('gl_promotions');
    const newPromo = {
      id: `promo-${Date.now()}`,
      fournisseur_id: supplierId,
      product_id: data.product_id,
      promo_type: data.promo_type || 'percentage',
      value: parseFloat(data.value) || 0,
      min_qty: parseInt(data.min_qty) || 1,
      start_date: data.start_date,
      end_date: data.end_date,
      usage_limit: parseInt(data.usage_limit) || null,
      usage_current: 0,
      active: true,
      is_active: true,
    };
    promos.push(newPromo);
    set('gl_promotions', promos);
    return { data: newPromo, status: 201 };
  }

  if (path.match(/\/fournisseur\/promotions\/[^/]+$/) && m === 'put') {
    const id = path.split('/').pop();
    let promos = get('gl_promotions');
    let updated = null;
    promos = promos.map(p => { if (p.id === id) { updated = { ...p, ...data }; return updated; } return p; });
    set('gl_promotions', promos);
    return { data: updated, status: 200 };
  }

  if (path.match(/\/fournisseur\/promotions\/[^/]+\/toggle$/) && m === 'patch') {
    const id = path.split('/')[3];
    let promos = get('gl_promotions');
    let updated = null;
    promos = promos.map(p => { if (p.id === id) { updated = { ...p, active: data.is_active, is_active: data.is_active }; return updated; } return p; });
    set('gl_promotions', promos);
    return { data: updated, status: 200 };
  }

  if (path.startsWith('/fournisseur/promotions/') && m === 'delete') {
    const id = path.split('/').pop();
    set('gl_promotions', get('gl_promotions').filter(p => p.id !== id));
    return { data: { success: true }, status: 200 };
  }

  // ── ORDERS ────────────────────────────────────────────────────────────
  if (path === '/orders' && m === 'post') {
    const user = currentUser();
    const { items } = data;
    if (!items || items.length === 0) {
      return { data: { error: 'Cart is empty' }, status: 400 };
    }

    const itemsBySupplier = {};
    items.forEach(item => {
      const fid = item.fournisseurId || item.fournisseur_id || 'f1';
      if (!itemsBySupplier[fid]) {
        itemsBySupplier[fid] = [];
      }
      itemsBySupplier[fid].push(item);
    });

    const createdOrders = [];
    let orders = get('gl_orders') || [];

    for (const [fid, supplierItems] of Object.entries(itemsBySupplier)) {
      const firstItem = supplierItems[0];
      const supplierName = firstItem.fournisseurName || firstItem.fournisseur_name || 'Fournisseur';
      
      const orderTotal = supplierItems.reduce((sum, item) => sum + (item.price || item.unit_price || 0) * item.quantity, 0);

      const newOrder = {
        id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
        restaurant_id: user.id || 'rest-1',
        restaurant_name: user.company_name || user.name || 'Le Bistro Vert',
        fournisseur_id: fid,
        fournisseur_name: supplierName,
        products: supplierItems.map(item => ({
          id: item.productId || item.product_id,
          name: item.name || item.product_name,
          price: item.price || item.unit_price || 0,
          unit: item.unit || 'Kg',
          quantity: item.quantity
        })),
        total: orderTotal,
        total_amount: orderTotal,
        status: 'pending',
        created_at: new Date().toISOString(),
        delivery_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
      };

      createdOrders.push(newOrder);
      orders.unshift(newOrder);
    }

    set('gl_orders', orders);
    return { data: { success: true, orders: createdOrders }, status: 201 };
  }

  if ((path === '/restaurant/orders' || path === '/fournisseur/orders' || path === '/orders') && m === 'get') {
    const user = currentUser();
    let orders = get('gl_orders');
    if (path === '/restaurant/orders') orders = orders.filter(o => o.restaurant_id === (user.id || 'rest-1'));
    else if (path === '/fournisseur/orders') {
      const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
      orders = orders.filter(o => o.fournisseur_id === supplierId);
    }
    if (params?.status && params.status !== 'all') orders = orders.filter(o => o.status === params.status);
    return { data: orders.map(mapOrder), status: 200 };
  }

  if ((path.includes('/orders/') || path.includes('/orders')) && (m === 'put' || m === 'patch')) {
    const segments = path.split('/');
    const idIndex = segments.findIndex(s => s === 'orders') + 1;
    const id = segments[idIndex];
    let orders = get('gl_orders');
    let updated = null;
    orders = orders.map(o => { if (o.id === id) { updated = { ...o, status: data.status }; return updated; } return o; });
    set('gl_orders', orders);
    return { data: updated ? mapOrder(updated) : {}, status: 200 };
  }

  // ── DASHBOARD STATS ───────────────────────────────────────────────────
  if (path === '/fournisseur/dashboard/stats') {
    const user = currentUser();
    const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
    const products = get('gl_products').filter(p => p.fournisseur_id === supplierId);
    const promos = get('gl_promotions').filter(p => p.fournisseur_id === supplierId && p.active !== false);
    const orders = get('gl_orders').filter(o => o.fournisseur_id === supplierId);
    return {
      data: {
        totalProducts: products.length,
        activePromos: promos.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue: orders.filter(o => ['completed','shipped','delivered'].includes(o.status)).reduce((s, o) => s + (o.total || 0), 0),
      },
      status: 200,
    };
  }

  // ── PUBLIC SUPPLIER PROFILES ──────────────────────────────────────────
  if (path.startsWith('/fournisseurs/')) {
    const parts = path.split('/');
    const id = parts[2];
    const sub = parts[3];
    const suppliers = get('gl_fournisseurs');
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return { data: { message: 'Not found' }, status: 404 };
    if (!sub) return { data: supplier, status: 200 };
    if (sub === 'products') return { data: get('gl_products').filter(p => p.fournisseur_id === id && p.is_active !== false), status: 200 };
    if (sub === 'reviews') return { data: get('gl_reviews').filter(r => r.fournisseur_id === id), status: 200 };
  }

  // ── MESSAGES ──────────────────────────────────────────────────────────
  if (path === '/messages' && m === 'get') {
    const messages = get('gl_messages') || [];
    const suppliers = get('gl_fournisseurs') || [];
    const user = currentUser();
    const uid = user.id;
    const convsMap = {};

    messages.forEach(msg => {
      const isSender = msg.sender_id === uid;
      const isRecipient = msg.recipient_id === uid;
      if (!isSender && !isRecipient) return;
      const contactId = isSender ? msg.recipient_id : msg.sender_id;
      const rawName = isSender ? msg.recipient_name : msg.sender_name;
      if (!convsMap[contactId]) {
        let name = rawName;
        if (user.role === 'restaurant') { const s = suppliers.find(s => s.id === contactId); if (s) name = s.company_name; }
        else if (user.role === 'fournisseur' && contactId === 'rest-1') name = 'Le Bistro Vert';
        convsMap[contactId] = { id: contactId, contact_name: name, messages: [], unread_count: 0 };
      }
      convsMap[contactId].messages.push(msg);
      if (isRecipient && !msg.read) convsMap[contactId].unread_count++;
    });

    const convs = Object.values(convsMap).map(c => {
      c.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const last = c.messages[c.messages.length - 1];
      return { id: c.id, contact_name: c.contact_name, last_message_preview: last?.content || '', last_message_time: last?.timestamp || '', unread_count: c.unread_count };
    }).sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));

    return { data: convs, status: 200 };
  }

  if (path.startsWith('/messages/') && m === 'get') {
    const contactId = path.split('/').pop();
    const user = currentUser();
    const uid = user.id;
    let messages = get('gl_messages') || [];
    const thread = messages.filter(msg => (msg.sender_id === uid && msg.recipient_id === contactId) || (msg.sender_id === contactId && msg.recipient_id === uid));
    thread.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let changed = false;
    messages = messages.map(msg => { if (msg.sender_id === contactId && msg.recipient_id === uid && !msg.read) { changed = true; return { ...msg, read: true }; } return msg; });
    if (changed) set('gl_messages', messages);
    return { data: thread.map(msg => ({ sender: msg.sender_id === uid ? 'user' : 'other', content: msg.content, timestamp: msg.timestamp })), status: 200 };
  }

  if (path === '/messages' && m === 'post') {
    const messages = get('gl_messages') || [];
    const suppliers = get('gl_fournisseurs') || [];
    const user = currentUser();
    const recipientId = data.conversationId;
    let recipientName = recipientId === 'rest-1' ? 'Le Bistro Vert' : (suppliers.find(s => s.id === recipientId)?.company_name || 'Contact');
    const newMsg = { id: `m-${Date.now()}`, sender_id: user.id, sender_name: user.company_name || user.name || 'User', recipient_id: recipientId, recipient_name: recipientName, content: data.content, timestamp: new Date().toISOString(), read: false };
    messages.push(newMsg);
    set('gl_messages', messages);
    return { data: { sender: 'user', content: newMsg.content, timestamp: newMsg.timestamp }, status: 201 };
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────
  if (path === '/admin/stats') {
    const orders = get('gl_orders');
    return { data: { totalUsers: get('gl_fournisseurs').length + 5, totalSuppliers: get('gl_fournisseurs').length, totalOrders: orders.length, totalRevenue: orders.reduce((s, o) => s + o.total, 0) }, status: 200 };
  }
  if (path === '/admin/users')       return { data: get('gl_fournisseurs'), status: 200 };
  if (path === '/admin/orders')      return { data: get('gl_orders').map(mapOrder), status: 200 };
  if (path === '/admin/promotions')  return { data: get('gl_promotions'), status: 200 };
  if (path === '/admin/logs')        return { data: [{ id:1, action:'User registration', user:'atlas.prime@gmail.com', ip:'196.206.15.44', date:new Date().toISOString() },{ id:2, action:'Order created', user:'restaurant@greenleaf.com', ip:'196.206.12.89', date:new Date().toISOString() },{ id:3, action:'Admin login', user:'admin@greenleaf.com', ip:'196.206.1.10', date:new Date().toISOString() }], status: 200 };

  // Fallback
  console.warn(`[Mock API] Unhandled: ${m.toUpperCase()} ${path}`);
  return { data: [], status: 200 };
};