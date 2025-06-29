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

    // --- ADDED: Filter by subCategory for your public shop pages ---
    const subCategoryFilter = req.query.subCategory
        ? { subCategory: req.query.subCategory }
        : {};
    // ----------------------------------------------------------------

    // --- UPDATED: Added the new subCategoryFilter to the search ---
    const products = await Product.find({ ...keywordFilter, ...categoryFilter, ...subCategoryFilter });
    res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    // ... No changes needed here ...
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        countInStock: 0,
        user: req.user._id,
        images: ['/images/sample.jpg'],
        brand: 'Sample Brand',
        category: 'Sample Category',
        // --- ADDED: Default subCategory for new products ---
        subCategory: 'Sample SubCategory',
        // ----------------------------------------------------
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
    // --- UPDATED: Add subCategory to the destructuring ---
    const { name, price, countInStock, description, brand, category, subCategory, images, variants } = req.body;

    // This variant validation logic is correct
    if (category === 'Electronics') {
        if (!variants || variants.length === 0) {
            res.status(400);
            throw new Error('For Electronics products, at least one variant is required.');
        }
        for (const variant of variants) {
            if (!variant.ram || !variant.storage) {
                res.status(400);
                throw new Error('For Electronics variants, RAM and Storage fields are mandatory.');
            }
        }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.description = description;
        product.brand = brand;
        product.category = category;
        // --- ADDED: Save the new subCategory field ---
        product.subCategory = subCategory;
        // -------------------------------------------
        product.images = images;
        // --- UPDATED: Clear variants if not an electronic product for data safety ---
        product.variants = category === 'Electronics' ? variants : [];
        // --------------------------------------------------------------------------
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
    // ... No changes needed here ...
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};