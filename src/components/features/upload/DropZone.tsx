import { useCallback, useRef, useState } from 'react';
import { FileSpreadsheet, UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFileSelected: (file: File) => void;
}

export function DropZone({ onFileSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      className={`group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-[1.01]'
          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-gray-700'
      }`}
    >
      <div
        className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
          isDragging ? 'bg-brand-100 dark:bg-brand-900/40' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30'
        }`}
      >
        <UploadCloud
          className={isDragging ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400'}
          size={28}
          strokeWidth={1.5}
        />
      </div>
      <p className="text-gray-900 dark:text-white font-medium">اسحب ملف Excel هنا أو اضغط للاختيار</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">xlsx أو xls بحد أقصى</p>

      <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <FileSpreadsheet size={14} className="text-brand-500" />
          كل الحيازات
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <FileSpreadsheet size={14} className="text-brand-500" />
          ملخص الأحواض
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
