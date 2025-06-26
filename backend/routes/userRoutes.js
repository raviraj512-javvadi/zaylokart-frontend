import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Reorganized Routes ---

// Public routes
router.route('/').post(registerUser).get(protect, admin, getUsers);

// --- THIS IS THE FIX ---
// The route is now '/login' to match the frontend
router.post('/login', authUser);
// -----------------------

router.post('/logout', logoutUser);

// Private routes for logged-in users
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Wishlist routes
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

// Private routes for admins only
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
