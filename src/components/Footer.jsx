import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Chromebook Marketplace</h3>
          <p>Your trusted source for HP Chromebook models at competitive prices.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Products</h3>
          <ul className="footer-links">
            <li><Link to="/product/1">HP Chromebook 11 G8 EE</Link></li>
            <li><Link to="/product/2">HP Chromebook 14 G6</Link></li>
            <li><Link to="/product/6">HP Chromebook 11 G9 EE</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <ul className="footer-links">
            <li>Email: support@chromebookmarket.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Address: 123 Tech Lane, Silicon Valley, CA</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Chromebook Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;