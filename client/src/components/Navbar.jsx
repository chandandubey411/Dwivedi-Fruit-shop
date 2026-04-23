import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section - Truncates on small screens */}
          <Link to="/" className="text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2 overflow-hidden shrink min-w-0 mr-2">
            <img src="/logo.png" alt="Diwedi Fruit Shop Logo" className="h-8 md:h-10 w-auto shrink-0" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] md:max-w-none">
              Diwedi Fruit Shop
            </span>
          </Link>
          
          {/* Desktop Right Nav (hidden on mobile -> < 768px) */}
          <div className="hidden md:flex gap-6 items-center shrink-0">
            <Link to="/products" className="text-gray-600 hover:text-brand-dark font-medium">Shop</Link>
            
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-dark">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-brand-dark flex items-center gap-1 max-w-[150px] overflow-hidden">
                  <UserIcon className="w-5 h-5 shrink-0"/> 
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg font-bold transition shadow-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Right Icons (Cart + Hamburger -> visible < 768px) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-dark">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-gray-600 hover:text-brand-dark p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full min-h-screen bg-white shadow-xl z-40 border-t border-gray-100 flex flex-col p-6 space-y-6">
           <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-800 hover:text-brand">Shop Fruits</Link>
           {user ? (
             <>
               <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-800 hover:text-brand flex items-center gap-2">
                 <UserIcon className="w-6 h-6"/> Account Dashboard
               </Link>
               <button onClick={handleLogout} className="text-left text-xl font-bold text-red-600 hover:text-red-800 flex items-center gap-2">
                 <LogOut className="w-6 h-6"/> Sign Out ({user.name})
               </button>
             </>
           ) : (
             <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-brand text-white py-4 rounded-xl font-black text-lg shadow-md">
               Login / Register
             </Link>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
