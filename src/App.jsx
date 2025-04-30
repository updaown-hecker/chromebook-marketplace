import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import OrderDetail from './pages/admin/OrderDetail';
import AdminLogin from './pages/admin/Login';
import AdminAuthGuard from './components/admin/AdminAuthGuard';
import NotFound from './pages/NotFound';
import { CartProvider } from './context/CartContext';
import './App.css';
import './pages/admin/AdminStyles.css';
import './pages/EbayStyle.css';
import './ModernTheme.css'; // Import the new modern theme

function App() {
  // Check if user is logged out of admin when visiting non-admin pages
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (!path.startsWith('/admin')) {
        // Clear admin authentication when navigating to non-admin pages
        localStorage.removeItem('adminAuthenticated');
      }
    };
    
    // Initial check
    handleNavigation();
    
    // Listen for navigation changes
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);
  
  return (
    <CartProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />
            <Route path="/admin/products" element={<AdminAuthGuard><AdminProducts /></AdminAuthGuard>} />
            <Route path="/admin/orders" element={<AdminAuthGuard><AdminOrders /></AdminAuthGuard>} />
            <Route path="/admin/orders/:orderId" element={<AdminAuthGuard><OrderDetail /></AdminAuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;