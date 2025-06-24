import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// Helper function to generate JWT. NOTE: It's better to use the one from utils.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone, // <-- Added phone to login response
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Destructure phone from the request body
  const { name, email, password, phone } = req.body;

  // Check if the phone number was provided
  if (!phone) {
      res.status(400);
      throw new Error('Phone number is a required field');
  }
  
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Add phone number when creating the new user
  const user = await User.create({ name, email, password, phone });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone, // <-- Return phone number in registration response
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


// Wishlist functions remain the same
const getWishlist = asyncHandler(async (req, res) => { /* ...your existing function... */ });
const addToWishlist = asyncHandler(async (req, res) => { /* ...your existing function... */ });
const removeFromWishlist = asyncHandler(async (req, res) => { /* ...your existing function... */ });

// --- FUNCTION TO GET ALL USERS (FOR ADMIN) ---
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Select all fields EXCEPT password to avoid sending hashes to the frontend
  const users = await User.find({}).select('-password');
  res.json(users);
});
// ----------------------------------------------------


export {
  authUser,
  registerUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUsers,
};