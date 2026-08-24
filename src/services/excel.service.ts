import * as XLSX from 'xlsx';
import type { BasinRow, CityMeta, ExcelParseResult, ParcelRow } from '../types/excel';
import {
  BASIN_COLUMNS,
  BASINS_SHEET_NAME,
  PARCEL_COLUMNS,
  PARCELS_SHEET_NAME,
  resolveAssociationType,
} from '../utils/excel-columns';

type ExcelRow = Record<string, unknown>;

function findColumnValue(row: ExcelRow, expectedKey: string, allHeaders: string[]): unknown {
  // First try exact match
  if (row.hasOwnProperty(expectedKey)) {
    return row[expectedKey];
  }

  // Try to find by similar string (handle whitespace/diacritical variations)
  const candidates = allHeaders.filter(
    (h) => h.trim().toLowerCase() === expectedKey.trim().toLowerCase()
  );

  if (candidates.length > 0) {
    console.warn(
      `[DEBUG] Column mismatch detected. Expected: "${expectedKey}", found: "${candidates[0]}"`
    );
    return row[candidates[0]];
  }

  console.warn(
    `[DEBUG] Column not found: "${expectedKey}". Available: ${allHeaders.slice(0, 5).join(', ')}...`
  );
  return undefined;
}

export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  const errors: string[] = [];

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

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

  const parcelRows = XLSX.utils.sheet_to_json<ExcelRow>(parcelsSheet, { defval: '' });
  const basinRows = XLSX.utils.sheet_to_json<ExcelRow>(basinsSheet, { defval: '' });

  if (parcelRows.length === 0) {
    errors.push('الملف فاضي');
    return { cityMeta: emptyCityMeta(), basins: [], parcels: [], errors };
  }

  // Log actual column headers for debugging column name mismatches
  const actualHeaders = parcelRows.length > 0 ? Object.keys(parcelRows[0]) : [];
  console.log('[DEBUG] Actual parcel column headers:', actualHeaders);

  const parcels = parcelRows
    .filter(isRealParcelRow)
    .map((row) => parseParcelRow(row, actualHeaders));

  const basins = basinRows.map(parseBasinRow);

  const cityMeta = extractCityMeta(parcels);

  return { cityMeta, basins, parcels, errors };
}

function emptyCityMeta(): CityMeta {
  return {
    name: '',
    association_type: 'agricultural_credit',
    directorate: '',
    administration: '',
    association_code: '',
  };
}

function isRealParcelRow(row: ExcelRow): boolean {
  const holdingId = String(row[PARCEL_COLUMNS.holding_id_number] ?? '').trim();
  const holderName = String(row[PARCEL_COLUMNS.holder_name] ?? '').trim();
  return holdingId !== '' || holderName !== '';
}

function parseParcelRow(row: ExcelRow, allHeaders: string[]): ParcelRow {
  return {
    directorate: toText(findColumnValue(row, PARCEL_COLUMNS.directorate, allHeaders)),
    administration: toText(findColumnValue(row, PARCEL_COLUMNS.administration, allHeaders)),
    association_name: toText(findColumnValue(row, PARCEL_COLUMNS.association_name, allHeaders)),
    association_code: toText(findColumnValue(row, PARCEL_COLUMNS.association_code, allHeaders)),
    association_type: toText(findColumnValue(row, PARCEL_COLUMNS.association_type, allHeaders)),
    basin_name: toText(findColumnValue(row, PARCEL_COLUMNS.basin_name, allHeaders)),
    basin_code: toText(findColumnValue(row, PARCEL_COLUMNS.basin_code, allHeaders)),
    holding_id_number: toText(findColumnValue(row, PARCEL_COLUMNS.holding_id_number, allHeaders)),
    unified_holding_id: toText(findColumnValue(row, PARCEL_COLUMNS.unified_holding_id, allHeaders)),
    registry_page: toText(findColumnValue(row, PARCEL_COLUMNS.registry_page, allHeaders)),
    national_id: toText(findColumnValue(row, PARCEL_COLUMNS.national_id, allHeaders)),
    holder_name: toText(findColumnValue(row, PARCEL_COLUMNS.holder_name, allHeaders)),
    parcel_count_in_holding: toNumber(findColumnValue(row, PARCEL_COLUMNS.parcel_count_in_holding, allHeaders)),
    land_number: toText(findColumnValue(row, PARCEL_COLUMNS.land_number, allHeaders)),
    area_feddan: toNumber(findColumnValue(row, PARCEL_COLUMNS.area_feddan, allHeaders)),
    area_qirat: toNumber(findColumnValue(row, PARCEL_COLUMNS.area_qirat, allHeaders)),
    area_sahm: toNumber(findColumnValue(row, PARCEL_COLUMNS.area_sahm, allHeaders)),
    area_sqm: toNumber(findColumnValue(row, PARCEL_COLUMNS.area_sqm, allHeaders)),
    border_north: toText(findColumnValue(row, PARCEL_COLUMNS.border_north, allHeaders)),
    border_south: toText(findColumnValue(row, PARCEL_COLUMNS.border_south, allHeaders)),
    border_east: toText(findColumnValue(row, PARCEL_COLUMNS.border_east, allHeaders)),
    border_west: toText(findColumnValue(row, PARCEL_COLUMNS.border_west, allHeaders)),
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


function toText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  if (!Number.isFinite(num)) {
    console.warn('[DEBUG] Invalid number conversion:', { value, result: num });
    return 0;
  }
  return num;
}
