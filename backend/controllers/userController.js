import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ✅ --- EXISTING: Auth user & get token (Login) ---
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// ✅ --- EXISTING: Register new user ---
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// ✅ --- NEW: Get Wishlist ---
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ✅ --- NEW: Add to Wishlist ---
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(updatedUser.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ✅ --- NEW: Remove from Wishlist ---
const removeFromWishlist = async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(updatedUser.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ✅ --- COMBINED EXPORT ---
export {
  authUser,
  registerUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
