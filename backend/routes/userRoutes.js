import express from 'express';
// Import the new getUsers function
import { 
  authUser, 
  registerUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUsers, // <-- New import
} from '../controllers/userController.js';

// Import BOTH protect and admin middleware
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


// --- NEW ROUTE FOR ADMIN TO GET ALL USERS ---
router.route('/').get(protect, admin, getUsers);
// --------------------------------------------


// --- Existing Auth Routes ---
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