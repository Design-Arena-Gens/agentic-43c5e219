import Link from 'next/link';

const HeroSection = () => (
  <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-primary to-slate-900 text-white shadow-smooth">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_60%)]" />
    <div className="relative px-6 py-20 md:px-12 lg:px-20">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-[0.3em]">
          Elite Electronics
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Elevate your tech experience with premium devices curated for enthusiasts.
        </h1>
        <p className="text-lg text-slate-100/90">
          Discover flagship smartphones, powerhouse laptops, immersive audio, and smart accessories with exclusive launch offers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/products"
            className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold text-center hover:opacity-90"
          >
            Shop Best Sellers
          </Link>
          <Link
            href="/products?category=accessories"
            className="px-6 py-3 rounded-full border border-white/70 text-white font-semibold text-center hover:bg-white/10"
          >
            Explore Accessories
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
