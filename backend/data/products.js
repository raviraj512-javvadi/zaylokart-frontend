const products = [
  {
    name: 'Premium Urban Jacket',
    imageUrl: '/images/jacket.jpg',
    description: 'A stylish and durable jacket for the modern urban explorer.',
    price: 4999,
    category: 'Men',
    brand: 'ZayloKart',
    sizes: [
      { name: 'S', stock: 5 },
      { name: 'M', stock: 10 },
      { name: 'L', stock: 8 },
      { name: 'XL', stock: 3 },
    ],
  },
  {
    name: 'Classic Denim Jeans',
    imageUrl: '/images/jeans.jpg',
    description: 'Timeless denim jeans that offer both comfort and style.',
    price: 3499,
    category: 'Men',
    brand: 'ZayloKart',
    sizes: [
      { name: '30', stock: 10 },
      { name: '32', stock: 12 },
      { name: '34', stock: 7 },
      { name: '36', stock: 4 },
    ],
  },
  {
    name: 'Essential Graphic Tee',
    imageUrl: '/images/tee.jpg',
    description: 'A soft, breathable t-shirt with a minimalist graphic design.',
    price: 1499,
    category: 'Men',
    brand: 'ZayloKart',
    sizes: [
      { name: 'S', stock: 20 },
      { name: 'M', stock: 25 },
      { name: 'L', stock: 15 },
    ],
  },
  {
    name: 'Casual Knit Sweater',
    imageUrl: '/images/sweater.jpg',
    description: 'A cozy knit sweater perfect for casual outings or a relaxed day in.',
    price: 4299,
    category: 'Women',
    brand: 'ZayloKart',
    sizes: [
      { name: 'XS', stock: 8 },
      { name: 'S', stock: 12 },
      { name: 'M', stock: 9 },
    ],
  },
  // ... Add other products with sizes if you wish
];
export default products;