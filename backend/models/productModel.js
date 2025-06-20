import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  // REMOVED: countInStock: { type: Number, required: true, default: 0 },

  // ADDED: An array to hold different sizes and their stock
  sizes: [
    {
      name: { type: String, required: true }, // e.g., 'S', 'M', 'L'
      stock: { type: Number, required: true, default: 0 },
    }
  ]
}, { 
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema);
export default Product;