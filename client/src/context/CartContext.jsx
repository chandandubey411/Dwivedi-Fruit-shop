import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cartData = localStorage.getItem('cartItems');
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);
    if (existItem) {
      setCartItems(cartItems.map((x) => 
        x.product === existItem.product ? { ...existItem, qty: Number(qty) } : x
      ));
      toast.success('Cart updated');
    } else {
      setCartItems([...cartItems, { 
        product: product._id,
        name: product.name,
        price: product.price,
        images: product.images, 
        stock: product.countInStock,
        qty
      }]);
      toast.success('Added to cart');
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
