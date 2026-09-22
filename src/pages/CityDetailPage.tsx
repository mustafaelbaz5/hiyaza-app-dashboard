import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Building2, LandPlot, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCity, useCityBasins, useCityStats } from "../hooks/useCity";
import { useDeleteCity, usePublishCity, useUnpublishCity } from "../hooks/useCities";
import { CityStatusBadge } from "../components/features/cities/CityStatusBadge";
import { Table } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { TopBar } from "../components/layout/TopBar";
import { formatAssociationType, formatNumber } from "../utils/formatters";

export function CityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cityId = id ?? "";
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: city, isLoading: isCityLoading, isError: isCityError, error } = useCity(cityId);
  const { data: basins, isLoading: isBasinsLoading } = useCityBasins(cityId);
  const { data: stats } = useCityStats(cityId);

  const publishMutation = usePublishCity();
  const unpublishMutation = useUnpublishCity();
  const deleteMutation = useDeleteCity();

  if (isCityLoading) {
    return (
      <div className='flex justify-center py-24'>
        <Spinner size={32} />
      </div>
    );
  }

  if (isCityError || !city) {
    return (
      <div className='p-8'>
        <Alert kind='error'>{error instanceof Error ? error.message : "فشل الاتصال بقاعدة البيانات"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title={city.name}
        actions={
          <button
            onClick={() => navigate("/")}
            className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors'>
            العودة للقائمة
            <ArrowRight size={16} />
          </button>
        }
      />

      <div className='p-8 space-y-6 max-w-4xl'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500'>
            <span className='flex items-center gap-1.5'>
              <Building2 size={14} />
              {formatAssociationType(city.association_type)}
            </span>
            <span className='flex items-center gap-1.5'>
              <MapPin size={14} />
              {city.administration || "-"} · {city.directorate || "-"}
            </span>
          </div>
          <CityStatusBadge isPublished={city.is_published} />
        </div>

        {stats && (
          <div className='grid grid-cols-2 gap-3 max-w-sm'>
            <div className='rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-center shadow-card'>
              <p className='text-2xl font-bold text-brand-700'>{formatNumber(stats.basin_count)}</p>
              <p className='text-xs text-gray-500 mt-0.5'>حوض</p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-center shadow-card'>
              <p className='text-2xl font-bold text-brand-700'>{formatNumber(stats.parcel_count)}</p>
              <p className='text-xs text-gray-500 mt-0.5'>قطعة</p>
            </div>
          </div>
        )}

        <div>
          <h3 className='flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3'>
            <LandPlot
              size={16}
              className='text-gray-400'
            />
            الأحواض
          </h3>
          {isBasinsLoading ?
            <div className='flex justify-center py-8'>
              <Spinner />
            </div>
          : <Table
              columns={[
                { key: "name", header: "اسم الحوض", render: (b) => b.basin_name },
                { key: "code", header: "الكود", render: (b) => b.basin_code || "-" },
                { key: "count", header: "القطع", render: (b) => formatNumber(b.parcel_count) },
              ]}
              rows={basins ?? []}
              rowKey={(b) => b.id}
            />
          }
        </div>

        <div className='flex items-center gap-2 pt-2 border-t border-gray-100'>
          <div className='flex-1' />
          {city.is_published ?
            <Button
              variant='secondary'
              onClick={() => unpublishMutation.mutate(cityId)}
              disabled={unpublishMutation.isPending}>
              إلغاء النشر
            </Button>
          : <Button
              onClick={() => publishMutation.mutate(cityId)}
              disabled={publishMutation.isPending}>
              نشر المدينة
            </Button>
          }
          <Button
            variant='danger'
            onClick={() => setIsDeleteOpen(true)}>
            <Trash2 size={14} />
            حذف المدينة
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title='حذف المدينة'
        message={`هل أنت متأكد من حذف "${city.name}"؟ سيتم حذف كل الأحواض والقطع المرتبطة بها ولا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel='حذف نهائيًا'
        isLoading={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(cityId, { onSuccess: () => navigate("/") })}
      />
    </div>
  );
}
