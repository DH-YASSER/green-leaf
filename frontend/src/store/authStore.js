import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,

  login: (userData, token) => {
    set({
      user: userData,
      token: token,
      role: userData.role,
      isAuthenticated: true,
    });
    // Optionally store in localStorage for persistence
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);
  },

  logout: () => {
    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  setUser: (userData) => {
    set({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  },
}));

export { useAuthStore };