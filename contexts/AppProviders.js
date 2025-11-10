import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

export const useAppContext = () => useContext(AppContext);

const CART_STORAGE_KEY = 'elite-cart';
const THEME_STORAGE_KEY = 'elite-theme';

const AppProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState('light');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from storage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to persist cart', error);
    }
  }, [cart]);

  useEffect(() => {
    const applyTheme = (value) => {
      document.documentElement.dataset.theme = value;
      document.body.classList.toggle('dark', value === 'dark');
    };

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      document.documentElement.dataset.theme = next;
      document.body.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.product._id === product._id);
      if (existing) {
        return current.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => setCart([]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    fetch('/api/auth/logout', { method: 'POST' }).catch((error) =>
      console.error('Failed to logout', error)
    );
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      theme,
      toggleTheme,
      login,
      logout,
      loadingUser
    }),
    [user, cart, theme, loadingUser]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProviders;
