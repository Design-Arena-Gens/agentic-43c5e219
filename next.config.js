const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || ''
  }
};

module.exports = nextConfig;
