import { useEffect } from 'react';

// Global theme injector — applies saved theme preference on mount
export default function AppTheme() {
  useEffect(() => {
    const saved = localStorage.getItem('app-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);
  return null;
}
