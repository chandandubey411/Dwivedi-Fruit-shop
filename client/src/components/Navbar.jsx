import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const navLinks = [
    { name: 'Shop Fruits', path: '/products' },
    { name: 'Categories', path: '/products?category=Fruits' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300 border-b border-slate-200/50">
      <div className="container-custom">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all duration-300">
               <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-primary">
              Dwivedi<span className="text-accent">Fruits</span>
            </span>
          </Link>
          
          {/* Desktop Right Nav */}
          <div className="hidden md:flex gap-10 items-center">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-sm font-semibold text-text-muted hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-6">
              <Link to="/cart" className="relative p-2 text-text-muted hover:text-accent transition-all duration-300 hover:scale-110">
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartItems.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-accent rounded-full shadow-lg border-2 border-white"
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-semibold text-primary transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                      <UserIcon className="w-3.5 h-3.5"/> 
                    </div>
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-primary hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative p-2 text-text-muted hover:text-accent">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-accent rounded-full shadow-md border-2 border-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 text-text-muted hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
             <div className="container-custom py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block text-lg font-semibold text-primary py-2"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-100">
                  {user ? (
                    <div className="space-y-4">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="flex items-center gap-3 text-lg font-semibold text-primary"
                      >
                        <UserIcon className="w-6 h-6 text-accent"/> Account Settings
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left text-lg font-semibold text-red-500 flex items-center gap-3"
                      >
                        <LogOut className="w-6 h-6"/> Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="block w-full text-center bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
