import { supabase } from '../config/supabase';
import type { BasinRow, CityMeta, ParcelRow } from '../types/excel';
import type { Basin, City, CityStats, CitySummary } from '../types/city';

export async function getCities(): Promise<CitySummary[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*, basins(count), parcels(count)')
    .order('created_at', { ascending: false });

  if (error) throw new Error('فشل الاتصال بقاعدة البيانات');

  return (data ?? []).map((row) => {
    const { basins, parcels, ...city } = row as unknown as City & {
      basins: { count: number }[];
      parcels: { count: number }[];
    };
    return {
      ...city,
      basin_count: basins?.[0]?.count ?? 0,
      parcel_count: parcels?.[0]?.count ?? 0,
    };
  });
}

export async function getCity(id: string): Promise<City> {
  const { data, error } = await supabase.from('cities').select('*').eq('id', id).single();
  if (error) throw new Error('فشل الاتصال بقاعدة البيانات');
  return data as City;
}

export async function getCityBasins(cityId: string): Promise<Basin[]> {
  const { data, error } = await supabase
    .from('basins')
    .select('*')
    .eq('city_id', cityId)
    .order('basin_name', { ascending: true });

  if (error) throw new Error('فشل الاتصال بقاعدة البيانات');
  return (data ?? []) as Basin[];
}

export async function getCityStats(cityId: string): Promise<CityStats> {
  const [{ count: basinCount, error: basinError }, { count: parcelCount, error: parcelError }] =
    await Promise.all([
      supabase.from('basins').select('*', { count: 'exact', head: true }).eq('city_id', cityId),
      supabase.from('parcels').select('*', { count: 'exact', head: true }).eq('city_id', cityId),
    ]);

  if (basinError || parcelError) throw new Error('فشل الاتصال بقاعدة البيانات');

  return {
    basin_count: basinCount ?? 0,
    parcel_count: parcelCount ?? 0,
  };
}

export async function uploadCity(
  meta: CityMeta,
  basins: BasinRow[],
  parcels: ParcelRow[]
): Promise<string> {
  const { data: existing } = await supabase
    .from('cities')
    .select('id')
    .ilike('name', meta.name)
    .maybeSingle();

  if (existing) throw new Error('المدينة دي موجودة بالفعل');

  const { data, error } = await supabase.rpc('insert_city_with_data', {
    p_name: meta.name,
    p_association_type: meta.association_type,
    p_association_subtype: null,
    p_directorate: meta.directorate,
    p_administration: meta.administration,
    p_basins: basins,
    p_parcels: parcels,
  });

  if (error) throw new Error('فشل رفع البيانات');
  return data as string;
}

export async function publishCity(cityId: string): Promise<void> {
  const { error } = await supabase.rpc('publish_city', { p_city_id: cityId });
  if (error) throw new Error('فشل نشر المدينة');
}

export async function unpublishCity(cityId: string): Promise<void> {
  const { error } = await supabase.rpc('unpublish_city', { p_city_id: cityId });
  if (error) throw new Error('فشل إلغاء نشر المدينة');
}

export async function deleteCity(cityId: string): Promise<void> {
  const { error } = await supabase.rpc('delete_city', { p_city_id: cityId });
  if (error) throw new Error('فشل حذف المدينة');
}
