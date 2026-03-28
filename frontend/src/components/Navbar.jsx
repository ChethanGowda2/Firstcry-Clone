import { Search, ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar-container glass">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <span className="logo-first">First</span>
          <span className="logo-cry">Cry</span>
        </Link>
        <div className="search-bar">
          <input type="text" placeholder="Search for products, brands..." />
          <button className="search-btn"><Search size={20} /></button>
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-item">Shop</Link>
          {isAdmin && <Link to="/admin" className="nav-item admin-link">Dashboard</Link>}
          <Link to="/orders" className="nav-item">My Orders</Link>
          {!user ? (
            <Link to="/login" className="nav-item btn-primary auth-btn">Login</Link>
          ) : (
            <div className="user-profile">
               <span className="user-name">Hi, {user.username}</span>
               <button onClick={logout} className="nav-item logout-btn"><LogOut size={20} /></button>
            </div>
          )}
          <Link to="/cart" className="nav-item cart-icon">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
