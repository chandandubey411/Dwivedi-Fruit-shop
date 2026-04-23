import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, login } = useContext(AuthContext); // login needed to update user state if address added
  
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(user?.addresses?.length > 0 ? user.addresses.length - 1 : -1);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAddressLocal, setSaveAddressLocal] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/');
    
    // fetch settings
    api.get('/settings').then(res => {
      if(res.data) setDeliveryCharge(res.data.deliveryCharge);
    }).catch(console.error);
  }, [navigate, cartItems]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalPrice = itemsPrice + deliveryCharge;

  const handlePlaceOrder = async () => {
    let finalAddress;
    if (selectedAddressIndex >= 0 && user.addresses[selectedAddressIndex]) {
      finalAddress = user.addresses[selectedAddressIndex];
    } else {
      if (!address.street || !address.city || !address.state || !address.zip) {
        return toast.error('Please fill in complete address');
      }
      finalAddress = address;
    }

    try {
      setIsSubmitting(true);
      
      const mappedOrderItems = cartItems.map(item => ({
        ...item,
        image: item.images?.length > 0 ? item.images[0] : '/placeholder.png'
      }));

      const { data } = await api.post('/orders', {
        orderItems: mappedOrderItems,
        shippingAddress: finalAddress,
        paymentMethod,
        itemsPrice,
        deliveryCharge,
        totalPrice,
        saveAddress: selectedAddressIndex === -1 ? saveAddressLocal : false
      });
      
      // Fetch updated profile to ensure sync with context state
      try {
        const { data: updatedProfile } = await api.get('/auth/profile');
        login({ ...user, addresses: updatedProfile.addresses });
      } catch (err) {
        console.error("Failed to fetch updated profile", err);
      }

      toast.success(paymentMethod === 'UPI' ? 'Order placed! Please complete your payment.' : 'Order placed successfully (COD)');
      navigate('/dashboard', { replace: true });
      setTimeout(() => clearCart(), 100);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* Left: Shipping & Payment */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
        
        {user?.addresses?.length > 0 && (
          <div className="mb-6">
            <label className="block font-medium mb-2">Saved Addresses</label>
            <div className="space-y-3">
              {user.addresses.map((a, index) => (
                <label key={index} className="flex flex-col border p-3 rounded-md cursor-pointer hover:bg-gray-50 flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="addressSelector" 
                      checked={selectedAddressIndex === index} 
                      onChange={() => setSelectedAddressIndex(index)} 
                      className="mt-1"
                    />
                    <span className="font-semibold">Address {index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600 block pl-5">{a.street}, {a.city}, {a.state} - {a.zip}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="addressSelector" 
                  checked={selectedAddressIndex === -1} 
                  onChange={() => setSelectedAddressIndex(-1)} 
                />
                <span className="font-medium">Add New Address</span>
              </label>
            </div>
          </div>
        )}

        {(selectedAddressIndex === -1 || !user?.addresses?.length) && (
          <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-xl border">
            <input placeholder="Street Address" className="border p-2 rounded" value={address.street} onChange={e=>setAddress({...address, street: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="City" className="border p-2 rounded" value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} />
              <input placeholder="State" className="border p-2 rounded" value={address.state} onChange={e=>setAddress({...address, state: e.target.value})} />
            </div>
            <input placeholder="Zip Code" className="border p-2 rounded" value={address.zip} onChange={e=>setAddress({...address, zip: e.target.value})} />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={saveAddressLocal} onChange={(e) => setSaveAddressLocal(e.target.checked)} className="w-4 h-4 text-brand bg-white border-gray-300 rounded focus:ring-brand accent-brand" />
              <span className="text-sm font-medium text-gray-700">Save this address to my profile</span>
            </label>
          </div>
        )}

        <h2 className="text-2xl font-bold mt-10 mb-4">Payment Method</h2>
        <div className="flex gap-4">
          <label className={`flex-1 border p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-brand bg-brand-light' : ''}`}>
            <input type="radio" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="hidden" />
            <span className="font-semibold">UPI Payment</span>
            <span className="bg-brand text-white text-xs px-2 py-1 rounded ml-2">Recommended</span>
          </label>
          <label className={`flex-1 border p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition ${paymentMethod === 'COD' ? 'border-brand bg-brand-light' : ''}`}>
            <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
            <span className="font-semibold">Cash on Delivery</span>
          </label>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div>
        <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-24">
          <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{item.name} x {item.qty}</span>
                <span className="font-medium text-gray-900">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2">
              <span>Total Payable</span>
              <span className="text-brand-dark">₹{totalPrice}</span>
            </div>
          </div>
          
          <button 
            disabled={isSubmitting}
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-brand hover:bg-brand-dark disabled:bg-gray-400 text-white py-3 rounded-md font-bold text-lg transition shadow-md"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
