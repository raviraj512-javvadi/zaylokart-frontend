import express from 'express';

// Import the new OTP functions and keep the existing wishlist/protect functions
import { 
  sendOtp,
  verifyOtp,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- NEW OTP AUTHENTICATION ROUTES ---
router.post('/send-otp', sendOtp);      // Route to send an OTP to a mobile number
router.post('/verify-otp', verifyOtp);  // Route to verify the OTP and log in/register the user


// --- Wishlist Routes (These remain the same) ---
router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router
  .route('/wishlist/:id')
  .delete(protect, removeFromWishlist);


export default router;