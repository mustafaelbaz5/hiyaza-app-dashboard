import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 24 }: SpinnerProps) {
  return <Loader2 size={size} className="animate-spin text-emerald-600" />;
}
