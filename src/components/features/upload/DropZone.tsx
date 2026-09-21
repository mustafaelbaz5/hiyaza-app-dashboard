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
          ? 'border-brand-500 bg-brand-50 scale-[1.01]'
          : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/40'
      }`}
    >
      <div
        className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
          isDragging ? 'bg-brand-100' : 'bg-gray-100 group-hover:bg-brand-100'
        }`}
      >
        <UploadCloud
          className={isDragging ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-600'}
          size={28}
          strokeWidth={1.5}
        />
      </div>
      <p className="text-gray-900 font-medium">اسحب ملف Excel هنا أو اضغط للاختيار</p>
      <p className="text-sm text-gray-500 mt-1">xlsx أو xls بحد أقصى</p>

      <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
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
