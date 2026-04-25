const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 mt-20 relative overflow-hidden">
      {/* Decorative Gradient Flare */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md">
                 <Leaf className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-primary">
                Dwivedi<span className="text-accent">Fruits</span>
              </span>
            </Link>
            <p className="text-text-muted text-base leading-relaxed max-w-sm">
              Experience the true taste of nature with our farm-fresh, premium organic fruits. 
              Delivered with care to your doorstep in New Delhi.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-text-muted hover:text-accent transition-colors text-sm font-medium">Home</Link></li>
              <li><Link to="/products" className="text-text-muted hover:text-accent transition-colors text-sm font-medium">Shop Catalog</Link></li>
              <li><Link to="/cart" className="text-text-muted hover:text-accent transition-colors text-sm font-medium">Your Basket</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="text-text-muted text-sm flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Janakpuri, New Delhi
              </li>
              <li>
                 <a href="tel:+919910850024" className="text-text-muted hover:text-accent transition-colors text-sm font-medium flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> +91 9910850024
                 </a>
              </li>
              <li>
                 <a href="mailto:dubeychandan411@gmail.com" className="text-text-muted hover:text-accent transition-colors text-sm font-medium flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Email Us
                 </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} Dwivedi Fruit Shop. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-xs font-medium">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-xs font-medium">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
