import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    // --- NEW STATE STRUCTURE ---
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState(['']); // State for multiple images
    const [variants, setVariants] = useState([{ ram: '', storage: '', price: 0, countInStock: 0 }]); // State for variants

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
                
            } catch (error) {
                console.error('Failed to fetch product details', error);
                setError('Failed to fetch product details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    // --- HANDLERS FOR VARIANTS ---
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

    // --- HANDLERS FOR IMAGES ---
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

    // --- UPLOAD HANDLER (updates first image) ---
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
            // Update the first image URL with the uploaded image path
            const newImages = [...images];
            newImages[0] = data.image;
            setImages(newImages);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    // --- SUBMIT HANDLER ---
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                // Send the new data structure to the backend
                body: JSON.stringify({ name, brand, category, description, images, variants }),
            });
            alert('Product updated successfully!');
            navigate('/admin/productlist');
        } catch (error) {
            alert('Error updating product');
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
                
                {/* Standard product fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block font-semibold">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full rounded" /></div>
                    <div><label className="block font-semibold">Brand</label><input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="border p-2 w-full rounded" /></div>
                    <div><label className="block font-semibold">Category</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} className="border p-2 w-full rounded" /></div>
                </div>
                <div className="mb-6"><label className="block font-semibold">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full rounded" /></div>

                {/* --- Multiple Images Section --- */}
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

                {/* --- Variants Section --- */}
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
