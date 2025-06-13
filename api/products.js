// In your NEW file: api/products.js

// Make sure this path is correct to find your data file
import products from '../backend/data/products.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(products);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}