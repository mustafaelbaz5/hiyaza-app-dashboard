import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-card hover:bg-brand-700 focus-visible:ring-brand-300",
  secondary: "bg-white text-gray-700 border border-gray-300 shadow-card hover:bg-gray-50 focus-visible:ring-gray-200",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus-visible:ring-red-200",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-200",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}>
      {children}
    </button>
  );
}
