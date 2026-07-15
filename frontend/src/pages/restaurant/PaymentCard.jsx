import React from 'react';

export function PaymentCardForm() {
  return <div style={{ padding: 20 }}><p style={{ color: 'var(--db-text, #333)' }}>Payment card form — coming soon.</p></div>;
}

export default function PaymentCard() {
  return <div style={{ padding: 40, color: 'var(--db-text, #333)' }}><h2>Payment Card</h2><PaymentCardForm /></div>;
}
