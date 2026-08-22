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
    return <p className="text-center text-gray-500 py-12">لا توجد مدن مضافة بعد</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
