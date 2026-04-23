import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchAuthParams = async () => {
      try {
        const { data: orderData } = await api.get(`/orders/${orderId}`);
        setOrder(orderData);
        if (orderData.paymentMethod !== 'UPI' || orderData.paymentStatus !== 'Pending') {
          navigate('/dashboard'); // Only show this page if payment is required via UPI
        }

        const { data: settingsData } = await api.get('/settings');
        setSettings(settingsData);
      } catch (error) {
        toast.error('Error fetching details');
      }
    };
    fetchAuthParams();
  }, [orderId, navigate]);

  const handlePaymentConfirm = async () => {
    try {
      setIsUpdating(true);
      await api.put(`/orders/${orderId}/payment`);
      toast.success('Payment confirmation sent. We will verify your payment soon.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error updating payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order || !settings) return <div className="text-center mt-20 animate-pulse text-xl text-gray-500">Loading Payment Details...</div>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg border text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
      <p className="text-gray-500 mb-6">Scan the QR code below or use the UPI ID to pay</p>
      
      <div className="bg-brand-light border border-brand p-4 rounded-lg mb-6">
        <p className="text-sm text-brand-dark mb-1">Exact Amount Payable</p>
        <p className="text-4xl font-extrabold text-brand-dark">₹{order.totalPrice}</p>
      </div>

      <div className="flex justify-center mb-6">
        <img src={settings.qrImageUrl} alt="UPI QR Code" className="w-48 h-48 border-2 border-gray-100 rounded-xl" />
      </div>

      <div className="bg-gray-50 py-3 px-4 rounded-md border text-left flex justify-between mb-8 items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">UPI ID</p>
          <p className="font-semibold text-gray-800">{settings.upiId}</p>
        </div>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(settings.upiId);
            toast.success('UPI ID copied!');
          }}
          className="text-brand text-sm font-semibold hover:underline"
        >
          Copy
        </button>
      </div>

      <button 
        disabled={isUpdating}
        onClick={handlePaymentConfirm}
        className="w-full bg-brand hover:bg-brand-dark disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition shadow-md text-lg"
      >
        {isUpdating ? 'Updating...' : 'I have paid'}
      </button>
      <p className="text-xs text-gray-400 mt-4 text-center px-4">
        Clicking this button implies you have completed the transaction. Falsely confirming may lead to account ban.
      </p>
    </div>
  );
};

export default Payment;
