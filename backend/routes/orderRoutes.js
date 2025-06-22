import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';

// --- PROOF OF LIFE TEST ---
console.log('✅✅✅ ORDER ROUTES FILE LOADED - v2 ✅✅✅');
// --------------------------

const router = express.Router();

// This route creates new orders
router.route('/').post(protect, addOrderItems);

// This route gets the logged-in user's orders
router.route('/myorders').get(protect, getMyOrders);

export default router;