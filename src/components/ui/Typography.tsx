'use client';

import React from 'react';
import clsx from 'clsx';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  h1: 'text-3xl md:text-4xl font-bold text-foreground',
  h2: 'text-2xl md:text-3xl font-semibold text-foreground',
  h3: 'text-xl md:text-2xl font-semibold text-foreground',
  body: 'text-base text-foreground/90',
  caption: 'text-sm text-foreground/70',
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
    <Comp
      className={clsx(
        'transition-colors duration-200',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
