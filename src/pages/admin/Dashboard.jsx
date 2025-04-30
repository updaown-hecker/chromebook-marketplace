import React from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>
        
        <div className="dashboard-stats">
          <div className="row">
            <div className="col-md-4">
              <div className="card p-3 mb-3">
                <h3>Products</h3>
                <p className="stats-number">6</p>
                <Link to="/admin/products" className="btn btn-primary btn-sm">Manage Products</Link>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card p-3 mb-3">
                <h3>Orders</h3>
                <p className="stats-number">0</p>
                <Link to="/admin/orders" className="btn btn-primary btn-sm">View Orders</Link>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card p-3 mb-3">
                <h3>Revenue</h3>
                <p className="stats-number">$0.00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="quick-actions mt-4">
          <h2>Quick Actions</h2>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="card p-3 mb-3">
                <h3>Add New Product</h3>
                <p>Add a new Chromebook model to your inventory</p>
                <Link to="/admin/products" className="btn btn-primary">Add Product</Link>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card p-3 mb-3">
                <h3>Update Inventory</h3>
                <p>Update stock levels for existing products</p>
                <Link to="/admin/products" className="btn btn-primary">Update Inventory</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;