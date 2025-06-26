import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../apiConfig';
import ProductCard from '../components/ProductCard'; 

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
                const url = new URL(`${API_URL}/api/products`);
                if (keyword) url.searchParams.append('keyword', keyword);
                if (category) url.searchParams.append('category', category);
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Could not fetch products.');
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, category]);

    const pageTitle = keyword 
        ? `Search Results for: "${keyword}"` 
        : (category ? category.replace(/-/g, ' ').toUpperCase() : 'Featured Products');

    return (
        // Using a fragment <> to avoid adding extra unnecessary divs
        <>
            {/* --- Hero Section with Centering and Styling --- */}
            {!category && !keyword && (
                <div className="bg-gray-100 py-16 sm:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Style Redefined</h1>
                        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.</p>
                        <a href="#featured" className="mt-8 inline-block bg-gray-800 text-white font-bold text-sm uppercase px-8 py-3 rounded-md hover:bg-gray-700 transition-colors">
                            EXPLORE THE COLLECTION
                        </a>
                    </div>
                </div>
            )}
            
            <main id="featured" className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    {pageTitle}
                </h2>
                
                {loading && <div className="text-center p-10">Loading products...</div>}
                {error && <div className="text-center p-10 text-red-500">{error}</div>}

                {/* --- The Responsive 4-Column Product Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        !loading && !error && <p className="col-span-full text-center p-10">No products found.</p>
                    )}
                </div>
            </main>
        </>
    );
};

export default HomeScreen;
