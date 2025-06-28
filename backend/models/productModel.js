import mongoose from 'mongoose';

// --- CORRECTED: A schema for product variants ---
const variantSchema = mongoose.Schema({
  // REMOVE 'required: true' from these two lines
  ram: { type: String },
  storage: { type: String },
  
  // These are fine because price and stock are always required for any variant
  price: { type: Number, required: true, default: 0 },
  // Your field is countInStock, so let's use that
  countInStock: { type: Number, required: true, default: 0 },
});
// -----------------------------------------

const productSchema = mongoose.Schema(
  {
    // ... the rest of your schema is perfect ...
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
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
    variants: [variantSchema],
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