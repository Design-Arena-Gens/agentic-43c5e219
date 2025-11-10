import useSWR from 'swr';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import FeatureHighlights from '../components/FeatureHighlights';
import PromoBanner from '../components/PromoBanner';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePage = () => {
  const { data: featured, error: featuredError } = useSWR('/api/products?limit=8&featured=true', fetcher);
  const { data: trending, error: trendingError } = useSWR('/api/products?limit=8&sort=top-rated', fetcher);

  return (
    <Layout>
      <div className="space-y-14">
        <HeroSection />
        <FeatureHighlights />
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Devices</h2>
            <a href="/products" className="text-sm text-primary hover:text-primary-dark">
              View all
            </a>
          </div>
          {featuredError && <p className="text-sm text-red-500">Failed to load featured products.</p>}
          {!featured && !featuredError ? (
            <LoadingSpinner />
          ) : (
            <ProductGrid products={featured?.products || []} />
          )}
        </section>
        <PromoBanner />
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Trending Now</h2>
            <a href="/products?sort=top-rated" className="text-sm text-primary hover:text-primary-dark">
              Browse more
            </a>
          </div>
          {trendingError && <p className="text-sm text-red-500">Failed to load trending products.</p>}
          {!trending && !trendingError ? (
            <LoadingSpinner />
          ) : (
            <ProductGrid products={trending?.products || []} />
          )}
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
