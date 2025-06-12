import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import products from './data/products.js';

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Old data cleared...');

    await User.create({
      name: 'Raviraj Javvadi',
      email: 'ravirajjavvadi@gmail.com',
      password: 'password123',
      isAdmin: true,
    });
    console.log('Admin user created...');

    await Product.insertMany(products);
    console.log('Sample products imported...');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}