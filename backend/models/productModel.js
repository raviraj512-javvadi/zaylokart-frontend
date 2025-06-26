import mongoose from 'mongoose';

// --- NEW: A schema for product variants ---
const variantSchema = mongoose.Schema({
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
});
// -----------------------------------------

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    // --- UPDATED: From single image to an array of images ---
    images: [
      {
        type: String,
        required: true,
      },
    ],
    // --------------------------------------------------------
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // --- DEPRECATED: We will no longer use these single fields ---
    // price: { type: Number, required: true, default: 0 },
    // countInStock: { type: Number, required: true, default: 0 },
    // -----------------------------------------------------------

    // --- NEW: Add the variants array ---
    variants: [variantSchema],
    // -----------------------------------
    
    // Reviews and ratings can remain the same
    reviews: [
      /* your review schema */
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
