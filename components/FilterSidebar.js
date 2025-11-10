const FilterSidebar = ({
  brands = [],
  categories = [],
  filters,
  onFilterChange,
  onReset
}) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 h-max">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={onReset} className="text-sm text-primary hover:text-primary-dark">
          Reset
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <input
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Search products"
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Brand</label>
        <select
          name="brand"
          value={filters.brand}
          onChange={handleInputChange}
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            name="minPrice"
            min={0}
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="Min"
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
          />
          <span className="text-sm text-slate-400">—</span>
          <input
            type="number"
            name="maxPrice"
            min={0}
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="Max"
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sort</label>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleInputChange}
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="top-rated">Top Rated</option>
        </select>
      </div>
    </aside>
  );
};

export default FilterSidebar;
