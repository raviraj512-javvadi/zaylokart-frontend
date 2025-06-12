// src/data/productService.js
const USE_API = false; // Set to true when backend is ready

export const fetchProducts = async () => {
  if (!USE_API) {
    const { productDatabase } = await import('./products');
    return productDatabase;
  }

  try {
    const response = await fetch('http://localhost:5000/api/products');
    return await response.json();
  } catch (error) {
    console.error("API failed, using fallback data", error);
    const { productDatabase } = await import('./products');
    return productDatabase;
  }
};