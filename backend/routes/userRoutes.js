import express from 'express';
const router = express.Router();
import { 
  authUser, 
  registerUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUsers,
  getUserById, // <-- Import the new functions
  updateUser,  // <-- Import the new functions
  // deleteUser // You may need to add a deleteUser controller later
} from '../controllers/userController.js';

// Import BOTH protect and admin middleware
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Reorganized User Routes ---
// The '/api/users' path
router.route('/')
  .post(registerUser) // Anyone can register
  .get(protect, admin, getUsers); // Only admins can get all users

router.post('/login', authUser); // Anyone can log in

// --- NEW ROUTES FOR ADMINS TO MANAGE A SPECIFIC USER ---
// The '/api/users/:id' path
router.route('/:id')
  .get(protect, admin, getUserById)    // Admin gets a single user by ID
  .put(protect, admin, updateUser);    // Admin updates a single user by ID
  // .delete(protect, admin, deleteUser) // You can add this later

// --- Wishlist Routes (Remain the same) ---
router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router
  .route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

export default router;
