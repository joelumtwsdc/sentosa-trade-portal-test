import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, hover, padding = true, className = '', ...rest }: Props) {
  return (
    <div
      className={[
        'bg-white rounded-xl border border-slate-100 shadow-card',
        hover ? 'transition-card hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : '',
        padding ? 'p-5' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
