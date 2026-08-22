import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ExcelParseResult } from '../../../types/excel';
import { Card } from '../../ui/Card';
import { Table } from '../../ui/Table';
import { BasinPreview } from './BasinPreview';
import { formatAssociationType, formatNumber } from '../../../utils/formatters';

interface ExcelPreviewProps {
  result: ExcelParseResult;
}

const SAMPLE_SIZE = 10;

export function ExcelPreview({ result }: ExcelPreviewProps) {
  const [showSample, setShowSample] = useState(false);
  const { cityMeta, basins, parcels } = result;

  return (
    <Card className="space-y-4">
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <span className="text-gray-500">المدينة:</span>
        <span className="text-gray-900 font-medium">{cityMeta.name || '-'}</span>

        <span className="text-gray-500">النوع:</span>
        <span className="text-gray-900 font-medium">{formatAssociationType(cityMeta.association_type)}</span>

        <span className="text-gray-500">الإدارة:</span>
        <span className="text-gray-900 font-medium">{cityMeta.administration || '-'}</span>

        <span className="text-gray-500">المديرية:</span>
        <span className="text-gray-900 font-medium">{cityMeta.directorate || '-'}</span>
      </div>

      <div className="flex gap-6 text-sm">
        <p className="text-gray-700">الأحواض: <strong>{formatNumber(basins.length)}</strong> حوض</p>
        <p className="text-gray-700">القطع: <strong>{formatNumber(parcels.length)}</strong> قطعة</p>
      </div>

      <BasinPreview basins={basins} />

      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setShowSample((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
        >
          عرض عينة من القطع
          {showSample ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showSample && (
          <div className="px-4 pb-4">
            <Table
              columns={[
                { key: 'holder', header: 'اسم الحائز', render: (p) => p.holder_name || '-' },
                { key: 'basin', header: 'الحوض', render: (p) => p.basin_name || '-' },
                { key: 'holding', header: 'رقم الحيازة', render: (p) => p.holding_id_number || '-' },
                { key: 'area', header: 'المساحة (م²)', render: (p) => formatNumber(p.area_sqm) },
              ]}
              rows={parcels.slice(0, SAMPLE_SIZE)}
              rowKey={(p) => `${p.holding_id_number}-${p.land_number}-${p.holder_name}`}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
