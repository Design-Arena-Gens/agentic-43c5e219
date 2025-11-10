import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../contexts/AppProviders';

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/products?category=phones', label: 'Phones' },
  { href: '/products?category=laptops', label: 'Laptops' },
  { href: '/products?category=accessories', label: 'Accessories' }
];

const Navbar = () => {
  const router = useRouter();
  const { cart, user, logout } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams({ search });
    router.push(`/products?${params.toString()}`);
    setMobileOpen(false);
  };

  const renderLinks = (className = '') => (
    <>
      {links.map((link) => (
        <Link key={link.label} href={link.href} className={`px-2 py-1 font-medium hover:text-primary ${className}`}>
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-2xl font-bold text-primary dark:text-primary">
              Elite Electronics
            </Link>
            <nav className="hidden lg:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
              {renderLinks('px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition')}
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search gadgets"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-4 py-2 text-sm outline-none"
              />
            </form>
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/account/orders" className="text-sm font-medium hover:text-primary">
                  Hi, {user.firstName || user.email}
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-sm font-medium hover:text-primary">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-white bg-primary px-3 py-2 rounded-full shadow-smooth hover:bg-primary-dark"
                >
                  Join
                </Link>
              </>
            )}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search gadgets"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-4 py-3 text-sm outline-none"
              />
            </form>
            <div className="flex flex-col space-y-2 text-slate-600 dark:text-slate-300">
              {renderLinks('px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800')}
            </div>
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Link href="/account/orders" className="px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    Account
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-3 py-3 rounded-xl bg-red-500 text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    Login
                  </Link>
                  <Link href="/signup" className="px-3 py-3 rounded-xl bg-primary text-white">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
