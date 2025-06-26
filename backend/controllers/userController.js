import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// Helper function to generate JWT
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};


// @desc    Auth user & get token (Login)
// @route   POST /api/users/auth
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!phone) {
      res.status(400);
      throw new Error('Phone number is a required field');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, phone });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// --- WISHLIST CONTROLLERS ---

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.wishlist.includes(productId)) {
      // It's already there, just return the current wishlist
      const updatedUser = await User.findById(req.user._id).populate('wishlist');
      return res.status(200).json(updatedUser.wishlist);
    }
    user.wishlist.push(productId);
    await user.save();
    const finalUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(finalUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(updatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// --- ADMIN CONTROLLERS ---
// (Assuming you have these from previous steps)
const getUsers = asyncHandler(async (req, res) => { /* ... */ });
const getUserById = asyncHandler(async (req, res) => { /* ... */ });
const updateUser = asyncHandler(async (req, res) => { /* ... */ });
const deleteUser = asyncHandler(async (req, res) => { /* ... */ });
const getUserProfile = asyncHandler(async (req, res) => { /* ... */ });
const updateUserProfile = asyncHandler(async (req, res) => { /* ... */ });
const logoutUser = asyncHandler(async (req, res) => { /* ... */ });


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  // --- EXPORT THE NEW FUNCTIONS ---
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
