import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import {
  ShoppingCart, ArrowLeft, Heart, CheckCircle, XCircle,
  Truck, ShieldCheck, RotateCcw, Star, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Trust Badge ─── */
const TrustBadge = ({ icon: Icon, label, sub }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px', background:'#f9fafb', borderRadius:'10px', border:'1px solid #e5e7eb' }}>
    <div style={{ padding:'8px', background:'#f0fdf4', borderRadius:'8px', flexShrink:0 }}>
      <Icon style={{ width:'18px', height:'18px', color:'#22c55e' }} />
    </div>
    <div>
      <p style={{ fontSize:'13px', fontWeight:700, color:'#1f2937', margin:0 }}>{label}</p>
      <p style={{ fontSize:'11px', color:'#9ca3af', margin:0 }}>{sub}</p>
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
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#f9fafb', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:'80px' }}>
        <div style={{ width:'48px', height:'48px', border:'3px solid #e5e7eb', borderTopColor:'#22c55e', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0
    ? product.images
    : ['/placeholder.png'];

  const inStock = product.countInStock > 0;

  return (
    <div style={{ background:'#f9fafb', minHeight:'100vh', paddingTop:'80px' }}>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #f3f4f6' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'12px 24px' }}>
          <nav style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#6b7280', textDecoration:'none' }} onMouseEnter={e => e.target.style.color='#22c55e'} onMouseLeave={e => e.target.style.color='#6b7280'}>Home</Link>
            <ChevronRight style={{ width:'14px', height:'14px' }} />
            <Link to="/products" style={{ color:'#6b7280', textDecoration:'none' }} onMouseEnter={e => e.target.style.color='#22c55e'} onMouseLeave={e => e.target.style.color='#6b7280'}>Products</Link>
            <ChevronRight style={{ width:'14px', height:'14px' }} />
            <span style={{ color:'#111827', fontWeight:600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'24px 24px 60px' }}>

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', cursor:'pointer', color:'#6b7280', fontSize:'14px', fontWeight:500, marginBottom:'20px', padding:0 }}
          onMouseEnter={e => { e.currentTarget.style.color='#22c55e'; }}
          onMouseLeave={e => { e.currentTarget.style.color='#6b7280'; }}
        >
          <ArrowLeft style={{ width:'16px', height:'16px' }} />
          Back to Products
        </button>

        {/* ── MAIN PRODUCT CARD ── */}
        <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          
          {/* 2-Column Grid - Image | Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0',
          }}
          className="product-detail-grid"
          >

            {/* ── LEFT: Image Gallery ── */}
            <div style={{ padding:'32px', borderRight:'1px solid #f3f4f6', display:'flex', gap:'16px' }}>

              {/* Vertical Thumbnails */}
              {images.length > 1 && (
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', flexShrink:0 }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        border: selectedImage === idx ? '2.5px solid #22c55e' : '2px solid #e5e7eb',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#fff',
                        padding: '4px',
                        flexShrink: 0,
                        boxShadow: selectedImage === idx ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none',
                        transform: selectedImage === idx ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img src={img} alt={`View ${idx + 1}`} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'6px' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', background:'#f9fafb', borderRadius:'14px', minHeight:'380px', overflow:'hidden' }}>
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  style={{ maxWidth:'100%', maxHeight:'380px', objectFit:'contain', mixBlendMode:'multiply', transition:'opacity 0.25s ease' }}
                />
                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    setWishlisted(!wishlisted);
                    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist!', { icon: wishlisted ? '💔' : '❤️' });
                  }}
                  style={{
                    position:'absolute', top:'12px', right:'12px',
                    width:'38px', height:'38px', borderRadius:'50%',
                    border: wishlisted ? '1.5px solid #fca5a5' : '1.5px solid #e5e7eb',
                    background: wishlisted ? '#fef2f2' : '#fff',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.1)',
                    transition:'all 0.2s'
                  }}
                >
                  <Heart style={{ width:'18px', height:'18px', color: wishlisted ? '#ef4444' : '#9ca3af', fill: wishlisted ? '#ef4444' : 'none' }} />
                </button>

                {/* Out of stock overlay */}
                {!inStock && (
                  <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ background:'#fee2e2', color:'#dc2626', fontWeight:700, fontSize:'13px', padding:'8px 18px', borderRadius:'999px', border:'1px solid #fca5a5' }}>Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Product Info ── */}
            <div style={{ padding:'32px', display:'flex', flexDirection:'column' }}>

              {/* Category Tag */}
              <span style={{ display:'inline-block', width:'fit-content', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#16a34a', background:'#f0fdf4', border:'1px solid #bbf7d0', padding:'4px 12px', borderRadius:'999px', marginBottom:'12px' }}>
                {product.category || 'Fresh Produce'}
              </span>

              {/* Name */}
              <h1 style={{ fontSize:'28px', fontWeight:800, color:'#111827', lineHeight:1.3, margin:'0 0 10px' }}>
                {product.name}
              </h1>

              {/* Stars */}
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
                <div style={{ display:'flex' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ width:'15px', height:'15px', color: i < 4 ? '#fbbf24' : '#d1d5db', fill: i < 4 ? '#fbbf24' : 'none' }} />
                  ))}
                </div>
                <span style={{ fontSize:'13px', color:'#9ca3af' }}>4.0 · Fresh & Quality</span>
              </div>

              <div style={{ height:'1px', background:'#f3f4f6', marginBottom:'18px' }} />

              {/* Price */}
              <div style={{ marginBottom:'14px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
                  <span style={{ fontSize:'36px', fontWeight:900, color:'#111827' }}>₹{product.price}</span>
                  <span style={{ fontSize:'14px', color:'#9ca3af', fontWeight:500 }}>/ item</span>
                </div>
                <p style={{ fontSize:'11px', color:'#d1d5db', marginTop:'2px' }}>Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'18px' }}>
                {inStock ? (
                  <>
                    <CheckCircle style={{ width:'17px', height:'17px', color:'#22c55e' }} />
                    <span style={{ fontSize:'13px', fontWeight:600, color:'#16a34a' }}>
                      In Stock <span style={{ color:'#9ca3af', fontWeight:400 }}>({product.countInStock} units)</span>
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle style={{ width:'17px', height:'17px', color:'#ef4444' }} />
                    <span style={{ fontSize:'13px', fontWeight:600, color:'#dc2626' }}>Out of Stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <div style={{ background:'#f9fafb', borderRadius:'10px', padding:'14px 16px', border:'1px solid #f3f4f6', marginBottom:'20px' }}>
                <p style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#6b7280', marginBottom:'6px' }}>About this item</p>
                <p style={{ fontSize:'14px', color:'#4b5563', lineHeight:1.7, margin:0 }}>{product.description}</p>
              </div>

              {/* Included Basket Items */}
              {product.type === 'basket' && product.basketItems && product.basketItems.length > 0 && (
                <div style={{ background:'#fff', borderRadius:'14px', padding:'16px', border:'1.5px dashed #22c55e', marginBottom:'20px' }}>
                  <p style={{ fontSize:'13px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'#16a34a', marginBottom:'14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <span style={{ fontSize: '18px' }}>🎁</span> Inside this basket
                  </p>
                  <ul style={{ listStyle:'none', padding:0, margin:0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     {product.basketItems.map(item => (
                        <li key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f9fafb', padding: '8px', borderRadius: '10px' }}>
                           <img src={item.product?.images?.[0] || '/placeholder.png'} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                           <div>
                              <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{item.product?.name}</p>
                              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, fontWeight: 500 }}>Quantity Included: <span style={{color: '#111827'}}>{item.quantity}</span></p>
                           </div>
                        </li>
                     ))}
                  </ul>
                </div>
              )}

              {/* Quantity */}
              {inStock && (
                <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
                  <span style={{ fontSize:'14px', fontWeight:600, color:'#374151' }}>Qty:</span>
                  <div style={{ display:'flex', alignItems:'center', border:'2px solid #e5e7eb', borderRadius:'10px', overflow:'hidden' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ width:'40px', height:'40px', background:'none', border:'none', cursor:'pointer', fontSize:'20px', fontWeight:700, color:'#6b7280', display:'flex', alignItems:'center', justifyContent:'center' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background='none'}
                    >−</button>
                    <span style={{ width:'44px', textAlign:'center', fontSize:'16px', fontWeight:700, color:'#111827', borderLeft:'1.5px solid #e5e7eb', borderRight:'1.5px solid #e5e7eb', lineHeight:'40px' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                      style={{ width:'40px', height:'40px', background:'none', border:'none', cursor:'pointer', fontSize:'20px', fontWeight:700, color:'#6b7280', display:'flex', alignItems:'center', justifyContent:'center' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background='none'}
                    >+</button>
                  </div>
                  <span style={{ fontSize:'12px', color:'#9ca3af' }}>Max {product.countInStock}</span>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  padding: '14px 24px', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                  border: 'none', cursor: inStock ? 'pointer' : 'not-allowed',
                  background: inStock ? '#22c55e' : '#e5e7eb',
                  color: inStock ? '#fff' : '#9ca3af',
                  transition: 'all 0.2s ease',
                  marginBottom: '22px'
                }}
                onMouseEnter={e => { if(inStock) { e.currentTarget.style.background='#16a34a'; e.currentTarget.style.boxShadow='0 6px 20px rgba(34,197,94,0.30)'; }}}
                onMouseLeave={e => { e.currentTarget.style.background = inStock ? '#22c55e' : '#e5e7eb'; e.currentTarget.style.boxShadow='none'; }}
              >
                <ShoppingCart style={{ width:'20px', height:'20px' }} />
                {inStock ? `Add ${quantity > 1 ? `${quantity} items ` : ''}to Cart` : 'Out of Stock'}
              </button>

              {/* Trust Badges */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
                <TrustBadge icon={Truck} label="Fast Delivery" sub="Same day" />
                <TrustBadge icon={ShieldCheck} label="100% Fresh" sub="Guaranteed" />
                <TrustBadge icon={RotateCcw} label="Easy Return" sub="Hassle-free" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Product Details Section ── */}
        <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e5e7eb', padding:'24px', marginTop:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'16px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ display:'inline-block', width:'4px', height:'18px', background:'#22c55e', borderRadius:'2px' }} />
            Product Specifications
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0' }}>
            {[
              { label: 'Product', value: product.name },
              { label: 'Category', value: product.category || '—' },
              { label: 'Price', value: `₹${product.price} / item` },
              { label: 'Stock', value: inStock ? `${product.countInStock} units available` : 'Out of Stock' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #f9fafb' }}>
                <span style={{ fontSize:'13px', color:'#9ca3af', fontWeight:500 }}>{label}</span>
                <span style={{ fontSize:'13px', color:'#111827', fontWeight:600 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive CSS for mobile stacking */}
      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .product-detail-grid > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid #f3f4f6;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
