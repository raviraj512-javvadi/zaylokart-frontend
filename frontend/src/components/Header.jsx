import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="header">
      <div className="header-container">
        {/* Left - Logo */}
        <div className="header-logo">
          <Link to="/">ZAYLOKART</Link>
        </div>

        {/* Center - Navigation */}
        <nav className="header-nav">
          <Link to="/category/new">NEW</Link>
          <Link to="/category/men">MEN</Link>
          <Link to="/category/women">WOMEN</Link>
          <Link to="/sale" className="sale">SALE</Link>
        </nav>

        {/* Right - Search + Icons */}
        <div className="header-icons">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
            />
            <button className="search-button">
              <Search size={18} />
            </button>
          </div>

          {userInfo ? (
            <div className="dropdown">
              <button className="icon-button">
                <User size={20} />
              </button>
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <Link to="/wishlist">My Wishlist</Link>
                <button onClick={logoutHandler}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="icon-button">
              <User size={20} />
            </Link>
          )}

          <Link to="/cart" className="icon-button">
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
