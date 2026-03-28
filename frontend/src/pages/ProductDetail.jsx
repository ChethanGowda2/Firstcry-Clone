import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { fetchCartCount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const res = await productAPI.getProductDetails(id);
                setProduct(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadDetail();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            await cartAPI.addToCart({ product_id: product.id, quantity: qty });
            fetchCartCount();
            alert("Added to cart!");
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="container p-y-5">Loading product...</div>;

    return (
        <div className="product-detail-page container p-y-5">
            <div className="detail-layout">
                <div className="detail-image shadow-md">
                    <img src={product.image_url} alt={product.name} />
                </div>
                <div className="detail-info animate-fade">
                    <h1 className="detail-title">{product.name}</h1>
                    <div className="detail-meta">
                        <div className="rating">
                            <Star size={20} fill="#ffb400" color="#ffb400" />
                            <span>{product.rating} (500+ reviews)</span>
                        </div>
                        <span className="stock-label">In Stock: {product.stock} units</span>
                    </div>
                    <div className="detail-price">
                        <span className="current">${product.price}</span>
                        <span className="mrp">${(product.price * 1.2).toFixed(2)}</span>
                        <span className="off">20% OFF</span>
                    </div>
                    <p className="description">{product.description}</p>
                    
                    <div className="order-options">
                        <div className="qty-picker">
                            <button onClick={() => setQty(q => Math.max(1, q-1))}>-</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(q => q+1)}>+</button>
                        </div>
                        <button className="btn-primary buy-btn" onClick={handleAddToCart}>
                            <ShoppingCart size={22} /> Add to Cart
                        </button>
                    </div>

                    <div className="trust-badges card">
                        <div className="badge-item">
                           <ShieldCheck size={24} color="#4caf50" />
                           <p>Authentic Product</p>
                        </div>
                        <div className="badge-item">
                           <Truck size={24} color="#03a9f4" />
                           <p>Free Shipping</p>
                        </div>
                        <div className="badge-item">
                           <RotateCcw size={24} color="#ff7043" />
                           <p>30-Day Returns</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
