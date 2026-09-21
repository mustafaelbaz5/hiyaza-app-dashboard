import { Sprout } from 'lucide-react';
import type { CitySummary } from '../../../types/city';
import { CityCard } from './CityCard';

interface CityListProps {
  cities: CitySummary[];
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
  isMutating: boolean;
}

export function CityList({ cities, onPublish, onUnpublish, onDelete, isMutating }: CityListProps) {
  if (cities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
          <Sprout size={26} className="text-brand-500" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-gray-900 font-medium">لا توجد مدن مضافة بعد</p>
          <p className="text-sm text-gray-500 mt-1">ابدأ برفع أول ملف Excel لإضافة مدينة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cities.map((city) => (
        <CityCard
          key={city.id}
          city={city}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          onDelete={onDelete}
          isMutating={isMutating}
        />
      ))}
    </div>
  );
}
