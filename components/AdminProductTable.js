const AdminProductTable = ({ products, onEdit, onDelete }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
    <table className="w-full text-sm">
      <thead className="bg-slate-100 dark:bg-slate-900 text-left uppercase text-xs tracking-wide text-slate-500">
        <tr>
          <th className="px-4 py-3">Product</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Brand</th>
          <th className="px-4 py-3">Price</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
        {products.map((product) => (
          <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <td className="px-4 py-4">
              <div className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {product.description}
              </div>
            </td>
            <td className="px-4 py-4 capitalize">{product.category}</td>
            <td className="px-4 py-4">{product.brand}</td>
            <td className="px-4 py-4 font-semibold text-primary">${product.price.toFixed(2)}</td>
            <td className="px-4 py-4">{product.stock}</td>
            <td className="px-4 py-4 text-right space-x-3">
              <button
                onClick={() => onEdit(product)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="text-sm text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {products.length === 0 && (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        No products found. Create one using the form above.
      </div>
    )}
  </div>
);

export default AdminProductTable;
