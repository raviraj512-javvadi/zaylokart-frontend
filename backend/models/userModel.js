import mongoose from 'mongoose';
// We no longer need bcrypt for passwords

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // Replaced email with mobileNumber, which must be unique
    mobileNumber: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true, default: false },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });

// The password matching and hashing functions have been removed
// as they are no longer needed with an OTP system.

const User = mongoose.model('User', userSchema);

export default User;