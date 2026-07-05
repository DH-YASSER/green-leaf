import { create } from 'zustand';

// Rehydrate from localStorage on startup
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () => localStorage.getItem('token') || null;
const getStoredRole = () => localStorage.getItem('role') || null;

const storedUser = getStoredUser();
const storedToken = getStoredToken();
const storedRole = getStoredRole();

const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  role: storedRole || (storedUser ? storedUser.role : null),
  isAuthenticated: !!(storedToken && storedUser),

  login: (userData, token) => {
    set({
      user: userData,
      token: token,
      role: userData.role,
      isAuthenticated: true,
    });
    // Persist in localStorage
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