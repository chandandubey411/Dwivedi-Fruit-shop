import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShoppingBag, Filter, X } from 'lucide-react';

const FilterForm = ({ filters, setFilters }) => {
  const categories = ['All', 'Fruits', 'Exotic', 'Seasonal'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      {/* Type Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Product Type</h3>
        <div className="flex bg-gray-100 p-1 rounded-lg">
           <button onClick={() => setFilters({...filters, type: 'All'})} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${filters.type === 'All' ? 'bg-white shadow-sm text-brand' : 'text-gray-500 hover:text-gray-900'}`}>All</button>
           <button onClick={() => setFilters({...filters, type: 'single'})} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${filters.type === 'single' ? 'bg-white shadow-sm text-brand' : 'text-gray-500 hover:text-gray-900'}`}>Singles</button>
           <button onClick={() => setFilters({...filters, type: 'basket'})} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${filters.type === 'basket' ? 'bg-white shadow-sm text-brand' : 'text-gray-500 hover:text-gray-900'}`}>Baskets</button>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* Category */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Categories</h3>
        <div className="space-y-3">
          {categories.map(cat => (
             <label key={cat} className="flex items-center gap-3 cursor-pointer group">
               <input type="radio" name="category" checked={filters.category === cat} onChange={() => setFilters({...filters, category: cat})} className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand accent-brand cursor-pointer" />
               <span className={`font-medium transition ${filters.category === cat ? 'text-brand font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat}</span>
             </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Range (₹)</h3>
        <div className="flex items-center gap-2">
           <input type="number" min="0" placeholder="Min" value={filters.minPrice} onChange={e => {
              const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value));
              setFilters({...filters, minPrice: val});
           }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand font-medium" />
           <span className="text-gray-400 font-bold">-</span>
           <input type="number" min="0" placeholder="Max" value={filters.maxPrice} onChange={e => {
              const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value));
              setFilters({...filters, maxPrice: val});
           }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand font-medium" />
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* Availability */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer">
           <input type="checkbox" checked={filters.inStock} onChange={e => setFilters({...filters, inStock: e.target.checked})} className="w-4 h-4 rounded text-brand focus:ring-brand accent-brand cursor-pointer" />
           <span className="text-gray-600 font-medium">In Stock Only</span>
        </label>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* Sort */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Sort Rules</h3>
        <select value={filters.sort} onChange={e => setFilters({...filters, sort: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 font-bold text-gray-700 cursor-pointer shadow-sm">
           <option value="newest">Newly Added</option>
           <option value="price_asc">Price: Low to High</option>
           <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      
      {/* Reset */}
      <button 
         onClick={() => setFilters({ type: 'All', category: 'All', minPrice: '', maxPrice: '', sort: 'newest', inStock: false })}
         className="w-full py-3 text-red-600 hover:bg-red-50 bg-white border border-red-200 font-bold rounded-lg transition"
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
  
  // Track parameters safely across react-router DOM
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

  // Sync state if routing happens externally (like clicking a banner on the homepage)
  useEffect(() => {
    const queryCat = new URLSearchParams(location.search).get('category') || 'All';
    if(queryCat !== filters.category) {
       setFilters(prev => ({...prev, category: queryCat}));
    }
    // eslint-disable-next-line
  }, [location.search]);

  // Master Fetch logic tracking Filter state array strictly
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
    // eslint-disable-next-line
  }, [filters]);

  return (
    <div className="bg-gray-50 min-h-[90vh] pb-20">
       
       <div className="bg-white shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)] border-b border-gray-100 z-10 relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">The Catalog</h1>
            <p className="text-gray-500 mt-3 font-medium text-lg">Browse our freshly picked selection of organics</p>
         </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
         <div className="flex flex-col md:flex-row gap-8">
            
            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
               <span className="font-bold text-gray-700">Displaying <span className="text-brand">{products.length}</span> results</span>
               <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold shadow-sm">
                 <Filter className="w-5 h-5"/> Filters
               </button>
            </div>

            {/* Sidebar (Desktop w-64) */}
            <div className="hidden md:block w-72 shrink-0">
               <div className="sticky top-24">
                  <FilterForm filters={filters} setFilters={setFilters} />
               </div>
            </div>

            {/* Main Product Grid (Flex-1) */}
            <div className="flex-1">
               <div className="justify-between items-center mb-8 hidden md:flex bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 font-medium tracking-wide">Showing <b>{products.length}</b> product(s) matching your criteria</p>
               </div>

               {isLoading ? (
                 <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div></div>
               ) : products.length === 0 ? (
                 <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 mt-4 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Filter className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No matching products</h3>
                    <p className="text-gray-500">Try loosening your filter metrics or clear all rules.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                   {products.map(product => {
                     const displayImage = product.images?.length > 0 ? product.images[0] : '/placeholder.png';
                     return (
                     <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition duration-300 group">
                       <Link to={`/product/${product._id}`} className="block overflow-hidden relative">
                          {product.tags?.includes('Best Seller') && <span className="absolute top-4 right-4 z-10 bg-yellow-400 text-yellow-900 px-3 py-1 lg:py-0.5 bg-opacity-90 backdrop-blur rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase">Best Seller</span>}
                          {product.tags?.includes('Festival Special') && <span className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 lg:py-0.5 bg-opacity-90 backdrop-blur rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase">Special</span>}
                          <img src={displayImage} alt={product.name} className="w-full h-56 object-cover group-hover:scale-110 transition duration-500" />
                          <div className="absolute top-4 left-4">
                             <span className="bg-white/90 backdrop-blur shadow-sm text-brand-dark px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
                          </div>
                       </Link>
                       <div className="p-6 flex flex-col flex-grow">
                         <Link to={`/product/${product._id}`} className="text-xl font-bold text-gray-900 group-hover:text-brand transition mb-2">{product.name}</Link>
                         <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{product.description}</p>
                         
                         <div className="flex items-center justify-between mt-auto">
                           <div className="flex flex-col">
                             <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                             <span className={`text-xs font-bold mt-1 ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                               {product.countInStock > 0 ? `In Stock: ${product.countInStock}` : 'Out of Stock'}
                             </span>
                           </div>
                           
                           <button 
                             disabled={product.countInStock === 0}
                             onClick={() => addToCart(product, 1)}
                             className="bg-brand hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white p-3.5 rounded-xl shadow-sm transition hover:-translate-y-1"
                           >
                             <ShoppingBag className="w-5 h-5" />
                           </button>
                         </div>
                       </div>
                     </div>
                   )})}
                 </div>
               )}
            </div>
         </div>
       </div>

       {/* Mobile Drawer */}
       {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-[100] flex md:hidden">
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)}></div>
             <div className="relative w-[85%] max-w-sm bg-gray-50 h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Filters</h2>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="bg-white border shadow-sm p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition">
                     <X className="w-5 h-5"/>
                  </button>
                </div>
                
                <div className="flex-grow">
                   <FilterForm filters={filters} setFilters={setFilters} />
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-200 pb-8">
                   <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-xl font-black shadow-lg transition">
                     Show {products.length} Results
                   </button>
                </div>
             </div>
          </div>
       )}

    </div>
  );
};

export default Products;
