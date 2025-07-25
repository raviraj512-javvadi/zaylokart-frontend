import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBox from './SearchBox';

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);

  const logoutHandler = () => {
    logout();
    setOpenDropdown(null);
    navigate('/');
  };

  const cartItemCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;
  
  const toggleDropdown = (menu) => {
    setOpenDropdown(prev => (prev === menu ? null : menu));
  };

  return (
    <header className="header">
      
      {/* ===================== UPDATED LOGO AND TEXT SECTION ===================== */}
      <Link to="/" className="header-logo-link">
        <img 
          src="/images/zaylo_logo.jpg" 
          alt="Zaylokart Logo" 
          className="header-logo-image" 
        />
        <span className="header-logo-text">ZAYLOCART</span>
      </Link>
      {/* ======================================================================= */}
      
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
            <button className="icon-button" style={{ fontWeight: 'bold' }} onClick={() => toggleDropdown('admin')}>
              Admin
            </button>
            {openDropdown === 'admin' && (
              <div className="dropdown-content">
                <Link to="/admin/productlist">Products</Link>
                <Link to="/admin/orderlist">Orders</Link>
                <Link to="/admin/userlist">Users</Link>
              </div>
            )}
          </div>
        )}

        {userInfo ? (
          <div className="dropdown">
            <button className="icon-button" onClick={() => toggleDropdown('profile')}>
              <User size={20} />
            </button>
            {openDropdown === 'profile' && (
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <Link to="/wishlist">My Wishlist</Link>
                <button onClick={logoutHandler}>Logout</button>
              </div>
            )}
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