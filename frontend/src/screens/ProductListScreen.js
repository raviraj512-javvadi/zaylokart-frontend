import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    // This function will be used to fetch the products
    const fetchProducts = async () => {
        const response = await fetch('/api/products');
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
                await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                // Refetch products after deletion
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new sample product?')) {
            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    body: JSON.stringify({}), // Empty body, backend creates sample
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
                            <td style={{ padding: '8px' }}>₹{product.price}</td>
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