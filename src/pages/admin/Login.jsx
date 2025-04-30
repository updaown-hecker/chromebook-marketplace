import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // In a real application, this would be handled securely with a backend
  // For demo purposes, we're using a hardcoded credential
  const validCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === validCredentials.username && 
        credentials.password === validCredentials.password) {
      // Set authentication in localStorage (in a real app, use secure cookies/JWT)
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the admin panel</p>
        </div>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>
            <a href="/">Return to Store</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;