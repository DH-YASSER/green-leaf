import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button onClick={onClick} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
      <Bell size={20} color="currentColor" />
      {count > 0 && (
        <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
      )}
    </button>
  );
}
