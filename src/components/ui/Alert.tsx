import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

type Kind = "error" | "success" | "info";

interface AlertProps {
  kind: Kind;
  children: ReactNode;
  action?: ReactNode;
}

const KIND_CLASSES: Record<Kind, string> = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-brand-50 text-brand-800 border-brand-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

const KIND_ICONS: Record<Kind, ReactNode> = {
  error: (
    <AlertTriangle
      size={18}
      className='shrink-0'
    />
  ),
  success: (
    <CheckCircle2
      size={18}
      className='shrink-0'
    />
  ),
  info: (
    <Info
      size={18}
      className='shrink-0'
    />
  ),
};

export function Alert({ kind, children, action }: AlertProps) {
  return (
    <div
      className={`flex items-start gap-3 border rounded-xl px-4 py-3.5 text-sm animate-fade-in ${KIND_CLASSES[kind]}`}>
      {KIND_ICONS[kind]}
      <div className='flex-1 leading-relaxed'>{children}</div>
      {action}
    </div>
  );
}
