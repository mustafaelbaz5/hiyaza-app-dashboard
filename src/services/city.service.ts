import { supabase } from "../config/supabase";
import type { BasinRow, CityMeta, ParcelRow } from "../types/excel";
import type { Basin, City, CityStats, CitySummary } from "../types/city";
import { ASSOCIATION_TYPE_MAP } from "../utils/excel-columns";

export async function getCities(): Promise<CitySummary[]> {
  const { data, error } = await supabase
    .from("city_summaries")
    .select(
      "id,name,association_type,association_subtype,directorate,administration,data_version,is_published,created_at,updated_at,basins_count,parcels_count",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "فشل الاتصال بقاعدة البيانات");

  return (data ?? []).map((row) => {
    const city = row as unknown as City & {
      basins_count: number | null;
      parcels_count: number | null;
    };

    return {
      ...city,
      basin_count: city.basins_count ?? 0,
      parcel_count: city.parcels_count ?? 0,
    };
  });
}
export async function getCity(id: string): Promise<City> {
  const { data, error } = await supabase
    .from("cities")
    .select(
      "id,name,association_type,association_subtype,directorate,administration,data_version,is_published,created_at,updated_at",
    )
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message || "فشل الاتصال بقاعدة البيانات");
  return data as City;
}

export async function getCityBasins(cityId: string): Promise<Basin[]> {
  const { data, error } = await supabase
    .from("basins")
    .select("id,city_id,basin_name,basin_code,total_feddan,total_qirat,total_sahm,total_sqm,parcel_count")
    .eq("city_id", cityId)
    .order("basin_name", { ascending: true });

  if (error) throw new Error(error.message || "فشل الاتصال بقاعدة البيانات");
  return (data ?? []) as Basin[];
}

export async function getCityStats(cityId: string): Promise<CityStats> {
  const { data, error } = await supabase
    .from("city_summaries")
    .select("basins_count,parcels_count")
    .eq("id", cityId)
    .single();

  if (error) throw new Error(error.message || "فشل الاتصال بقاعدة البيانات");

  return {
    basin_count: data?.basins_count ?? 0,
    parcel_count: data?.parcels_count ?? 0,
  };
}
export async function uploadCity(meta: CityMeta, basins: BasinRow[], parcels: ParcelRow[]): Promise<string> {
  const { data: existing } = await supabase.from("cities").select("id").ilike("name", meta.name).maybeSingle();

  if (existing) throw new Error("المدينة دي موجودة بالفعل");

  const normalizedParcels = parcels.map((parcel) => ({
    ...parcel,
    association_type: ASSOCIATION_TYPE_MAP[parcel.association_type.trim()] ?? meta.association_type,
  }));

  const { data, error } = await supabase.rpc("insert_city_with_data", {
    p_name: meta.name,
    p_association_type: meta.association_type,
    p_association_subtype: null,
    p_directorate: meta.directorate,
    p_administration: meta.administration,
    p_basins: basins,
    p_parcels: normalizedParcels,
  });

  if (error) throw new Error(error.message || "فشل رفع البيانات");
  return data as string;
}

export async function publishCity(cityId: string): Promise<void> {
  const { error } = await supabase.rpc("publish_city", { p_city_id: cityId });
  if (error) throw new Error(error.message || "فشل نشر المدينة");
}

export async function unpublishCity(cityId: string): Promise<void> {
  const { error } = await supabase.rpc("unpublish_city", { p_city_id: cityId });
  if (error) throw new Error(error.message || "فشل إلغاء نشر المدينة");
}

export async function deleteCity(cityId: string): Promise<void> {
  const { error } = await supabase.rpc("delete_city", { p_city_id: cityId });
  if (error) throw new Error(error.message || "فشل حذف المدينة");
}
