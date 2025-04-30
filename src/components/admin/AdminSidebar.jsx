import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      
      <ul className="admin-nav">
        <li>
          <Link 
            to="/admin" 
            className={currentPath === '/admin' ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/products" 
            className={currentPath === '/admin/products' ? 'active' : ''}
          >
            Products
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/orders" 
            className={currentPath === '/admin/orders' ? 'active' : ''}
          >
            Orders
          </Link>
        </li>
        <li>
          <Link to="/" className="mt-4">
            Back to Store
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;