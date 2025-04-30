import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OrdersService } from '../services/OrdersService';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerMessage, setCustomerMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleOrderIdChange = (e) => {
    setOrderId(e.target.value);
  };

  const trackOrder = async (e) => {
    e.preventDefault();
    setError('');
    setOrderDetails(null);
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get order details from OrdersService
      const result = await OrdersService.getOrderById(orderId.trim());
      
      if (result.success) {
        setOrderDetails(result.order);
      } else {
        setError('Order not found. Please check your order ID and try again.');
      }
    } catch (err) {
      setError('Error retrieving order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const sendMessage = async () => {
    if (!customerMessage.trim() || !orderDetails) return;
    
    try {
      setLoading(true);
      const result = await OrdersService.addCustomerMessage(orderDetails.id, customerMessage);
      
      if (result.success) {
        setOrderDetails(result.order);
        setCustomerMessage('');
        setMessageSent(true);
        
        // Reset the message sent notification after 3 seconds
        setTimeout(() => {
          setMessageSent(false);
        }, 3000);
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Error sending message: ' + err.message);
    } finally {
      setLoading(false);
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
    <div className="container order-tracking-container my-5">
      <h1 className="section-title mb-4">Track Your Order</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={trackOrder}>
                <div className="form-group mb-3">
                  <label htmlFor="orderId" className="mb-2">Enter your Order ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="orderId"
                    placeholder="e.g. ORD-20230615-1234"
                    value={orderId}
                    onChange={handleOrderIdChange}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Track Order'}
                </button>
              </form>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          {orderDetails && (
            <div className="order-details-card">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Order #{orderDetails.id}</h3>
                  <span className={`order-status ${getStatusClass(orderDetails.status)}`}>
                    {orderDetails.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="order-info mb-4">
                    <p><strong>Order Date:</strong> {formatDate(orderDetails.date)}</p>
                    <p><strong>Customer:</strong> {orderDetails.customer.name}</p>
                    <p><strong>Total Amount:</strong> ${orderDetails.total.toFixed(2)}</p>
                    
                    {orderDetails.trackingNumber && (
                      <div>
                        <p><strong>Tracking Number:</strong> {orderDetails.trackingNumber}</p>
                        {orderDetails.carrierInfo && (
                          <p><strong>Carrier:</strong> {orderDetails.carrierInfo}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="order-communication mt-4">
                    <h4>Communication</h4>
                    
                    <div className="messages-container mb-3">
                      {orderDetails.adminResponses && orderDetails.adminResponses.length > 0 && (
                        <div className="admin-responses mb-3">
                          <h5>Responses from Seller</h5>
                          {orderDetails.adminResponses.map((resp, index) => (
                            <div key={index} className="message admin-message">
                              <div className="message-content">{resp.text}</div>
                              <div className="message-date">{formatDate(resp.date)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {orderDetails.customerMessages && orderDetails.customerMessages.length > 0 && (
                        <div className="customer-messages mb-3">
                          <h5>Your Messages</h5>
                          {orderDetails.customerMessages.map((msg, index) => (
                            <div key={index} className="message customer-message">
                              <div className="message-content">{msg.text}</div>
                              <div className="message-date">{formatDate(msg.date)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {messageSent && (
                      <div className="alert alert-success mb-3">
                        Your message has been sent successfully!
                      </div>
                    )}
                    
                    <div className="message-form">
                      <h5>Send a Message</h5>
                      <div className="form-group">
                        <textarea
                          className="form-control mb-2"
                          rows="3"
                          value={customerMessage}
                          onChange={(e) => setCustomerMessage(e.target.value)}
                          placeholder="Type your message to the seller..."
                        ></textarea>
                        <button 
                          className="btn btn-primary"
                          onClick={sendMessage}
                          disabled={!customerMessage.trim() || loading}
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <h4>Order Items</h4>
                  <div className="table-responsive">
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
                        {orderDetails.items.map((item, index) => (
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
                          <td><strong>${orderDetails.total.toFixed(2)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;