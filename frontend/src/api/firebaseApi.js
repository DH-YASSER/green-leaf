import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firebaseAuth, firestore, hasFirebaseConfig } from './firebaseClient';
import { handleMockRequest } from './mockApi';
import {
  MOCK_FOURNISSEURS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
} from './mockData';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const json = (data, status = 200) => ({ data, status });

const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  folder: import.meta.env.VITE_CLOUDINARY_FOLDER || 'green-leaf',
};

const normalizePath = (url = '') => url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/api/, '') || '/';

const readBody = (rawData) => {
  if (!rawData) return {};
  if (rawData instanceof FormData) {
    const data = {};
    rawData.forEach((value, key) => {
      if (key.endsWith('[]')) {
        const cleanKey = key.slice(0, -2);
        data[cleanKey] = [...(data[cleanKey] || []), value];
      } else {
        data[key] = value;
      }
    });
    return data;
  }
  if (typeof rawData === 'string') {
    try { return JSON.parse(rawData); } catch { return {}; }
  }
  return rawData;
};

const currentUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
};

const asArray = async (name) => {
  const snapshot = await getDocs(collection(firestore, name));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

const saveWithId = async (name, id, data) => {
  await setDoc(doc(firestore, name, String(id)), data, { merge: true });
  return { id: String(id), ...data };
};

const seedIfEmpty = async () => {
  const markerRef = doc(firestore, 'meta', 'seed');
  const marker = await getDoc(markerRef);
  if (marker.exists()) return;

  await Promise.all([
    ...MOCK_FOURNISSEURS.map((supplier) => saveWithId('suppliers', supplier.id, {
      ...supplier,
      role: 'fournisseur',
      status: supplier.is_verified ? 'approved' : 'pending',
    })),
    ...MOCK_PRODUCTS.map((product) => saveWithId('products', product.id, {
      ...product,
      is_active: product.is_active !== false,
      status: product.status || 'published',
    })),
    ...MOCK_ORDERS.map((order) => saveWithId('orders', order.id, order)),
    saveWithId('users', 'admin-1', { name: 'Yasser Admin', email: 'admin@greenleaf.com', role: 'admin' }),
    saveWithId('users', 'rest-1', { name: 'Chef Youssef', company_name: 'Le Bistro Vert', email: 'restaurant@greenleaf.com', role: 'restaurant', city: 'casablanca' }),
  ]);
  await setDoc(markerRef, { seeded_at: serverTimestamp(), version: 1 });
};

const getUserByEmail = async (email) => {
  const result = await getDocs(query(collection(firestore, 'users'), where('email', '==', email), limit(1)));
  if (result.empty) return null;
  const snap = result.docs[0];
  return { id: snap.id, ...snap.data() };
};

const firebaseLogin = async (data, path) => {
  const email = data.email || 'restaurant@greenleaf.com';
  const password = data.password || 'password';

  try {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try { await createUserWithEmailAndPassword(firebaseAuth, email, password); } catch {}
    } else {
      throw error;
    }
  }

  const uid = firebaseAuth.currentUser?.uid;
  const userSnap = uid ? await getDoc(doc(firestore, 'users', uid)) : null;
  let userDoc = userSnap?.exists() ? { id: userSnap.id, ...userSnap.data() } : null;

  if (!userDoc) {
    const role = email === 'admin@demo.com' || path === '/admin/login'
      ? 'admin'
      : email.includes('fournisseur')
        ? 'fournisseur'
        : 'restaurant';
    userDoc = {
      id: uid || `user-${Date.now()}`,
      name: role === 'admin' ? 'Yasser Admin' : role === 'fournisseur' ? 'Nouveau Fournisseur' : 'Nouveau Restaurant',
      company_name: role === 'fournisseur' ? 'Fournisseur GreenLeaf' : 'Restaurant GreenLeaf',
      email,
      role,
      city: 'casablanca',
    };
    await saveWithId('users', userDoc.id, userDoc);
  }

  const token = await firebaseAuth.currentUser?.getIdToken();
  return json({ user: userDoc, token, access_token: token });
};

