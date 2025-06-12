import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import './CartScreen.css';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const checkoutHandler = () => { navigate('/shipping'); };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty">Your cart is empty. <Link to="/">Go Back</Link></div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.cartId} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                  {/* --- ADDED: Display the selected size --- */}
                  <div className="cart-item-size">Size: {item.size}</div>
                </div>
                <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                <div className="cart-item-qty">Qty: {item.qty}</div>
                <button onClick={() => removeFromCart(item.cartId)} className="cart-item-delete"><Trash2 /></button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
            <p>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <button onClick={checkoutHandler} className="checkout-button" disabled={cartItems.length === 0}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartScreen;