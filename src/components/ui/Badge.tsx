import type { ReactNode } from 'react';

type Color = 'teal' | 'coral' | 'slate' | 'amber' | 'green' | 'red' | 'purple' | 'blue';

interface Props {
  children: ReactNode;
  color?: Color;
  size?: 'sm' | 'md';
}

const COLOR_CLASSES: Record<Color, string> = {
  teal: 'bg-teal-50 text-teal-700 border-teal-100',
  coral: 'bg-coral-500/10 text-coral-600 border-coral-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  green: 'bg-green-50 text-green-700 border-green-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
};

export function Badge({ children, color = 'teal', size = 'sm' }: Props) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        COLOR_CLASSES[color],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
