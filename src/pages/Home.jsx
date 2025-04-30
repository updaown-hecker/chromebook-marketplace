import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import products from '../data/products';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    // Filter featured products
    const featured = products.filter(product => product.featured);
    setFeaturedProducts(featured);
    setAllProducts(products);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(products.map(product => product.category || 'Uncategorized'))];
    setCategories(uniqueCategories);
  }, []);
  
  const handleAddToCart = (product, event) => {
    event.preventDefault();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="ebay-style-store">
      {/* Top Banner */}
      <section className="ebay-banner">
        <div className="container">
          <h1>Chromebook Marketplace</h1>
          <p>Find the perfect HP Chromebook for your needs at competitive prices</p>
        </div>
      </section>
      
      {/* Category Navigation */}
      <section className="category-nav">
        <div className="container">
          <div className="category-list">
            <button 
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button 
                key={category}
                className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Daily Deals / Featured Products */}
      <section className="daily-deals">
        <div className="container">
          <div className="section-header">
            <h2>Featured Deals</h2>
            <Link to="/" className="view-all">See all</Link>
          </div>
          
          <div className="product-grid">
            {featuredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <div className="product-badge">Featured</div>
                <Link to={`/product/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="product-meta">
                      <span className="product-condition">{product.condition || 'New'}</span>
                      <span className="product-shipping">Free shipping</span>
                    </div>
                    <p className="product-description">
                      {product.description.substring(0, 80)}...
                    </p>
                  </div>
                </Link>
                <button 
                  className="buy-now-btn"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Products */}
      <section className="all-products">
        <div className="container">
          <div className="section-header">
            <h2>{selectedCategory === 'all' ? 'All Chromebooks' : selectedCategory}</h2>
            <div className="product-count">{filteredProducts.length} items</div>
          </div>
          
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                {product.featured && <div className="product-badge">Featured</div>}
                <Link to={`/product/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="product-meta">
                      <span className="product-condition">{product.condition || 'New'}</span>
                      <span className="product-shipping">Free shipping</span>
                    </div>
                    <p className="product-description">
                      {product.description.substring(0, 80)}...
                    </p>
                  </div>
                </Link>
                <button 
                  className="buy-now-btn"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;