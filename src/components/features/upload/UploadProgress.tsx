interface UploadProgressProps {
  progress: number;
  current: string;
}

export function UploadProgress({ progress, current }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">{current}</p>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
