import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useCities, useDeleteCity, usePublishCity, useUnpublishCity } from '../hooks/useCities';
import { CityList } from '../components/features/cities/CityList';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TopBar } from '../components/layout/TopBar';
import { formatNumber } from '../utils/formatters';

export function CitiesPage() {
  const { data: cities, isLoading, isError, error } = useCities();
  const publishMutation = usePublishCity();
  const unpublishMutation = useUnpublishCity();
  const deleteMutation = useDeleteCity();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const isMutating =
    publishMutation.isPending || unpublishMutation.isPending || deleteMutation.isPending;

  const pendingCity = cities?.find((c) => c.id === pendingDeleteId);

  return (
    <div>
      <TopBar
        title="المدن الزراعية"
        subtitle={cities ? `${formatNumber(cities.length)} مدينة مضافة` : undefined}
        actions={
          <Link to="/cities/new">
            <Button>
              <PlusCircle size={16} />
              إضافة مدينة
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {isLoading && (
          <div className="flex justify-center py-24">
            <Spinner size={32} />
          </div>
        )}

        {isError && (
          <Alert kind="error">{error instanceof Error ? error.message : 'فشل الاتصال بقاعدة البيانات'}</Alert>
        )}

        {cities && (
          <CityList
            cities={cities}
            onPublish={(id) => publishMutation.mutate(id)}
            onUnpublish={(id) => unpublishMutation.mutate(id)}
            onDelete={setPendingDeleteId}
            isMutating={isMutating}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!pendingDeleteId}
        title="حذف المدينة"
        message={`هل أنت متأكد من حذف "${pendingCity?.name ?? ''}"؟ سيتم حذف كل الأحواض والقطع المرتبطة بها ولا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف نهائيًا"
        isLoading={deleteMutation.isPending}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (!pendingDeleteId) return;
          deleteMutation.mutate(pendingDeleteId, { onSuccess: () => setPendingDeleteId(null) });
        }}
      />
    </div>
  );
}
