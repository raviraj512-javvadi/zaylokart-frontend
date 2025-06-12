import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // --- 1. Import Wishlist tools ---
import { Heart } from 'lucide-react';                     // --- 2. Import the Heart Icon ---
import './ProductScreen.css';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // --- 3. Get Wishlist state and functions ---
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // --- 4. Add logic for the wishlist button ---
  // Check if the current product is already in the wishlist
  const isWishlisted = wishlistItems.some(item => item._id === productId);

  const wishlistHandler = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };
  
  const addToCartHandler = () => {
    if (!selectedSize) { alert('Please select a size'); return; }
    addToCart(product, qty, selectedSize.name);
    navigate('/cart');
  };

  const buyNowHandler = () => {
    if (!selectedSize) { alert('Please select a size'); return; }
    addToCart(product, qty, selectedSize.name);
    navigate('/shipping');
  };

  if (loading) return <div style={{textAlign: 'center', padding: '5rem'}}>Loading...</div>;
  if (error) return <div style={{textAlign: 'center', padding: '5rem'}}>Error: {error}</div>;
  if (!product) return <div style={{textAlign: 'center', padding: '5rem'}}>Product not found.</div>;

  const totalStock = product.sizes ? product.sizes.reduce((acc, size) => acc + size.stock, 0) : 0;

  return (
    <div className="product-page-container">
      <div className="product-image-panel">
        <img src={product.imageUrl} alt={product.name} />
      </div>

      <div className="product-info-panel">
        {/* --- 5. Add a wrapper for the title and the new heart button --- */}
        <div className="product-info-header">
          <h1 className="product-info-name">{product.name}</h1>
          <button className="wishlist-btn" onClick={wishlistHandler}>
              <Heart size={24} fill={isWishlisted ? 'red' : 'none'} stroke={isWishlisted ? 'red' : 'currentColor'} />
          </button>
        </div>
        <p className="product-info-brand">Brand: {product.brand}</p>
        <hr className="info-divider" />
        <p className="product-info-description">{product.description}</p>
        <div className="size-selector">
          <p className="size-selector-title">Select Size:</p>
          <div className="size-buttons">
            {product.sizes && product.sizes.map(size => (
              <button 
                key={size.name} 
                className={`size-btn ${selectedSize && selectedSize.name === size.name ? 'selected' : ''}`}
                disabled={size.stock === 0}
                onClick={() => { setSelectedSize(size); setQty(1); }}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-buy-box">
        <p className="buy-box-price">₹{product.price.toLocaleString('en-IN')}</p>
        <p className="buy-box-status" style={{ color: totalStock > 0 ? 'green' : 'red' }}>
          {totalStock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>
        {totalStock > 0 && (
          <div className="buy-box-qty">
            <label htmlFor="qty">Qty:</label>
            <select id="qty" value={qty} onChange={(e) => setQty(Number(e.target.value))} disabled={!selectedSize}>
              {selectedSize ? [...Array(selectedSize.stock).keys()].map(x => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              )) : <option>Select Size</option>}
            </select>
          </div>
        )}
        <button 
          className="action-button" 
          disabled={totalStock === 0 || !selectedSize}
          onClick={addToCartHandler}
        >
          Add to Cart
        </button>
        <button 
          className="action-button buy-now" 
          disabled={totalStock === 0 || !selectedSize}
          onClick={buyNowHandler}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductScreen;