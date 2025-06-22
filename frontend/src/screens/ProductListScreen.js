import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import API_URL from '../apiConfig';
import './ProductListScreen.css'; // Import the new CSS file

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
    };

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [userInfo, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new sample product?')) {
            try {
                const response = await fetch(`${API_URL}/api/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    body: JSON.stringify({}),
                });
                const newProduct = await response.json();
                navigate(`/admin/product/${newProduct._id}/edit`);
            } catch (error) {
                alert('Error creating product');
            }
        }
    };

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
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>₹{product.price.toLocaleString('en-IN')}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn" onClick={() => navigate(`/admin/product/${product._id}/edit`)}><Edit size={18} /></button>
                                        <button className="icon-btn-danger" onClick={() => deleteHandler(product._id)}><Trash2 size={18} /></button>
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