import Product from '../models/productModel.js';

// @desc    Fetch all products, with optional filtering by category AND keyword
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    // --- THIS IS THE UPDATED LOGIC ---
    // It now handles both a search keyword and a category
    const keywordFilter = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i', // 'i' for case-insensitive
          },
        }
      : {};

    const categoryFilter = req.query.category
      ? {
          category: {
            $regex: `^${req.query.category}$`, // Exact match for category, case-insensitive
            $options: 'i',
          },
        }
      : {};

    // Find products that match BOTH the keyword and category filters
    const products = await Product.find({ ...keywordFilter, ...categoryFilter });
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- ALL OTHER FUNCTIONS REMAIN UNCHANGED ---

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    imageUrl: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    sizes: [{ name: 'Standard', stock: 0 }],
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, imageUrl, brand, category, sizes } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;
    product.brand = brand;
    product.category = category;
    product.sizes = sizes;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export { 
    getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};