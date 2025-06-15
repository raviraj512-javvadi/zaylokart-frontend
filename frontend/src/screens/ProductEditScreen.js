import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import './LoginScreen.css';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

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
            try {
                const response = await fetch(`${API_URL}/api/products/${productId}`);
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
            } catch (error) {
                console.error('Failed to fetch product details', error);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleSizeChange = (index, event) => {
        const newSizes = [...sizes];
        newSizes[index][event.target.name] = event.target.value;
        setSizes(newSizes);
    };

    const addSizeField = () => {
        setSizes([...sizes, { name: '', stock: 0 }]);
    };

    const removeSizeField = (index) => {
        const newSizes = [...sizes];
        newSizes.splice(index, 1);
        setSizes(newSizes);
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
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
            await fetch(`${API_URL}/api/products/${productId}`, {
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
        <div className="login-container">
            <form className="login-form" onSubmit={submitHandler}>
                <h1>Edit Product</h1>

                <div className="form-group"><label>Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
                <div className="form-group"><label>Price</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
                <div className="form-group"><label>Image URL</label><input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
                <div className="form-group"><label>Or Upload New Image</label><input type="file" onChange={uploadFileHandler} />{uploading && <p>Uploading...</p>}</div>
                <div className="form-group"><label>Brand</label><input type="text" value={brand} onChange={e => setBrand(e.target.value)} /></div>
                <div className="form-group"><label>Category</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} /></div>

                <div className="form-group">
                    <label>Sizes & Stock</label>
                    {sizes.map((size, index) => (
                        <div key={index} className="size-field-row">
                            <input type="text" name="name" placeholder="Size Name (e.g., M)" value={size.name} onChange={event => handleSizeChange(index, event)} required/>
                            <input type="number" name="stock" placeholder="Stock" value={size.stock} onChange={event => handleSizeChange(index, event)} required/>
                            <button type="button" onClick={() => removeSizeField(index)} className="remove-size-btn">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSizeField} className="add-size-btn">Add New Size</button>
                </div>

                <div className="form-group"><label>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
                <button type="submit" className="login-button">Update</button>
            </form>
        </div>
    );
};

export default ProductEditScreen;
