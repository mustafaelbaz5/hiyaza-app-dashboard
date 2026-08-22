import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { BasinRow } from '../../../types/excel';
import { Table } from '../../ui/Table';
import { formatNumber } from '../../../utils/formatters';

interface BasinPreviewProps {
  basins: BasinRow[];
}

export function BasinPreview({ basins }: BasinPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
      >
        عرض الأحواض
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <Table
            columns={[
              { key: 'name', header: 'اسم الحوض', render: (b) => b.basin_name },
              { key: 'code', header: 'الكود', render: (b) => b.basin_code || '-' },
              { key: 'count', header: 'القطع', render: (b) => formatNumber(b.parcel_count) },
            ]}
            rows={basins}
            rowKey={(b) => `${b.basin_name}-${b.basin_code}`}
          />
        </div>
      )}
    </div>
  );
}
