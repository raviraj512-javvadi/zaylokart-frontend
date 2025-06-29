import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // Re-enabling Wishlist
import { useAuth } from '../context/AuthContext';       // Re-enabling Auth for Wishlist
import { Heart } from 'lucide-react';                  // Re-enabling Heart icon
import API_URL from '../apiConfig';
import Rating from '../components/Rating';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();
    // --- RE-ENABLING WISHLIST AND AUTH ---
    const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
    const { userInfo } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/products/${productId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Could not fetch product.');
                setProduct(data);
                if (data.images && data.images.length > 0) setMainImage(data.images[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // --- RE-ENABLING WISHLIST LOGIC ---
    const isWishlisted = product ? wishlistItems.some(item => item._id === product._id) : false;

    const wishlistHandler = () => {
        if (!userInfo) {
            navigate('/login?redirect=/product/' + productId); // Redirect back after login
            return;
        }
        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };
    
    const addToCartHandler = () => {
        addToCart(product, qty, { price: product.price, countInStock: product.countInStock });
        navigate('/cart');
    };

    // --- NEW "BUY NOW" HANDLER ---
    const buyNowHandler = () => {
        addToCart(product, qty, { price: product.price, countInStock: product.countInStock });
        navigate('/shipping'); // The only difference: navigates directly to shipping
    };

    if (error || !product) return <p className="text-center p-10 text-red-500">{error || 'Product not found.'}</p>;

    const isInStock = product.countInStock > 0;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Link to="/" className='btn btn-light my-3 inline-block mb-4'>Go Back</Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Image Gallery */}
                <div>
                    <img src={mainImage || (product.images && product.images[0])} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg mb-4"/>
                    <div className="flex space-x-2 overflow-x-auto p-2">
                        {product.images.map((image, index) => (
                            <img key={index} src={image} alt={`thumbnail ${index}`} 
                                className={`w-20 h-20 rounded cursor-pointer border-2 ${mainImage === image ? 'border-blue-500' : 'border-gray-300'}`}
                                onClick={() => setMainImage(image)} />
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Details */}
                <div>
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold mb-2 pr-4">{product.name}</h1>
                        {/* --- RE-ENABLING WISHLIST BUTTON --- */}
                        <button title="Add to Wishlist" className="p-2" onClick={wishlistHandler}>
                           <Heart size={28} className="text-gray-500 hover:text-red-500 transition-colors" fill={isWishlisted ? '#ef4444' : 'none'} stroke={isWishlisted ? '#ef4444' : 'currentColor'} />
                        </button>
                    </div>

                    <p className="text-gray-500 mb-4">Brand: {product.brand}</p>
                    <div className="my-4"><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
                    <hr className="my-4" />
                    
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                        ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    
                    <p className="font-semibold" style={{ color: isInStock ? 'green' : 'red' }}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                    </p>

                    <hr className="my-4" />

                    {isInStock && (
                        <div className="my-4">
                            <label className="font-bold text-gray-700">Qty:</label>
                            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="ml-2 p-2 border rounded">
                                {[...Array(product.countInStock).keys()].slice(0, 10).map(x => (
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {/* --- ACTION BUTTONS WITH NEW "BUY NOW" BUTTON --- */}
                    <div className="mt-6 space-y-4">
                        <button onClick={addToCartHandler} disabled={!isInStock} className="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded hover:bg-yellow-600 disabled:bg-gray-400 transition-colors">
                            Add to Cart
                        </button>
                        <button onClick={buyNowHandler} disabled={!isInStock} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
        </div>
    );
};

export default ProductScreen;