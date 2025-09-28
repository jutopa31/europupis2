import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea({ className = '', rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 ${className}`}
      {...props}
    />
  );
});

export default Textarea;
