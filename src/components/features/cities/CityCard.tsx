import { Link } from 'react-router-dom';
import { Building2, LandPlot, MapPin, Sprout, Trash2 } from 'lucide-react';
import type { CitySummary } from '../../../types/city';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { CityStatusBadge } from './CityStatusBadge';
import { formatAssociationType, formatNumber } from '../../../utils/formatters';

interface CityCardProps {
  city: CitySummary;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
  isMutating: boolean;
}

export function CityCard({ city, onPublish, onUnpublish, onDelete, isMutating }: CityCardProps) {
  return (
    <Card hoverable className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/cities/${city.id}`} className="group flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Sprout size={18} className="text-brand-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-brand-700 transition-colors">
            {city.name}
          </h3>
        </Link>
        <CityStatusBadge isPublished={city.is_published} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Building2 size={13} />
          {formatAssociationType(city.association_type)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={13} />
          {city.administration || '-'} · {city.directorate || '-'}
        </span>
      </div>

      <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-3 py-2.5 text-sm">
        <span className="flex items-center gap-1.5 text-gray-700">
          <LandPlot size={14} className="text-gray-400" />
          <strong className="font-semibold text-gray-900">{formatNumber(city.basin_count)}</strong>
          حوض
        </span>
        <span className="w-px h-3.5 bg-gray-200" />
        <span className="text-gray-700">
          <strong className="font-semibold text-gray-900">{formatNumber(city.parcel_count)}</strong>{' '}
          قطعة
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Link to={`/cities/${city.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            تفاصيل
          </Button>
        </Link>
        {city.is_published ? (
          <Button
            variant="secondary"
            size="sm"
            disabled={isMutating}
            onClick={() => onUnpublish(city.id)}
          >
            إلغاء النشر
          </Button>
        ) : (
          <Button variant="primary" size="sm" disabled={isMutating} onClick={() => onPublish(city.id)}>
            نشر
          </Button>
        )}
        <Button
          variant="danger"
          size="sm"
          disabled={isMutating}
          onClick={() => onDelete(city.id)}
          aria-label="حذف"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
}
