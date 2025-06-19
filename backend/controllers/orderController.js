import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    // ======================= NEW DEBUGGING LOGS =======================
    console.log('USER FROM TOKEN:', req.user);
    console.log('INCOMING ORDER BODY:', JSON.stringify(req.body, null, 2));
    // ================================================================

    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems: orderItems.map(x => ({ 
        ...x, 
        product: x._id, 
        _id: undefined 
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      paidAt: null,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('ERROR CREATING ORDER:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- The rest of your functions remain the same ---

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getOrders
};