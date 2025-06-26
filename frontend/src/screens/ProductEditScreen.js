import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    // --- NEW STATE STRUCTURE for Variants and Multiple Images ---
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState(['']); // State for multiple images
    const [variants, setVariants] = useState([{ ram: '', storage: '', price: 0, countInStock: 0 }]); // State for variants

    // States for loading and messaging
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/products/${productId}`);
                const data = await response.json();
                if (!response.ok) throw new Error('Failed to fetch product details');
                
                // --- POPULATE NEW STATES ---
                setName(data.name);
                setBrand(data.brand);
                setCategory(data.category);
                setDescription(data.description);
                // Ensure images/variants are arrays and not empty
                setImages(data.images && data.images.length > 0 ? data.images : ['']);
                setVariants(data.variants && data.variants.length > 0 ? data.variants : [{ ram: '', storage: '', price: 0, countInStock: 0 }]);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleVariantChange = (index, event) => {
        const newVariants = [...variants];
        newVariants[index][event.target.name] = event.target.value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { ram: '', storage: '', price: 0, countInStock: 0 }]);
    };

    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const handleImageChange = (index, event) => {
        const newImages = [...images];
        newImages[index] = event.target.value;
        setImages(newImages);
    };

    const addImageField = () => {
        setImages([...images, '']);
    };
    
    const removeImageField = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
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
            const newImages = [...images];
            newImages[0] = data.image; // Replace the first image with the uploaded one
            setImages(newImages);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateSuccess(false);

        // --- THE FIX: Ensure price and stock are sent as numbers ---
        const productData = {
            name,
            brand,
            category,
            description,
            images,
            variants: variants.map(v => ({
                ...v,
                price: Number(v.price) || 0,
                countInStock: Number(v.countInStock) || 0
            }))
        };
        // -----------------------------------------------------------

        try {
            const res = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify(productData),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update product');
            }
            
            setUpdateSuccess(true);
            setTimeout(() => {
                navigate('/admin/productlist');
            }, 2000);

        } catch (error) {
            setUpdateError(error.message);
        }
    };
    
    if (loading) return <p className="text-center p-10">Loading Product...</p>;
    if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
             <Link to="/admin/productlist" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-6 inline-block">
                Go Back
            </Link>
            <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                
                {updateError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{updateError}</div>}
                {updateSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Product updated successfully! Redirecting...</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block font-semibold">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full rounded" /></div>
                    <div><label className="block font-semibold">Brand</label><input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="border p-2 w-full rounded" /></div>
                    <div><label className="block font-semibold">Category</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} className="border p-2 w-full rounded" /></div>
                </div>
                <div className="mb-6"><label className="block font-semibold">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full rounded" rows="4"></textarea></div>
                
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">Product Images</h3>
                    <div className="mb-3"><label className="block text-sm font-medium">Upload New Image (replaces first URL)</label><input type="file" onChange={uploadFileHandler} className="mt-1" />{uploading && <p>Uploading...</p>}</div>
                    {images.map((image, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input type="text" placeholder={`Image URL ${index + 1}`} value={image} onChange={(e) => handleImageChange(index, e)} className="border p-2 flex-grow mr-2 rounded" />
                            <button type="button" onClick={() => removeImageField(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addImageField} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition">Add Image URL</button>
                </div>

                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">Product Variants (RAM, Storage, Price, Stock)</h3>
                    {variants.map((variant, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border-b items-center">
                            <input type="text" name="ram" placeholder="RAM" value={variant.ram} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                            <input type="text" name="storage" placeholder="Storage" value={variant.storage} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                            <input type="number" name="price" placeholder="Price" value={variant.price} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                            <input type="number" name="countInStock" placeholder="Stock" value={variant.countInStock} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                            <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addVariant} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition">Add Variant</button>
                </div>
                
                <button type="submit" className="w-full bg-green-600 text-white font-bold px-6 py-3 rounded hover:bg-green-700 transition">Update Product</button>
            </form>
        </div>
    );
};

export default ProductEditScreen;
