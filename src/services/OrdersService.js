/**
 * OrdersService.js
 * Service for managing orders in the Chromebook Marketplace
 */

// Database key for storing orders in IndexedDB
const DB_NAME = 'chromebook-marketplace';
const STORE_NAME = 'orders';
const DB_VERSION = 1;

// Check if IndexedDB is supported by the browser
const isIndexedDBSupported = () => {
  return typeof window !== 'undefined' && window.indexedDB !== undefined;
};

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is supported
    if (!isIndexedDBSupported()) {
      console.error('IndexedDB is not supported in this browser');
      return reject({ message: 'IndexedDB is not supported in this browser' });
    }
    
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = (event) => {
        const error = event.target.error || new Error('Unknown IndexedDB error');
        console.error('IndexedDB error:', error);
        reject({ message: 'Could not open IndexedDB', details: error });
      };
      
      request.onsuccess = (event) => {
        if (event.target && event.target.result) {
          resolve(event.target.result);
        } else {
          reject({ message: 'IndexedDB opened but no database instance was returned' });
        }
      };
      
      request.onupgradeneeded = (event) => {
        try {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        } catch (error) {
          console.error('Error during database upgrade:', error);
          // Don't reject here as onupgradeneeded is not the end of the process
        }
      };
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
      reject({ message: 'Error initializing IndexedDB', details: error });
    }
  });
};

// Generate a unique order ID
const generateOrderId = () => {
  // Get current timestamp in milliseconds
  const timestamp = new Date().getTime();
  // Get random number between 1000-9999
  const random = Math.floor(Math.random() * 9000) + 1000;
  // Format: ORD-YYYYMMDD-XXXX (where XXXX is a random number)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
};

// Function to save an order to IndexedDB
const saveOrder = async (orderDetails) => {
  try {
    // Create a new order with unique ID and timestamp
    const newOrder = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      customer: {
        name: orderDetails.name,
        email: orderDetails.email,
        address: orderDetails.address
      },
      items: orderDetails.items,
      total: orderDetails.total,
      status: 'Processing',
      trackingNumber: null,
      notes: "",
      customerMessages: [],
      adminResponses: []
    };
    
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        transaction.onerror = (event) => {
          const error = event.target.error || new Error('Unknown transaction error');
          console.error('Transaction error:', error);
          resolve({ success: false, error: error.message || 'Transaction failed' });
        };
        
        const request = store.add(newOrder);
        
        request.onsuccess = () => {
          resolve({ success: true, order: newOrder });
        };
        
        request.onerror = (event) => {
          const error = event.target.error || new Error('Unknown error saving order');
          console.error('Error saving order to IndexedDB:', error);
          resolve({ success: false, error: error.message || 'Failed to save order' });
        };
        
        transaction.oncomplete = () => {
          if (db && typeof db.close === 'function') {
            db.close();
          }
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction:', error);
        resolve({ success: false, error: error.message || 'Database transaction failed' });
      }
    });
  } catch (error) {
    console.error('Error saving order:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

// Fallback method to get orders from localStorage when IndexedDB fails
const getOrdersFromLocalStorage = () => {
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      // Sort orders by date (newest first)
      orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      return { success: true, orders };
    }
    return { success: true, orders: [] };
  } catch (error) {
    console.error('Error getting orders from localStorage:', error);
    return { success: false, error: error.message || 'Failed to retrieve orders from localStorage', orders: [] };
  }
};

// Function to get all orders from IndexedDB
const getOrders = async () => {
  // If IndexedDB is not supported, use localStorage fallback
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported, using localStorage fallback for getOrders');
    return getOrdersFromLocalStorage();
  }
  
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        transaction.onerror = (event) => {
          const error = event.target.error || new Error('Unknown transaction error');
          console.error('Transaction error when getting orders:', error);
          resolve({ success: false, error: error.message || 'Failed to retrieve orders', orders: [] });
        };
        
        const request = store.getAll();
        
        request.onsuccess = () => {
          try {
            const orders = request.result || [];
            // Sort orders by date (newest first)
            orders.sort((a, b) => new Date(b.date) - new Date(a.date));
            resolve({ success: true, orders });
          } catch (error) {
            console.error('Error processing orders:', error);
            resolve({ success: false, error: error.message || 'Error processing orders', orders: [] });
          }
        };
        
        request.onerror = (event) => {
          const error = event.target.error || new Error('Unknown error getting orders');
          console.error('Error getting orders from IndexedDB:', error);
          resolve({ success: false, error: error.message || 'Failed to retrieve orders', orders: [] });
        };
        
        transaction.oncomplete = () => {
          if (db && typeof db.close === 'function') {
            db.close();
          }
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction when getting orders:', error);
        resolve({ success: false, error: error.message || 'Database transaction failed', orders: [] });
      }
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    return { success: false, error: error.message || 'Unknown error occurred', orders: [] };
  }
};

