import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

// Import the new CSS file
import './CartScreen.css';

const CartScreen = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useCart();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const handleQtyChange = (item, newQty) => {
    addToCart(
        { _id: item.product, name: item.name, images: [item.image] }, 
        newQty, 
        { _id: item.variant, price: item.price, ram: item.ram, storage: item.storage, countInStock: item.countInStock }
    );
  };

  return (
    <div className="cart-screen-container">
      <h1 className="cart-title">Shopping Cart</h1>
      <div className="cart-grid">
        {/* Left Column: Cart Items */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty-message">
              Your cart is empty. <Link to="/">Go Shopping</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.variant} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <Link to={`/product/${item.product}`} className="item-name">{item.name}</Link>
                  <p className="item-variant">{item.ram} / {item.storage}</p>
                  <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="cart-item-actions">
                  <select 
                    value={item.qty} 
                    onChange={(e) => handleQtyChange(item, Number(e.target.value))} 
                    className="qty-select"
                  >
                    {[...Array(item.countInStock).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                  <button onClick={() => removeFromCart(item.variant)} className="remove-btn" title="Remove Item">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Subtotal and Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h2>Subtotal ({totalItems}) items</h2>
            <p className="summary-price">₹{itemsPrice.toLocaleString('en-IN')}</p>
            <button onClick={checkoutHandler} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
