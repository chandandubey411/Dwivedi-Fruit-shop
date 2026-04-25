import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Package, MapPin, Trash2, ExternalLink, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
  const { user, login } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const { data } = await api.delete(`/auth/profile/address/${addressId}`);
      login({ ...user, addresses: data });
      toast.success('Address removed', {
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
      });
    } catch (error) {
       toast.error('Failed to remove address');
    }
  };

  const handleMarkPaid = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/mark-paid`);
      setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? data : o));
      toast.success('Verification request sent!', {
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'Processing': return <Package className="w-4 h-4" />;
      case 'Out for Delivery': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Out for Delivery': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-premium border border-slate-100 text-center max-w-md">
           <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <User className="w-10 h-10 text-slate-200" />
           </div>
           <h2 className="text-2xl font-display font-bold text-primary mb-4">Account Access</h2>
           <p className="text-text-muted font-medium mb-10">Please sign in to your account to view your dashboard and orders.</p>
           <Link to="/login" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary/20 block">
             Sign In Now
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-main min-h-screen pb-24">
      <div className="pt-16 pb-12">
        <div className="container-custom">
           <h1 className="text-4xl md:text-5xl font-display font-bold text-primary tracking-tight">Your Dashboard</h1>
           <p className="text-text-muted mt-2 font-medium">Manage your profile, addresses, and track orders</p>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Profile */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center text-4xl font-display font-bold text-accent mx-auto mb-6 border-2 border-white shadow-xl">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-display font-bold text-primary">{user.name}</h2>
                <p className="text-sm font-bold text-text-muted mt-1">{user.phone}</p>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                 </div>
                 <h3 className="text-lg font-display font-bold text-primary tracking-tight">Addresses</h3>
              </div>

              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((a, i) => (
                    <div key={a._id || i} className="group p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-premium relative">
                      <div className="pr-8">
                         <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Address {i + 1}</p>
                         <p className="text-sm text-primary font-bold leading-relaxed">{a.street}, {a.city}, {a.state} - {a.zip}</p>
                      </div>
                      {a._id && (
                         <button 
                           onClick={() => handleDeleteAddress(a._id)}
                           className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="text-center py-6">
                    <p className="text-sm font-medium text-slate-400 italic">No saved addresses</p>
                 </div>
              )}
            </div>
          </div>

          {/* Main Orders List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-display font-bold text-primary">Recent Orders</h2>
               <span className="text-sm font-bold text-text-muted bg-slate-100 px-4 py-1.5 rounded-full">{orders.length} Total</span>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-[3rem] border border-slate-100 shadow-premium">
                 <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-slate-200">
                    <ShoppingBag className="w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-display font-bold text-primary mb-3">No orders found</h3>
                 <p className="text-text-muted font-medium mb-10">You haven't placed any orders yet. Treat yourself to some fresh fruits!</p>
                 <Link to="/products" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary/20 inline-block">
                   Explore Products
                 </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden group">
                    <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-wrap justify-between items-center gap-8">
                      <div className="flex gap-10">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Date</p>
                          <p className="text-sm font-bold text-primary">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Amount</p>
                           <p className="text-lg font-display font-bold text-primary">₹{order.totalPrice}</p>
                        </div>
                        <div className="hidden sm:block">
                           <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Order Ref</p>
                           <p className="text-sm font-bold text-slate-500 uppercase">#{order._id.substring(order._id.length - 8)}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl border ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="text-xs font-black uppercase tracking-widest">
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col md:flex-row gap-12">
                      <div className="flex-1 space-y-6">
                        {order.orderItems.map((item, idx) => (
                           <div key={idx} className="flex gap-5 items-center group/item">
                             <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                                <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                             </div>
                             <div>
                                <p className="text-lg font-display font-bold text-primary group-hover/item:text-accent transition-colors">{item.name}</p>
                                <p className="text-sm font-bold text-text-muted mt-1">Qty: <span className="text-primary">{item.qty}</span> <span className="mx-2 text-slate-200">|</span> Price: <span className="text-primary">₹{item.price}</span></p>
                             </div>
                           </div>
                        ))}
                      </div>
                      
                      <div className="md:w-72 lg:border-l lg:pl-12 flex flex-col justify-between">
                         <div className="space-y-6">
                           <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Details</p>
                             <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-primary">{order.paymentMethod}</p>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                  {order.paymentStatus}
                                </span>
                             </div>
                           </div>
                           
                           {order.paymentMethod === 'UPI' && ['Pending', 'Payment Pending Verification'].includes(order.paymentStatus) && (
                             <div className="space-y-4 pt-4">
                               {!order.hasUserMarkedPaid ? (
                                 <>
                                   <Link to={`/payment/${order._id}`} className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
                                     <ExternalLink className="w-4 h-4" />
                                     Proceed to Payment
                                   </Link>
                                   <button
                                     disabled={updatingOrderId === order._id}
                                     onClick={() => handleMarkPaid(order._id)}
                                     className="w-full bg-slate-100 text-primary py-4 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                                   >
                                     {updatingOrderId === order._id ? 'Processing...' : 'I Have Paid'}
                                   </button>
                                 </>
                               ) : (
                                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden group/wa">
                                    <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover/wa:opacity-[0.03] transition-opacity"></div>
                                    <p className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-black mb-4 leading-tight">Confirmation Required</p>
                                    <button 
                                      onClick={() => {
                                        const message = `Hi, I have paid ₹${order.totalPrice} for Order ID ${order._id}. Please confirm my order.`;
                                        const whatsappUrl = `https://wa.me/919910850024?text=${encodeURIComponent(message)}`;
                                        window.open(whatsappUrl, "_blank");
                                      }}
                                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                      Confirm on WhatsApp
                                    </button>
                                 </div>
                               )}
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
