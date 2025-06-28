import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products, with optional filtering
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    // ... This function is correct and requires no changes
    const keywordFilter = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {};

    const categoryFilter = req.query.category
        ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } }
        : {};

    const products = await Product.find({ ...keywordFilter, ...categoryFilter });
    res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    // ... This function is correct and requires no changes
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
    // UPDATED to include default price and countInStock
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        countInStock: 0,
        user: req.user._id,
        images: ['/images/sample.jpg'],
        brand: 'Sample Brand',
        category: 'Sample Category',
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
    // --- UPDATED: Add price and countInStock to the destructuring ---
    const { name, price, countInStock, description, brand, category, images, variants } = req.body;

    // This variant validation logic remains unchanged and is correct
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
        product.images = images;
        product.variants = variants;
        
        // --- ADDED: Save the new base price and stock fields ---
        product.price = price;
        product.countInStock = countInStock;
        // ----------------------------------------------------

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
    // ... This function is correct and requires no changes
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