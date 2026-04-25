import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShoppingBag, Filter, X } from 'lucide-react';

const FilterForm = ({ filters, setFilters }) => {
  const categories = ['All', 'Fruits', 'Exotic', 'Seasonal'];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-premium border border-slate-100 space-y-10">
      {/* Type Filter */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-primary text-sm uppercase tracking-widest">Collection</h3>
        <div className="grid grid-cols-1 gap-2">
           {['All', 'single', 'basket'].map(type => (
             <button 
               key={type}
               onClick={() => setFilters({...filters, type})} 
               className={`w-full py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 text-left capitalize ${filters.type === type ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-slate-50 text-text-muted hover:bg-slate-100'}`}
             >
               {type === 'single' ? 'Individual Fruits' : type === 'basket' ? 'Curated Baskets' : 'All Products'}
             </button>
           ))}
        </div>
      </div>

      <div className="h-px bg-slate-100"></div>

      {/* Category */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-primary text-sm uppercase tracking-widest">Categories</h3>
        <div className="space-y-3">
          {categories.map(cat => (
             <label key={cat} className="flex items-center gap-3 cursor-pointer group">
               <div className="relative flex items-center justify-center">
                 <input 
                   type="radio" 
                   name="category" 
                   checked={filters.category === cat} 
                   onChange={() => setFilters({...filters, category: cat})} 
                   className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-accent transition-all duration-300 cursor-pointer" 
                 />
                 <div className="absolute w-2.5 h-2.5 bg-accent rounded-full scale-0 peer-checked:scale-100 transition-transform duration-300 pointer-events-none"></div>
               </div>
               <span className={`text-sm font-semibold transition-colors duration-300 ${filters.category === cat ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`}>{cat}</span>
             </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100"></div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-primary text-sm uppercase tracking-widest">Price Range</h3>
        <div className="flex items-center gap-3">
           <div className="relative flex-1">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
             <input 
               type="number" 
               min="0" 
               placeholder="Min" 
               value={filters.minPrice} 
               onChange={e => setFilters({...filters, minPrice: e.target.value})} 
               className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 font-bold transition-all" 
             />
           </div>
           <div className="w-2 h-px bg-slate-200"></div>
           <div className="relative flex-1">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
             <input 
               type="number" 
               min="0" 
               placeholder="Max" 
               value={filters.maxPrice} 
               onChange={e => setFilters({...filters, maxPrice: e.target.value})} 
               className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 font-bold transition-all" 
             />
           </div>
        </div>
      </div>

      <div className="h-px bg-slate-100"></div>

      {/* Sort */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-primary text-sm uppercase tracking-widest">Sort By</h3>
        <select 
          value={filters.sort} 
          onChange={e => setFilters({...filters, sort: e.target.value})} 
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 font-bold text-primary cursor-pointer appearance-none transition-all"
        >
           <option value="newest">Newly Added</option>
           <option value="price_asc">Price: Low to High</option>
           <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      
      {/* Reset */}
      <button 
         onClick={() => setFilters({ type: 'All', category: 'All', minPrice: '', maxPrice: '', sort: 'newest', inStock: false })}
         className="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors duration-300"
      >
        Clear All Filters
      </button>

    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const getInitialFilters = () => {
    const urlParams = new URLSearchParams(location.search);
    return {
      type: urlParams.get('type') || 'All',
      category: urlParams.get('category') || 'All',
      minPrice: urlParams.get('minPrice') || '',
      maxPrice: urlParams.get('maxPrice') || '',
      sort: urlParams.get('sort') || 'newest',
      inStock: urlParams.get('inStock') === 'true'
    };
  };

  const [filters, setFilters] = useState(getInitialFilters());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const queryCat = new URLSearchParams(location.search).get('category') || 'All';
    if(queryCat !== filters.category) {
       setFilters(prev => ({...prev, category: queryCat}));
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.type && filters.type !== 'All') params.append('type', filters.type);
        if (filters.category && filters.category !== 'All') params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort !== 'newest') params.append('sort', filters.sort);
        if (filters.inStock) params.append('inStock', 'true');
        
        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data);
        
        navigate(`/products?${params.toString()}`, { replace: true });
      } catch (error) {
        console.error('Failed querying product matrix', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return (
    <div className="bg-bg-main min-h-screen pb-24">
       
       <div className="pt-16 pb-12">
         <div className="container-custom">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary tracking-tight">Our Collection</h1>
            <p className="text-text-muted mt-4 font-medium text-lg max-w-2xl">Discover the freshest picks from our organic farms. Handpicked daily for your well-being.</p>
         </div>
       </div>

       <div className="container-custom">
         <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block w-80 shrink-0">
               <div className="sticky top-28">
                  <FilterForm filters={filters} setFilters={setFilters} />
               </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex justify-between items-center bg-white p-6 rounded-3xl shadow-premium border border-slate-100 mb-8">
               <span className="font-bold text-primary">Found {products.length} products</span>
               <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-accent/20">
                 <Filter className="w-5 h-5"/> Filters
               </button>
            </div>

            {/* Main Product Grid */}
            <div className="flex-1">
               {isLoading ? (
                 <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
               ) : products.length === 0 ? (
                 <div className="bg-white p-20 text-center rounded-[3rem] border border-slate-100 shadow-premium">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                       <Filter className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-primary mb-3">No matches found</h3>
                    <p className="text-text-muted font-medium mb-8">Try adjusting your filters to find what you're looking for.</p>
                    <button 
                      onClick={() => setFilters({ type: 'All', category: 'All', minPrice: '', maxPrice: '', sort: 'newest', inStock: false })}
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105"
                    >
                      Clear All Filters
                    </button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                   {products.map(product => (
                     <div key={product._id} className="group bg-white rounded-[2.5rem] p-5 shadow-premium border border-slate-100 hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                       <Link to={`/product/${product._id}`} className="block relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                          {product.tags?.includes('Best Seller') && (
                            <span className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-accent shadow-sm">Best Seller</span>
                          )}
                          <img 
                            src={product.images?.[0] || '/placeholder.png'} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                       </Link>
                       
                       <div className="px-2 flex flex-col flex-grow">
                         <div className="flex justify-between items-start mb-2 gap-4">
                           <Link to={`/product/${product._id}`} className="text-xl font-display font-bold text-primary hover:text-accent transition-colors duration-300">{product.name}</Link>
                           <span className="text-xl font-display font-bold text-primary">₹{product.price}</span>
                         </div>
                         
                         <p className="text-text-muted text-sm mb-8 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
                         
                         <div className="mt-auto flex items-center justify-between gap-4">
                           <div className="flex flex-col">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                               {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                             </span>
                           </div>
                           
                           <button 
                             disabled={product.countInStock === 0}
                             onClick={() => addToCart(product, 1)}
                             className="bg-accent hover:bg-accent-dark disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-lg shadow-accent/20 transition-all duration-300 hover:scale-110 active:scale-95"
                           >
                             <ShoppingBag className="w-5 h-5" />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
         </div>
       </div>

       {/* Mobile Filter Drawer */}
       <AnimatePresence>
         {isMobileFiltersOpen && (
           <div className="fixed inset-0 z-[100] lg:hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-primary/40 backdrop-blur-sm" 
                onClick={() => setIsMobileFiltersOpen(false)}
              ></motion.div>
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative ml-auto w-[85%] max-w-sm bg-bg-main h-full shadow-2xl p-8 overflow-y-auto flex flex-col"
              >
                 <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                   <h2 className="text-2xl font-display font-bold text-primary">Filters</h2>
                   <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <X className="w-6 h-6"/>
                   </button>
                 </div>
                 
                 <div className="flex-grow">
                    <FilterForm filters={filters} setFilters={setFilters} />
                 </div>
                 
                 <div className="mt-10">
                    <button 
                      onClick={() => setIsMobileFiltersOpen(false)} 
                      className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20"
                    >
                      Show Results
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>

    </div>
  );
};;
};

export default Products;
