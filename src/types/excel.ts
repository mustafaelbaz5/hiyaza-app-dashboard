export interface ExcelParseResult {
  cityMeta: CityMeta;
  basins: BasinRow[];
  parcels: ParcelRow[];
  errors: string[];
}

export interface CityMeta {
  name: string;
  association_type: 'agricultural_credit' | 'agricultural_reform';
  directorate: string;
  administration: string;
  association_code: string;
}

export interface BasinRow {
  basin_name: string;
  basin_code: string;
  total_feddan: number;
  total_qirat: number;
  total_sahm: number;
  total_sqm: number;
  parcel_count: number;
}

export interface ParcelRow {
  directorate: string;
  administration: string;
  association_name: string;
  association_code: string;
  association_type: string;
  basin_name: string;
  basin_code: string;
  holding_id_number: string;
  unified_holding_id: string;
  registry_page: string;
  national_id: string;
  holder_name: string;
  parcel_count_in_holding: number;
  land_number: string;
  area_feddan: number;
  area_qirat: number;
  area_sahm: number;
  area_sqm: number;
  border_north: string;
  border_south: string;
  border_east: string;
  border_west: string;
}