const firebaseRegister = async (data) => {
  const role = data.role === 'fournisseur' || data.role === 'company' ? 'fournisseur' : 'restaurant';
  const credential = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password || 'password');
  const user = {
    id: credential.user.uid,
    name: data.name || data.company_name || 'Nouveau membre',
    email: data.email,
    role,
    company_name: data.company_name || data.name || 'GreenLeaf',
    city: data.city || 'casablanca',
    phone: data.phone || '',
    address: data.address || '',
    created_at: new Date().toISOString(),
  };
  await saveWithId('users', user.id, user);
  if (role === 'fournisseur') {
    await saveWithId('suppliers', user.id, {
      ...user,
      description: 'Nouveau fournisseur sur GreenLeaf.',
      is_verified: false,
      status: 'pending',
      avg_rating: 0,
      reviews_count: 0,
    });
  }
  const token = await credential.user.getIdToken();
  return json({ user, token, access_token: token });
};

const categoryCounts = (products) => {
  const counts = {};
  products.forEach((product) => {
    if (product.is_active === false) return;
    counts[product.category] = (counts[product.category] || 0) + 1;
  });
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
};

const filterProducts = (products, suppliers, params = {}) => {
  let list = products.filter((product) => product.is_active !== false);
  if (params.category) {
    const categories = String(params.category).split(',');
    list = list.filter((product) => categories.includes(product.category));
  }
  if (params.city) {
    const supplierIds = suppliers
      .filter((supplier) => String(supplier.city || '').toLowerCase() === String(params.city).toLowerCase())
      .map((supplier) => supplier.id);
    list = list.filter((product) => supplierIds.includes(product.fournisseur_id));
  }
  if (params.search) {
    const q = String(params.search).toLowerCase();
    list = list.filter((product) =>
      String(product.name || '').toLowerCase().includes(q) ||
      String(product.description || '').toLowerCase().includes(q) ||
      String(product.category || '').toLowerCase().includes(q)
    );
  }
  return list;
};