// Fallback method to get a specific order by ID from localStorage
const getOrderByIdFromLocalStorage = (orderId) => {
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const order = orders.find(o => o.id === orderId);
      if (order) {
        return { success: true, order };
      }
    }
    return { success: false, error: 'Order not found' };
  } catch (error) {
    console.error('Error getting order from localStorage:', error);
    return { success: false, error: error.message || 'Failed to retrieve order from localStorage' };
  }
};

// Function to get a specific order by ID from IndexedDB
const getOrderById = async (orderId) => {
  // If IndexedDB is not supported, use localStorage fallback
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported, using localStorage fallback for getOrderById');
    return getOrderByIdFromLocalStorage(orderId);
  }
  
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        transaction.onerror = (event) => {
          const error = event.target.error || new Error('Unknown transaction error');
          console.error('Transaction error when getting order by ID:', error);
          resolve({ success: false, error: error.message || 'Failed to retrieve order' });
        };
        
        const request = store.get(orderId);
        
        request.onsuccess = () => {
          const order = request.result;
          if (order) {
            resolve({ success: true, order });
          } else {
            resolve({ success: false, error: 'Order not found' });
          }
        };
        
        request.onerror = (event) => {
          const error = event.target.error || new Error('Unknown error getting order');
          console.error('Error getting order from IndexedDB:', error);
          resolve({ success: false, error: error.message || 'Failed to retrieve order' });
        };
        
        transaction.oncomplete = () => {
          if (db && typeof db.close === 'function') {
            db.close();
          }
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction when getting order by ID:', error);
        resolve({ success: false, error: error.message || 'Database transaction failed' });
      }
    });
  } catch (error) {
    console.error('Error getting order:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

// Fallback method to update order status in localStorage
const updateOrderStatusInLocalStorage = (orderId, newStatus) => {
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) {
        return { success: false, error: 'Order not found' };
      }
      
      // Update the order status
      orders[orderIndex].status = newStatus;
      orders[orderIndex].lastUpdated = new Date().toISOString();
      
      // Save back to localStorage
      localStorage.setItem('orders', JSON.stringify(orders));
      
      return { success: true, order: orders[orderIndex] };
    }
    return { success: false, error: 'Orders not found in localStorage' };
  } catch (error) {
    console.error('Error updating order status in localStorage:', error);
    return { success: false, error: error.message || 'Failed to update order status in localStorage' };
  }
};

// Function to update order status in IndexedDB
const updateOrderStatus = async (orderId, newStatus) => {
  // If IndexedDB is not supported, use localStorage fallback
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported, using localStorage fallback for updateOrderStatus');
    return updateOrderStatusInLocalStorage(orderId, newStatus);
  }
  
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        transaction.onerror = (event) => {
          const error = event.target.error || new Error('Unknown transaction error');
          console.error('Transaction error when updating order status:', error);
          resolve({ success: false, error: error.message || 'Failed to update order status' });
        };
        
        // First get the order
        const getRequest = store.get(orderId);
        
        getRequest.onsuccess = () => {
          const order = getRequest.result;
          if (!order) {
            resolve({ success: false, error: 'Order not found' });
            return;
          }
          
          // Update the order status
          order.status = newStatus;
          order.lastUpdated = new Date().toISOString();
          
          // Put the updated order back
          const updateRequest = store.put(order);
          
          updateRequest.onsuccess = () => {
            resolve({ success: true, order });
          };
          
          updateRequest.onerror = (event) => {
            const error = event.target.error || new Error('Unknown error updating order');
            console.error('Error updating order status in IndexedDB:', error);
            resolve({ success: false, error: error.message || 'Failed to update order status' });
          };
        };
        
        getRequest.onerror = (event) => {
          const error = event.target.error || new Error('Unknown error getting order');
          console.error('Error getting order for status update:', error);
          resolve({ success: false, error: error.message || 'Failed to retrieve order for update' });
        };
        
        transaction.oncomplete = () => {
          if (db && typeof db.close === 'function') {
            db.close();
          }
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction when updating order status:', error);
        resolve({ success: false, error: error.message || 'Database transaction failed' });
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

// Fallback method to update order details in localStorage
const updateOrderDetailsInLocalStorage = (orderId, updates) => {
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) {
        return { success: false, error: 'Order not found' };
      }
      
      // Update the order with the provided updates
      const updatedOrder = { 
        ...orders[orderIndex], 
        ...updates,
        lastUpdated: new Date().toISOString() 
      };
      
      orders[orderIndex] = updatedOrder;
      
      // Save back to localStorage
      localStorage.setItem('orders', JSON.stringify(orders));
      
      return { success: true, order: updatedOrder };
    }
    return { success: false, error: 'Orders not found in localStorage' };
  } catch (error) {
    console.error('Error updating order details in localStorage:', error);
    return { success: false, error: error.message || 'Failed to update order details in localStorage' };
  }
};

