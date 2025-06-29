import express from 'express';
import { 
    getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Routes (This setup is correct) ---
// Anyone can view all products
router.route('/').get(getProducts);

// Anyone can view a single product by its ID. This is correctly public.
router.route('/:id').get(getProductById);


// --- Admin-Only Routes (This setup is correct) ---
// Only logged-in admins can create, update, or delete products.
router.route('/').post(protect, admin, createProduct);
router.route('/:id').put(protect, admin, updateProduct);
router.route('/:id').delete(protect, admin, deleteProduct);


export default router;