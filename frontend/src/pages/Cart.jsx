import { useEffect, useState } from 'react';
import { cartAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchCartCount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const loadCart = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const res = await cartAPI.getCart();
            setCartItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [user]);

    const handleUpdate = async (id, quantity) => {
        try {
            await cartAPI.updateCart(id, quantity);
            loadCart();
            fetchCartCount();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemove = async (id) => {
        try {
            await cartAPI.removeFromCart(id);
            loadCart();
            fetchCartCount();
        } catch (err) {
            console.error(err);
        }
    };

    const subTotal = cartItems.reduce((acc, item) => acc + item.product_price * item.quantity, 0);

    if (!user) return (
       <div className="container p-y-5 text-center auth-needed">
          <h2>Please login to view your cart</h2>
          <Link to="/login" className="btn-primary" style={{marginTop:'1.5rem', display:'inline-block'}}>Login Now</Link>
       </div>
    );

    if (loading) return <div className="container p-y-5">Loading cart...</div>;

    return (
        <div className="cart-page container p-y-5">
            <h1>Shopping Cart ({cartItems.length} items)</h1>
            {cartItems.length === 0 ? (
                <div className="empty-cart card">
                    <ShoppingBag size={80} color="#ccc" />
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="btn-primary">Explore Products</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item card animate-fade">
                                <img src={item.product_image} alt={item.product_name} />
                                <div className="item-details">
                                    <h3>{item.product_name}</h3>
                                    <p className="item-price">${item.product_price}</p>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => handleUpdate(item.id, item.quantity - 1)}><Minus size={16} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleUpdate(item.id, item.quantity + 1)}><Plus size={16} /></button>
                                        </div>
                                        <button className="remove-btn" onClick={() => handleRemove(item.id)}><Trash2 size={20} /></button>
                                    </div>
                                </div>
                                <div className="item-total">
                                    <p>${(item.product_price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary card glass">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free">FREE</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${subTotal.toFixed(2)}</span>
                        </div>
                        <button className="btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
