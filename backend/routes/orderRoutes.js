import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
// Make sure all needed functions are imported
import { 
  addOrderItems, 
  getMyOrders, 
  getOrderById 
} from '../controllers/orderController.js';

const router = express.Router();

// Route to create a new order
router.route('/').post(protect, addOrderItems);

// Route to get the logged-in user's orders
router.route('/myorders').get(protect, getMyOrders);

// --- THIS IS THE NEW ROUTE WE ARE ADDING ---
// Route to get a single order by its ID
router.route('/:id').get(protect, getOrderById);
// ---------------------------------------------

export default router;