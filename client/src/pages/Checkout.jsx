import { MapPin, CreditCard, ChevronRight, Check, ShieldCheck, Wallet, Truck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, login } = useContext(AuthContext); 
  
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(user?.addresses?.length > 0 ? user.addresses.length - 1 : -1);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAddressLocal, setSaveAddressLocal] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/');
    
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
      
      try {
        const { data: updatedProfile } = await api.get('/auth/profile');
        login({ ...user, addresses: updatedProfile.addresses });
      } catch (err) {
        console.error("Failed to fetch updated profile", err);
      }

      toast.success(paymentMethod === 'UPI' ? 'Order placed! Please complete your payment.' : 'Order placed successfully (COD)', {
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
      });
      navigate('/dashboard', { replace: true });
      setTimeout(() => clearCart(), 100);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-main min-h-screen pb-24">
      <div className="pt-16 pb-12">
        <div className="container-custom">
           <h1 className="text-4xl md:text-5xl font-display font-bold text-primary tracking-tight">Checkout</h1>
           <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                 <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                 <span className="text-sm font-bold text-primary">Shipping</span>
              </div>
              <div className="w-12 h-px bg-slate-200"></div>
              <div className="flex items-center gap-2 text-slate-400">
                 <span className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-sm font-bold">2</span>
                 <span className="text-sm font-bold">Payment</span>
              </div>
           </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Shipping Section */}
            <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-premium border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                 </div>
                 <h2 className="text-2xl font-display font-bold text-primary">Delivery Address</h2>
              </div>
              
              {user?.addresses?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {user.addresses.map((a, index) => (
                    <label key={index} className={`relative flex flex-col p-6 rounded-3xl border-2 transition-all cursor-pointer group ${selectedAddressIndex === index ? 'border-accent bg-accent/[0.02] shadow-lg shadow-accent/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-2">
                           <input 
                             type="radio" 
                             name="addressSelector" 
                             checked={selectedAddressIndex === index} 
                             onChange={() => setSelectedAddressIndex(index)} 
                             className="hidden peer"
                           />
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedAddressIndex === index ? 'border-accent bg-accent' : 'border-slate-300'}`}>
                              {selectedAddressIndex === index && <Check className="w-3 h-3 text-white" />}
                           </div>
                           <span className="font-bold text-primary">Home {index + 1}</span>
                         </div>
                      </div>
                      <p className="text-sm text-text-muted font-medium leading-relaxed">{a.street}, {a.city}, {a.state} - {a.zip}</p>
                    </label>
                  ))}
                  <button 
                    onClick={() => setSelectedAddressIndex(-1)} 
                    className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed transition-all ${selectedAddressIndex === -1 ? 'border-accent bg-accent/[0.02] text-accent' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                     <Plus className="w-6 h-6 mb-2" />
                     <span className="font-bold">Add New Address</span>
                  </button>
                </div>
              )}

              {(selectedAddressIndex === -1 || !user?.addresses?.length) && (
                <div className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border-2 border-slate-100">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Street Address</label>
                       <input placeholder="House No, Area, Locality" className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" value={address.street} onChange={e=>setAddress({...address, street: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">City</label>
                         <input placeholder="City" className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">State</label>
                         <input placeholder="State" className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" value={address.state} onChange={e=>setAddress({...address, state: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Pincode</label>
                       <input placeholder="Pincode" className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" value={address.zip} onChange={e=>setAddress({...address, zip: e.target.value})} />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                       <input type="checkbox" checked={saveAddressLocal} onChange={(e) => setSaveAddressLocal(e.target.checked)} className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-accent checked:border-accent transition-all cursor-pointer" />
                       <Check className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                    </div>
                    <span className="text-sm font-bold text-text-muted group-hover:text-primary transition-colors">Save this address to my profile</span>
                  </label>
                </div>
              )}
            </section>

            {/* Payment Section */}
            <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-premium border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-accent" />
                 </div>
                 <h2 className="text-2xl font-display font-bold text-primary">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center gap-4 p-6 rounded-3xl border-2 transition-all cursor-pointer ${paymentMethod === 'UPI' ? 'border-accent bg-accent/[0.02] shadow-lg shadow-accent/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                  <input type="radio" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="hidden" />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'UPI' ? 'bg-accent text-white' : 'bg-white text-slate-400'}`}>
                     <Wallet className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">UPI Payment</span>
                        {paymentMethod === 'UPI' && <Check className="w-5 h-5 text-accent" />}
                     </div>
                     <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">GPay, PhonePe, Paytm</p>
                  </div>
                </label>

                <label className={`relative flex items-center gap-4 p-6 rounded-3xl border-2 transition-all cursor-pointer ${paymentMethod === 'COD' ? 'border-accent bg-accent/[0.02] shadow-lg shadow-accent/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'COD' ? 'bg-accent text-white' : 'bg-white text-slate-400'}`}>
                     <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">Cash on Delivery</span>
                        {paymentMethod === 'COD' && <Check className="w-5 h-5 text-accent" />}
                     </div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pay when you receive</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100 sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
              
              <h2 className="text-2xl font-display font-bold text-primary mb-8 relative z-10">Order Summary</h2>
              
              <div className="space-y-4 mb-8 relative z-10 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <div className="flex-1">
                       <p className="text-sm font-bold text-primary truncate group-hover:text-accent transition-colors">{item.name}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Quantity: {item.qty}</p>
                    </div>
                    <span className="text-sm font-bold text-primary ml-4">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 border-t border-slate-100 pt-6 relative z-10">
                <div className="flex justify-between text-sm font-bold text-text-muted uppercase tracking-widest">
                  <span>Items Subtotal</span>
                  <span>₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-text-muted uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span>Delivery</span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-black tracking-widest">PROPRIETARY</span>
                  </div>
                  <span>₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black text-primary border-t border-slate-100 pt-6 mt-2">
                  <span className="uppercase tracking-widest">Payable</span>
                  <span className="text-4xl font-display font-bold text-accent">₹{totalPrice}</span>
                </div>
              </div>
              
              <button 
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full mt-10 bg-primary hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 group relative z-10"
              >
                {isSubmitting ? (
                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Confirm Order
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100 relative z-10">
                 <ShieldCheck className="w-8 h-8 text-green-500 shrink-0" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">Your data is safe & secure with 256-bit encryption</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
