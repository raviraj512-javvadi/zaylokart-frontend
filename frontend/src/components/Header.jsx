import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBox from './SearchBox';

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // State to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const logoutHandler = () => {
    logout();
    setOpenDropdown(null); // Close dropdown on logout
    navigate('/');
  };

  const cartItemCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;
  
  // This function handles opening and closing the dropdowns
  const handleDropdownToggle = (menuName) => {
    if (openDropdown === menuName) {
      setOpenDropdown(null); // Close if already open
    } else {
      setOpenDropdown(menuName); // Open the clicked one
    }
  };

  // This effect handles closing the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdownRef element
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    // Add event listener when a dropdown is open
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);


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
          // We pass the ref to the parent div of the dropdowns
          <div className="dropdown" ref={dropdownRef}>
            <button className="icon-button" style={{ fontWeight: 'bold' }} onClick={() => handleDropdownToggle('admin')}>
              Admin
            </button>
            {/* The dropdown content is now rendered based on state */}
            <div className={`dropdown-content ${openDropdown === 'admin' ? 'open' : ''}`}>
              <Link to="/admin/productlist" onClick={() => setOpenDropdown(null)}>Products</Link>
              <Link to="/admin/orderlist" onClick={() => setOpenDropdown(null)}>Orders</Link>
              <Link to="/admin/userlist" onClick={() => setOpenDropdown(null)}>Users</Link>
            </div>
          </div>
        )}

        {userInfo ? (
          // We pass the ref to the parent div of the dropdowns
          <div className="dropdown" ref={dropdownRef}>
            <button className="icon-button" onClick={() => handleDropdownToggle('profile')}>
              <User size={20} />
            </button>
            {/* The dropdown content is now rendered based on state */}
            <div className={`dropdown-content ${openDropdown === 'profile' ? 'open' : ''}`}>
              <Link to="/profile" onClick={() => setOpenDropdown(null)}>Profile</Link>
              <Link to="/wishlist" onClick={() => setOpenDropdown(null)}>My Wishlist</Link>
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