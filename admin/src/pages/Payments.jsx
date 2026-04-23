import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVerifications = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      // Filter exactly for UX requirement: Payment Verification Pending
      setOrders(data.filter(o => 
         o.paymentMethod === 'UPI' && 
         (o.isUPIVerificationPending === true || o.paymentStatus === 'Payment Pending Verification')
      ));
    } catch (error) {
      toast.error('Failed to load payment queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleVerify = async (id, action) => {
    try {
      const newStatus = action === 'approve' ? 'Confirmed' : 'Failed';
      await api.put(`/admin/orders/${id}/payment`, { paymentStatus: newStatus });
      toast.success(`Payment ${action === 'approve' ? 'Confirmed' : 'Rejected'}`);
      fetchVerifications();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading API queue...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-red-100 text-red-600 p-2 rounded-lg">UPI Verifications</span>
      </h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border text-center text-gray-500">
          No payments pending manual verification.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-l-red-500 hover:shadow-md transition">
              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">Order: {o._id}</p>
                <div className="flex gap-4 mb-2">
                  <span className="font-bold text-gray-800">{o.user?.name}</span>
                  <span className="text-gray-500">{o.user?.phone}</span>
                </div>
                <div className="text-2xl font-black text-brand-dark">₹{o.totalPrice}</div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleVerify(o._id, 'approve')}
                  className="flex items-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-bold rounded-lg border border-green-200 transition"
                >
                  <CheckCircle className="w-5 h-5"/> Confirm Payment
                </button>
                <button 
                  onClick={() => handleVerify(o._id, 'reject')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-bold rounded-lg border transition"
                >
                  <XCircle className="w-5 h-5"/> Reject (Reset)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
