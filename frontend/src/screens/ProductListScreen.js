import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import './ProductListScreen.css';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();
    const navigate = useNavigate();

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
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchProducts();
        } else {
            navigate('/login');
        }
    }, [userInfo, navigate, fetchProducts]);


    // --- IMPLEMENTATION ADDED FOR createProductHandler ---
    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new sample product?')) {
            console.log('User confirmed. Attempting to create product...');
            try {
                const response = await fetch(`${API_URL}/api/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    body: JSON.stringify({}), // Backend creates a sample
                });

                const createdProduct = await response.json();
                console.log('Received response from server:', createdProduct);

                if (!response.ok) {
                    throw new Error(createdProduct.message || 'Could not create product');
                }
                
                console.log('Product created successfully. Navigating to edit page...');
                navigate(`/admin/product/${createdProduct._id}/edit`);

            } catch (err) {
                console.error('An error occurred during product creation:', err);
                alert(`Failed to create product. Error: ${err.message}`);
            }
        } else {
            console.log('User canceled product creation.');
        }
    };

    // --- IMPLEMENTATION ADDED FOR deleteHandler ---
    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Could not delete product.');
                }
                // Refetch products to update the list after deletion
                fetchProducts();
            } catch (error) {
                alert(`Error deleting product: ${error.message}`);
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
                            <th>SUB-CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>₹{product.price.toLocaleString('en-IN')}</td>
                                <td>{product.subCategory}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Link to={`/admin/product/${product._id}/edit`} className="icon-btn">
                                            <Edit size={18} />
                                        </Link>
                                        <button className="icon-btn-danger" onClick={() => deleteHandler(product._id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListScreen;