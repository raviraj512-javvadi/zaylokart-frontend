import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import User from '../models/userModel.js';

// Initialize Firebase Admin from Environment Variable
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

// Helper function to generate our app's JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user with Firebase ID Token & get our app's token
// @route   POST /api/users/login-firebase
// @access  Public
const firebaseLogin = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const mobileNumber = decodedToken.phone_number.slice(3); // Remove +91

    let user = await User.findOne({ mobileNumber });

    if (!user) {
      user = await User.create({
        mobileNumber: mobileNumber,
        name: `User ${mobileNumber.slice(5)}`
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
  }
};

// Wishlist functions remain
const getWishlist = async (req, res) => { /* ...your existing function... */ };
const addToWishlist = async (req, res) => { /* ...your existing function... */ };
const removeFromWishlist = async (req, res) => { /* ...your existing function... */ };

export {
  firebaseLogin,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};