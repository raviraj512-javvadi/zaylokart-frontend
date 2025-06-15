import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBox from './SearchBox';

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  // --- THIS IS THE CORRECTED LINE ---
  // It safely checks if cartItems exists before trying to use it.
  const cartItemCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  return (
    <header className="header">
      <Link to="/" className="header-logo">ZAYLOKART</Link>
      
      <nav className="header-nav-center">
        <Link to="/category/new">NEW</Link>
        <Link to="/groceries">GROCERIES</Link>
        <Link to="/electronics">ELECTRONICS</Link>
        <Link to="/fashion-beauty">FASHION & BEAUTY</Link>
        <Link to="/sale" className="sale">SALE</Link>
      </nav>

      <div className="header-nav-right">
        <SearchBox />

        {userInfo && userInfo.isAdmin && (
          <div className="dropdown">
            <Link to="/admin/productlist" className="icon-button" style={{ fontWeight: 'bold' }}>Admin</Link>
          </div>
        )}

        {userInfo ? (
          <div className="dropdown">
            <button className="icon-button"><User size={20} /></button>
            <div className="dropdown-content">
              <Link to="/profile">Profile</Link>
              <Link to="/wishlist">My Wishlist</Link>
              <button onClick={logoutHandler}>Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="icon-button"><User size={20} /></Link>
        )}

        <Link to="/cart" className="icon-button">
          <ShoppingBag size={20} />
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;