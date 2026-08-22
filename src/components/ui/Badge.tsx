import type { ReactNode } from 'react';

type Tone = 'green' | 'gray' | 'red' | 'blue';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}

const TONE_CLASSES: Record<Tone, string> = {
  green: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-800',
  gray: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700',
  red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800',
};

const DOT_CLASSES: Record<Tone, string> = {
  green: 'bg-brand-500 dark:bg-brand-400',
  gray: 'bg-gray-400 dark:bg-gray-500',
  red: 'bg-red-500 dark:bg-red-400',
  blue: 'bg-blue-500 dark:bg-blue-400',
};

export function Badge({ tone = 'gray', children, dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT_CLASSES[tone]}`} />}
      {children}
    </span>
  );
}
