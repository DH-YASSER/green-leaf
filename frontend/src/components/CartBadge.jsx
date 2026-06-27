import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

/**
 * Drop this in any navbar. Shows a cart icon with a live item-count badge,
 * linking to /cart. Uses Zustand store for real-time reactivity.
 */
const CartBadge = () => {
  const items = useCartStore(s => s.items);
  const count = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <Link
      to="/cart"
      className="gl-icon-btn"
      style={{ position: 'relative', textDecoration: 'none' }}
      title="Cart"
    >
      <ShoppingCart size={12} />
      {count > 0 && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          background: 'var(--sulu)', color: 'var(--bg3)',
          fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 500,
          minWidth: 16, height: 16, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 3px',
        }}>
          {count}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;
