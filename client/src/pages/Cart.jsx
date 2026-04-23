import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [deliveryCharge, setDeliveryCharge] = useState(40);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data && data.deliveryCharge !== undefined) {
          setDeliveryCharge(data.deliveryCharge);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, []);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalPrice = itemsPrice > 0 ? itemsPrice + deliveryCharge : 0;

  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any fruits to your cart yet.</p>
        <Link to="/products" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-md font-medium">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.product} className="flex items-center gap-4 border-b py-4">
              <img src={item.images?.[0] || '/placeholder.png'} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-grow">
                <Link to={`/products`} className="text-lg font-semibold text-gray-800 hover:text-brand">{item.name}</Link>
                <div className="text-brand-dark font-bold mt-1">₹{item.price}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  value={item.qty} 
                  onChange={(e) => addToCart({ ...item, _id: item.product }, Number(e.target.value))}
                  className="border rounded p-1 max-w-[60px]"
                >
                  {[...Array(10).keys()].map(x => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
                <button onClick={() => removeFromCart(item.product)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                  <Trash2 className="w-5 h-5"/>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-800">
              <span>Grand Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
          <button 
            onClick={checkoutHandler}
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-md font-bold transition shadow"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
