import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API_URL from '../apiConfig';
import Rating from '../components/Rating';

// Import the new CSS file
import './ProductScreen.css';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/products/${productId}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Could not fetch product.');
                }
                setProduct(data);
                
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const addToCartHandler = () => {
        addToCart(product, qty, {
            price: product.price,
            countInStock: product.countInStock
        });
        navigate('/cart');
    };

    if (loading) {
        return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>;
    }

    if (error || !product) {
        return <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error || 'Product not found.'}</p>;
    }

    const displayPrice = product.price;
    const displayStock = product.countInStock;
    const isInStock = displayStock > 0;

    return (
        <div className="product-screen-container">
            <Link to="/" className='btn-go-back'>Go Back</Link>
            
            <div className="product-screen-grid">
                {/* Left Side: Image Gallery */}
                <div className="product-image-gallery">
                    <img src={mainImage} alt={product.name} className="main-image"/>
                    <div className="thumbnail-container">
                        {product.images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`thumbnail ${index}`} 
                                className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                                onClick={() => setMainImage(image)} 
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Details */}
                <div className="product-details">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-brand">Brand: {product.brand}</p>
                    <div style={{ margin: '1rem 0' }}><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
                    <hr />
                    
                    <div className="product-price">
                        ₹{displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    
                    <p className="product-stock" style={{ color: isInStock ? 'green' : 'red' }}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                    </p>

                    <hr style={{ margin: '1rem 0' }} />

                    {isInStock && (
                        <div>
                            <label htmlFor="qty-select" style={{ fontWeight: '600' }}>Qty:</label>
                            <select id="qty-select" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="qty-selector">
                                {[...Array(displayStock).keys()].slice(0, 10).map(x => (
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    <button onClick={addToCartHandler} disabled={!isInStock} className="add-to-cart-btn">
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="product-description-section">
                <h2>Description</h2>
                <p>{product.description}</p>
            </div>
        </div>
    );
};

export default ProductScreen;
