module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './contexts/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8'
        },
        accent: '#f59e0b'
      },
      boxShadow: {
        smooth: '0 10px 30px rgba(15, 23, 42, 0.15)'
      }
    }
  },
  plugins: []
};
