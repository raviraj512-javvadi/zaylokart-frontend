// This file intelligently determines which API URL to use.

// When your app is live on Vercel, process.env.NODE_ENV will be 'production'.
// At all other times (on your local machine), it will be 'development'.
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://zaylokart-api.onrender.com' // Your live backend URL
  : ''; // Empty for local development, so it uses the proxy in package.json

export default API_URL;