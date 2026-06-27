import { create } from 'zustand';

const getStoredCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const dispatchUpdate = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
};

const useCartStore = create((set, get) => ({
  items: getStoredCart(),

  addToCart: (product, fournisseur, quantity = 1) => {
    const items = get().items;
    const existing = items.find(i => i.productId === product.id);

    let updated;
    if (existing) {
      updated = items.map(i =>
        i.productId === product.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      );
    } else {
      updated = [...items, {
        productId:        product.id,
        name:             product.name,
        price:            product.price_min ?? product.price ?? 0,
        unit:             product.unit || 'Kg',
        image:            product.image || '',
        quantity,
        fournisseurId:    fournisseur.id,
        fournisseurName:  fournisseur.company_name,
      }];
    }

    set({ items: updated });
    dispatchUpdate(updated);
  },

  removeFromCart: (productId) => {
    const updated = get().items.filter(i => i.productId !== productId);
    set({ items: updated });
    dispatchUpdate(updated);
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) return get().removeFromCart(productId);
    const updated = get().items.map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    set({ items: updated });
    dispatchUpdate(updated);
  },

  clearCart: () => {
    set({ items: [] });
    dispatchUpdate([]);
  },

  totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  totalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * (i.price || 0), 0),
}));

export { useCartStore };