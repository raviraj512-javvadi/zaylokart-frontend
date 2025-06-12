import React from 'react';
import { Link } from 'react-router-dom';
import './GroceriesScreen.css';

// --- UPDATED with new, high-quality image URLs ---
const subCategories = [
  { name: 'Fresh Vegetables', imageUrl: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/vegetables' },
  { name: 'Fresh Fruits', imageUrl: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/fruits' },
  { name: 'Dairy & Eggs', imageUrl: 'https://images.pexels.com/photos/806361/pexels-photo-806361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/dairy-eggs' },
  { name: 'Snacks & Munchies', imageUrl: 'https://images.pexels.com/photos/3052360/pexels-photo-3052360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/snacks' },
  { name: 'Beverages', imageUrl: 'https://images.pexels.com/photos/3819969/pexels-photo-3819969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/beverages' },
  { name: 'Masalas & Spices', imageUrl: 'https://images.pexels.com/photos/1775050/pexels-photo-1775050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/spices' },
  { name: 'Atta, Rice & Dal', imageUrl: 'https://images.pexels.com/photos/6741755/pexels-photo-6741755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/staples' },
  { name: 'Meat & Seafood', imageUrl: 'https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '/category/meat-seafood' },
];

const GroceriesScreen = () => {
  return (
    <div className="groceries-container">
      <h1 className="groceries-title">Shop Groceries By Category</h1>
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

export default GroceriesScreen;