import { useState, useEffect } from 'react';
import { cartAPI, orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css'; // Reuse some summary styles

const Checkout = () => {
    const [address, setAddress] = useState({
        fullName: '',
        addressLine1: '',
        city: '',
        zipCode: '',
        phoneNumber: ''
    });
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const loadCart = async () => {
            try {
                const res = await cartAPI.getCart();
                setCartItems(res.data);
            } catch (err) { navigate('/cart'); }
        };
        loadCart();
    }, []);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formattedAddress = `${address.fullName}, ${address.addressLine1}, ${address.city}, ${address.zipCode}. Phone: ${address.phoneNumber}`;
            const res = await orderAPI.checkout({ address: formattedAddress });
            alert("Order placed successfully! Order ID: " + res.data.order_id);
            fetchCartCount();
            navigate('/orders');
        } catch (err) {
            alert("Checkout failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const subTotal = cartItems.reduce((acc, item) => acc + item.product_price * item.quantity, 0);

    return (
        <div className="checkout-page container p-y-5">
            <h1>Checkout</h1>
            <div className="cart-content">
                <div className="checkout-main">
                    <form onSubmit={handleCheckout} className="checkout-form card glass p-3">
                        <h2><MapPin className="icon" /> Shipping Address</h2>
                        <div className="form-grid">
                            <div className="form-group full">
                                <label>Full Name</label>
                                <input type="text" name="fullName" value={address.fullName} onChange={handleChange} required />
                            </div>
                            <div className="form-group full">
                                <label>Address Line 1</label>
                                <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
                            </div>
                            <div className="form-group half">
                                <label>City</label>
                                <input type="text" name="city" value={address.city} onChange={handleChange} required />
                            </div>
                            <div className="form-group half">
                                <label>Zip Code</label>
                                <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} required />
                            </div>
                            <div className="form-group full">
                                <label>Phone Number</label>
                                <input type="text" name="phoneNumber" value={address.phoneNumber} onChange={handleChange} required />
                            </div>
                        </div>

                        <h2 className="m-t-2"><CreditCard className="icon" /> Payment Method</h2>
                        <div className="payment-mock card p-2">
                             <input type="radio" checked readOnly />
                             <span>Cash on Delivery (Mocked for this project)</span>
                        </div>

                        <button type="submit" className="btn-primary checkout-btn-submit" disabled={loading || cartItems.length === 0}>
                            {loading ? 'Processing...' : `Place Order - $${subTotal}`}
                        </button>
                    </form>
                </div>
                <div className="cart-summary card glass p-2">
                    <h2>Order Summary</h2>
                    <div className="checkout-items">
                         {cartItems.map(item => (
                             <div key={item.id} className="checkout-item-small">
                                 <span>{item.quantity}x {item.product_name}</span>
                                 <span>${(item.product_price * item.quantity).toFixed(2)}</span>
                             </div>
                         ))}
                    </div>
                    <div className="summary-total m-t-1">
                        <span>Total Price</span>
                        <span>${subTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
