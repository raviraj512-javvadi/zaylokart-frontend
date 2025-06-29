import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    // State for all product fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState(['']); 
    const [variants, setVariants] = useState([{ ram: '', storage: '', price: 0, countInStock: 0 }]);
    
    // States for loading and messaging
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    const subCategoryOptions = [
        'Fresh Fruits', 'Fresh Vegetables', 'Dairy & Eggs', 'Meat & Seafood',
        'Snacks & Munchies', 'Beverages', 'Masalas & Spices', 'Atta, Rice & Dal',
        'Mobiles', 'Laptops', 'Audio', 'Cameras', 'Men', 'Women', 'Kids', 'Beauty & Grooming'
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/products/${productId}`);
                const data = await response.json();
                if (!response.ok) throw new Error('Failed to fetch product details');
                
                setName(data.name);
                setPrice(data.price);
                setCountInStock(data.countInStock);
                setBrand(data.brand);
                setCategory(data.category);
                setSubCategory(data.subCategory);
                setDescription(data.description);
                setImages(data.images && data.images.length > 0 ? data.images : ['']);
                setVariants(data.variants && data.variants.length > 0 ? data.variants : [{ ram: '', storage: '', price: 0, countInStock: 0 }]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (productId) { fetchProduct(); }
    }, [productId]);

    // --- ALL HELPER FUNCTIONS NOW FULLY IMPLEMENTED ---

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        if (newCategory !== 'Electronics') {
            setVariants([{ ram: '', storage: '', price: 0, countInStock: 0 }]);
        }
    };

    const handleVariantChange = (index, event) => {
        const updatedVariants = variants.map((variant, i) => {
            if (index === i) {
                return { ...variant, [event.target.name]: event.target.value };
            }
            return variant;
        });
        setVariants(updatedVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { ram: '', storage: '', price: 0, countInStock: 0 }]);
    };

    const removeVariant = (index) => {
        const filteredVariants = variants.filter((_, i) => i !== index);
        setVariants(filteredVariants);
    };

    const handleImageChange = (index, event) => {
        const newImages = images.map((image, i) => {
            if (index === i) {
                return event.target.value;
            }
            return image;
        });
        setImages(newImages);
    };

    const addImageField = () => {
        setImages([...images, '']);
    };

    const removeImageField = (index) => {
        const filteredImages = images.filter((_, i) => i !== index);
        setImages(filteredImages);
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
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
            if (!response.ok) throw new Error(data.message || 'Image upload failed');
            const newImages = [...images];
            newImages[0] = data.image; 
            setImages(newImages);
        } catch (error) {
            console.error(error);
            setUpdateError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateSuccess(false);

        const productData = {
            name,
            price: Number(price),
            countInStock: Number(countInStock),
            brand,
            category,
            subCategory,
            description,
            images,
            variants: category === 'Electronics' ? variants : [],
        };

        try {
            const res = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
                body: JSON.stringify(productData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update product');
            
            setUpdateSuccess(true);
            setTimeout(() => navigate('/admin/productlist'), 2000);
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
                {updateSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Product updated successfully!</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block font-semibold">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full rounded" required /></div>
                    <div><label className="block font-semibold">Brand</label><input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="border p-2 w-full rounded" required /></div>
                    <div><label className="block font-semibold">Base Price</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 w-full rounded" required /></div>
                    <div><label className="block font-semibold">Base Stock</label><input type="number" value={countInStock} onChange={e => setCountInStock(e.target.value)} className="border p-2 w-full rounded" required /></div>
                    
                    <div>
                        <label className="block font-semibold">Category (Controls Form)</label>
                        <select value={category} onChange={e => handleCategoryChange(e.target.value)} className="border p-2 w-full rounded bg-white" required>
                            <option value="">-- Select Type --</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Fashion & Beauty">Fashion & Beauty</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold">Sub-Category (For Shop Filter)</label>
                        <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="border p-2 w-full rounded bg-white" required>
                            <option value="">-- Select Sub-Category --</option>
                            {subCategoryOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="mb-6"><label className="block font-semibold">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full rounded" rows="4" required></textarea></div>
                
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">Product Images</h3>
                    <div className="mb-3"><label className="block text-sm font-medium">Upload New Image</label><input type="file" onChange={uploadFileHandler} className="mt-1" />{uploading && <p>Uploading...</p>}</div>
                    {images.map((image, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input type="text" placeholder={`Image URL ${index + 1}`} value={image} onChange={(e) => handleImageChange(index, e)} className="border p-2 flex-grow mr-2 rounded" />
                            <button type="button" onClick={() => removeImageField(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addImageField} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition">Add Image URL</button>
                </div>

                {category === 'Electronics' && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold mb-3">Product Variants (RAM, Storage, etc.)</h3>
                        <p className="text-sm text-gray-500 mb-3">Prices set here will override the base price for that specific variant.</p>
                        {variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border-b items-center">
                                <input type="text" name="ram" placeholder="RAM" value={variant.ram} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                                <input type="text" name="storage" placeholder="Storage" value={variant.storage} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                                <input type="number" step="0.01" name="price" placeholder="Price" value={variant.price} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                                <input type="number" name="countInStock" placeholder="Stock" value={variant.countInStock} onChange={e => handleVariantChange(index, e)} className="border p-2 rounded" required />
                                <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={addVariant} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition">Add Variant</button>
                    </div>
                )}
                
                <button type="submit" className="w-full bg-green-600 text-white font-bold px-6 py-3 rounded hover:bg-green-700 transition">Update Product</button>
            </form>
        </div>
    );
};

export default ProductEditScreen;