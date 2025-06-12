// src/api/products.js
import { get, post } from './client'; // Fixed: Added post import

export const fetchProducts = () => get('/products');
export const fetchProductDetails = (id) => get(`/products/${id}`);
export const createProduct = (productData) => post('/products', productData);