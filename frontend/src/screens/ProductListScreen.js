import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';
import API_URL from '../apiConfig'; // <-- IMPORT a
import { Link } from 'react-router-dom';
dded

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    // Your fetchProducts function is preserved, only the URL is updated
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

    // Your deleteHandler function is preserved, only the URL is updated
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

    // Your createProductHandler function is preserved, only the URL is updated
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
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Products</h1>
                <button onClick={createProductHandler} style={{ padding: '0.5rem 1rem' }}>Create Product</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>NAME</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>PRICE</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>CATEGORY</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>BRAND</th>
                        <th style={{ padding: '8px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{product._id}</td>
                            <td style={{ padding: '8px' }}>{product.name}</td>
                            <td style={{ padding: '8px' }}>₹{product.price.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '8px' }}>{product.category}</td>
                            <td style={{ padding: '8px' }}>{product.brand}</td>
                            <td style={{ padding: '8px', display: 'flex', gap: '1rem' }}>
                                <button onClick={() => navigate(`/admin/product/${product._id}/edit`)}><Edit size={16} /></button>
                                <button onClick={() => deleteHandler(product._id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductListScreen;