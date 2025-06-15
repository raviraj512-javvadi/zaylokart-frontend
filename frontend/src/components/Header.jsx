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

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          ZAYLOKART
        </Link>

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
              <button className="icon-button bold">Admin</button>
              <div className="dropdown-content">
                <Link to="/admin/productlist">Products</Link>
                <Link to="/admin/orderlist">Orders</Link>
                <Link to="/admin/userlist">Users</Link>
              </div>
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
      </div>
    </header>
  );
};

export default Header;
