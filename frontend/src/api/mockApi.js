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

// Helper to initialize localStorage
const initStorage = () => {
  if (!localStorage.getItem('gl_fournisseurs')) {
    localStorage.setItem('gl_fournisseurs', JSON.stringify(MOCK_FOURNISSEURS));
  }
  if (!localStorage.getItem('gl_products')) {
    localStorage.setItem('gl_products', JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem('gl_reviews')) {
    localStorage.setItem('gl_reviews', JSON.stringify(MOCK_REVIEWS));
  }
  if (!localStorage.getItem('gl_orders')) {
    localStorage.setItem('gl_orders', JSON.stringify(MOCK_ORDERS));
  }
  if (!localStorage.getItem('gl_messages')) {
    localStorage.setItem('gl_messages', JSON.stringify(MOCK_MESSAGES));
  }
  if (!localStorage.getItem('gl_promotions')) {
    localStorage.setItem('gl_promotions', JSON.stringify(MOCK_PROMOTIONS));
  }
};

initStorage();

// Getters from localStorage
const getStorageItem = (key) => JSON.parse(localStorage.getItem(key));
const setStorageItem = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Delay helper to simulate network lag
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const handleMockRequest = async (config) => {
  await delay(); // simulate server delay

  const { url, method, data: rawData, params } = config;
  const data = typeof rawData === 'string' && rawData.length > 0 ? JSON.parse(rawData) : rawData;

  // Normalize URL to remove base path
  const path = url.replace(/^\/api/, '');

  console.log(`[Mock API] ${method.toUpperCase()} ${path}`, { params, data });

  // Helper to map order properties for backward compatibility
  const mapOrder = (o) => {
    const productsList = o.products || [];
    const items = productsList.map(p => ({
      product_name: p.name || 'Produit',
      quantity: p.quantity || 1,
      unit: p.unit || 'Kg',
      unit_price: p.price || 0
    }));

    return {
      ...o,
      total_amount: o.total, // map total to total_amount
      items: items, // map products array to items array
      items_count: productsList.reduce((acc, p) => acc + (p.quantity || 1), 0),
      subtotal: o.total,
      discount: 0,
      tax: 0
    };
  };

  // ----------------------------------------
  // AUTHENTICATION ENDPOINTS
  // ----------------------------------------
  if (path === '/auth/login' || path === '/login' || path === '/admin/login') {
    const { email, password } = data || {};
    let user = null;
    let token = 'mock-jwt-token-xyz';

    if (email === 'admin@demo.com' || path === '/admin/login') {
      user = { id: 'admin-1', name: 'Yasser Admin', email: 'admin@greenleaf.com', role: 'admin' };
    } else if (email === 'fournisseur@demo.com') {
      user = { id: 'f1', name: 'Mohamed El Alami', company_name: 'Atlas Prime Maraîcher', email: 'atlas.prime@gmail.com', role: 'fournisseur', city: 'casablanca' };
    } else {
      user = { id: 'rest-1', name: 'Chef Youssef', company_name: 'Le Bistro Vert', email: 'restaurant@greenleaf.com', role: 'restaurant', city: 'casablanca' };
    }

    return { data: { user, token }, status: 200 };
  }

  if (path === '/register' || path === '/auth/register') {
    const role = data.role === 'fournisseur' || data.role === 'company' ? 'fournisseur' : 'restaurant';
    const user = {
      id: `usr-${Date.now()}`,
      name: data.name || 'Nouveau Membre',
      email: data.email,
      role: role,
      company_name: data.company_name || 'Mon Entreprise',
      city: data.city || 'casablanca'
    };

    if (role === 'fournisseur') {
      const suppliers = getStorageItem('gl_fournisseurs');
      suppliers.push({
        id: user.id,
        company_name: user.company_name,
        name: user.name,
        city: user.city,
        email: user.email,
        phone: data.phone || '+212 660-000000',
        address: data.address || 'Adresse Professionnelle',
        description: 'Nouveau fournisseur sur la plateforme Green Leaf.',
        is_verified: false,
        avg_rating: 0,
        reviews_count: 0,
        created_at: new Date().toISOString().split('T')[0]
      });
      setStorageItem('gl_fournisseurs', suppliers);
    }

    return { data: { user, token: 'mock-jwt-token-new' }, status: 200 };
  }

  // ----------------------------------------
  // PRODUCTS ENDPOINTS
  // ----------------------------------------
  if (path === '/products' && method === 'get') {
    const products = getStorageItem('gl_products');
    const suppliers = getStorageItem('gl_fournisseurs');

    let filtered = [...products];
    if (params) {
      if (params.category && params.category.length > 0) {
        const cats = params.category.split(',');
        filtered = filtered.filter(p => cats.includes(p.category));
      }
      if (params.city) {
        const citySuppliers = suppliers.filter(s => s.city.toLowerCase() === params.city.toLowerCase()).map(s => s.id);
        filtered = filtered.filter(p => citySuppliers.includes(p.fournisseur_id));
      }
      if (params.minPrice) {
        filtered = filtered.filter(p => p.price >= parseFloat(params.minPrice));
      }
      if (params.maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(params.maxPrice));
      }
      if (params.verifiedOnly === 'true' || params.verifiedOnly === true) {
        const verifiedSuppliers = suppliers.filter(s => s.is_verified).map(s => s.id);
        filtered = filtered.filter(p => verifiedSuppliers.includes(p.fournisseur_id));
      }
    }

    return {
      data: {
        products: filtered,
        fournisseurs: suppliers,
        total: filtered.length
      },
      status: 200
    };
  }

  // Supplier Products Subroute
  if (path === '/fournisseur/products') {
    const products = getStorageItem('gl_products');
    // Filter to f1 (demo supplier account)
    const supplierProducts = products.filter(p => p.fournisseur_id === 'f1');
    return { data: supplierProducts, status: 200 };
  }

  if (path.startsWith('/fournisseur/products') && method === 'post') {
    const products = getStorageItem('gl_products');
    const newProduct = {
      id: `p-${Date.now()}`,
      fournisseur_id: 'f1',
      name: data.name,
      description: data.description,
      category: data.category || 'legumes',
      price: parseFloat(data.price),
      unit: data.unit || 'Kg',
      has_active_promo: false,
      promo_discount: 0,
      stock: parseInt(data.stock) || 100
    };
    products.push(newProduct);
    setStorageItem('gl_products', products);
    return { data: newProduct, status: 201 };
  }

  if (path.startsWith('/fournisseur/products/') && method === 'put') {
    const id = path.split('/').pop();
    let products = getStorageItem('gl_products');
    let updated = null;
    products = products.map(p => {
      if (p.id === id) {
        updated = { ...p, ...data, price: parseFloat(data.price), stock: parseInt(data.stock) };
        return updated;
      }
      return p;
    });
    setStorageItem('gl_products', products);
    return { data: updated, status: 200 };
  }

  if (path.startsWith('/fournisseur/products/') && method === 'delete') {
    const id = path.split('/').pop();
    let products = getStorageItem('gl_products');
    products = products.filter(p => p.id !== id);
    setStorageItem('gl_products', products);
    return { data: { success: true }, status: 200 };
  }

  // ----------------------------------------
  // FOURNISSEUR PROMOTIONS ENDPOINTS
  // ----------------------------------------
  if (path === '/fournisseur/promotions' && method === 'get') {
    const promos = getStorageItem('gl_promotions');
    return { data: promos.filter(p => p.fournisseur_id === 'f1'), status: 200 };
  }

  if (path === '/fournisseur/promotions' && method === 'post') {
    const promos = getStorageItem('gl_promotions');
    const newPromo = {
      id: `promo-${Date.now()}`,
      fournisseur_id: 'f1',
      title: data.title,
      description: data.description,
      discount_pct: parseInt(data.discount_pct) || 10,
      start_date: data.start_date,
      end_date: data.end_date,
      active: true
    };
    promos.push(newPromo);
    setStorageItem('gl_promotions', promos);
    return { data: newPromo, status: 201 };
  }

  if (path.startsWith('/fournisseur/promotions/') && method === 'delete') {
    const id = path.split('/').pop();
    let promos = getStorageItem('gl_promotions');
    promos = promos.filter(p => p.id !== id);
    setStorageItem('gl_promotions', promos);
    return { data: { success: true }, status: 200 };
  }

  // ----------------------------------------
  // ORDERS ENDPOINTS
  // ----------------------------------------
  if (path === '/restaurant/orders' || path === '/fournisseur/orders' || path === '/orders') {
    const orders = getStorageItem('gl_orders');
    let filtered = [...orders];

    if (path === '/restaurant/orders') {
      filtered = filtered.filter(o => o.restaurant_id === 'rest-1');
    } else if (path === '/fournisseur/orders') {
      filtered = filtered.filter(o => o.fournisseur_id === 'f1');
    }

    return { data: filtered.map(mapOrder), status: 200 };
  }

  if ((path.includes('/orders/') || path.includes('/orders')) && (method === 'put' || method === 'patch')) {
    const segments = path.split('/');
    const idIndex = segments.findIndex(seg => seg === 'orders') + 1;
    const id = segments[idIndex];

    let orders = getStorageItem('gl_orders');
    let updated = null;
    orders = orders.map(o => {
      if (o.id === id) {
        updated = { ...o, status: data.status };
        return updated;
      }
      return o;
    });
    setStorageItem('gl_orders', orders);
    return { data: mapOrder(updated), status: 200 };
  }

  // ----------------------------------------
  // DASHBOARD STATS ENDPOINTS
  // ----------------------------------------
  if (path === '/fournisseur/dashboard/stats') {
    const products = getStorageItem('gl_products').filter(p => p.fournisseur_id === 'f1');
    const promos = getStorageItem('gl_promotions').filter(p => p.fournisseur_id === 'f1');
    const orders = getStorageItem('gl_orders').filter(o => o.fournisseur_id === 'f1');

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'shipped').reduce((sum, o) => sum + o.total, 0);

    return {
      data: {
        totalProducts: products.length,
        activePromos: promos.length,
        pendingOrders: pendingOrders,
        totalRevenue: totalRevenue
      },
      status: 200
    };
  }

  // ----------------------------------------
  // PUBLIC FOURNISSEURS ENDPOINTS
  // ----------------------------------------
  if (path.startsWith('/fournisseurs/')) {
    const parts = path.split('/');
    const id = parts[2];
    const subRoute = parts[3];

    const suppliers = getStorageItem('gl_fournisseurs');
    const supplier = suppliers.find(s => s.id === id);

    if (!supplier) {
      return { data: { message: 'Supplier not found' }, status: 404 };
    }

    if (!subRoute) {
      return { data: supplier, status: 200 };
    }

    if (subRoute === 'products') {
      const products = getStorageItem('gl_products').filter(p => p.fournisseur_id === id);
      return { data: products, status: 200 };
    }

    if (subRoute === 'reviews') {
      const reviews = getStorageItem('gl_reviews').filter(r => r.fournisseur_id === id);
      return { data: reviews, status: 200 };
    }
  }

  // ----------------------------------------
  // MESSAGES ENDPOINTS
  // ----------------------------------------
  if (path === '/messages') {
    const messages = getStorageItem('gl_messages');
    return { data: messages, status: 200 };
  }

  if (path.startsWith('/messages/') && method === 'get') {
    const conversationId = path.split('/').pop();
    const messages = getStorageItem('gl_messages');
    // Return messages belonging to f1/rest-1
    return { data: messages, status: 200 };
  }

  if (path === '/messages' && method === 'post') {
    const messages = getStorageItem('gl_messages');
    const newMsg = {
      id: `m-${Date.now()}`,
      sender_id: data.sender_id || 'rest-1',
      sender_name: data.sender_name || 'User',
      recipient_id: data.recipient_id || 'f1',
      recipient_name: data.recipient_name || 'Recipient',
      content: data.content,
      timestamp: new Date().toISOString(),
      read: false
    };
    messages.push(newMsg);
    setStorageItem('gl_messages', messages);
    return { data: newMsg, status: 201 };
  }

  // ----------------------------------------
  // ADMIN ENDPOINTS
  // ----------------------------------------
  if (path === '/admin/stats') {
    const users = getStorageItem('gl_fournisseurs').length + 5; // mock total users
    const suppliers = getStorageItem('gl_fournisseurs').length;
    const orders = getStorageItem('gl_orders');
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return {
      data: {
        totalUsers: users,
        totalSuppliers: suppliers,
        totalOrders: orders.length,
        totalRevenue: totalRevenue
      },
      status: 200
    };
  }

  if (path === '/admin/users' || path === '/admin/orders' || path === '/admin/promotions') {
    if (path === '/admin/users') {
      const suppliers = getStorageItem('gl_fournisseurs');
      return { data: suppliers, status: 200 };
    }
    if (path === '/admin/orders') {
      const orders = getStorageItem('gl_orders');
      return { data: orders.map(mapOrder), status: 200 };
    }
    if (path === '/admin/promotions') {
      const promos = getStorageItem('gl_promotions');
      return { data: promos, status: 200 };
    }
  }

  if (path === '/admin/logs') {
    return {
      data: [
        { id: 1, action: 'User registration', user: 'atlas.prime@gmail.com', ip: '196.206.15.44', date: new Date().toISOString() },
        { id: 2, action: 'Order created', user: 'restaurant@greenleaf.com', ip: '196.206.12.89', date: new Date().toISOString() },
        { id: 3, action: 'Admin login', user: 'admin@greenleaf.com', ip: '196.206.1.10', date: new Date().toISOString() }
      ],
      status: 200
    };
  }

  return { data: [], status: 200 };
};
