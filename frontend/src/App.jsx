import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- All the necessary imports are here ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CartScreen from './screens/CartScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import WishlistScreen from './screens/WishlistScreen';
import GroceriesScreen from './screens/GroceriesScreen';
import ElectronicsScreen from './screens/ElectronicsScreen';
import PaymentScreen from './screens/PaymentScreen';         // <-- 1. Import PaymentScreen
import OrderSuccessScreen from './screens/OrderSuccessScreen'; // <-- 2. Import OrderSuccessScreen

import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/search/:keyword" element={<HomeScreen />} />
          <Route path="/category/:category" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/groceries" element={<GroceriesScreen />} />
          <Route path="/electronics" element={<ElectronicsScreen />} />

          {/* Protected Routes for Regular Users */}
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistScreen /></ProtectedRoute>} />
          <Route path="/shipping" element={<ProtectedRoute><ShippingScreen /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} /> {/* <-- 3. Add Payment Route */}
          <Route path="/placeorder" element={<ProtectedRoute><PlaceOrderScreen /></ProtectedRoute>} />
          <Route path="/order/success/:id" element={<ProtectedRoute><OrderSuccessScreen /></ProtectedRoute>} /> {/* <-- 4. Add Order Success Route */}

          {/* Protected Routes for Admin */}
          <Route path="/admin/productlist" element={<AdminProtectedRoute><ProductListScreen /></AdminProtectedRoute>} />
          <Route path="/admin/product/:id/edit" element={<AdminProtectedRoute><ProductEditScreen /></AdminProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;