'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(211,39,50,0.7)] focus-visible:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: `
      text-white
      bg-[linear-gradient(135deg,#b2202a,#3a0005)]
      hover:bg-[linear-gradient(135deg,#d32732,#4a0208)]
      shadow-md shadow-[rgba(0,0,0,0.45)]
    `,
    secondary: `
      border border-primary/40
      text-primary
      bg-transparent
      hover:bg-primary/10
    `,
    ghost: `
      text-primary
      bg-transparent
      hover:bg-primary/10
    `,
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
