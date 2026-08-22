import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useCities, useDeleteCity, usePublishCity, useUnpublishCity } from '../hooks/useCities';
import { CityList } from '../components/features/cities/CityList';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';

export function CitiesPage() {
  const { data: cities, isLoading, isError } = useCities();
  const publishMutation = usePublishCity();
  const unpublishMutation = useUnpublishCity();
  const deleteMutation = useDeleteCity();

  const isMutating =
    publishMutation.isPending || unpublishMutation.isPending || deleteMutation.isPending;

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف المدينة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">المدن الزراعية</h2>
        <Link to="/cities/new">
          <Button>
            <span className="flex items-center gap-2">
              <PlusCircle size={16} />
              إضافة مدينة
            </span>
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size={32} />
        </div>
      )}

      {isError && <Alert kind="error">فشل الاتصال بقاعدة البيانات</Alert>}

      {cities && (
        <CityList
          cities={cities}
          onPublish={(id) => publishMutation.mutate(id)}
          onUnpublish={(id) => unpublishMutation.mutate(id)}
          onDelete={handleDelete}
          isMutating={isMutating}
        />
      )}
    </div>
  );
}
