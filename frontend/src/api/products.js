// src/api/products.js
import { get, post } from './client';

// Add '/api' to the beginning of each path
export const fetchProducts = () => get('/api/products');
export const fetchProductDetails = (id) => get(`/api/products/${id}`);
export const createProduct = (productData) => post('/api/products', productData);