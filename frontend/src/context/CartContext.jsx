import { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCartCount = async () => {
    if (user) {
      try {
        const res = await cartAPI.getCart();
        const total = res.data.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      } catch (err) {
        console.error("Cart fetch failed", err);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  const incrementCart = () => setCartCount(prev => prev + 1);
  const decrementCart = () => setCartCount(prev => (prev > 0 ? prev - 1 : 0));
  const updateCartCount = (count) => setCartCount(count);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, incrementCart, decrementCart, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
