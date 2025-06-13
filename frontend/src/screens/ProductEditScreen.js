import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig'; // <-- 1. IMPORT THE API URL CONFIG
import './LoginScreen.css'; 

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    // (Your other state variables remain the same)
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [sizes, setSizes] = useState([{ name: '', stock: 0 }]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            // --- 2. UPDATE THIS FETCH URL ---
            const response = await fetch(`<span class="math-inline">\{API\_URL\}/api/products/</span>{productId}`);
            const data = await response.json();
            setName(data.name);
            setPrice(data.price);
            setImageUrl(data.imageUrl);
            setBrand(data.brand);
            setCategory(data.category);
            setDescription(data.description);
            if (data.sizes && data.sizes.length > 0) {
                setSizes(data.sizes);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleSizeChange = (index, event) => { /* ... same as before ... */ };
    const addSizeField = () => { /* ... same as before ... */ };
    const removeSizeField = (index) => { /* ... same as before ... */ };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            // --- 3. UPDATE THIS FETCH URL ---
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                body: formData,
            });
            const data = await response.json();
            setImageUrl(data.image);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // --- 4. UPDATE THIS FETCH URL ---
            await fetch(`<span class="math-inline">\{API\_URL\}/api/products/</span>{productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ name, price, imageUrl, brand, category, sizes, description }),
            });
            alert('Product updated successfully!');
            navigate('/admin/productlist');
        } catch (error) {
            alert('Error updating product');
        }
    };

    return (
      // Your JSX remains exactly the same
      <div className="login-container">
        {/* ... form ... */}
      </div>
    );
};

export default ProductEditScreen;