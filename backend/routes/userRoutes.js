import express from 'express';
import { 
  authUser, 
  registerUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Restore original Auth Routes ---
router.post('/login', authUser);
router.post('/register', registerUser);

// --- Wishlist Routes (Remain the same) ---
router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router
  .route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

export default router;