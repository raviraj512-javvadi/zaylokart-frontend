import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

// Import all the functions we will need
import { 
  addOrderItems, 
  getMyOrders, 
  getOrderById,
  getOrders,
  updateOrderToDelivered // <-- Added this import
} from '../controllers/orderController.js';

const router = express.Router();

// GET all orders (Admin) & POST a new order (User)
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// GET the logged-in user's orders
router.route('/myorders').get(protect, getMyOrders);

// GET a single order by its ID
router.route('/:id').get(protect, getOrderById);

// --- THIS IS THE NEW ROUTE WE ARE ADDING ---
// PUT to update an order to delivered (Admin only)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
// ---------------------------------------------

export default router;