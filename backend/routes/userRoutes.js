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
  getWishlist,       // <-- Import wishlist functions
  addToWishlist,     // <-- Import wishlist functions
  removeFromWishlist,// <-- Import wishlist functions
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public routes
router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

// Private routes for logged-in users
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// --- NEW WISHLIST ROUTES ---
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:id')
  .delete(protect, removeFromWishlist);
// -------------------------

// Private routes for admins only
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
