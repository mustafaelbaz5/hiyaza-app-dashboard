import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
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
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{city.name}</h3>
        <CityStatusBadge isPublished={city.is_published} />
      </div>

      <p className="text-sm text-gray-500">
        {formatAssociationType(city.association_type)} | {city.administration || '-'} | {city.directorate || '-'}
      </p>

      <p className="text-sm text-gray-700">
        {formatNumber(city.basin_count)} حوض | {formatNumber(city.parcel_count)} قطعة
      </p>

      <div className="flex items-center gap-2 pt-2">
        <Link to={`/cities/${city.id}`}>
          <Button variant="secondary">تفاصيل</Button>
        </Link>
        {city.is_published ? (
          <Button variant="secondary" disabled={isMutating} onClick={() => onUnpublish(city.id)}>
            إلغاء النشر
          </Button>
        ) : (
          <Button variant="primary" disabled={isMutating} onClick={() => onPublish(city.id)}>
            نشر
          </Button>
        )}
        <Button variant="danger" disabled={isMutating} onClick={() => onDelete(city.id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}
