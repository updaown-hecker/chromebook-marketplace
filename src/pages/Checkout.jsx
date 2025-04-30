import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart, sendOrderToDiscord } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.address || 
        !formData.city || !formData.state || !formData.zipCode || 
        !formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
      setError('All fields are required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Card number validation (simple check for 16 digits)
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    // Card expiry validation (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(formData.cardExpiry)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    // CVV validation (3 or 4 digits)
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(formData.cardCvv)) {
      setError('Please enter a valid CVV (3 or 4 digits)');
      return false;
    }
    
    return true;
  };
  
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare order details for Discord webhook and JSON storage
      const orderDetails = {
        name: formData.name,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        items: cartItems,
        total: totalPrice
      };
      
      // Send order notification to Discord webhook and save to JSON
      const result = await sendOrderToDiscord(orderDetails);
      
      if (result.success) {
        // Clear the cart
        clearCart();
        
        // Show order confirmation with real order ID and date
        setOrderConfirmation({
          orderId: result.orderId,
          orderDate: result.orderDate,
          customerName: formData.name,
          total: totalPrice
        });
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('An error occurred while processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (cartItems.length === 0 && !orderConfirmation) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="container checkout-container">
      <h1 className="section-title mb-4">Checkout</h1>
      
      {orderConfirmation ? (
        <div className="order-confirmation">
          <div className="card p-4 mb-4 text-center">
            <div className="confirmation-icon mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#4CAF50" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            </div>
            <h2 className="mb-3">Order Placed Successfully!</h2>
            <p className="mb-1">Thank you for your order, {orderConfirmation.customerName}!</p>
            <p className="mb-3">Your order ID is: <strong>{orderConfirmation.orderId}</strong></p>
            <p className="mb-3">Order date: <strong>{new Date(orderConfirmation.orderDate).toLocaleString()}</strong></p>
            <p className="mb-4">Total amount: <strong>${orderConfirmation.total.toFixed(2)}</strong></p>
            <p>We've sent a confirmation to your email address.</p>
            <div className="mt-4">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="mb-3">Shipping Information</h3>
                
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger mb-3">{error}</div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-row row">
                    <div className="form-group col-md-4">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group col-md-4">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group col-md-4">
                      <label htmlFor="zipCode">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <h3 className="mb-3 mt-4">Payment Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="form-row row">
                    <div className="form-group col-md-6">
                      <label htmlFor="cardExpiry">Expiry Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div className="form-group col-md-6">
                      <label htmlFor="cardCvv">CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardCvv"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-4"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h3 className="mb-3">Order Summary</h3>
                
                <div className="order-summary">
                  {cartItems.map(item => (
                    <div className="order-item" key={item.id}>
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="order-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="order-total">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;