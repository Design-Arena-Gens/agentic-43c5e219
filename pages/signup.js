import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAppContext } from '../contexts/AppProviders';

const SignupPage = () => {
  const router = useRouter();
  const { login } = useAppContext();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to sign up');
      }
      login(data.user);
      router.replace('/');
    } catch (signupError) {
      setError(signupError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Account · Elite Electronics">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Join Elite Electronics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track orders, unlock loyalty perks, and get curated recommendations.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-full bg-primary text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          Already have an account? <a href="/login" className="text-primary">Sign in</a>
        </p>
      </div>
    </Layout>
  );
};

export default SignupPage;
