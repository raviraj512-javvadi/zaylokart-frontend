import express from 'express';

// ✅ Import controller functions (old + new)
import { 
  authUser, 
  registerUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- ✅ Existing Auth Routes ---
router.post('/login', authUser);
router.post('/register', registerUser);

// --- ✅ Wishlist Routes (NEW) ---
router
  .route('/wishlist')
  .get(protect, getWishlist)       // Get wishlist items
  .post(protect, addToWishlist);   // Add product to wishlist

router
  .route('/wishlist/:id')
  .delete(protect, removeFromWishlist); // Remove product by ID from wishlist

export default router;
