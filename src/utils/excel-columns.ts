export const PARCELS_SHEET_NAME = 'كل الحيازات';

export const PARCEL_COLUMNS = {
  directorate: 'المديرية',
  administration: 'الإدارة',
  association_name: 'الجمعية',
  association_type: 'نوع الجمعية',
  association_code: 'كود الجمعية',
  basin_name: 'اسم الحوض',
  basin_code: 'كود الحوض',
  holding_id_number: 'رقم الحيازة',
  unified_holding_id: 'الرقم الموحد للحيازة',
  registry_page: 'رقم الصفحة بالسجل',
  national_id: 'الرقم القومي',
  holder_name: 'اسم الحائز',
  parcel_count_in_holding: 'عدد القطع بالحيازة',
  land_number: 'رقم الأرض',
  area_feddan: 'فدان',
  area_qirat: 'قيراط',
  area_sahm: 'سهم',
  area_sqm: 'مساحة القطعة - م²',
  border_north: 'حد بحري',
  border_south: 'حد قبلي',
  border_east: 'حد شرقي',
  border_west: 'حد غربي',
} as const;

export const BASINS_SHEET_NAME = 'ملخص الأحواض';

export const BASIN_COLUMNS = {
  basin_name: 'اسم الحوض',
  basin_code: 'كود الحوض',
  parcel_count: 'عدد القطع',
  total_sqm: 'إجمالي المساحة - م²',
} as const;

export const ASSOCIATION_TYPE_MAP: Record<string, 'agricultural_credit' | 'agricultural_reform'> = {
  'الائتمان الزراعي': 'agricultural_credit',
  'ائتمان الزراعي': 'agricultural_credit',
  'ائتمان': 'agricultural_credit',
  'الإصلاح الزراعي': 'agricultural_reform',
  'إصلاح الزراعي': 'agricultural_reform',
  'إصلاح': 'agricultural_reform',
  'اصلاح': 'agricultural_reform',
};

export function resolveAssociationType(value: string): 'agricultural_credit' | 'agricultural_reform' {
  if (!value) return 'agricultural_credit';

  const normalized = value.trim().toLowerCase();

  // Try exact match first
  const mapped = ASSOCIATION_TYPE_MAP[value.trim()];
  if (mapped) return mapped;

  // Fallback: keyword matching for robustness
  if (normalized.includes('ائتمان')) return 'agricultural_credit';
  if (normalized.includes('اصلاح') || normalized.includes('إصلاح')) return 'agricultural_reform';

  return 'agricultural_credit';
}
