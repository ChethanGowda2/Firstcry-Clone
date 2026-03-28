import './Footer.css';
import { Globe, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-section">
          <Link to="/" className="logo">
            <span className="logo-first">First</span>
            <span className="logo-cry">Cry</span>
          </Link>
          <p>India's largest online shop for new born, baby & kids products. Explore our wide range of categories today!</p>
          <div className="social-links">
            <Share2 size={20} /> <MessageCircle size={20} /> <Globe size={20} />
          </div>
        </div>
        <div className="footer-section">
          <h3>Shopping</h3>
          <Link to="/">Baby Care</Link>
          <Link to="/">Toys</Link>
          <Link to="/">Clothing</Link>
          <Link to="/">Footwear</Link>
        </div>
        <div className="footer-section">
          <h3>Support</h3>
          <Link to="/">Contact Us</Link>
          <Link to="/">Order Status</Link>
          <Link to="/">Return Policy</Link>
          <Link to="/">FAQs</Link>
        </div>
        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to get special offers and once-in-a-lifetime deals.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your Email" />
            <button className="btn-primary">Go</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <p>&copy; 2026 FirstCry Clone. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
