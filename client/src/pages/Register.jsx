import { User, Phone, Lock, ArrowRight, Fruit } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, phone, password });
      login(data);
      toast.success('Registration successful!', {
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 p-10 md:p-12 overflow-hidden">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <Fruit className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-primary tracking-tight">Create Account</h1>
            <p className="text-text-muted mt-2 font-medium">Join the Dwivedi Fruits family today</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary ml-1">Full Name</label>
              <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors">
                    <User className="w-5 h-5" />
                 </div>
                 <input 
                   required 
                   type="text" 
                   placeholder="Enter your full name"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" 
                   value={name} 
                   onChange={(e) => setName(e.target.value)} 
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary ml-1">Phone Number</label>
              <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors">
                    <Phone className="w-5 h-5" />
                 </div>
                 <input 
                   required 
                   type="text" 
                   placeholder="Enter your phone"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" 
                   value={phone} 
                   onChange={(e) => setPhone(e.target.value)} 
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary ml-1">Password</label>
              <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors">
                    <Lock className="w-5 h-5" />
                 </div>
                 <input 
                   required 
                   type="password" 
                   placeholder="••••••••"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
                 />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Sign Up
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-text-muted">
              Already have an account? {' '}
              <Link to={`/login?redirect=${redirect}`} className="text-accent font-bold hover:underline decoration-2 underline-offset-4">Log in</Link>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Secure Registration Powered by Dwivedi Fruits
        </p>
      </div>
    </div>
  );
};

export default Register;
