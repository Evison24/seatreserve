import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'px-4 py-2 font-medium rounded-md transition-colors hover: cursor-pointer';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-black',
    ghost: 'text-primary hover:bg-blue-50',
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
