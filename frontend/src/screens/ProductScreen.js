import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API_URL from '../apiConfig';
import Rating from '../components/Rating';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // We can remove selectedVariant state for now as it's only for electronics
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
        // Since we only have one price/stock for simple products, this logic is simpler.
        // We will need to enhance this later if we re-add variants.
        addToCart(product, qty, {
            price: product.price,
            countInStock: product.countInStock
        });
        navigate('/cart');
    };

    if (loading) return <p className="text-center p-10">Loading...</p>;
    if (error || !product) return <p className="text-center p-10 text-red-500">{error || 'Product not found.'}</p>;

    // Use the product's base price and stock directly
    const displayPrice = product.price;
    const displayStock = product.countInStock;
    const isInStock = displayStock > 0;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Link to="/" className='btn btn-light my-3'>Go Back</Link>
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