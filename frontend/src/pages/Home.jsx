import { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentBanner, setCurrentBanner] = useState(0);

    const banners = [
        'https://cdn.fcglcdn.com/brain/images/v2/banner/hp_march_toy_fest_2026.jpg', // Placeholder
        'https://cdn.fcglcdn.com/brain/images/v2/banner/hp_fashion_sale.jpg', // Placeholder
        'https://cdn.fcglcdn.com/brain/images/v2/banner/hp_diaper_sale.jpg' // Placeholder
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    productAPI.getProducts({ per_page: 8 }),
                    productAPI.getCategories()
                ]);
                setProducts(prodRes.data.products);
                setCategories(catRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
    const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

    if (loading) return <div className="container p-5">Loading...</div>;

    return (
        <div className="home-page">
            {/* Banner Section */}
            <section className="banner-section">
                <div className="banner-container">
                   <div className="banner-slide" style={{backgroundImage: `url(${banners[currentBanner]})`, backgroundColor: '#ffefeb'}}>
                        <div className="banner-content container">
                            <h1>Best Deals for Your Little Ones</h1>
                            <p>Up to 50% OFF on Top Brands</p>
                            <button className="btn-primary">Shop Now</button>
                        </div>
                    </div>
                </div>
                <button className="banner-nav prev" onClick={prevBanner}><ChevronLeft /></button>
                <button className="banner-nav next" onClick={nextBanner}><ChevronRight /></button>
            </section>

            {/* Categories Section */}
            <section className="categories-section container p-t-5">
                <div className="section-header">
                    <h2>Shop by Category</h2>
                    <Link to="/products" className="view-all">View All <ChevronRight size={16}/></Link>
                </div>
                <div className="category-grid">
                    {categories.map(cat => (
                        <div key={cat.id} className="category-item">
                            <div className="category-image">
                                <img src={cat.image_url} alt={cat.name} />
                            </div>
                            <h3>{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section container p-y-5">
                 <div className="section-header">
                    <h2>Premium Picks</h2>
                    <Link to="/products" className="view-all">View All <ChevronRight size={16}/></Link>
                </div>
                <div className="products-grid">
                    {products.map(prod => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
