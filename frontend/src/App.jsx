import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AppTheme from './components/AppTheme';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';

const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const Register = lazy(() => import('./pages/Register'));
const Browse = lazy(() => import('./pages/Browse'));
const Account = lazy(() => import('./pages/Account'));
const Orders = lazy(() => import('./pages/restaurant/Orders'));
const Messages = lazy(() => import('./pages/restaurant/Messages'));
const Favorites = lazy(() => import('./pages/restaurant/Favorites'));
const PaymentCard = lazy(() => import('./pages/restaurant/PaymentCard'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const FournisseurProfile = lazy(() => import('./pages/FournisseurProfile'));
const FournisseurApp = lazy(() => import('./pages/fournisseur/FournisseurApp'));
const AdminApp = lazy(() => import('./pages/admin/AdminApp'));
const Cart = lazy(() => import('./pages/Cart'));
const NotFound = lazy(() => import('./pages/NotFound'));
const EmailVerified = lazy(() => import('./pages/EmailVerified'));
const ShopSetup = lazy(() => import('./pages/Shopesetup'));

const RestaurantDashboard = ({ children }) => (
  <DashboardLayout role="restaurant">
    {children}
  </DashboardLayout>
);

export default function App() {
  return (
    <Router>
      <AppTheme />
      <Suspense fallback={null}>
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
          <Route path="/restaurant/commandes" element={<ProtectedRoute allowedRoles={['restaurant']}><Orders /></ProtectedRoute>} />
          <Route path="/restaurant/payment-card" element={<ProtectedRoute allowedRoles={['restaurant']}><RestaurantDashboard><PaymentCard /></RestaurantDashboard></ProtectedRoute>} />
          <Route path="/restaurant/messages" element={<ProtectedRoute allowedRoles={['restaurant']}><Messages /></ProtectedRoute>} />
          <Route path="/restaurant/favorites" element={<ProtectedRoute allowedRoles={['restaurant']}><Favorites /></ProtectedRoute>} />
          <Route path="/help" element={<HelpCenter />} />

          <Route path="/fournisseur/shop-setup" element={
            <ProtectedRoute allowedRoles={['fournisseur']}>
              <ShopSetup />
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
          <Route path="/email-verified" element={<EmailVerified />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
