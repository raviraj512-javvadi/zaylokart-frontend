import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// ... (getProducts and getProductById functions remain the same) ...

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Your current 'createProduct' creates a sample product.
  // The user then edits this product, which calls 'updateProduct'.
  // We will add the validation here as well for future-proofing,
  // in case you ever create products directly with full data.
  
  // Assuming the data might come from req.body or be a sample
  const { 
    name = 'Sample Name',
    images = ['/images/sample.jpg'],
    brand = 'Sample Brand',
    category = 'Sample Category',
    description = 'Sample Description',
    variants = []
  } = req.body;
  
  // --- START OF NEW VALIDATION LOGIC FOR CREATE ---
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
  // --- END OF NEW VALIDATION LOGIC FOR CREATE ---

  const product = new Product({
    name,
    user: req.user._id,
    images,
    brand,
    category,
    description,
    variants
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, brand, category, images, variants } = req.body;
  
  // --- START OF NEW VALIDATION LOGIC FOR UPDATE ---
  if (category === 'Electronics') {
    if (!variants || variants.length === 0) {
      res.status(400); // Bad Request
      throw new Error('For Electronics products, at least one variant is required.');
    }
    for (const variant of variants) {
      // Check for null, undefined, or empty strings
      if (!variant.ram || !variant.storage) {
        res.status(400);
        throw new Error('For Electronics variants, RAM and Storage fields are mandatory.');
      }
    }
  }
  // --- END OF NEW VALIDATION LOGIC FOR UPDATE ---

  const product = await Product.findById(req.params.id);

  if (product) {
    product.user = req.user._id;
    product.name = name;
    product.description = description;
    product.brand = brand;
    product.category = category;
    product.images = images;
    // If the category is not 'Electronics', the frontend will send an empty 'variants' array,
    // which will correctly overwrite and clear any old variants.
    product.variants = variants;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// ... (deleteProduct function remains the same) ...


export { 
    getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};