// Function to update order details in IndexedDB
const updateOrderDetails = async (orderId, updates) => {
  // If IndexedDB is not supported, use localStorage fallback
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported, using localStorage fallback for updateOrderDetails');
    return updateOrderDetailsInLocalStorage(orderId, updates);
  }
  
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        transaction.onerror = (event) => {
          const error = event.target.error || new Error('Unknown transaction error');
          console.error('Transaction error when updating order details:', error);
          resolve({ success: false, error: error.message || 'Failed to update order details' });
        };
        
        // First get the order
        const getRequest = store.get(orderId);
        
        getRequest.onsuccess = () => {
          const order = getRequest.result;
          if (!order) {
            resolve({ success: false, error: 'Order not found' });
            return;
          }
          
          // Update the order with the provided updates
          const updatedOrder = { 
            ...order, 
            ...updates,
            lastUpdated: new Date().toISOString() 
          };
          
          // Put the updated order back
          const updateRequest = store.put(updatedOrder);
          
          updateRequest.onsuccess = () => {
            resolve({ success: true, order: updatedOrder });
          };
          
          updateRequest.onerror = (event) => {
            const error = event.target.error || new Error('Unknown error updating order details');
            console.error('Error updating order details in IndexedDB:', error);
            resolve({ success: false, error: error.message || 'Failed to update order details' });
          };
        };
        
        getRequest.onerror = (event) => {
          const error = event.target.error || new Error('Unknown error getting order');
          console.error('Error getting order for details update:', error);
          resolve({ success: false, error: error.message || 'Failed to retrieve order for update' });
        };
        
        transaction.oncomplete = () => {
          if (db && typeof db.close === 'function') {
            db.close();
          }
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction when updating order details:', error);
        resolve({ success: false, error: error.message || 'Database transaction failed' });
      }
    });
  } catch (error) {
    console.error('Error updating order details:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

// Function to update tracking information
const updateTrackingInfo = async (orderId, trackingNumber, carrierInfo) => {
  try {
    return await updateOrderDetails(orderId, {
      trackingNumber,
      carrierInfo,
      trackingUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating tracking info:', error);
    return { success: false, error: error.message || 'Failed to update tracking information' };
  }
};

// Function to add admin response to an order
const addAdminResponse = async (orderId, responseText) => {
  try {
    const result = await getOrderById(orderId);
    
    if (!result.success) {
      return result;
    }
    
    const order = result.order;
    const adminResponses = order.adminResponses || [];
    
    adminResponses.push({
      text: responseText,
      date: new Date().toISOString()
    });
    
    return await updateOrderDetails(orderId, { adminResponses });
  } catch (error) {
    console.error('Error adding admin response:', error);
    return { success: false, error: error.message || 'Failed to add admin response' };
  }
};

// Function to add customer message to an order
const addCustomerMessage = async (orderId, messageText) => {
  try {
    const result = await getOrderById(orderId);
    
    if (!result.success) {
      return result;
    }
    
    const order = result.order;
    const customerMessages = order.customerMessages || [];
    
    customerMessages.push({
      text: messageText,
      date: new Date().toISOString()
    });
    
    return await updateOrderDetails(orderId, { customerMessages });
  } catch (error) {
    console.error('Error adding customer message:', error);
    return { success: false, error: error.message || 'Failed to add customer message' };
  }
};

export const OrdersService = {
  saveOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderDetails,
  updateTrackingInfo,
  addAdminResponse,
  addCustomerMessage,
  generateOrderId,
  isIndexedDBSupported
};

export default OrdersService;