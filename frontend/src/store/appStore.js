import { create } from 'zustand';

const useAppStore = create((set) => ({
  theme: localStorage.getItem('gl_theme') || 'dark',
  lang: localStorage.getItem('gl_lang') || 'fr',
  setTheme: (theme) => {
    localStorage.setItem('gl_theme', theme);
    set({ theme });
  },
  setLang: (lang) => {
    localStorage.setItem('gl_lang', lang);
    set({ lang });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('gl_theme', newTheme);
    return { theme: newTheme };
  }),
  toggleLang: () => set((state) => {
    const newLang = state.lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('gl_lang', newLang);
    return { lang: newLang };
  }),
}));

export { useAppStore };
