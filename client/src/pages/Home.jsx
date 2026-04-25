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

// Local Assets
import desktop1 from '../assets/images/desktop1.png';
import desktop2 from '../assets/images/desktop2.png';
import mobile1 from '../assets/images/mobile1.png';
import mobile2 from '../assets/images/mobile2.png';
import mobile3 from '../assets/images/mobile3.png';

const slides = [
  {
    desktopImage: desktop1,
    mobileImage: mobile1,
    title: 'Best Fruit Shop in Janakpuri',
    subtitle: 'Fresh, organic & premium fruits delivered to your doorstep',
    buttonText: 'Shop Now',
    action: '/products'
  },
  {
    desktopImage: desktop2,
    mobileImage: mobile2,
    title: 'Freshness You Can Trust',
    subtitle: 'Handpicked fruits with best quality & taste',
    buttonText: 'Explore Fruits',
    action: '/products'
  },
  {
    desktopImage: desktop1, // Fallback to desktop1 since desktop3 is missing
    mobileImage: mobile3,
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
        setProducts(productsRes.data.slice(0, 3)); 
        setBaskets(basketsRes.data.slice(0, 3)); 
      } catch (error) {
        console.error('Failed fetching payload', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="bg-bg-main overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-20 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-bold text-xs uppercase tracking-widest border border-accent/20">
                <Leaf className="w-4 h-4" />
                <span>100% Organic & Fresh</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-[1.1] tracking-tight">
                Freshness delivered <br/>
                <span className="text-accent">to your doorstep.</span>
              </h1>
              <p className="text-text-muted text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience the finest selection of handpicked fruits, delivered fresh within 24 hours. 
                Premium quality fruits for a healthier lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/products" className="bg-accent hover:bg-accent-dark text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 w-full sm:w-auto text-center">
                  Shop Now
                </Link>
                <Link to="/products?type=basket" className="bg-white hover:bg-slate-50 text-primary border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 w-full sm:w-auto text-center">
                  View Gift Baskets
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-8">
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-display font-bold text-primary">5k+</p>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Happy Clients</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-display font-bold text-primary">24h</p>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Fast Delivery</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-display font-bold text-primary">100%</p>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Organic</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-[120px] -z-10"></div>
               <img 
                 src={desktop1} 
                 alt="Premium Fruits" 
                 className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl"
               />
               <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-premium border border-slate-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                       <Leaf className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary">Natural Freshness</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Handpicked daily</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Baskets */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-4 text-center md:text-left">
               <h2 className="text-3xl md:text-5xl font-display font-bold text-primary tracking-tight">Curated Fruit Baskets</h2>
               <p className="text-text-muted text-lg font-medium max-w-xl">Beautifully packed, farm-fresh fruit collections perfect for gifting or personal health.</p>
            </div>
            <Link to="/products?type=basket" className="group flex items-center gap-2 font-bold text-accent hover:text-accent-dark transition-all duration-300">
               Explore all baskets <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {baskets.map(basket => (
                <Link 
                  key={basket._id} 
                  to={`/product/${basket._id}`}
                  className="group bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={basket.images?.[0] || '/placeholder.png'} 
                      alt={basket.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-display font-bold text-primary mb-3 group-hover:text-accent transition-colors">{basket.name}</h3>
                    <p className="text-text-muted text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{basket.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                       <span className="text-2xl font-display font-bold text-primary">₹{basket.price}</span>
                       <span className="text-accent font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                         Order Now <ChevronRight className="w-4 h-4" />
                       </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-slate-50/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
             <h2 className="text-3xl md:text-5xl font-display font-bold text-primary tracking-tight">Our Fresh Picks</h2>
             <p className="text-text-muted text-lg font-medium">Seasonal favorites and exotic finds, sourced with love.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <Link 
                  key={product._id} 
                  to={`/product/${product._id}`}
                  className="bg-white rounded-[2rem] p-4 shadow-premium border border-slate-100 hover:shadow-premium-hover transition-all duration-500 group"
                >
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-6">
                    <img 
                      src={product.images?.[0] || '/placeholder.png'} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-display font-bold text-primary group-hover:text-accent transition-colors">{product.name}</h3>
                       <span className="text-lg font-display font-bold text-primary">₹{product.price}</span>
                    </div>
                    <p className="text-text-muted text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{product.description}</p>
                    <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
                       View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6 text-center md:text-left">
               <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto md:mx-0">
                  <Leaf className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-display font-bold text-primary">Premium Quality</h3>
               <p className="text-text-muted font-medium leading-relaxed">
                 We source our fruits from certified organic farms, ensuring every bite is packed with natural goodness.
               </p>
            </div>
            
            <div className="space-y-6 text-center md:text-left">
               <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto md:mx-0">
                  <Truck className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-display font-bold text-primary">Express Delivery</h3>
               <p className="text-text-muted font-medium leading-relaxed">
                 From our store to your door in less than 24 hours. Freshness is guaranteed with every order.
               </p>
            </div>
            
            <div className="space-y-6 text-center md:text-left">
               <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto md:mx-0">
                  <Tag className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-display font-bold text-primary">Direct Sourcing</h3>
               <p className="text-text-muted font-medium leading-relaxed">
                 By cutting out the middlemen, we provide premium quality fruits at the fairest market prices.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="pb-24 pt-10">
        <div className="container-custom">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center space-y-8">
             <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
             
             <h2 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight relative z-10">
               Ready to taste <br className="hidden md:block"/> natural excellence?
             </h2>
             <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
               Join thousands of families getting their daily dose of health delivered fresh.
             </p>
             <div className="pt-4 relative z-10">
                <Link to="/products" className="inline-block bg-white text-primary hover:bg-slate-50 px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl">
                  Explore The Collection
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
