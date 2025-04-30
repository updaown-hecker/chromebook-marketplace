import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/admin/login');
    }
  }, [navigate]);

  // Only render children if authenticated
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  return isAuthenticated ? children : null;
};

export default AdminAuthGuard;