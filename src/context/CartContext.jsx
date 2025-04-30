import React, { createContext, useState, useEffect } from 'react';
import { OrdersService } from '../services/OrdersService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    calculateTotal();
  }, [cartItems]);
  
  // Calculate total price
  const calculateTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };
  
  // Add item to cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Fallback method to save orders when IndexedDB fails or is not supported
  const saveFallbackOrder = (orderDetails) => {
    try {
      // Generate a real order ID using the OrdersService
      const orderId = OrdersService.generateOrderId();
      
      // Create a new order with the generated ID
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customer: {
          name: orderDetails.name,
          email: orderDetails.email,
          address: orderDetails.address
        },
        items: cartItems,
        total: totalPrice,
        status: 'Processing',
        trackingNumber: null,
        notes: "",
        customerMessages: [],
        adminResponses: []
      };
      
      // Get existing orders from localStorage
      let existingOrders = [];
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          existingOrders = JSON.parse(savedOrders);
        }
      } catch (e) {
        console.warn('Error parsing existing orders from localStorage:', e);
      }
      
      // Add the new order
      existingOrders.push(newOrder);
      
      // Save back to localStorage
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      return { success: true, order: newOrder };
    } catch (error) {
      console.error('Error in fallback order saving:', error);
      return { success: false, error: error.message || 'Failed to save order using fallback method' };
    }
  };
  
  // Send order to Discord webhook and save to IndexedDB
  const sendOrderToDiscord = async (orderDetails) => {
    const webhookUrl = "https://discord.com/api/webhooks/1366254681277464616/biPiUDOw2yDLGGloPb4CMaNdWtP_htOOiwXTWIZ5YYegxcOASYJVToo6CHBLaX6NRwer";
    
    try {
      // Check if IndexedDB is supported
      if (!OrdersService.isIndexedDBSupported()) {
        console.warn('IndexedDB is not supported in this browser. Using fallback storage method.');
        // Use fallback storage method (localStorage)
        const saveResult = saveFallbackOrder(orderDetails);
        if (!saveResult.success) {
          return { success: false, error: 'Failed to save order using fallback method' };
        }
        return proceedWithDiscordNotification(saveResult);
      }
      
      // Generate a real order ID using the OrdersService
      const orderId = OrdersService.generateOrderId();
      
      // Save order to IndexedDB with the generated ID
      const saveResult = await OrdersService.saveOrder({
        ...orderDetails,
        items: cartItems,
        total: totalPrice
      });
      
      if (!saveResult.success) {
        console.error('Error saving order to IndexedDB:', saveResult.error);
        // Try fallback if IndexedDB fails
        const fallbackResult = saveFallbackOrder(orderDetails);
        if (!fallbackResult.success) {
          return { success: false, error: 'Failed to save order using both primary and fallback methods' };
        }
        return proceedWithDiscordNotification(fallbackResult);
      }
      
      return proceedWithDiscordNotification(saveResult);
    } catch (error) {
      console.error('Error processing order:', error);
      return { success: false, error: error.message || 'An unknown error occurred' };
    }
  };
  
  // Function to send Discord notification after order is saved
  const proceedWithDiscordNotification = async (saveResult) => {
    try {
      // Send to Discord webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `New Order Received!`,
          embeds: [
            {
              title: `Order Details - ${saveResult.order.id}`,
              color: 3447003,
              fields: [
                {
                  name: 'Customer',
                  value: `${saveResult.order.customer.name} (${saveResult.order.customer.email})`,
                },
                {
                  name: 'Items',
                  value: saveResult.order.items.map(item => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`).join('\n'),
                },
                {
                  name: 'Total',
                  value: `$${saveResult.order.total.toFixed(2)}`,
                },
                {
                  name: 'Shipping Address',
                  value: saveResult.order.customer.address,
                },
                {
                  name: 'Order ID',
                  value: saveResult.order.id,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      
      if (response.ok) {
        return { 
          success: true, 
          orderId: saveResult.order.id,
          orderDate: saveResult.order.date
        };
      } else {
        return { success: false, error: 'Failed to send notification' };
      }
    } catch (error) {
      console.error('Error processing order:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Get order by ID
  const getOrderById = (orderId) => {
    return OrdersService.getOrderById(orderId);
  };
  
  // Get all orders
  const getOrders = () => {
    return OrdersService.getOrders();
  };
  
  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    return OrdersService.updateOrderStatus(orderId, newStatus);
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        sendOrderToDiscord,
        getOrderById,
        getOrders,
        updateOrderStatus
      }}
    >
      {children}
    </CartContext.Provider>
  );
};