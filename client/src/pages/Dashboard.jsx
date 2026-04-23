import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

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
      toast.success('Address removed');
    } catch (error) {
       toast.error('Failed to remove address');
    }
  };

  const handleMarkPaid = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/mark-paid`);
      setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? data : o));
      toast.success('Validation triggered successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-teal-100 text-teal-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    if (status === 'Confirmed') return 'text-green-600 bg-green-50';
    if (status.includes('Pending')) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (!user) {
    return <div className="text-center py-20">Please log in to view dashboard</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
      {/* Sidebar Profile */}
      <div className="md:col-span-1 border rounded-xl p-6 bg-white shadow-sm h-fit">
        <div className="text-center mb-6 border-b pb-6">
          <div className="w-20 h-20 bg-brand-light text-brand-dark rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.phone}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 block">Saved Addresses</h3>
          {user.addresses && user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map((a, i) => (
                <div key={a._id || i} className="text-sm p-3 bg-gray-50 rounded border text-gray-700 flex justify-between items-start gap-4 hover:shadow-sm transition">
                  <div className="leading-relaxed">
                    {a.street},<br/>{a.city}, {a.state} - {a.zip}
                  </div>
                  {a._id && (
                     <button 
                       onClick={() => handleDeleteAddress(a._id)}
                       title="Delete Address"
                       className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-gray-500">No addresses saved.</p>
          )}
        </div>
      </div>

      {/* Main Content: Orders */}
      <div className="md:col-span-3">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h2>
        
        {loading ? (
          <div className="text-center py-10 animate-pulse text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link to="/products" className="bg-brand text-white px-6 py-2 rounded shadow hover:bg-brand-dark">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Order placed</p>
                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                     <p className="text-sm font-medium">₹{order.totalPrice}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 uppercase font-semibold">Order #</p>
                     <p className="text-sm font-medium">{order._id.substring(order._id.length - 8)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    {order.orderItems.map((item, idx) => (
                       <div key={idx} className="flex gap-4">
                         <img src={item.image || '/placeholder.png'} alt={item.name} className="w-16 h-16 rounded object-cover border" />
                         <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.qty} | Price: ₹{item.price}</p>
                         </div>
                       </div>
                    ))}
                  </div>
                  
                  <div className="md:w-64 border-l pl-6 space-y-4">
                     <div>
                       <p className="text-xs font-semibold text-gray-500 uppercase">Payment Info</p>
                       <p className="text-sm font-medium mt-1">{order.paymentMethod}</p>
                       <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                         {order.paymentStatus}
                       </span>
                     </div>
                     
                     {order.paymentMethod === 'UPI' && ['Pending', 'Payment Pending Verification'].includes(order.paymentStatus) && (
                       <div className="space-y-3 pt-2">
                         {!order.hasUserMarkedPaid ? (
                           <>
                             <Link to={`/payment/${order._id}`} className="block w-full text-center bg-brand text-white py-2 rounded text-sm font-bold shadow hover:bg-brand-dark transition">
                               Complete Payment
                             </Link>
                             <button
                               disabled={updatingOrderId === order._id || order.hasUserMarkedPaid}
                               onClick={() => handleMarkPaid(order._id)}
                               className="block w-full text-center bg-gray-100 disabled:opacity-50 text-gray-700 py-2 rounded text-sm font-bold shadow hover:bg-gray-200 transition"
                             >
                               {updatingOrderId === order._id ? 'Processing...' : 'I Have Paid'}
                             </button>
                           </>
                         ) : (
                           <div className="text-center animate-fade-in">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">After payment, please send screenshot on WhatsApp for confirmation</p>
                              <button 
                                onClick={() => {
                                  const message = `Hi, I have paid ₹${order.totalPrice} for Order ID ${order._id}. Please confirm my order.`;
                                  const whatsappUrl = `https://wa.me/919910850024?text=${encodeURIComponent(message)}`;
                                  window.open(whatsappUrl, "_blank");
                                }}
                                className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-md transition"
                              >
                                Send Screenshot on WhatsApp
                              </button>
                           </div>
                         )}
                       </div>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
