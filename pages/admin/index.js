import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminProductForm from '../../components/AdminProductForm';
import AdminProductTable from '../../components/AdminProductTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppContext } from '../../contexts/AppProviders';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, loadingUser } = useAppContext();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loadingUser && (!user || user.role !== 'admin')) {
      router.replace('/login?redirect=/admin');
    }
  }, [user, loadingUser, router]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load products');
      }
      setProducts(data.products);
    } catch (productsError) {
      setError(productsError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadProducts();
    }
  }, [user]);

  const handleSubmit = async (payload) => {
    const url = editing ? `/api/admin/products/${editing._id}` : '/api/admin/products';
    const method = editing ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Unable to save product');
    }
    setEditing(null);
    await loadProducts();
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data?.error || 'Unable to delete product');
      return;
    }
    await loadProducts();
  };

  return (
    <Layout title="Admin dashboard · Elite Electronics">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage products, pricing, and catalog visibility.
          </p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid lg:grid-cols-[360px_1fr] gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editing ? `Update ${editing.name}` : 'Add new product'}
              </h2>
              <AdminProductForm
                product={editing}
                onSubmit={handleSubmit}
                onCancel={() => setEditing(null)}
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Catalog</h2>
              <AdminProductTable
                products={products}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
