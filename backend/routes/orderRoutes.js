import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
// --- UPDATE THIS IMPORT ---
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';

const router = express.Router();

// This route creates new orders
router.route('/').post(protect, addOrderItems);

// --- ADD THIS NEW ROUTE ---
router.route('/myorders').get(protect, getMyOrders);

export default router;