import express from 'express';
// --- UPDATE: Import all the new controller functions ---
import { 
    authUser, 
    registerUser,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing routes
router.post('/login', authUser);
router.post('/register', registerUser);

// --- ADD THESE NEW WISHLIST ROUTES ---

// We can chain .get() and .post() to the same '/wishlist' path
router.route('/wishlist')
  .get(protect, getWishlist)       // Gets the user's wishlist
  .post(protect, addToWishlist);    // Adds an item to the wishlist

// This route handles deleting a specific item from the wishlist by its ID
router.route('/wishlist/:id').delete(protect, removeFromWishlist);


export default router;