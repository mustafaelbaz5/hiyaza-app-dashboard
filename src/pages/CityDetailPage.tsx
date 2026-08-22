import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCity, useCityBasins, useCityStats } from '../hooks/useCity';
import { useDeleteCity, useUnpublishCity } from '../hooks/useCities';
import { CityStatusBadge } from '../components/features/cities/CityStatusBadge';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { formatAssociationType, formatNumber } from '../utils/formatters';

export function CityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cityId = id ?? '';

  const { data: city, isLoading: isCityLoading, isError: isCityError } = useCity(cityId);
  const { data: basins, isLoading: isBasinsLoading } = useCityBasins(cityId);
  const { data: stats } = useCityStats(cityId);

  const unpublishMutation = useUnpublishCity();
  const deleteMutation = useDeleteCity();

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف المدينة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteMutation.mutate(cityId, { onSuccess: () => navigate('/') });
    }
  };

  if (isCityLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size={32} />
      </div>
    );
  }

  if (isCityError || !city) {
    return <Alert kind="error">فشل الاتصال بقاعدة البيانات</Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowRight size={16} />
          {city.name}
        </button>
        <CityStatusBadge isPublished={city.is_published} />
      </div>

      <p className="text-sm text-gray-500">
        {formatAssociationType(city.association_type)} | {city.administration || '-'} | {city.directorate || '-'}
      </p>

      {stats && (
        <p className="text-sm text-gray-700">
          {formatNumber(stats.parcel_count)} قطعة | {formatNumber(stats.basin_count)} حوض
        </p>
      )}

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">الأحواض</h3>
        {isBasinsLoading ? (
          <Spinner />
        ) : (
          <Table
            columns={[
              { key: 'name', header: 'اسم الحوض', render: (b) => b.basin_name },
              { key: 'code', header: 'الكود', render: (b) => b.basin_code || '-' },
              { key: 'count', header: 'القطع', render: (b) => formatNumber(b.parcel_count) },
            ]}
            rows={basins ?? []}
            rowKey={(b) => b.id}
          />
        )}
      </div>

      <div className="flex items-center gap-2 pt-4">
        {city.is_published && (
          <Button variant="secondary" onClick={() => unpublishMutation.mutate(cityId)}>
            إلغاء النشر
          </Button>
        )}
        <Button variant="danger" onClick={handleDelete}>
          حذف المدينة
        </Button>
      </div>
    </div>
  );
}
