import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- Your existing functions are preserved ---

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id) });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};


// --- ADD THESE THREE NEW FUNCTIONS ---

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
const getWishlist = async (req, res) => {
    // We use .populate() to get the full product details, not just the ID
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/users/wishlist
const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        // Check if the product is already in the wishlist
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        // We use .populate() here as well to send the updated, full wishlist back
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json(updatedUser.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/users/wishlist/:id
const removeFromWishlist = async (req, res) => {
    const productId = req.params.id;
    const user = await User.findById(req.user._id);

    if (user) {
        // Filter out the product ID to remove it
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json(updatedUser.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


// --- UPDATE THE EXPORT AT THE BOTTOM ---
export { 
    authUser, 
    registerUser,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};