import React, { useState } from 'react'; // Removed useEffect and useRef
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBox from './SearchBox';

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // State to manage which dropdown is open ('admin', 'profile', or null)
  const [openDropdown, setOpenDropdown] = useState(null);

  const logoutHandler = () => {
    logout();
    setOpenDropdown(null); // Close dropdown on logout
    navigate('/');
  };

  const cartItemCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;
  
  // This function cleanly toggles the dropdowns
  const toggleDropdown = (menu) => {
    // If the clicked menu is already open, close it. Otherwise, open the clicked menu.
    setOpenDropdown(prev => (prev === menu ? null : menu));
  };

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
            {/* The button now toggles the 'admin' dropdown */}
            <button className="icon-button" style={{ fontWeight: 'bold' }} onClick={() => toggleDropdown('admin')}>
              Admin
            </button>
            {/* The dropdown content only shows if the state is 'admin' */}
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
            {/* The button now toggles the 'profile' dropdown */}
            <button className="icon-button" onClick={() => toggleDropdown('profile')}>
              <User size={20} />
            </button>
            {/* The dropdown content only shows if the state is 'profile' */}
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