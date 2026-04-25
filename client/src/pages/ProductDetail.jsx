import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import {
  ShoppingCart, ArrowLeft, Heart, CheckCircle, XCircle,
  Truck, ShieldCheck, RotateCcw, Star, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const TrustBadge = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-premium group">
    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
      <Icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
    </div>
    <div>
      <p className="text-sm font-bold text-primary leading-tight">{label}</p>
      <p className="text-xs text-text-muted font-medium mt-0.5">{sub}</p>
    </div>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, { 
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : ['/placeholder.png'];
  const inStock = product.countInStock > 0;

  return (
    <div className="bg-bg-main min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200/50 bg-white/50 backdrop-blur-sm sticky top-20 z-40">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-accent transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom pt-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Image Gallery */}
            <div className="p-8 md:p-12 lg:border-r border-slate-50 flex flex-col md:flex-row gap-8">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${selectedImage === idx ? 'border-accent shadow-lg shadow-accent/10 scale-105' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Container */}
              <div className="flex-1 relative aspect-square bg-slate-50 rounded-[2rem] overflow-hidden flex items-center justify-center p-8 group">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Wishlist Toggle */}
                <button
                  onClick={() => {
                    setWishlisted(!wishlisted);
                    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', { 
                      icon: wishlisted ? '💔' : '❤️',
                      style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
                    });
                  }}
                  className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${wishlisted ? 'bg-red-50 text-red-500 scale-110' : 'bg-white text-slate-300 hover:text-red-400 hover:scale-105'}`}
                >
                  <Heart className={`w-6 h-6 ${wishlisted ? 'fill-current' : ''}`} />
                </button>

                {!inStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-red-50 text-red-500 font-black px-8 py-3 rounded-2xl border border-red-100 shadow-xl shadow-red-500/10">SOLD OUT</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
                    {product.category || 'Premium Selection'}
                  </span>
                  {product.tags?.includes('Best Seller') && (
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                      Best Seller
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-primary leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                      <span className="ml-2 text-sm font-bold text-primary">4.8</span>
                   </div>
                   <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                   <p className="text-sm font-bold text-text-muted">128+ Reviews</p>
                </div>
              </div>

              <div className="mb-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-display font-bold text-primary">₹{product.price}</span>
                      <span className="text-text-muted font-bold">/ unit</span>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Inclusive of all taxes</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
              </div>

              {/* Basket Contents if applicable */}
              {product.type === 'basket' && product.basketItems?.length > 0 && (
                <div className="mb-10 space-y-4">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <span className="w-8 h-px bg-accent"></span>
                     What's Inside
                   </h3>
                   <div className="grid grid-cols-1 gap-3">
                      {product.basketItems.map(item => (
                         <div key={item._id} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <img 
                              src={item.product?.images?.[0] || '/placeholder.png'} 
                              className="w-12 h-12 object-cover rounded-xl border border-slate-50" 
                              alt={item.product?.name}
                            />
                            <div className="flex-1">
                               <p className="text-sm font-bold text-primary">{item.product?.name}</p>
                               <p className="text-[10px] font-black text-accent uppercase tracking-widest">Qty: {item.quantity}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              )}

              <div className="space-y-8 mt-auto">
                {/* Description */}
                <div className="space-y-3">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary">Overview</h3>
                   <p className="text-text-muted text-base leading-relaxed font-medium">
                     {product.description}
                   </p>
                </div>

                {/* Purchase Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                  {inStock ? (
                    <>
                      <div className="flex items-center justify-between px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl min-w-[140px]">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-primary font-bold transition-colors"
                        >−</button>
                        <span className="text-lg font-bold text-primary min-w-[2ch] text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-primary font-bold transition-colors"
                        >+</button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-primary hover:bg-slate-800 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Basket
                      </button>
                    </>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-2xl font-bold text-lg cursor-not-allowed"
                    >
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features / Trust Badges */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <TrustBadge icon={Truck} label="Instant Delivery" sub="Within 24 Hours" />
          <TrustBadge icon={ShieldCheck} label="Fresh Guarantee" sub="Farm to Table" />
          <TrustBadge icon={RotateCcw} label="Quality Promise" sub="Or Money Back" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
