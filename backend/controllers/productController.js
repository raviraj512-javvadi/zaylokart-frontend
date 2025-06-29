import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
const getProducts = asyncHandler(async (req, res) => {
    const keywordFilter = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
    const subCategoryFilter = req.query.subCategory ? { subCategory: req.query.subCategory } : {};
    const products = await Product.find({ ...keywordFilter, ...subCategoryFilter });
    res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
// --- IMPLEMENTATION ADDED ---
const getProductById = asyncHandler(async (req, res) => {
    console.log(`--- Request received to get product with ID: ${req.params.id} ---`);

    try {
        console.log('Attempting to find product in the database...');
        const product = await Product.findById(req.params.id);
        console.log('Database query has finished.');

        if (product) {
            console.log(`Product found: ${product.name}`);
            res.json(product);
        } else {
            console.log(`No product found with ID: ${req.params.id}`);
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        console.error('!!! An error occurred in getProductById !!!:', error);
        res.status(500).json({ message: 'Server error while fetching product.' });
    }
});

// @desc    Create a product
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample Name', price: 0, countInStock: 0, user: req.user._id,
        images: ['/images/sample.jpg'], brand: 'Sample Brand',
        category: 'Sample Category', subCategory: 'Sample SubCategory',
        description: 'Sample description', variants: []
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, countInStock, description, brand, category, subCategory, images, variants } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.user = req.user._id;
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
// --- IMPLEMENTATION ADDED ---
const deleteProduct = asyncHandler(async (req, res) => {
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