import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import FilterSidebar from '../../components/FilterSidebar';
import ProductGrid from '../../components/ProductGrid';
import LoadingSpinner from '../../components/LoadingSpinner';

const fetcher = (url) => fetch(url).then((res) => res.json());

const defaultFilters = {
  search: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest'
};

const ProductsPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    const nextFilters = { ...defaultFilters };
    Object.entries(router.query).forEach(([key, value]) => {
      if (key in nextFilters && typeof value === 'string') {
        nextFilters[key] = value;
      }
    });
    setFilters(nextFilters);
  }, [router.query]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    return params.toString();
  }, [filters]);

  const { data, error, isLoading } = useSWR(
    `/api/products${queryString ? `?${queryString}` : ''}`,
    fetcher
  );

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`, undefined, {
      shallow: true
    });
  };

  const handleReset = () => {
    handleFilterChange(defaultFilters);
  };

  return (
    <Layout title="All Products · Elite Electronics">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <FilterSidebar
          brands={data?.meta?.brands || []}
          categories={data?.meta?.categories || []}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Explore our catalog</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {data?.meta?.total || 0} products · updated daily
              </p>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">Failed to load products.</p>}
          {isLoading ? <LoadingSpinner /> : <ProductGrid products={data?.products || []} />}
        </section>
      </div>
    </Layout>
  );
};

export default ProductsPage;
