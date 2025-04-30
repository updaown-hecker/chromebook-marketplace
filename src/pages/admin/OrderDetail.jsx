import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { OrdersService } from '../../services/OrdersService';
import './AdminStyles.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrierInfo, setCarrierInfo] = useState('');
  const [trackingUpdated, setTrackingUpdated] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');

  // Available order statuses
  const orderStatuses = ['Processing', 'Shipped', 'Completed', 'Cancelled'];

  useEffect(() => {
    const loadOrderDetails = async () => {
      setLoading(true);
      try {
        const result = await OrdersService.getOrderById(orderId);
        
        if (result.success) {
          setOrder(result.order);
          setStatus(result.order.status);
          setTrackingNumber(result.order.trackingNumber || '');
          setCarrierInfo(result.order.carrierInfo || '');
        } else {
          setError('Order not found or could not be loaded');
        }
      } catch (err) {
        setError('Error loading order: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrderDetails();
  }, [orderId]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    try {
      const result = await OrdersService.updateOrderStatus(orderId, status);
      
      if (result.success) {
        setStatusUpdated(true);
        // Update the local order object
        setOrder(prev => ({ ...prev, status }));
        
        // Reset the status updated message after 3 seconds
        setTimeout(() => {
          setStatusUpdated(false);
        }, 3000);
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('Error updating status: ' + err.message);
    }
  };
  
  const updateTracking = async () => {
    try {
      const result = await OrdersService.updateTrackingInfo(orderId, trackingNumber, carrierInfo);
      
      if (result.success) {
        setTrackingUpdated(true);
        // Update the local order object
        setOrder(prev => ({ ...prev, trackingNumber, carrierInfo }));
        
        // Reset the tracking updated message after 3 seconds
        setTimeout(() => {
          setTrackingUpdated(false);
        }, 3000);
      } else {
        setError('Failed to update tracking information');
      }
    } catch (err) {
      setError('Error updating tracking: ' + err.message);
    }
  };
  
  const sendAdminResponse = async () => {
    if (!adminResponse.trim()) return;
    
    try {
      const result = await OrdersService.addAdminResponse(orderId, adminResponse);
      
      if (result.success) {
        // Update the local order object
        setOrder(result.order);
        // Clear the response input
        setAdminResponse('');
      } else {
        setError('Failed to send response');
      }
    } catch (err) {
      setError('Error sending response: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="admin-header">
          <button 
            className="btn btn-secondary mb-3"
            onClick={() => navigate('/admin/orders')}
          >
            &larr; Back to Orders
          </button>
          <h1>Order Details</h1>
        </div>
        
        {loading ? (
          <div className="loading">Loading order details...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : order ? (
          <div className="order-detail-container">
            {statusUpdated && (
              <div className="alert alert-success mb-3">
                Order status updated successfully!
              </div>
            )}
            
            {trackingUpdated && (
              <div className="alert alert-success mb-3">
                Tracking information updated successfully!
              </div>
            )}
            
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Order #{order.id}</h3>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h4>Order Information</h4>
                    <p><strong>Date:</strong> {formatDate(order.date)}</p>
                    <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                    
                    <div className="mt-4">
                      <h5>Update Status</h5>
                      <div className="d-flex">
                        <select 
                          className="form-control mr-2" 
                          value={status}
                          onChange={handleStatusChange}
                        >
                          {orderStatuses.map(statusOption => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <button 
                          className="btn btn-primary ml-2" 
                          onClick={updateOrderStatus}
                          disabled={status === order.status}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5>Tracking Information</h5>
                      <div className="form-group mb-2">
                        <label>Tracking Number</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={trackingNumber} 
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Carrier Information</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={carrierInfo} 
                          onChange={(e) => setCarrierInfo(e.target.value)}
                          placeholder="Enter carrier name (e.g., UPS, FedEx)"
                        />
                      </div>
                      <button 
                        className="btn btn-primary" 
                        onClick={updateTracking}
                      >
                        Update Tracking
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> {order.customer.name}</p>
                    <p><strong>Email:</strong> {order.customer.email}</p>
                    <p><strong>Shipping Address:</strong> {order.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="mb-0">Order Items</h3>
              </div>
              
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                      <td><strong>${order.total.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="mb-0">Customer Communication</h3>
              </div>
              
              <div className="card-body">
                <div className="messages-container mb-4">
                  {order.customerMessages && order.customerMessages.length > 0 ? (
                    <div className="customer-messages">
                      <h5>Customer Messages</h5>
                      {order.customerMessages.map((msg, index) => (
                        <div key={index} className="message customer-message">
                          <div className="message-content">{msg.text}</div>
                          <div className="message-date">{formatDate(msg.date)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No customer messages yet.</p>
                  )}
                  
                  {order.adminResponses && order.adminResponses.length > 0 && (
                    <div className="admin-responses mt-3">
                      <h5>Admin Responses</h5>
                      {order.adminResponses.map((resp, index) => (
                        <div key={index} className="message admin-message">
                          <div className="message-content">{resp.text}</div>
                          <div className="message-date">{formatDate(resp.date)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="response-form">
                  <h5>Send Response to Customer</h5>
                  <div className="form-group">
                    <textarea
                      className="form-control mb-2"
                      rows="3"
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Type your response to the customer..."
                    ></textarea>
                    <button 
                      className="btn btn-primary"
                      onClick={sendAdminResponse}
                      disabled={!adminResponse.trim()}
                    >
                      Send Response
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">Order not found</div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;