const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Diwedi Fruit Shop Logo" className="h-12 w-auto bg-white rounded p-1 object-contain" />
              <h3 className="text-xl font-bold">Diwedi Fruit Shop</h3>
            </div>
            <p className="text-brand-light/80">Best fruit shop in Janakpuri. Get fresh and organic fruits delivered directly to your home.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-brand-light transition">Home</a></li>
              <li><a href="/products" className="hover:text-brand-light transition">Shop Fruits</a></li>
              <li><a href="/cart" className="hover:text-brand-light transition">Your Cart</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-brand-light/80">
              <li>Janakpuri, New Delhi</li>
              <li>Phone: +91 9910850024</li>
              <li>Email: dubeychandan411@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand mt-8 pt-8 text-center text-brand-light/60">
          <p>&copy; {new Date().getFullYear()} Diwedi Fruit Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
