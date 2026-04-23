import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Eye, Copy, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleCopyAddress = (address) => {
    const text = `${address.street}, ${address.city}, ${address.state} - ${address.zip}`;
    navigator.clipboard.writeText(text);
    toast.success('Address copied');
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-teal-100 text-teal-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading core system...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Logistics</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Order ID</th>
              <th className="p-4 font-semibold text-gray-600">Customer</th>
              <th className="p-4 font-semibold text-gray-600">Amount</th>
              <th className="p-4 font-semibold text-gray-600">Payment</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 pl-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-xs">{o._id}</td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{o.user?.name || 'Guest'}</div>
                  <div className="text-xs text-gray-500">{o.user?.phone}</div>
                </td>
                <td className="p-4 font-bold text-gray-800">₹{o.totalPrice}</td>
                <td className="p-4">
                  <div className="text-gray-800 font-semibold">
                    {o.paymentMethod === 'COD' ? (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-800 text-white">Cash on Delivery</span>
                    ) : (
                      o.paymentMethod
                    )}
                  </div>
                  <div className={`text-xs mt-1 ${o.paymentStatus.includes('Pending') ? 'text-yellow-600' : 'text-green-600'}`}>
                    {o.paymentStatus}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[o.orderStatus] || 'bg-gray-100'}`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {o.paymentMethod === 'COD' && o.orderStatus === 'Pending' ? (
                      <button 
                         onClick={() => handleStatusUpdate(o._id, 'Confirmed')}
                         className="bg-brand hover:bg-brand-dark text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                      >
                         Confirm Order
                      </button>
                    ) : (
                      <select 
                          value={o.orderStatus} 
                          onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                          className="border rounded p-1 text-sm bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Out for Delivery">Out</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer Info & Status */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="text-gray-500 mb-1">Customer</h3>
                  <div className="font-semibold text-gray-800">{selectedOrder.user?.name || 'Guest'}</div>
                  <div className="text-gray-600">{selectedOrder.user?.phone}</div>
                </div>
                <div>
                   <h3 className="text-gray-500 mb-1">Date</h3>
                   <div className="font-medium text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                   <div className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[selectedOrder.orderStatus]}`}>
                     {selectedOrder.orderStatus}
                   </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-blue-900">Shipping Address</h3>
                    <button 
                      onClick={() => handleCopyAddress(selectedOrder.shippingAddress)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium bg-white px-2 py-1 rounded shadow-sm border border-blue-200 transition"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedOrder.shippingAddress.street}<br/>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zip}
                  </p>
                </div>
              )}

              {/* Items List */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Purchased Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                       <span className="font-medium text-gray-700">{item.name} <span className="text-xs text-gray-500 ml-1">x{item.qty}</span></span>
                       <span className="font-bold text-gray-800">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2 text-gray-600">
                  <span>Items Price</span>
                  <span>₹{selectedOrder.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-sm mb-4 text-gray-600">
                  <span>Delivery Charge</span>
                  <span>₹{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pb-2 border-b">
                  <span>Total Paid</span>
                  <span>₹{selectedOrder.totalPrice}</span>
                </div>
                <div className="mt-3 flex gap-2 text-sm">
                  <span className="bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700">Via {selectedOrder.paymentMethod}</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${selectedOrder.paymentStatus.includes('Pending') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
