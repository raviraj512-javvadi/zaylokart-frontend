import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import API_URL from '../apiConfig';
import Rating from '../components/Rating'; // We will use the Rating component here too

const ProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();
    const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
    const { userInfo } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);

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
                
                // Set defaults based on product type
                if (data.variants && data.variants.length > 0) {
                    // It's a variable product (e.g., Electronics)
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

    const isWishlisted = product ? wishlistItems.some(item => item._id === product._id) : false;

    // --- UPDATED ADD TO CART HANDLER ---
    const addToCartHandler = () => {
        const isVariableProduct = product.variants && product.variants.length > 0;

        // For variable products, a variant must be selected
        if (isVariableProduct && !selectedVariant) {
            alert('Please select a product variant');
            return;
        }
        
        // Use selectedVariant if it exists, otherwise use main product details
        const cartItemDetails = selectedVariant || {
            price: product.price,
            countInStock: product.countInStock
        };
        
        addToCart(product, qty, cartItemDetails);
        navigate('/cart');
    };

    // Other handlers (wishlist, etc.) can remain the same
    const wishlistHandler = () => { /* ... */ };


    // --- RENDER LOGIC ---

    if (loading) return <p className="text-center p-10">Loading...</p>;
    // IMPORTANT: Check for error or a non-existent product first
    if (error || !product) return <p className="text-center p-10 text-red-500">{error || 'Product not found.'}</p>;

    // --- NEW LOGIC TO DETERMINE PRICE AND STOCK ---
    const isVariableProduct = product.variants && product.variants.length > 0;
    
    // If a variant is selected, use its price/stock. Otherwise, use the product's base price/stock.
    const displayPrice = selectedVariant ? selectedVariant.price : product.price;
    const displayStock = selectedVariant ? selectedVariant.countInStock : product.countInStock;
    const isInStock = displayStock > 0;

    // Get unique options for variant dropdowns if they exist
    const ramOptions = isVariableProduct ? [...new Set(product.variants.map(v => v.ram))] : [];
    const storageOptions = isVariableProduct ? [...new Set(product.variants.map(v => v.storage))] : [];

    return (
        <div className="container mx-auto p-4 md:p-8">
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
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-gray-500 mb-4">Brand: {product.brand}</p>
                    <div className="my-4"><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
                    <hr className="my-4" />
                    
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                        ₹{displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    
                    <p className="font-semibold" style={{ color: isInStock ? 'green' : 'red' }}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                    </p>

                    <hr className="my-4" />

                    {/* --- VARIANT SECTION: ONLY SHOWS FOR VARIABLE PRODUCTS --- */}
                    {isVariableProduct && (
                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                            {/* RAM/Storage selectors here, mapping over ramOptions and storageOptions */}
                            <p>RAM/Storage selectors would go here.</p>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    {isInStock && (
                        <div className="my-4">
                            <label className="font-bold text-gray-700">Qty:</label>
                            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="ml-2 p-2 border rounded">
                                {[...Array(displayStock).keys()].slice(0, 10).map(x => ( // Limit to max 10 for performance
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-6 space-y-4">
                        <button onClick={addToCartHandler} disabled={!isInStock} className="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded hover:bg-yellow-600 disabled:bg-gray-400">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700">{product.description}</p>
            </div>
        </div>
    );
};

export default ProductScreen;