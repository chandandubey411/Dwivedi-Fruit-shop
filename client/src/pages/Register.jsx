import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

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
      toast.success('Registration successful');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input required type="text" className="mt-1 block w-full px-3 py-2 border rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input required type="text" className="mt-1 block w-full px-3 py-2 border rounded-md" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input required type="password" className="mt-1 block w-full px-3 py-2 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-brand text-white py-2 rounded-md hover:bg-brand-dark transition font-semibold">Register</button>
      </form>
      <div className="mt-4 text-center">
        Already have an account? <a href={`/login?redirect=${redirect}`} className="text-brand font-medium">Log in</a>
      </div>
    </div>
  );
};

export default Register;
