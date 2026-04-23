import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingCart, DollarSign, Package, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
    <div className={`p-4 rounded-full ${color}`}>
      <Icon className="w-8 h-8"/>
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase">{title}</p>
      <h3 className="text-2xl font-black text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400 font-medium">Loading Dashboard Data...</div>;

  const { cards, dailyData } = data || { cards: {}, dailyData: [] };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        <StatCard title="Total Revenue" value={`₹${cards.totalRevenue || 0}`} icon={DollarSign} color="bg-green-100 text-green-600" />
        <StatCard title="Total Orders" value={cards.totalOrders} icon={ShoppingCart} color="bg-blue-100 text-blue-600" />
        <StatCard title="Pending Verifications" value={cards.verificationPendingOrders} icon={AlertTriangle} color="bg-red-100 text-red-600" />
        <StatCard title="Pending Logistics" value={cards.pendingOrders} icon={Clock} color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Delivered" value={cards.deliveredOrders} icon={Package} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Daily Revenue Trends (Last 30 Orders mapped)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={dailyData}>
              <XAxis dataKey="date" stroke="#8884d8" />
              <YAxis />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
