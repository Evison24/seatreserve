'use client';

import React from 'react';
import clsx from 'clsx';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  h1: 'text-3xl md:text-4xl font-bold text-gray-900',
  h2: 'text-2xl md:text-3xl font-semibold text-gray-900',
  h3: 'text-xl md:text-2xl font-semibold text-gray-900',
  body: 'text-base text-gray-800',
  caption: 'text-sm text-gray-500',
};

export function Typography({
  as: Component = 'p',
  variant = 'body',
  className,
  children,
  ...props
}: TypographyProps) {
  const Comp = Component as React.ElementType;

  return (
    <Comp className={clsx(variantStyles[variant], className)} {...props}>
      {children}
    </Comp>
  );
}
