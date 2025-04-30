import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import products from '../../data/products';
import './AdminStyles.css';

const AdminProducts = () => {
  const [productList, setProductList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    featured: false
  });

  useEffect(() => {
    // Load products from data file
    setProductList(products);
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      featured: product.featured
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      stock: 0,
      featured: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real application, this would update the database
    // For this demo, we'll update the local state
    if (editingProduct) {
      const updatedProducts = productList.map(product => 
        product.id === editingProduct.id ? { ...product, ...formData } : product
      );
      setProductList(updatedProducts);
      alert(`Product "${formData.name}" updated successfully!`);
    } else {
      // Add new product logic would go here
      const newProduct = {
        id: productList.length + 1,
        ...formData,
        image: '/images/placeholder.jpg',
        images: []
      };
      setProductList([...productList, newProduct]);
      alert(`Product "${formData.name}" added successfully!`);
    }
    
    // Reset form
    handleCancelEdit();
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter products based on search term
  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products based on sort field and direction
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'price' || sortField === 'stock') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else {
      return sortDirection === 'asc'
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]));
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Manage Products</h1>
          <button 
            className="btn btn-primary admin-add-btn"
            onClick={() => setEditingProduct({})}
          >
            Add New Product
          </button>
        </div>
        
        {editingProduct && (
          <div className="product-form-container">
            <div className="card p-4 mb-4">
              <h2>{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="featured">
                    Featured Product
                  </label>
                </div>
                
                <div className="form-group d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct.id ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="product-list-container">
          <div className="product-list-header">
            <div className="product-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="product-search-input"
              />
            </div>
            <div className="product-count">
              {filteredProducts.length} products found
            </div>
          </div>

          <div className="table-responsive product-table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable-header">
                    ID {sortField === 'id' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th>Image</th>
                  <th onClick={() => handleSort('name')} className="sortable-header">
                    Name {sortField === 'name' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th onClick={() => handleSort('price')} className="sortable-header">
                    Price {sortField === 'price' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th onClick={() => handleSort('stock')} className="sortable-header">
                    Stock {sortField === 'stock' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th onClick={() => handleSort('featured')} className="sortable-header">
                    Featured {sortField === 'featured' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => (
                  <tr key={product.id} className="product-row">
                    <td>{product.id}</td>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>{product.featured ? 'Yes' : 'No'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;