import { QrCode, Copy, ShieldCheck, CheckCircle2, Info, ArrowRight } from 'lucide-react';

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
          navigate('/dashboard'); 
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
      toast.success('Payment confirmation sent. We will verify your payment soon.', {
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error updating payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order || !settings) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );

  return (
    <div className="bg-bg-main min-h-screen flex items-center justify-center p-6 py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative">
        <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 p-10 md:p-14 overflow-hidden">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <QrCode className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-primary tracking-tight">Complete Payment</h1>
            <p className="text-text-muted mt-2 font-medium">Scan the QR code to finish your order</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100 text-center relative group">
             <div className="absolute top-4 right-4">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Amount Payable</p>
             <p className="text-5xl font-display font-bold text-primary tracking-tight">₹{order.totalPrice}</p>
          </div>

          <div className="flex justify-center mb-10 group">
             <div className="relative p-6 bg-white rounded-3xl shadow-xl border border-slate-100 transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                <img src={settings.qrImageUrl} alt="UPI QR Code" className="w-56 h-56 rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 border-2 border-accent/0 rounded-3xl group-hover:border-accent/10 transition-all"></div>
             </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">UPI ID</p>
                <p className="text-sm font-bold text-primary">{settings.upiId}</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(settings.upiId);
                  toast.success('UPI ID copied!');
                }}
                className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all active:scale-90"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
               <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase tracking-wider">Please ensure the amount is correct before making the payment.</p>
            </div>
          </div>

          <button 
            disabled={isUpdating}
            onClick={handlePaymentConfirm}
            className="w-full bg-primary hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 group"
          >
            {isUpdating ? 'Verifying...' : (
              <>
                I Have Paid
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <p className="text-[10px] font-black text-slate-400 mt-8 text-center uppercase tracking-widest leading-relaxed px-4">
            Security verification active. Your transaction is monitored for safety.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Payment</span>
           </div>
           <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
           <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Buyer Protected</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
