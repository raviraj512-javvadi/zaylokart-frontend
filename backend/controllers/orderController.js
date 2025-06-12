import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = async (req, res) => {
    // ... your existing addOrderItems function ...
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
    // req.user._id comes from our 'protect' middleware
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
};


// --- UPDATE THE EXPORT AT THE BOTTOM ---
export { addOrderItems, getMyOrders };