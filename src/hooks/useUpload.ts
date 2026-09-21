import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { parseExcelFile } from '../services/excel.service';
import { uploadCity } from '../services/city.service';
import type { ExcelParseResult } from '../types/excel';

export type UploadState =
  | { status: 'idle' }
  | { status: 'parsing'; fileName: string }
  | { status: 'preview'; result: ExcelParseResult }
  | { status: 'uploading'; progress: number; current: string }
  | { status: 'success'; cityId: string; cityName: string }
  | { status: 'error'; message: string };

export function useUpload() {
  const [state, setState] = useState<UploadState>({ status: 'idle' });
  const queryClient = useQueryClient();

  const selectFile = useCallback(async (file: File) => {
    setState({ status: 'parsing', fileName: file.name });
    try {
      const result = await parseExcelFile(file);
      if (result.errors.length > 0) {
        setState({ status: 'error', message: result.errors.join('، ') });
        return;
      }
      setState({ status: 'preview', result });
    } catch {
      setState({ status: 'error', message: 'الملف مش Excel' });
    }
  }, []);

  const confirmUpload = useCallback(
    async (result: ExcelParseResult) => {
      setState({ status: 'uploading', progress: 10, current: 'جاري التحقق من البيانات...' });
      try {
        setState({ status: 'uploading', progress: 20, current: 'جاري إنشاء المدينة...' });
        const cityId = await uploadCity(result.cityMeta, result.basins, result.parcels);

        setState({ status: 'uploading', progress: 90, current: 'جاري إنهاء الرفع...' });
        await queryClient.invalidateQueries({ queryKey: ['cities'] });

        setState({ status: 'success', cityId, cityName: result.cityMeta.name });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'فشل الاتصال بقاعدة البيانات';
        setState({ status: 'error', message });
      }
    },
    [queryClient]
  );

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, selectFile, confirmUpload, reset };
}
