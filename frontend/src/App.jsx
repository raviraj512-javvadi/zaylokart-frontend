import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// --- LAYOUT & ROUTE COMPONENTS ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// --- SCREEN COMPONENTS ---
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
import PaymentScreen from './screens/PaymentScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

import './styles/App.css';

function App() {
  return (
    //  --- THIS IS THE FIX ---
    // We wrap the entire application in the providers to share state.
    // The <Router> component should be in your index.js file, wrapping this App component.
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
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
                <Route path="/payment" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} />
                <Route path="/placeorder" element={<ProtectedRoute><PlaceOrderScreen /></ProtectedRoute>} />
                <Route path="/order/success/:id" element={<ProtectedRoute><OrderSuccessScreen /></ProtectedRoute>} /> 
                <Route path="/order/:id" element={<ProtectedRoute><OrderSuccessScreen /></ProtectedRoute>} /> 
                
                {/* Protected Routes for Admin */}
                <Route path="/admin/productlist" element={<AdminProtectedRoute><ProductListScreen /></AdminProtectedRoute>} />
                <Route path="/admin/product/:id/edit" element={<AdminProtectedRoute><ProductEditScreen /></AdminProtectedRoute>} />
                <Route path="/admin/orderlist" element={<AdminProtectedRoute><OrderListScreen /></AdminProtectedRoute>} />
                <Route path="/admin/userlist" element={<AdminProtectedRoute><UserListScreen /></AdminProtectedRoute>} />
                <Route path="/admin/user/:id/edit" element={<AdminProtectedRoute><UserEditScreen /></AdminProtectedRoute>} />

              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
    // ------------------------------------------
  );
}

export default App;
