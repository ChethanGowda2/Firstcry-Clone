import { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadOrders = async () => {
            if (!user) { setLoading(false); return; }
            try {
                const res = await orderAPI.getOrders();
                setOrders(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadOrders();
    }, [user]);

    if (!user) return <div className="container p-y-5">Please login to view orders</div>;
    if (loading) return <div className="container p-y-5">Loading orders...</div>;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Placed': return <Package size={20} color="#ffb400" />;
            case 'Shipped': return <Truck size={20} color="#03a9f4" />;
            case 'Delivered': return <CheckCircle size={20} color="#4caf50" />;
            default: return <Package size={20} />;
        }
    };

    return (
        <div className="orders-page container p-y-5">
            <h1>My Orders ({orders.length})</h1>
            <div className="orders-list">
                {orders.length === 0 ? (
                    <div className="empty-orders text-center card p-5">
                       <ShoppingBag size={64} style={{marginBottom: '1rem'}} />
                       <h2>No orders yet</h2>
                       <Link to="/">Start Shopping</Link>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="order-card card animate-fade">
                            <div className="order-header">
                                <div className="order-id">
                                    <span className="label">Order ID:</span>
                                    <span className="value">#{order.id}</span>
                                </div>
                                <div className="order-status">
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {getStatusIcon(order.status)} {order.status}
                                    </span>
                                </div>
                                <div className="order-date">
                                    <span className="label">Placed on:</span>
                                    <span className="value">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="order-price">
                                    <span className="label">Total Paid:</span>
                                    <span className="value">${order.total_price.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="order-items-summary">
                                 {order.items.map((item, idx) => (
                                     <div key={idx} className="order-item-row">
                                         <p>{item.product_name} <span>x {item.quantity}</span></p>
                                         <p>${(item.price * item.quantity).toFixed(2)}</p>
                                     </div>
                                 ))}
                            </div>
                            <div className="order-address">
                                <span className="label">Shipping to:</span>
                                <p>{order.address}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;
