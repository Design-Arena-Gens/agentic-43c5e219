import { BoltIcon, ShieldCheckIcon, TruckIcon, SparklesIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: BoltIcon,
    title: 'Fast & Secure Checkout',
    description: 'Encrypted payments with Stripe and PayPal, plus instant order confirmation.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Warranty Assured',
    description: 'Every product includes EliteCare warranty and optional extended coverage.'
  },
  {
    icon: TruckIcon,
    title: 'Global Shipping',
    description: 'Express delivery to 120+ countries with end-to-end tracking updates.'
  },
  {
    icon: SparklesIcon,
    title: 'Curated Tech',
    description: 'Only flagship devices and top-rated accessories make it to our catalog.'
  }
];

const FeatureHighlights = () => (
  <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {features.map(({ icon: Icon, title, description }) => (
      <div
        key={title}
        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow transition hover:-translate-y-1"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
    ))}
  </section>
);

export default FeatureHighlights;
