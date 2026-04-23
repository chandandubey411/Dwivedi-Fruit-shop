import { useContext } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { LayoutDashboard, ShoppingCart, CreditCard, Apple, Users, Settings, LogOut } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Layout = () => {
  const { admin, logout } = useContext(AdminAuthContext);

  if (!admin) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-black text-brand-dark flex items-center gap-2">
            <img src="/logo.png" alt="Diwedi Fruit Shop Logo" className="h-10 object-contain" /> 
            <span className="text-lg text-gray-400 font-medium">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="/orders" icon={ShoppingCart} label="Orders" />
          <SidebarLink to="/payments" icon={CreditCard} label="Payments API" />
          <SidebarLink to="/products" icon={Apple} label="Products" />
          <SidebarLink to="/customers" icon={Users} label="Customers" />
          <SidebarLink to="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-light text-brand-dark flex items-center justify-center font-bold text-lg">
              A
            </div>
            <div className="text-sm font-semibold truncate text-gray-800">{admin.email}</div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition font-medium"
          >
            <LogOut className="w-4 h-4"/> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden bg-white p-4 border-b flex justify-between items-center shadow-sm">
           <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
             <img src="/logo.png" alt="Logo" className="h-8 object-contain" /> 
           </h2>
           <button onClick={logout} className="text-red-500"><LogOut /></button>
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
