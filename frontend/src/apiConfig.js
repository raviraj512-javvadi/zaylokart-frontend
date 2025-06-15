// This file intelligently determines which API URL to use.
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://zaylokart-api.onrender.com' // Your live backend URL on Render
  : ''; // Empty for local development, so it uses the proxy

export default API_URL;