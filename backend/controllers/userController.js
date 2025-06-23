import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import User from '../models/userModel.js';

// Initialize Twilio Client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- NEW: Send OTP to user's mobile number ---
// @desc    Send OTP to a mobile number
// @route   POST /api/users/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { mobileNumber } = req.body;
  
  if (!mobileNumber || mobileNumber.length !== 10) {
      return res.status(400).json({ message: 'Valid 10-digit mobile number is required' });
  }

  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: `+91${mobileNumber}`, channel: 'sms' });

    if (verification.status === 'pending') {
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
        throw new Error('Failed to send OTP');
    }
  } catch (error) {
    console.error('Twilio Send OTP Error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
};


// --- NEW: Verify OTP and Login/Register User ---
// @desc    Verify OTP and Auth user
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { mobileNumber, otpCode } = req.body;

    if (!mobileNumber || !otpCode) {
        return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    try {
        const verificationCheck = await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks.create({ to: `+91${mobileNumber}`, code: otpCode });

        if (verificationCheck.status === 'approved') {
            // OTP is correct. Find user or create a new one.
            let user = await User.findOne({ mobileNumber });

            if (!user) {
                // If user doesn't exist, register them automatically
                user = await User.create({ 
                    mobileNumber,
                    name: `User${mobileNumber.slice(5)}` // Creates a default name like "User12345"
                });
            }

            // Return user info and token, effectively logging them in
            res.status(200).json({
                _id: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });

        } else {
            // OTP is incorrect
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Twilio Verify OTP Error:', error);
        res.status(500).json({ message: 'Failed to verify OTP. It may have expired.' });
    }
};


// --- Your existing wishlist functions remain untouched ---
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

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


// --- The EXPORT block is now updated ---
export {
  sendOtp,
  verifyOtp,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};