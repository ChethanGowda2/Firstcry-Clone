import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { fetchCartCount } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
       alert("Please login to add to cart");
       return;
    }
    try {
      await cartAPI.addToCart({ product_id: product.id, quantity: 1 });
      fetchCartCount();
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="product-card card animate-fade">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
          <button className="wishlist-btn"><Heart size={18} /></button>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="rating">
            <Star size={14} fill="#ffb400" color="#ffb400" />
            <span>{product.rating}</span>
          </div>
          <div className="product-price">
            <span className="current-price">${product.price}</span>
            <span className="mrp">${(product.price * 1.2).toFixed(2)}</span>
            <span className="discount">(20% OFF)</span>
          </div>
          <button className="add-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
