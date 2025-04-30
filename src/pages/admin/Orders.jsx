import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { OrdersService } from '../../services/OrdersService';
import './AdminStyles.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Load orders from OrdersService (localStorage)
  useEffect(() => {
    const loadOrders = () => {
      // Simulate a slight delay for loading effect
      setTimeout(() => {
        const result = OrdersService.getOrders();
        
        if (result.success) {
          // If no orders exist yet, add some sample data for demonstration
          if (result.orders.length === 0) {
            const sampleOrders = [
              {
                id: 'ORD-001',
                date: '2023-05-15',
                customer: {
                  name: 'John Doe',
                  email: 'john.doe@example.com',
                  address: '123 Main St, Anytown, CA 12345'
                },
                items: [
                  { id: 1, name: 'HP Chromebook 11 G8 EE', price: 249.99, quantity: 1 },
                  { id: 2, name: 'HP Chromebook 14 G6', price: 299.99, quantity: 2 }
                ],
                total: 849.97,
                status: 'Completed'
              },
              {
                id: 'ORD-002',
                date: '2023-05-18',
                customer: {
                  name: 'Jane Smith',
                  email: 'jane.smith@example.com',
                  address: '456 Oak Ave, Springfield, IL 67890'
                },
                items: [
                  { id: 3, name: 'HP Chromebook x360 11 G3 EE', price: 349.99, quantity: 1 }
                ],
                total: 349.99,
                status: 'Processing'
              }
            ];
            
            // Save sample orders to localStorage
            localStorage.setItem('orders', JSON.stringify(sampleOrders));
            setOrders(sampleOrders);
          } else {
            setOrders(result.orders);
          }
        } else {
          console.error('Error loading orders:', result.error);
          setOrders([]);
        }
        
        setLoading(false);
      }, 800);
    };
    
    loadOrders();
  }, []);
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Processing':
        return 'status-processing';
      case 'Shipped':
        return 'status-shipped';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  const handleViewDetails = (orderId) => {
    // Navigate to the order detail page
    navigate(`/admin/orders/${orderId}`);
  };
  
  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Manage Orders</h1>
        </div>
        
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.customer.name}</td>
                    <td>{order.items.length} items</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="order-stats mt-4">
          <div className="row">
            <div className="col-md-3">
              <div className="card p-3">
                <h3>Total Orders</h3>
                <p className="stats-number">{orders.length}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3">
                <h3>Completed</h3>
                <p className="stats-number">
                  {orders.filter(order => order.status === 'Completed').length}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3">
                <h3>Processing</h3>
                <p className="stats-number">
                  {orders.filter(order => order.status === 'Processing').length}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3">
                <h3>Total Revenue</h3>
                <p className="stats-number">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;