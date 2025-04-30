import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity));
  };
  
  const handleRemoveItem = (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(productId);
    }
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="section-title">Your Cart</h1>
        <div className="text-center">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <h1 className="section-title">Your Cart</h1>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} className="cart-item-image" />
            
            <div className="cart-item-details">
              <h3>
                <Link to={`/product/${item.id}`}>{item.name}</Link>
              </h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="cart-item-quantity">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="quantity-input" 
                  value={item.quantity} 
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)} 
                  min="1" 
                />
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="cart-item-actions">
              <button 
                className="btn btn-danger" 
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={handleClearCart}>
            Clear Cart
          </button>
          <button className="btn btn-primary" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;