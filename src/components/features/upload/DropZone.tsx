import { useCallback, useRef, useState } from 'react';
import { FolderOpen } from 'lucide-react';

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
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <FolderOpen className="mx-auto mb-3 text-gray-400" size={36} />
      <p className="text-gray-700 font-medium">اسحب ملف Excel هنا أو اضغط للاختيار</p>
      <p className="text-sm text-gray-500 mt-3">يجب أن يحتوي على:</p>
      <p className="text-sm text-gray-500">✓ شيت "كل الحيازات"</p>
      <p className="text-sm text-gray-500">✓ شيت "ملخص الأحواض"</p>
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
