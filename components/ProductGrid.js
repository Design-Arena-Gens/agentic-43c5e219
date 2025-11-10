import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (!products?.length) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        No products found. Adjust your filters or check back soon.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