const compressToDataUrl = (file, maxSize = 900, quality = 0.68) => new Promise((resolve, reject) => {
  if (!(file instanceof File)) return resolve('');
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

const uploadToCloudinary = async (file, folder) => {
  if (!(file instanceof File)) return '';
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    return compressToDataUrl(file);
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', cloudinaryConfig.uploadPreset);
  form.append('folder', `${cloudinaryConfig.folder}/${folder}`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    console.warn('[Cloudinary] Upload failed, saving compressed Base64 fallback.');
    return compressToDataUrl(file);
  }

  const result = await response.json();
  return result.secure_url || result.url || '';
};

const uploadFile = async (file, folder) => {
  if (!(file instanceof File)) return typeof file === 'string' ? file : '';
  return uploadToCloudinary(file, folder);
};

const createProduct = async (data) => {
  const user = currentUser() || {};
  const imageFiles = data.images || data['images'] || [];
  const firstImage = Array.isArray(imageFiles) ? imageFiles[0] : imageFiles;
  const imageUrl = await uploadFile(firstImage, 'products');
  const product = {
    name: data.name || 'Untitled product',
    description: data.description || '',
    category: data.category || data.product_type || 'legumes',
    price: Number(data.price || data.unit_price || 0),
    unit: data.unit || 'Kg',
    stock: Number(data.stock || 0),
    fournisseur_id: user.role === 'fournisseur' ? user.id : 'f1',
    is_active: true,
    status: data.status || 'published',
    image: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    created_at: new Date().toISOString(),
  };
  const refDoc = await addDoc(collection(firestore, 'products'), product);
  return json({ id: refDoc.id, ...product }, 201);
};

const createOrder = async (data) => {
  const user = currentUser() || {};
  const items = data.items || data.products || [];
  const grouped = items.reduce((acc, item) => {
    const supplierId = item.fournisseur_id || item.supplier_id || 'f1';
    acc[supplierId] = [...(acc[supplierId] || []), item];
    return acc;
  }, {});
  const createdOrders = [];
  for (const [supplierId, supplierItems] of Object.entries(grouped)) {
    const total = supplierItems.reduce((sum, item) => sum + Number(item.price || item.unit_price || 0) * Number(item.quantity || 1), 0);
    const order = {
      restaurant_id: user.id || 'rest-1',
      restaurant_name: user.company_name || user.name || 'Restaurant',
      fournisseur_id: supplierId,
      products: supplierItems,
      total,
      total_amount: total,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    const refDoc = await addDoc(collection(firestore, 'orders'), order);
    createdOrders.push({ id: refDoc.id, ...order });
  }
  return json({ success: true, orders: createdOrders }, 201);
};

const updateOrderStatus = async (path, data) => {
  const id = path.split('/orders/')[1]?.split('/')[0];
  if (!id) return json({ message: 'Order id missing' }, 422);
  const status = data.status || data.action || 'confirmed';
  await updateDoc(doc(firestore, 'orders', id), { status, updated_at: new Date().toISOString() });
  return json({ success: true, id, status });
};

export const handleFirebaseRequest = async (config) => {
  await delay();

  if (!hasFirebaseConfig) {
    console.warn('[Firebase API] Missing Firebase env config. Falling back to local demo data.');
    return handleMockRequest(config);
  }

  try {
    await seedIfEmpty();
  } catch (error) {
    console.warn('[Firebase API] Demo seed skipped. Add data through the app or loosen rules only during setup.', error);
  }

  const path = normalizePath(config.url);
  const method = String(config.method || 'get').toLowerCase();
  const data = readBody(config.data);
  const params = config.params || {};

  try {
    if ((path === '/auth/check-email') && method === 'post') {
      try {
        return json({ exists: Boolean(await getUserByEmail(data.email)) });
      } catch {
        return json({ exists: false });
      }
    }
    if ((path === '/auth/login' || path === '/login' || path === '/admin/login') && method === 'post') {
      return firebaseLogin(data, path);
    }
    if ((path === '/register' || path === '/auth/register') && method === 'post') {
      return firebaseRegister(data);
    }
    if (path === '/logout' && method === 'post') {
      await signOut(firebaseAuth);
      return json({ success: true });
    }

    const supplierDocs = await asArray('suppliers');
    const productDocs = await asArray('products');
    const orderDocs = await asArray('orders');
    const suppliers = supplierDocs.length ? supplierDocs : MOCK_FOURNISSEURS;
    const products = productDocs.length ? productDocs : MOCK_PRODUCTS;
    const orders = orderDocs.length ? orderDocs : MOCK_ORDERS;
    const user = currentUser() || {};

    if (path === '/products/category-counts' && method === 'get') return json(categoryCounts(products));
    if (path === '/products' && method === 'get') return json({
      products: filterProducts(products, suppliers, params),
      fournisseurs: suppliers,
      total: filterProducts(products, suppliers, params).length,
    });

    if (path === '/fournisseur/products' && method === 'get') {
      const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
      return json(products.filter((product) => product.fournisseur_id === supplierId));
    }
    if (path === '/fournisseur/products' && method === 'post') return createProduct(data);
    if (path.startsWith('/fournisseur/products/') && method === 'delete') {
      const id = path.split('/').pop();
      await deleteDoc(doc(firestore, 'products', id));
      return json({ success: true });
    }
    if (path.startsWith('/fournisseur/products/') && (method === 'put' || method === 'patch')) {
      const id = path.split('/').pop();
      await updateDoc(doc(firestore, 'products', id), data);
      return json({ id, ...data });
    }

    if (path === '/orders' && method === 'post') return createOrder(data);
    if ((path === '/restaurant/orders' || path === '/orders') && method === 'get') {
      return json(orders.filter((order) => !user.id || order.restaurant_id === user.id || user.role === 'admin'));
    }
    if (path === '/fournisseur/orders' && method === 'get') {
      const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
      return json(orders.filter((order) => order.fournisseur_id === supplierId));
    }
    if (path.includes('/orders/') && (method === 'patch' || method === 'put')) return updateOrderStatus(path, data);

    if (path === '/fournisseur/shop-setup/status' && method === 'get') {
      const supplier = suppliers.find((item) => item.id === user.id) || suppliers[0] || {};
      return json({
        profile_complete: Boolean(supplier.company_name && supplier.city),
        products_count: products.filter((product) => product.fournisseur_id === supplier.id).length,
        submitted_for_review: supplier.status === 'review',
        approved: supplier.status === 'approved' || supplier.is_verified,
      });
    }
    if (path === '/fournisseur/shop-setup/page' && (method === 'put' || method === 'post')) {
      const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
      const currentSupplier = suppliers.find((item) => item.id === supplierId) || {};
      const mediaUpdates = {};

      for (const key of ['profile_photo', 'cover_photo', 'feature_image', 'logo_image']) {
        if (data[key]) mediaUpdates[`${key}_url`] = await uploadFile(data[key], `suppliers/${supplierId}`);
      }

      if (Array.isArray(data.additional_images)) {
        mediaUpdates.additional_image_urls = await Promise.all(
          data.additional_images.map((file) => uploadFile(file, `suppliers/${supplierId}`))
        );
      }

      const updates = {
        ...currentSupplier,
        ...data,
        ...mediaUpdates,
        id: supplierId,
        updated_at: new Date().toISOString(),
      };
      delete updates.profile_photo;
      delete updates.cover_photo;
      delete updates.feature_image;
      delete updates.logo_image;
      delete updates.additional_images;
      await saveWithId('suppliers', supplierId, updates);
      return json(updates);
    }
    if (path === '/fournisseur/shop-setup/order-preferences' && (method === 'put' || method === 'post')) {
      const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
      const currentSupplier = suppliers.find((item) => item.id === supplierId) || {};
      const updates = { ...currentSupplier, order_preferences: data, updated_at: new Date().toISOString() };
      await saveWithId('suppliers', supplierId, updates);
      return json(updates);
    }
    if (path === '/fournisseur/shop-setup/complete' && method === 'post') {
      const supplierId = user.role === 'fournisseur' ? user.id : 'f1';
      await saveWithId('suppliers', supplierId, { status: 'review', submitted_for_review: true, updated_at: new Date().toISOString() });
      return json({ success: true, status: 'review' });
    }

    if (path === '/restaurant/profile' && method === 'get') return json(user);
    if (path === '/restaurant/profile' && method === 'put') {
      await saveWithId('users', user.id || 'rest-1', { ...user, ...data });
      return json({ ...user, ...data });
    }
    if (path === '/restaurant/avatar' && method === 'post') {
      const file = data.avatar || data.image || Object.values(data).find((value) => value instanceof File);
      const avatar_url = await uploadFile(file, `avatars/${user.id || 'restaurant'}`);
      const updates = { ...user, avatar_url };
      await saveWithId('users', user.id || 'rest-1', updates);
      return json(updates);
    }

    if (path === '/notifications' && method === 'get') {
      const result = await getDocs(query(collection(firestore, 'notifications'), where('user_id', '==', user.id || 'demo')));
      return json(result.docs.map((item) => ({ id: item.id, ...item.data() })));
    }
    if (path.includes('/notifications') && (method === 'patch' || method === 'put')) return json({ success: true });

    if (path === '/admin/users' && method === 'get') return json(await asArray('users'));
    if (path === '/admin/suppliers' && method === 'get') return json(suppliers);
    if (path === '/admin/products' && method === 'get') return json(products);
    if (path === '/admin/orders' && method === 'get') return json(orders);
    if (path.startsWith('/admin/suppliers/') && method === 'patch') {
      const id = path.split('/').pop();
      const updates = { status: data.action === 'approve' ? 'approved' : data.action || 'pending', is_verified: data.action === 'approve' };
      await updateDoc(doc(firestore, 'suppliers', id), updates);
      return json({ id, ...updates });
    }
    if (path.startsWith('/admin/products/') && method === 'patch') {
      const id = path.split('/').pop();
      const updates = { status: data.action || 'published', is_active: data.action !== 'reject' };
      await updateDoc(doc(firestore, 'products', id), updates);
      return json({ id, ...updates });
    }

    return handleMockRequest(config);
  } catch (error) {
    console.error('[Firebase API]', error);
    throw {
      message: error.message || 'Firebase request failed',
      response: {
        status: 500,
        data: { message: error.message || 'Firebase request failed' },
      },
    };
  }
};
