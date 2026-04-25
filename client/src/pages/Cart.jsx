import { ShoppingBag, ArrowRight, Minus, Plus, X } from 'lucide-react';

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
      <div className="bg-bg-main min-h-screen py-24">
        <div className="container-custom flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-premium flex items-center justify-center mb-8">
             <ShoppingBag className="w-12 h-12 text-slate-200" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary mb-4">Your Basket is Empty</h2>
          <p className="text-text-muted font-medium mb-10 max-w-md">Looks like you haven't added any fresh items to your basket yet. Start exploring our collection!</p>
          <Link to="/products" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary/20">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-main min-h-screen pb-24">
      <div className="pt-16 pb-12">
        <div className="container-custom">
           <h1 className="text-4xl md:text-5xl font-display font-bold text-primary tracking-tight">Your Basket</h1>
           <p className="text-text-muted mt-2 font-medium">Review your items and proceed to checkout</p>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white p-6 rounded-[2rem] shadow-premium border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group transition-all duration-300 hover:shadow-premium-hover">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                  <img src={item.images?.[0] || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                        <Link to={`/products`} className="text-xl font-display font-bold text-primary hover:text-accent transition-colors">{item.name}</Link>
                        <p className="text-xs font-black uppercase tracking-widest text-accent mt-1">Fresh Farm Selection</p>
                     </div>
                     <p className="text-2xl font-display font-bold text-primary">₹{item.price * item.qty}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                     <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <button 
                          onClick={() => addToCart({ ...item, _id: item.product }, Math.max(1, item.qty - 1))}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-primary hover:bg-accent hover:text-white transition-all disabled:opacity-50"
                          disabled={item.qty <= 1}
                        >
                           <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-primary">{item.qty}</span>
                        <button 
                          onClick={() => addToCart({ ...item, _id: item.product }, item.qty + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-primary hover:bg-accent hover:text-white transition-all"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                     </div>

                     <button 
                       onClick={() => removeFromCart(item.product)} 
                       className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                     >
                       <X className="w-4 h-4" />
                       Remove Item
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100 sticky top-28">
              <h2 className="text-2xl font-display font-bold text-primary mb-8">Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <span className="text-lg font-bold text-primary">₹{itemsPrice}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Delivery</span>
                     <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-black uppercase tracking-widest">Fast</span>
                   </div>
                   <span className="text-lg font-bold text-primary">₹{deliveryCharge}</span>
                </div>
                
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-lg font-black text-primary uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-display font-bold text-accent">₹{totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={checkoutHandler}
                className="w-full bg-primary hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 mt-10 flex items-center justify-center gap-3 group"
              >
                Checkout Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure 256-bit SSL Encrypted Payment</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
