import Link from 'next/link';

const Footer = () => (
  <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8 text-sm text-slate-500 dark:text-slate-400">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Elite Electronics</h3>
        <p className="mt-3 leading-relaxed">
          Premium devices, curated gadgets, and accessories to elevate your connected life.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Shop</h4>
        <ul className="space-y-2">
          <li><Link href="/products?category=phones">Smartphones</Link></li>
          <li><Link href="/products?category=laptops">Laptops</Link></li>
          <li><Link href="/products?category=tablets">Tablets</Link></li>
          <li><Link href="/products?category=accessories">Accessories</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Support</h4>
        <ul className="space-y-2">
          <li><Link href="/support/shipping">Shipping & Delivery</Link></li>
          <li><Link href="/support/warranty">Warranty</Link></li>
          <li><Link href="/support/contact">Contact Us</Link></li>
          <li><Link href="/support/faq">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Join our newsletter</h4>
        <form className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-4 py-2 outline-none"
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-medium">
            Subscribe
          </button>
        </form>
      </div>
    </div>
    <div className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-400">
      © {new Date().getFullYear()} Elite Electronics. All rights reserved.
    </div>
  </footer>
);

export default Footer;
