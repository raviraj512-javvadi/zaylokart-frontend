import express from 'express';
// We now import both 'protect' and 'admin' middleware
import { protect, admin } from '../middleware/authMiddleware.js';

// We also import the getOrders function from the controller
import { 
  addOrderItems, 
  getMyOrders, 
  getOrderById,
  getOrders 
} from '../controllers/orderController.js';

const router = express.Router();

// This route now handles two things:
// POST to /api/orders will create a new order
// GET to /api/orders will get ALL orders (but only for an Admin)
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders); // <-- This is the new line

// Route to get the logged-in user's own orders
router.route('/myorders').get(protect, getMyOrders);

// Route to get a single order by its ID
// IMPORTANT: This route must come AFTER the more specific routes above
router.route('/:id').get(protect, getOrderById);

export default router;