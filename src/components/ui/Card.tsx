import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-card transition-shadow ${
        hoverable ? 'hover:shadow-popover hover:border-gray-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
