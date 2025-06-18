// This file intelligently determines which API URL to use.
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://zaylokart-api.onrender.com' // Your LIVE backend URL from Render
  : ''; // This is empty for local development, so it uses the proxy

export default API_URL;