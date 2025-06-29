import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products, with optional filtering
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const keywordFilter = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {};

    const categoryFilter = req.query.category
        ? { category: req.query.category }
        : {};

    const subCategoryFilter = req.query.subCategory
        ? { subCategory: req.query.subCategory }
        : {};

    const products = await Product.find({ ...keywordFilter, ...categoryFilter, ...subCategoryFilter });
    res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    // ... No changes needed here
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    // ... This function is correct, no changes needed
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        countInStock: 0,
        user: req.user._id,
        images: ['/images/sample.jpg'],
        brand: 'Sample Brand',
        category: 'Sample Category',
        subCategory: 'Sample SubCategory',
        description: 'Sample description',
        variants: []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, countInStock, description, brand, category, subCategory, images, variants } = req.body;

    if (category === 'Electronics') {
        // ... This validation is correct
    }

    const product = await Product.findById(req.params.id);

    if (product) {
        // --- THIS IS THE FIX ---
        // We ensure the user ID from the logged-in admin is always present before saving.
        product.user = req.user._id;
        // ----------------------
        
        product.name = name;
        product.description = description;
        product.brand = brand;
        product.category = category;
        product.subCategory = subCategory;
        product.images = images;
        product.variants = category === 'Electronics' ? variants : [];
        product.price = price;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    // ... No changes needed here
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};