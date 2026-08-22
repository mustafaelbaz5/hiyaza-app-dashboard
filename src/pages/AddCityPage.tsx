import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUpload } from '../hooks/useUpload';
import { DropZone } from '../components/features/upload/DropZone';
import { ExcelPreview } from '../components/features/upload/ExcelPreview';
import { UploadProgress } from '../components/features/upload/UploadProgress';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';

export function AddCityPage() {
  const navigate = useNavigate();
  const { state, selectFile, confirmUpload, reset } = useUpload();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowRight size={16} />
        إضافة مدينة جديدة
      </button>

      {state.status === 'idle' && <DropZone onFileSelected={selectFile} />}

      {state.status === 'parsing' && (
        <div className="flex items-center gap-3 justify-center py-10">
          <Spinner />
          <span className="text-gray-600">جاري قراءة ملف Excel...</span>
        </div>
      )}

      {state.status === 'error' && (
        <div className="space-y-4">
          <Alert kind="error">{state.message}</Alert>
          <Button variant="secondary" onClick={reset}>
            حاول تاني
          </Button>
        </div>
      )}

      {state.status === 'preview' && (
        <div className="space-y-4">
          <ExcelPreview result={state.result} />
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={reset}>
              إلغاء
            </Button>
            <Button onClick={() => confirmUpload(state.result)}>رفع إلى قاعدة البيانات</Button>
          </div>
        </div>
      )}

      {state.status === 'uploading' && (
        <UploadProgress progress={state.progress} current={state.current} />
      )}

      {state.status === 'success' && (
        <div className="space-y-4">
          <Alert kind="success">تم رفع "{state.cityName}" بنجاح ✓</Alert>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate(`/cities/${state.cityId}`)}>عرض المدينة</Button>
            <Button variant="secondary" onClick={reset}>
              إضافة مدينة أخرى
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
