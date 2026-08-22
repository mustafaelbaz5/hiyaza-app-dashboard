import { Badge } from '../../ui/Badge';

interface CityStatusBadgeProps {
  isPublished: boolean;
}

export function CityStatusBadge({ isPublished }: CityStatusBadgeProps) {
  return isPublished ? (
    <Badge tone="green">● منشورة</Badge>
  ) : (
    <Badge tone="gray">○ مسودة</Badge>
  );
}
