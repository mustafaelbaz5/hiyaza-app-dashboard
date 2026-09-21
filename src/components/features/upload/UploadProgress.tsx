import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  current: string;
}

export function UploadProgress({ progress, current }: UploadProgressProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-card space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Loader2 size={20} className="animate-spin text-brand-600 shrink-0" />
        <p className="text-sm font-medium text-gray-800">{current}</p>
      </div>
      <div className="space-y-2">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-left">{progress}%</p>
      </div>
    </div>
  );
}
