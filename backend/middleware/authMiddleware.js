import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// This is the new, more robust protect middleware for Bearer tokens
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for the authorization header and that it's a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID and attach it to the request object
      // This user object will be available in all subsequent protected routes
      req.user = await User.findById(decoded.id).select('-password');

      // If no user is found with this ID, the token is invalid
      if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
      }

      // Move to the next piece of middleware or the controller
      next();
      
    } catch (error) {
      // This will catch any error, including an expired or invalid token
      console.error('TOKEN VERIFICATION FAILED:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    // If there's no token at all
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


// The admin middleware remains the same
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
