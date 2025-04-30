import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import products from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  
  useEffect(() => {
    // Find the product by ID
    const productId = parseInt(id);
    const foundProduct = products.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image);
    }
    
    setLoading(false);
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      // Show success message
      alert(`${quantity} ${product.name} added to cart!`);
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleAddToWatchlist = () => {
    setAddedToWatchlist(!addedToWatchlist);
    if (!addedToWatchlist) {
      alert(`${product.name} added to your watchlist!`);
    }
  };
  
  const toggleShowAllSpecs = () => {
    setShowAllSpecs(!showAllSpecs);
  };
  
  if (loading) {
    return <div className="container">Loading...</div>;
  }
  
  if (!product) {
    return <div className="container">Product not found</div>;
  }

  // Get similar products (same category or featured)
  const similarProducts = products
    .filter(p => p.id !== product.id && (p.featured || (product.category && p.category === product.category)))
    .slice(0, 4);
  
  return (
    <div className="ebay-product-detail container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <Link to="/">Home</Link> &gt; 
        <span>{product.category || 'Chromebooks'}</span> &gt; 
        <span className="current">{product.name}</span>
      </div>

      <div className="product-main-content">
        {/* Left Column - Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="main-image" 
            />
            <div className="image-actions">
              <button className="image-action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                </svg>
              </button>
              <button className="image-action-btn" onClick={() => window.open(selectedImage, '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                  <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="image-thumbnails">
            <img 
              src={product.image} 
              alt={product.name} 
              className={`thumbnail ${selectedImage === product.image ? 'active' : ''}`}
              onClick={() => setSelectedImage(product.image)}
            />
            {product.images && product.images.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`${product.name} - view ${index + 1}`} 
                className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        
        {/* Right Column - Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          {/* Seller Info */}
          <div className="seller-info">
            <div className="seller-badge">
              <span className="seller-icon">J</span>
              <div className="seller-details">
                <span className="seller-name">jaremelee_31 (90)</span>
                <span className="seller-rating">93% positive</span>
              </div>
            </div>
            <div className="seller-links">
              <a href="#">Seller's other items</a> | <a href="#">Contact seller</a>
            </div>
          </div>
          
          {/* Price Section */}
          <div className="price-section">
            <div className="current-price-container">
              <span className="price-label">US ${product.price.toFixed(2)}</span>
              <span className="price-note">or Best Offer</span>
            </div>
            
            {/* Condition */}
            <div className="condition-container">
              <div className="condition-label">Condition:</div>
              <div className="condition-value">
                {product.condition || 'Used'} 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                </svg>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="quantity-container">
              <div className="quantity-label">Quantity:</div>
              <div className="quantity-selector-container">
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
                  <input 
                    type="number" 
                    className="quantity-input" 
                    value={quantity} 
                    onChange={handleQuantityChange} 
                    min="1" 
                    max={product.stock} 
                  />
                  <button className="quantity-btn" onClick={increaseQuantity}>+</button>
                </div>
                <div className="quantity-available">
                  {product.stock} available | {product.stock > 0 ? '2 sold' : 'Sold out'}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className="btn-buy-now" 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy It Now
              </button>
              
              <button 
                className="btn-add-to-cart" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to cart
              </button>
              
              <button 
                className="btn-make-offer" 
                disabled={product.stock === 0}
              >
                Make offer
              </button>
              
              <button 
                className={`btn-add-to-watchlist ${addedToWatchlist ? 'active' : ''}`} 
                onClick={handleAddToWatchlist}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                </svg>
                Add to Watchlist
              </button>
            </div>
            
            {/* Additional Services */}
            <div className="additional-services">
              <div className="service-header">Additional service available</div>
              <div className="service-option">
                <input type="checkbox" id="protection-plan" />
                <label htmlFor="protection-plan">1-year protection plan from Allstate - $13.99</label>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="social-proof">
              <div className="social-proof-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                </svg>
                <span>People want this. </span>
                <strong>10 people are watching this.</strong>
              </div>
              <div className="social-proof-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
                <span>Popular item. </span>
                <strong>7 have already sold.</strong>
              </div>
            </div>
          </div>
          
          {/* Shipping & Returns */}
          <div className="shipping-returns">
            <div className="shipping-info">
              <div className="info-header">Shipping:</div>
              <div className="info-content">
                <div className="shipping-price">US $8.99 USPS Ground Advantage<sup>®</sup> <a href="#">See details</a></div>
                <div className="shipping-location">Located in: Provo, Utah, United States</div>
              </div>
            </div>
            
            <div className="delivery-info">
              <div className="info-header">Delivery:</div>
              <div className="info-content">
                <div className="delivery-estimate">Estimated between Fri, May 3 and Thu, May 9 to 53539</div>
              </div>
            </div>
            
            <div className="returns-info">
              <div className="info-header">Returns:</div>
              <div className="info-content">
                <div className="returns-policy">Seller does not accept returns. <a href="#">See details</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description & Specs */}
      <div className="product-details-section">
        <h2 className="section-title">About this item</h2>
        <div className="product-description">
          <p>{product.description}</p>
        </div>
        
        <div className="product-specs">
          <h3>Specifications</h3>
          <ul className="specs-list">
            {product.specs.slice(0, showAllSpecs ? product.specs.length : 5).map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
          {product.specs.length > 5 && (
            <button className="show-more-btn" onClick={toggleShowAllSpecs}>
              {showAllSpecs ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
      
      {/* Similar Items */}
      {similarProducts.length > 0 && (
        <div className="similar-items-section">
          <h2 className="section-title">Similar Items</h2>
          <div className="similar-items-grid">
            {similarProducts.map(item => (
              <div className="similar-item" key={item.id}>
                <Link to={`/product/${item.id}`} className="similar-item-link">
                  <div className="similar-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="similar-item-info">
                    <h3 className="similar-item-title">{item.name}</h3>
                    <div className="similar-item-price">${item.price.toFixed(2)}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;