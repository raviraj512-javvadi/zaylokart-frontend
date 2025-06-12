import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* --- THIS IS THE UPDATED SECTION --- */}
        <div className="footer-column">
          <h3>SHOP</h3>
          <Link to="/category/new">NEW</Link>
          <Link to="/category/groceries">GROCERIES</Link>
          <Link to="/category/electronics">ELECTRONICS</Link>
          <Link to="/category/fashion-beauty">FASHION & BEAUTY</Link>
          <Link to="/sale">SALE</Link>
        </div>

        <div className="footer-column">
          <h3>HELP</h3>
          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping">Shipping</Link>
          <Link to="/returns">Returns</Link>
        </div>
        <div className="footer-column">
          <h3>ABOUT</h3>
          <Link to="/our-story">Our Story</Link>
        </div>
        <div className="footer-column">
          <h3>FOLLOW US</h3>
          <a 
            href="https://www.facebook.com/profile.php?id=61577285845643" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a 
            href="https://www.instagram.com/zaylokart" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 ZayloKart. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;