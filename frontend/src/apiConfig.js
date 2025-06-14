// This file intelligently determines which API URL to use.
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://zaylokart-api.onrender.com' // <-- PASTE YOUR LIVE RENDER URL HERE
  : ''; // For local development, this is empty so the proxy is used.

export default API_URL;