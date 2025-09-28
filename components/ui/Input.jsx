import { forwardRef } from 'react';

const Input = forwardRef(function Input({
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}, ref) {
  const baseStyles = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default: 'border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-brand-500 focus:border-transparent hover:border-zinc-400 dark:hover:border-zinc-600',
    error: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 placeholder-red-400 focus:ring-red-500 focus:border-transparent',
    success: 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 placeholder-green-400 focus:ring-green-500 focus:border-transparent'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base'
  };

  return (
    <input
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});

export default Input;