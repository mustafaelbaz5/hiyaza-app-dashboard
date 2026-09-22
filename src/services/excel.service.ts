import * as XLSX from "xlsx";
import type { BasinRow, CityMeta, ExcelParseResult, ParcelRow } from "../types/excel";
import {
  ASSOCIATION_TYPE_MAP,
  BASIN_COLUMNS,
  BASINS_SHEET_NAME,
  PARCEL_COLUMNS,
  PARCELS_SHEET_NAME,
} from "../utils/excel-columns";

type ExcelRow = Record<string, unknown>;

export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  const errors: string[] = [];

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  if (!workbook.SheetNames.includes(PARCELS_SHEET_NAME)) {
    errors.push(`مفيش شيت "${PARCELS_SHEET_NAME}"`);
  }
  if (!workbook.SheetNames.includes(BASINS_SHEET_NAME)) {
    errors.push(`مفيش شيت "${BASINS_SHEET_NAME}"`);
  }
  if (errors.length > 0) {
    return { cityMeta: emptyCityMeta(), basins: [], parcels: [], errors };
  }

  const parcelsSheet = workbook.Sheets[PARCELS_SHEET_NAME];
  const basinsSheet = workbook.Sheets[BASINS_SHEET_NAME];

  const parcelRows = XLSX.utils.sheet_to_json<ExcelRow>(parcelsSheet, { defval: "" });
  const basinRows = XLSX.utils.sheet_to_json<ExcelRow>(basinsSheet, { defval: "" });

  if (parcelRows.length === 0) {
    errors.push("الملف فاضي");
    return { cityMeta: emptyCityMeta(), basins: [], parcels: [], errors };
  }

  const parcels = parcelRows.filter(isRealParcelRow).map(parseParcelRow);

  const basins = basinRows.map(parseBasinRow);

  const cityMeta = extractCityMeta(parcels);

  return { cityMeta, basins, parcels, errors };
}

function emptyCityMeta(): CityMeta {
  return {
    name: "",
    association_type: "agricultural_credit",
    directorate: "",
    administration: "",
    association_code: "",
  };
}

function isRealParcelRow(row: ExcelRow): boolean {
  const holdingId = String(row[PARCEL_COLUMNS.holding_id_number] ?? "").trim();
  const holderName = String(row[PARCEL_COLUMNS.holder_name] ?? "").trim();
  return holdingId !== "" || holderName !== "";
}

function parseParcelRow(row: ExcelRow): ParcelRow {
  return {
    directorate: toText(row[PARCEL_COLUMNS.directorate]),
    administration: toText(row[PARCEL_COLUMNS.administration]),
    association_name: toText(row[PARCEL_COLUMNS.association_name]),
    association_code: toText(row[PARCEL_COLUMNS.association_code]),
    association_type: toText(row[PARCEL_COLUMNS.association_type]),
    basin_name: toText(row[PARCEL_COLUMNS.basin_name]),
    basin_code: toText(row[PARCEL_COLUMNS.basin_code]),
    holding_id_number: toText(row[PARCEL_COLUMNS.holding_id_number]),
    unified_holding_id: toText(row[PARCEL_COLUMNS.unified_holding_id]),
    registry_page: toText(row[PARCEL_COLUMNS.registry_page]),
    national_id: toText(row[PARCEL_COLUMNS.national_id]),
    holder_name: toText(row[PARCEL_COLUMNS.holder_name]),
    parcel_count_in_holding: toNumber(row[PARCEL_COLUMNS.parcel_count_in_holding]),
    land_number: toText(row[PARCEL_COLUMNS.land_number]),
    area_feddan: toNumber(row[PARCEL_COLUMNS.area_feddan]),
    area_qirat: toNumber(row[PARCEL_COLUMNS.area_qirat]),
    area_sahm: toNumber(row[PARCEL_COLUMNS.area_sahm]),
    area_sqm: toNumber(row[PARCEL_COLUMNS.area_sqm]),
    border_north: toText(row[PARCEL_COLUMNS.border_north]),
    border_south: toText(row[PARCEL_COLUMNS.border_south]),
    border_east: toText(row[PARCEL_COLUMNS.border_east]),
    border_west: toText(row[PARCEL_COLUMNS.border_west]),
  };
}

function parseBasinRow(row: ExcelRow): BasinRow {
  return {
    basin_name: toText(row[BASIN_COLUMNS.basin_name]),
    basin_code: toText(row[BASIN_COLUMNS.basin_code]),
    total_feddan: 0,
    total_qirat: 0,
    total_sahm: 0,
    total_sqm: toNumber(row[BASIN_COLUMNS.total_sqm]),
    parcel_count: toNumber(row[BASIN_COLUMNS.parcel_count]),
  };
}

function extractCityMeta(parcels: ParcelRow[]): CityMeta {
  const first = parcels[0];
  if (!first) return emptyCityMeta();

  return {
    name: first.association_name,
    association_type: resolveAssociationType(first.association_type),
    directorate: first.directorate,
    administration: first.administration,
    association_code: first.association_code,
  };
}

function resolveAssociationType(value: string): "agricultural_credit" | "agricultural_reform" {
  return ASSOCIATION_TYPE_MAP[value.trim()] ?? "agricultural_credit";
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}
