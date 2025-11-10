import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  description: '',
  price: '',
  category: 'phones',
  brand: '',
  image: '',
  stock: 10,
  tags: ''
};

const AdminProductForm = ({ product, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'phones',
        brand: product.brand || '',
        image: product.image || '',
        stock: product.stock || 0,
        tags: (product.tags || []).join(', ')
      });
    } else {
      setForm(initialState);
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      });
      setForm(initialState);
    } catch (submitError) {
      setError(submitError.message || 'Unable to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
          >
            <option value="phones">Phones</option>
            <option value="laptops">Laptops</option>
            <option value="tablets">Tablets</option>
            <option value="audio">Audio</option>
            <option value="accessories">Accessories</option>
            <option value="smart-home">Smart Home</option>
            <option value="wearables">Wearables</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (USD)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <input
            type="number"
            min={0}
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="flagship, 5G, gaming"
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-full bg-primary text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Saving…' : product ? 'Update product' : 'Add product'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminProductForm;
