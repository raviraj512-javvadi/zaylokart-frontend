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
  forgotPassword, // <-- Added
  resetPassword,  // <-- Added
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Public Routes ---
router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/logout', logoutUser);
// --- ADDED NEW PASSWORD RESET ROUTES ---
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
// -------------------------------------

// --- Private Routes for Logged-in Users ---
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

// --- Private Routes for Admins Only ---
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
