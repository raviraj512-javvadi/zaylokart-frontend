import express from 'express';

import { 
  firebaseLogin,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// The only authentication route needed now
router.post('/login-firebase', firebaseLogin);


// Wishlist Routes
router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router
  .route('/wishlist/:id')
  .delete(protect, removeFromWishlist);


export default router;