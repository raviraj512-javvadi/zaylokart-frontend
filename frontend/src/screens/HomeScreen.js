import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../apiConfig';
import ProductCard from '../components/ProductCard'; // Using the corrected ProductCard
import '../ProductGrid.css'; // Assuming you have this CSS file for styling

const HomeScreen = () => {
    const { keyword, category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                // This logic correctly constructs the URL for fetching products
                const url = new URL(`${API_URL}/api/products`);
                if (keyword) url.searchParams.append('keyword', keyword);
                if (category) url.searchParams.append('category', category);

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
    }, [keyword, category]);

    // This logic dynamically sets the title based on the context
    const pageTitle = keyword 
        ? `Search Results for: "${keyword}"` 
        : (category ? category.replace(/-/g, ' ').toUpperCase() : 'Featured Products');

    return (
        <>
            {/* --- Hero section from your code --- */}
            {!category && !keyword && (
                <section className="hero-section">
                    <h1 className="hero-title">Style Redefined</h1>
                    <p className="hero-subtitle">Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.</p>
                    <a href="#featured" className="hero-button">EXPLORE THE COLLECTION</a>
                </section>
            )}
            
            <section id="featured" className="featured-products-section">
                <h2 className="featured-title" style={{ textAlign: 'center' }}>
                    {pageTitle}
                </h2>
                
                {loading && <div className="text-center p-10">Loading products...</div>}
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            // Using the corrected ProductCard component to prevent crashes
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        !loading && !error && <p className="text-center p-10">No products found.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default HomeScreen;