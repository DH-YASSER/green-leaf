import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import { Login, Register } from './pages/AuthCard';
import Browse from './pages/Browse';
import FournisseurProfile from "./pages/FournisseurProfile";
import RestaurantApp from './pages/restaurant/RestaurantApp';
import FournisseurApp from './pages/fournisseur/FournisseurApp';
import AdminApp from './pages/admin/AdminApp';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/:role" element={<Register initialMode="register" />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/supplier/:id" element={<FournisseurProfile />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/restaurant/*" element={
          <ProtectedRoute allowedRoles={['restaurant']}>
            <RestaurantApp />
          </ProtectedRoute>
        } />

        <Route path="/fournisseur/*" element={
          <ProtectedRoute allowedRoles={['fournisseur']}>
            <FournisseurApp />
          </ProtectedRoute>
        } />

        <Route path="/gl/c0ns0le/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApp />
          </ProtectedRoute>
        } />

        <Route path="/cart" element={<Cart />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}