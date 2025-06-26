import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Using your Cart Context
import { useWishlist } from '../context/WishlistContext'; // Using your Wishlist Context
import { useAuth } from '../context/AuthContext'; // Using your Auth Context
import { Heart } from 'lucide-react'; // For the wishlist icon
import API_URL from '../apiConfig';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    // Context Hooks
    const { addToCart } = useCart();
    const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
    const { userInfo } = useAuth();

    // State for the component
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for the new variant and image features
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);

    // Fetch product data when the component loads
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/products/${productId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Could not fetch product.');
                }
                
                setProduct(data);
                
                // Set default variant and image from the fetched data
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
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

    // Check if the current product is in the wishlist
    const isWishlisted = product ? wishlistItems.some(item => item._id === product._id) : false;

    // --- Event Handlers ---

    const handleVariantChange = (ram, storage) => {
        if (!product || !product.variants) return;
        const variant = product.variants.find(v => v.ram === ram && v.storage === storage);
        if (variant) {
            setSelectedVariant(variant);
            setQty(1); // Reset quantity when variant changes
        }
    };

    const wishlistHandler = () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product); // Pass the whole product object
        }
    };

    const addToCartHandler = () => {
        if (!selectedVariant) {
            alert('Please select a product variant');
            return;
        }
        // Pass product and selected variant details to the cart
        addToCart(product, qty, selectedVariant);
        navigate('/cart');
    };
    
    const buyNowHandler = () => {
        if (!selectedVariant) {
            alert('Please select a product variant');
            return;
        }
        addToCart(product, qty, selectedVariant);
        navigate('/shipping');
    };

    // --- Render Logic ---

    if (loading) return <p className="text-center p-10">Loading...</p>;
    if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;
    if (!product || !selectedVariant) return <p className="text-center p-10">Product not found.</p>;

    // Create unique lists of RAM and Storage options from variants
    const ramOptions = [...new Set(product.variants.map(v => v.ram))];
    const storageOptions = [...new Set(product.variants.map(v => v.storage))];

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Image Gallery */}
                <div>
                    <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg mb-4"/>
                    <div className="flex space-x-2 overflow-x-auto p-2">
                        {product.images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`${product.name} thumbnail ${index + 1}`} 
                                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${mainImage === image ? 'border-blue-500' : 'border-gray-300'}`}
                                onClick={() => setMainImage(image)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Details & Options */}
                <div>
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <button className="wishlist-btn" onClick={wishlistHandler}>
                           <Heart size={28} fill={isWishlisted ? 'red' : 'none'} stroke={isWishlisted ? 'red' : 'currentColor'} />
                        </button>
                    </div>
                    <p className="text-gray-500 mb-4">Brand: {product.brand}</p>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                        ₹{selectedVariant.price.toLocaleString('en-IN')}
                    </div>
                    
                    {/* Variant Selectors */}
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="mb-4">
                            <label className="font-bold text-gray-700">RAM:</label>
                            <select onChange={(e) => handleVariantChange(e.target.value, selectedVariant.storage)} value={selectedVariant.ram} className="ml-2 p-2 border rounded">
                                {ramOptions.map(ram => <option key={ram} value={ram}>{ram}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-bold text-gray-700">Storage:</label>
                            <select onChange={(e) => handleVariantChange(selectedVariant.ram, e.target.value)} value={selectedVariant.storage} className="ml-2 p-2 border rounded">
                                {storageOptions.map(storage => <option key={storage} value={storage}>{storage}</option>)}
                            </select>
                        </div>
                    </div>

                    <p className="font-semibold" style={{ color: selectedVariant.countInStock > 0 ? 'green' : 'red' }}>
                        {selectedVariant.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>

                    {/* Quantity Selector */}
                    {selectedVariant.countInStock > 0 && (
                        <div className="my-4">
                            <label className="font-bold text-gray-700">Qty:</label>
                            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="ml-2 p-2 border rounded">
                                {[...Array(selectedVariant.countInStock).keys()].map(x => (
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-6 space-y-4">
                         <button onClick={addToCartHandler} disabled={selectedVariant.countInStock === 0} className="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded hover:bg-yellow-600 disabled:bg-gray-400 transition-colors">
                            Add to Cart
                        </button>
                        <button onClick={buyNowHandler} disabled={selectedVariant.countInStock === 0} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;
