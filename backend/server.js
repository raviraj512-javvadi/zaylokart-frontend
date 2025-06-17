import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; // <-- 1. IMPORT new route

dotenv.config();
connectDB();
const app = express();

// ✅ Enhanced CORS setup
const allowedOrigins = [
  'https://zaylokart.netlify.app',     // <-- your Netlify frontend
  'http://localhost:3000'              // <-- for local dev (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); // <-- 2. USE the new route

// --- Make 'uploads' folder static ---
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // <-- 3. MAKE folder accessible

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
