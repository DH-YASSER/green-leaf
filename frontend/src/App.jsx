import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Browse from './pages/Browse';
import FournisseurProfile from "./pages/FournisseurProfile";
// Restaurant pages
import RestaurantDashboard from './pages/restaurant/Dashboard';
import RestaurantOrders from './pages/restaurant/Orders';
import RestaurantMessages from './pages/restaurant/Messages';
// Fournisseur pages
import FournisseurDashboard from './pages/fournisseur/Dashboard';
import FournisseurProducts from './pages/fournisseur/Products';
import FournisseurPromotions from './pages/fournisseur/Promotions';
import FournisseurOrders from './pages/fournisseur/Orders';
import FournisseurMessages from './pages/fournisseur/Messages';
// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminPromotions from './pages/admin/Promotions';
import AdminLogs from './pages/admin/Logs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/supplier/:id" element={<FournisseurProfile />} />

        {/* Restaurant routes (role: restaurant) */}
        <Route
          path="/restaurant/*"
          element={
            <ProtectedRoute allowedRoles={['restaurant']}>
              <Routes>
                <Route path="dashboard" element={<RestaurantDashboard />} />
                <Route path="orders" element={<RestaurantOrders />} />
                <Route path="messages" element={<RestaurantMessages />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Fournisseur routes (role: fournisseur) */}
        <Route
          path="/fournisseur/*"
          element={
            <ProtectedRoute allowedRoles={['fournisseur']}>
              <Routes>
                <Route path="dashboard" element={<FournisseurDashboard />} />
                <Route path="products" element={<FournisseurProducts />} />
                <Route path="promotions" element={<FournisseurPromotions />} />
                <Route path="orders" element={<FournisseurOrders />} />
                <Route path="messages" element={<FournisseurMessages />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Admin routes (role: admin) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="logs" element={<AdminLogs />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Fallback for not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
