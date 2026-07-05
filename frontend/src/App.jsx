import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Account from './pages/Account';
import Orders from './pages/restaurant/Orders';
import Messages from './pages/restaurant/Messages';
import Favorites from './pages/restaurant/Favorites';
import HelpCenter from './pages/HelpCenter';
import FournisseurProfile from "./pages/FournisseurProfile";
import FournisseurApp from './pages/fournisseur/FournisseurApp';
import AdminApp from './pages/admin/AdminApp';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import EmailVerified from './pages/EmailVerified';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/supplier/:id" element={<FournisseurProfile />} />
        <Route path="/404" element={<NotFound />} />

        <Route path="/restaurant/settings" element={
          <ProtectedRoute allowedRoles={['restaurant']}>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/restaurant/dashboard" element={<ProtectedRoute allowedRoles={['restaurant']}><Orders /></ProtectedRoute>} />
        <Route path="/restaurant/messages" element={<ProtectedRoute allowedRoles={['restaurant']}><Messages /></ProtectedRoute>} />
        <Route path="/restaurant/favorites" element={<ProtectedRoute allowedRoles={['restaurant']}><Favorites /></ProtectedRoute>} />
        <Route path="/help" element={<HelpCenter />} />

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
        <Route path="/email-verified" element={<EmailVerified />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}