import React from 'react';
import { Link } from 'react-router-dom';
// We can reuse the same CSS from our Groceries page!
import './GroceriesScreen.css'; 

const subCategories = [
  { name: 'Mobiles & Accessories', imageUrl: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/mobiles' },
  { name: 'Laptops & Computers', imageUrl: 'https://images.pexels.com/photos/4005579/pexels-photo-4005579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/laptops' },
  { name: 'Headphones & Speakers', imageUrl: 'https://images.pexels.com/photos/3781338/pexels-photo-3781338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/audio' },
  { name: 'TVs & Appliances', imageUrl: 'https://images.pexels.com/photos/327100/pexels-photo-327100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/appliances' },
  { name: 'Cameras & Drones', imageUrl: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/cameras' },
  { name: 'Smart Watches', imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/watches' },
  { name: 'Gaming', imageUrl: 'https://images.pexels.com/photos/4219175/pexels-photo-4219175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/gaming' },
  { name: 'Tablets', imageUrl: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/tablets' },
];

const ElectronicsScreen = () => {
  return (
    <div className="groceries-container">
      <h1 className="groceries-title">Shop Electronics By Category</h1>
      <div className="subcategory-grid">
        {subCategories.map((category) => (
          <Link to={category.link} key={category.name} className="subcategory-card">
            <img src={category.imageUrl} alt={category.name} className="subcategory-image" />
            <h3 className="subcategory-name">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ElectronicsScreen;