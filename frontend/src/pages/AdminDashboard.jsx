import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, ListChecks, Users, PlusCircle, Trash2, Edit } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
    const { isAdmin, user } = useAuth();
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) return;
        const loadAdminData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                   adminAPI.getStats(),
                   adminAPI.getAllOrders()
                ]);
                setStats(statsRes.data);
                setOrders(ordersRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadAdminData();
    }, [isAdmin]);

    if (!isAdmin) return (
       <div className="container p-y-5 text-center">
          <h1>Access Denied</h1>
          <p>Please login as an admin to view this page</p>
       </div>
    );

    if (loading) return <div className="container p-y-5">Loading Admin Data...</div>;

    return (
        <div className="admin-page container p-y-5">
            <aside className="admin-sidebar glass card p-2">
                <h2>Admin Panel</h2>
                <nav className="admin-nav">
                    <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}><LayoutDashboard /> Dashboard</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag /> Orders</button>
                    <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><ListChecks /> Products</button>
                    <button disabled><Users /> Users (Coming Soon)</button>
                </nav>
            </aside>
            <main className="admin-content card p-3">
                {activeTab === 'stats' && (
                    <div className="stats-grid animate-fade">
                        <div className="stat-card">
                            <h3>Total Revenue</h3>
                            <p className="stat-value">${stats.total_revenue?.toFixed(2)}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Orders</h3>
                            <p className="stat-value">{stats.total_orders}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Products</h3>
                            <p className="stat-value">{stats.total_products}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Users</h3>
                            <p className="stat-value">{stats.total_users}</p>
                        </div>
                    </div>
                )}
                {activeTab === 'orders' && (
                    <div className="orders-table-container animate-fade">
                        <h2>Manage Orders</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.username}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td><span className={`status-badge-small ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                        <td>${order.total_price.toFixed(2)}</td>
                                        <td><button className="edit-btn">View Details</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'products' && (
                    <div className="products-manage animate-fade">
                        <div className="section-title">
                            <h2>Product List</h2>
                            <button className="btn-primary" style={{display:'flex', gap:'0.5rem'}}><PlusCircle size={20}/> New Product</button>
                        </div>
                        <p>Total Products (Mock List): {stats.total_products}</p>
                        {/* More grid list here */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
