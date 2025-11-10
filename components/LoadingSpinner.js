const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    <p className="mt-4 text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
