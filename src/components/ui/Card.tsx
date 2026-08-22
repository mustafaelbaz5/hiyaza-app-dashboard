import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = "", hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-card transition-shadow ${
        hoverable ? "hover:shadow-popover hover:border-gray-300 dark:hover:border-gray-600" : ""
      } ${className}`}>
      {children}
    </div>
  );
}
