import { useEffect } from 'react';
import AppProviders from '../contexts/AppProviders';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('elite-theme');
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}

export default MyApp;
