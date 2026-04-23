import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Leaf, Truck, Tag, ChevronRight } from 'lucide-react';

// Swiper setup
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Best Fruit Shop in Janakpuri',
    subtitle: 'Fresh, organic & premium fruits delivered to your doorstep',
    buttonText: 'Shop Now',
    action: '/products'
  },
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Freshness You Can Trust',
    subtitle: 'Handpicked fruits with best quality & taste',
    buttonText: 'Explore Fruits',
    action: '/products'
  },
  {
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Fast Home Delivery',
    subtitle: 'Get fruits delivered in Janakpuri & nearby areas',
    buttonText: 'Order Now',
    action: 'scroll'
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [baskets, setBaskets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, basketsRes] = await Promise.all([
           api.get('/products?type=single'),
           api.get('/products?type=basket')
        ]);
        setProducts(productsRes.data.slice(0, 3)); // show top 3 single products
        setBaskets(basketsRes.data.slice(0, 3)); // show top 3 baskets
      } catch (error) {
        console.error('Failed fetching payload', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section Carousel */}
      <section className="w-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full h-[50vh] md:h-[65vh]"
          loop={true}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div 
                className="w-full h-full bg-cover bg-center relative flex items-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
                
                {/* Slide Text Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left">
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto md:mx-0 drop-shadow-md font-medium">
                    {slide.subtitle}
                  </p>
                  
                  {slide.action === 'scroll' ? (
                     <button 
                       onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}
                       className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-full text-lg font-bold transition shadow-xl hover:-translate-y-1 inline-block"
                     >
                       {slide.buttonText}
                     </button>
                  ) : (
                     <Link 
                       to={slide.action} 
                       className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-full text-lg font-bold transition shadow-xl hover:-translate-y-1 inline-block"
                     >
                       {slide.buttonText}
                     </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Shop By Category */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <div className="w-24 h-1.5 bg-brand mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Link to="/products?category=Fruits" className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 pointer-events-auto">
              <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80" alt="Fruits" className="w-full h-[300px] object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                 <h3 className="text-3xl font-black text-white mb-2 transform group-hover:-translate-y-2 transition duration-300">Daily Fruits</h3>
                 <span className="text-brand-light font-bold flex items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:-translate-y-2 transition duration-300">Shop Collection <ChevronRight className="w-5 h-5 ml-1"/></span>
              </div>
            </Link>
            
            <Link to="/products?category=Exotic" className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 pointer-events-auto">
              <img src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80" alt="Exotic Fruits" className="w-full h-[300px] object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                 <h3 className="text-3xl font-black text-white mb-2 transform group-hover:-translate-y-2 transition duration-300">Exotic Fruits</h3>
                 <span className="text-brand-light font-bold flex items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:-translate-y-2 transition duration-300">Shop Collection <ChevronRight className="w-5 h-5 ml-1"/></span>
              </div>
            </Link>
            
            <Link to="/products?category=Seasonal" className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 pointer-events-auto">
              <img src="https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=80" alt="Seasonal Fruits" className="w-full h-[300px] object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                 <h3 className="text-3xl font-black text-white mb-2 transform group-hover:-translate-y-2 transition duration-300">Seasonal Picks</h3>
                 <span className="text-brand-light font-bold flex items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:-translate-y-2 transition duration-300">Shop Collection <ChevronRight className="w-5 h-5 ml-1"/></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Fruit Baskets */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
             <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">🎁 Pre-Made Fruit Baskets</h2>
             <p className="text-gray-500 font-medium">Perfect for gifting, festivals, and health bundles.</p>
          </div>
          <Link to="/products?type=basket" className="hidden sm:inline-flex items-center font-bold text-brand hover:text-brand-dark transition">
             View All Baskets <ChevronRight className="w-5 h-5 ml-1"/>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div></div>
        ) : baskets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {baskets.map(basket => {
              const displayImage = basket.images?.length > 0 ? basket.images[0] : '/placeholder.png';
              return (
              <div key={basket._id} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 border border-gray-100 group relative">
                <Link to={`/product/${basket._id}`} className="block overflow-hidden relative">
                   {basket.tags?.includes('Best Seller') && <span className="absolute top-4 left-4 z-10 bg-yellow-400 text-yellow-900 px-3 py-1 bg-opacity-90 backdrop-blur rounded-full text-xs font-black tracking-wider uppercase">Best Seller</span>}
                   {basket.tags?.includes('Festival Special') && <span className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 bg-opacity-90 backdrop-blur rounded-full text-xs font-black tracking-wider uppercase">Festival Special</span>}
                   <img src={displayImage} alt={basket.name} className="w-full h-64 object-cover group-hover:scale-105 transition duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </Link>
                <div className="p-8">
                  <Link to={`/product/${basket._id}`} className="text-2xl font-bold text-gray-900 hover:text-brand transition">{basket.name}</Link>
                  <p className="text-gray-500 mt-3 text-sm line-clamp-2 leading-relaxed font-medium">{basket.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
                    <span className="text-3xl font-black text-gray-900">₹{basket.price}</span>
                    <Link to={`/product/${basket._id}`} className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-full font-bold transition shadow-md hover:-translate-y-1">View Bundle</Link>
                  </div>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10 font-medium">Baskets are currently being prepared.</p>
        )}
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Featured Fresh Picks</h2>
        {isLoading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => {
              const displayImage = product.images?.length > 0 ? product.images[0] : '/placeholder.png';
              return (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <Link to={`/product/${product._id}`} className="block overflow-hidden">
                   <img src={displayImage} alt={product.name} className="w-full h-48 object-cover hover:scale-105 transition duration-300" />
                </Link>
                <div className="p-6">
                  <Link to={`/product/${product._id}`} className="text-xl font-bold text-gray-800 hover:text-brand transition">{product.name}</Link>
                  <p className="text-gray-500 mt-2 text-sm line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-dark">₹{product.price}</span>
                    <Link to={`/product/${product._id}`} className="text-brand hover:text-brand-dark font-semibold">View Details &rarr;</Link>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-brand-dark">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80')] bg-cover bg-center opacity-20 hover:scale-105 transition duration-[2000ms]"></div>
             <div className="relative z-10 py-16 px-8 md:px-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Best Fruit Shop in Janakpuri</h2>
                  <p className="text-lg md:text-xl text-brand-light/90 mb-10 lg:mb-0 font-medium leading-relaxed">Looking for farm-fresh, chemical-free fruits? We deliver premium quality produce handpicked daily from the best farms directly to your doorstep. Guaranteed freshness or your money back!</p>
                </div>
                <div className="shrink-0">
                  <Link to="/products" className="bg-white text-brand-dark hover:bg-brand-light hover:text-white border-2 border-white px-10 py-4 rounded-full text-xl font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 inline-block">
                     Shop The Collection
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <div className="w-24 h-1.5 bg-brand mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl text-center border border-gray-100 hover:-translate-y-2 transition duration-300 group">
               <div className="w-24 h-24 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 group-hover:bg-green-600 group-hover:text-white transition duration-300">
                 <Leaf className="w-12 h-12" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-4">Farm Fresh</h3>
               <p className="text-gray-500 font-medium leading-relaxed">100% organic and fresh fruits sourced directly from trusted farmers every morning.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl text-center border border-gray-100 hover:-translate-y-2 transition duration-300 group">
               <div className="w-24 h-24 mx-auto bg-blue-50 text-brand rounded-full flex items-center justify-center mb-8 group-hover:bg-brand group-hover:text-white transition duration-300">
                 <Truck className="w-12 h-12" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast Delivery</h3>
               <p className="text-gray-500 font-medium leading-relaxed">Lightning fast delivery across Janakpuri and surrounding locations right to your doorstep.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl text-center border border-gray-100 hover:-translate-y-2 transition duration-300 group">
               <div className="w-24 h-24 mx-auto bg-yellow-50 text-amber-500 rounded-full flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-white transition duration-300">
                 <Tag className="w-12 h-12" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Prices</h3>
               <p className="text-gray-500 font-medium leading-relaxed">Premium quality doesn't have to break the bank. Get the fairest market prices always.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
