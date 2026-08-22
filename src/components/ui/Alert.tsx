import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

type Kind = 'error' | 'success' | 'info';

interface AlertProps {
  kind: Kind;
  children: ReactNode;
}

const KIND_CLASSES: Record<Kind, string> = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const KIND_ICONS: Record<Kind, ReactNode> = {
  error: <AlertTriangle size={18} />,
  success: <CheckCircle2 size={18} />,
  info: <Info size={18} />,
};

export function Alert({ kind, children }: AlertProps) {
  return (
    <div className={`flex items-start gap-2 border rounded-lg px-4 py-3 text-sm ${KIND_CLASSES[kind]}`}>
      {KIND_ICONS[kind]}
      <div>{children}</div>
    </div>
  );
}
