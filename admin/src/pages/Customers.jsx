import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { UserCircle, Eye, X, Copy, ShoppingBag } from 'lucide-react';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied');
  };

  const handleViewCustomer = async (userId) => {
    setModalLoading(true);
    setSelectedUser({ _id: userId }); // Open modal skeleton
    try {
      const { data } = await api.get(`/admin/customer/${userId}`);
      setSelectedUser(data.user);
      setUserOrders(data.orders);
    } catch (error) {
      toast.error('Failed to fetch full profile');
      setSelectedUser(null);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Fetching Client Data...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <UserCircle className="w-6 h-6 text-brand"/> Registered Customers
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
           <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Phone</th>
              <th className="p-4 font-semibold text-gray-600">Saved Addresses</th>
              <th className="p-4 font-semibold text-gray-600">Joined</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                 <td className="p-4 font-mono text-xs text-gray-500">{u._id}</td>
                 <td className="p-4 font-bold text-gray-800">{u.name} {u.isAdmin && <span className="ml-2 text-xs bg-brand text-white px-2 py-0.5 rounded-full">ADMIN</span>}</td>
                 <td className="p-4 text-gray-600">{u.phone}</td>
                 <td className="p-4 text-gray-600">{u.addresses?.length || 0}</td>
                 <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                 <td className="p-4">
                    <button 
                      onClick={() => handleViewCustomer(u._id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="View Full Profile"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Full Data Modal Overlay */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col h-[85vh]">
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex justify-center items-center font-bold text-lg">
                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '?'}
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedUser.name || 'Loading...'}</h2>
                    <p className="text-sm text-gray-500">{selectedUser.phone} {selectedUser.isAdmin ? '(Admin)' : ''}</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1 relative">
               {modalLoading && (
                 <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                    <span className="animate-pulse font-medium text-brand">Fetching deep records...</span>
                 </div>
               )}
               
               <div className="grid md:grid-cols-2 gap-6 relative z-0">
                  {/* Left Col: Addresses */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-gray-800 border-b pb-2">Saved Addresses ({selectedUser.addresses?.length || 0})</h3>
                     {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                        <div className="space-y-3">
                           {selectedUser.addresses.map((a, i) => (
                              <div key={i} className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-start">
                                 <p className="text-sm text-gray-700">
                                   <span className="block font-medium mb-1">Address {i + 1}</span>
                                   {a.street}<br/>
                                   {a.city}, {a.state} - {a.zip}
                                 </p>
                                 <button onClick={() => handleCopy(`${a.street}, ${a.city}, ${a.state} - ${a.zip}`)} className="text-gray-400 hover:text-blue-600">
                                    <Copy className="w-4 h-4" />
                                 </button>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-sm text-gray-500 bg-white p-4 rounded border text-center">No addresses saved yet.</div>
                     )}
                  </div>

                  {/* Right Col: Orders History */}
                  <div className="space-y-4">
                     <div className="flex justify-between items-end border-b pb-2">
                        <h3 className="font-bold text-gray-800">Order History</h3>
                        <span className="text-xs font-semibold bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                           {userOrders.length} Orders
                        </span>
                     </div>
                     
                     {userOrders && userOrders.length > 0 ? (
                        <div className="space-y-3">
                           {userOrders.map(order => (
                              <div key={order._id} className="bg-white p-3 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                     <div className="text-xs font-mono text-gray-500">{order._id.slice(-6)}</div>
                                     <div className="font-bold text-gray-800">₹{order.totalPrice}</div>
                                  </div>
                                  <div className="text-right">
                                     <div className="text-xs text-gray-500 mb-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                     <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 flex rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.orderStatus}
                                     </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2 border-t pt-2">
                                   <ShoppingBag className="w-3 h-3" /> {order.orderItems.length} items • {order.paymentMethod}
                                </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-sm text-gray-500 bg-white p-4 rounded border text-center">No previous orders.</div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
