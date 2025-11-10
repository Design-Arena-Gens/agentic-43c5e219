import Link from 'next/link';

const PromoBanner = () => (
  <section className="grid md:grid-cols-2 gap-6">
    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-smooth">
      <h2 className="text-2xl font-semibold">Upgrade your workstation</h2>
      <p className="mt-3 text-sm text-slate-200">
        Save up to 20% on selected ultrabooks and performance accessories.
      </p>
      <Link
        href="/products?category=laptops"
        className="inline-flex items-center px-5 py-2 mt-6 rounded-full bg-white text-slate-900 font-semibold"
      >
        Shop laptops
      </Link>
    </div>
    <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-smooth">
      <h2 className="text-2xl font-semibold">Audio essentials drop</h2>
      <p className="mt-3 text-sm text-slate-100">
        Wireless buds, smart speakers, and soundbars now shipping globally.
      </p>
      <Link
        href="/products?category=audio"
        className="inline-flex items-center px-5 py-2 mt-6 rounded-full bg-white text-slate-900 font-semibold"
      >
        Explore audio
      </Link>
    </div>
  </section>
);

export default PromoBanner;
