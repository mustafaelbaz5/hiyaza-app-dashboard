export type AssociationType = "agricultural_credit" | "agricultural_reform";

export interface City {
  id: string;
  name: string;
  association_type: AssociationType;
  association_subtype: string | null;
  directorate: string | null;
  administration: string | null;
  data_version: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CitySummary extends City {
  basin_count: number;
  parcel_count: number;
}

export interface Basin {
  id: string;
  city_id: string;
  basin_name: string;
  basin_code: string | null;
  total_feddan: number;
  total_qirat: number;
  total_sahm: number;
  total_sqm: number;
  parcel_count: number;
}

export interface Parcel {
  city_id: string;
  basin_id: string | null;
  directorate: string | null;
  administration: string | null;
  association_name: string | null;
  association_code: string | null;
  association_type: AssociationType | null;
  basin_name: string | null;
  basin_code: string | null;
  holding_id_number: string | null;
  unified_holding_id: string | null;
  registry_page: string | null;
  parcel_count_in_holding: number | null;
  national_id: string | null;
  holder_name: string | null;
  land_number: string | null;
  area_feddan: number;
  area_qirat: number;
  area_sahm: number;
  area_sqm: number;
  border_north: string | null;
  border_south: string | null;
  border_east: string | null;
  border_west: string | null;
}

export interface CityStats {
  basin_count: number;
  parcel_count: number;
}
