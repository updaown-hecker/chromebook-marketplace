import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../ModernTheme.css';

const Header = () => {
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  
  // Don't show header on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <header className="main-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">Chromebook Marketplace</Link>
          </div>
          
          <nav className="main-nav">
            <ul className="nav-links">
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/track-order" className={location.pathname === '/track-order' ? 'active' : ''}>
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
                  Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;