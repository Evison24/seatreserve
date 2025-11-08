import clsx from 'clsx';
import React from 'react';

export function Card({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx('bg-white rounded-md shadow-md p-4', className)}>{children}</div>
  );
}
