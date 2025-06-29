import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../apiConfig'; // Assuming you have this config file
import ProductCard from '../components/ProductCard'; // Assuming you have a ProductCard component

const SubCategoryScreen = () => {
    // This hook gets the sub-category name from the URL parameter we defined in App.js
    // e.g., if the URL is /subcategory/Fresh%20Fruits, subCategoryName will be "Fresh Fruits"
    const { subCategoryName } = useParams(); 
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductsBySubCategory = async () => {
            try {
                setLoading(true);
                // This is the API call that makes the filter work.
                // It uses the subCategoryName from the URL to build the correct filter query.
                const response = await fetch(`${API_URL}/api/products?subCategory=${encodeURIComponent(subCategoryName)}`);
                
                if (!response.ok) {
                    throw new Error('Could not fetch products for this category.');
                }
                
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // We run the fetch only if a subCategoryName is present in the URL
        if (subCategoryName) {
            fetchProductsBySubCategory();
        }
    }, [subCategoryName]); // The dependency array ensures this runs again if the user navigates to a new sub-category

    // Render a loading message while fetching
    if (loading) {
        return <p className="text-center p-10 text-xl">Loading Products...</p>;
    }

    // Render an error message if the fetch failed
    if (error) {
        return <p className="text-center p-10 text-xl text-red-500">{error}</p>;
    }

    // Render the final page content
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-center my-8 capitalize">{subCategoryName}</h1>
            
            {products.length === 0 ? (
                <div className="text-center p-10">
                    <p className="text-xl text-gray-500">No products found in this category.</p>
                    <Link to="/groceries" className="text-blue-500 hover:underline mt-4 inline-block">← Back to Categories</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* We map over the fetched products and display each one */}
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubCategoryScreen;