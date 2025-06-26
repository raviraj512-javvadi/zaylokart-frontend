import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Using both Link and useNavigate
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import './ProductListScreen.css'; // Assuming you have this CSS file for styling

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    // Using useCallback to prevent infinite loops from the useEffect dependency array
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/products`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Could not fetch products');
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array as it doesn't depend on props or state

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchProducts();
        } else {
            navigate('/login');
        }
    }, [userInfo, navigate, fetchProducts]);

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new sample product?')) {
            try {
                const response = await fetch(`${API_URL}/api/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    body: JSON.stringify({}), // Sending an empty body as the backend creates a sample
                });
                const createdProduct = await response.json();
                if (!response.ok) throw new Error(createdProduct.message || 'Could not create product');
                
                // Navigate to the edit screen for the newly created product
                navigate(`/admin/product/${createdProduct._id}/edit`);

            } catch (err) {
                alert(err.message);
            }
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });
                // Refetch products to update the list after deletion
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    if (loading) return <p className="text-center p-10">Loading products...</p>;
    if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

    return (
        <div className="admin-screen-container">
            <div className="admin-header">
                <h1 className="admin-title">Products</h1>
                <button onClick={createProductHandler} className="primary-button">
                    <PlusCircle size={20} /> Create Product
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            // Safely get the price from the first variant to display in the list.
                            const displayPrice = product.variants && product.variants.length > 0 
                                ? product.variants[0].price 
                                : 0;

                            return (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        ₹{displayPrice.toLocaleString('en-IN')}
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <div className="action-buttons">
                                             {/* --- THIS IS THE FIX --- */}
                                             {/* Using Link component instead of a button with navigate */}
                                             <Link to={`/admin/product/${product._id}/edit`} className="icon-btn">
                                                <Edit size={18} />
                                             </Link>
                                             {/* ------------------------- */}
                                             <button className="icon-btn-danger" onClick={() => deleteHandler(product._id)}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListScreen;
