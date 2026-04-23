import { useState, useContext, useEffect } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, admin } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) navigate('/');
  }, [admin, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/login', { email, password });
      login(data);
      toast.success('Admin Authenticated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border">
        <h1 className="text-3xl font-black text-center text-brand-dark flex items-center justify-center gap-2 mb-8">
          🍎 Admin Panel
        </h1>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input required type="email" placeholder="admin@diwedi.com" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input required type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-brand text-white py-3 rounded-lg hover:bg-brand-dark transition font-bold shadow-lg mt-4">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
