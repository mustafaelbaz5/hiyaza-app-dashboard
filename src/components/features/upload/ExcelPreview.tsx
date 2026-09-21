import { useState } from 'react';
import { ChevronDown, Table2 } from 'lucide-react';
import type { ExcelParseResult } from '../../../types/excel';
import { Card } from '../../ui/Card';
import { Table } from '../../ui/Table';
import { BasinPreview } from './BasinPreview';
import { formatAssociationType, formatNumber } from '../../../utils/formatters';

interface ExcelPreviewProps {
  result: ExcelParseResult;
}

const SAMPLE_SIZE = 10;

const META_FIELDS = [
  { key: 'name', label: 'المدينة' },
  { key: 'type', label: 'النوع' },
  { key: 'administration', label: 'الإدارة' },
  { key: 'directorate', label: 'المديرية' },
] as const;

export function ExcelPreview({ result }: ExcelPreviewProps) {
  const [showSample, setShowSample] = useState(false);
  const { cityMeta, basins, parcels } = result;

  const metaValues: Record<(typeof META_FIELDS)[number]['key'], string> = {
    name: cityMeta.name || '-',
    type: formatAssociationType(cityMeta.association_type),
    administration: cityMeta.administration || '-',
    directorate: cityMeta.directorate || '-',
  };

  return (
    <Card className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2 pb-1">
        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
          <Table2 size={15} className="text-brand-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">مراجعة البيانات</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
        {META_FIELDS.map((field) => (
          <div key={field.key}>
            <p className="text-xs text-gray-400 mb-0.5">{field.label}</p>
            <p className="text-sm font-medium text-gray-900">{metaValues[field.key]}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-brand-700">{formatNumber(basins.length)}</p>
          <p className="text-xs text-gray-500 mt-0.5">حوض</p>
        </div>
        <div className="rounded-xl border border-gray-200 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-brand-700">{formatNumber(parcels.length)}</p>
          <p className="text-xs text-gray-500 mt-0.5">قطعة</p>
        </div>
      </div>

      <BasinPreview basins={basins} />

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSample((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Table2 size={15} className="text-gray-400" />
            عرض عينة من القطع
          </span>
          <ChevronDown size={16} className={`transition-transform ${showSample ? 'rotate-180' : ''}`} />
        </button>
        {showSample && (
          <div className="px-4 pb-4 animate-fade-in">
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
