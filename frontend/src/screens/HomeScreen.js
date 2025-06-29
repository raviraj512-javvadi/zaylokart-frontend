import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../apiConfig';
import ProductCard from '../components/ProductCard';

const HomeScreen = () => {
    // This gets the keyword or category from the URL, e.g., /search/headphones
    const { keyword, category } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                // Build the URL with search parameters if they exist
                const url = new URL(`${API_URL}/api/products`);
                if (keyword) {
                    url.searchParams.append('keyword', keyword);
                }
                if (category) {
                    url.searchParams.append('category', category);
                }
                
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Could not fetch products.');
                }
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, category]); // Re-fetch whenever the keyword or category changes

    // Determine the page title based on the context
    const pageTitle = keyword 
        ? `Search Results for: "${keyword}"` 
        : (category ? category.replace(/-/g, ' ').toUpperCase() : 'Featured Products');

    // Only show the hero section on the main homepage
    const showHero = !keyword && !category;

    return (
        <>
            {/* --- "STYLE REDEFINED" SECTION (Conditional) --- */}
            {showHero && (
                <div className="hero-section">
                    <h1 className="hero-title">Style Redefined</h1>
                    <p className="hero-subtitle">
                        Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.
                    </p>
                    {/* The link should probably go to a general shop page, but using / for now */}
                    <Link to="/" className="hero-button">
                        EXPLORE THE COLLECTION
                    </Link>
                </div>
            )}

            {/* --- PRODUCTS SECTION --- */}
            <div className="featured-products-section">
                <h2 className="featured-title">{pageTitle}</h2>
                
                {loading && <p className="text-center">Loading products...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="product-grid">
                        {products.length > 0 ? (
                            products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            <p className="col-span-full text-center">No products found.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default HomeScreen;
