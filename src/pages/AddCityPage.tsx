import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useUpload } from "../hooks/useUpload";
import { DropZone } from "../components/features/upload/DropZone";
import { ExcelPreview } from "../components/features/upload/ExcelPreview";
import { UploadProgress } from "../components/features/upload/UploadProgress";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { TopBar } from "../components/layout/TopBar";

export function AddCityPage() {
  const navigate = useNavigate();
  const { state, selectFile, confirmUpload, reset } = useUpload();

  return (
    <div>
      <TopBar
        title='إضافة مدينة جديدة'
        actions={
          <button
            onClick={() => navigate("/")}
            className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors'>
            العودة للقائمة
            <ArrowRight size={16} />
          </button>
        }
      />

      <div className='max-w-2xl mx-auto p-8 space-y-6'>
        {state.status === "idle" && <DropZone onFileSelected={selectFile} />}

        {state.status === "parsing" && (
          <div className='flex flex-col items-center gap-3 justify-center py-20'>
            <Spinner size={28} />
            <span className='text-sm text-gray-500'>جاري قراءة ملف Excel...</span>
          </div>
        )}

        {state.status === "error" && (
          <div className='space-y-4'>
            <Alert kind='error'>{state.message}</Alert>
            <Button
              variant='secondary'
              onClick={reset}>
              حاول تاني
            </Button>
          </div>
        )}

        {state.status === "preview" && (
          <div className='space-y-5 animate-fade-in'>
            <ExcelPreview result={state.result} />
            <div className='flex items-center justify-between'>
              <Button
                variant='ghost'
                onClick={reset}>
                إلغاء
              </Button>
              <Button onClick={() => confirmUpload(state.result)}>رفع إلى قاعدة البيانات</Button>
            </div>
          </div>
        )}

        {state.status === "uploading" && (
          <UploadProgress
            progress={state.progress}
            current={state.current}
          />
        )}

        {state.status === "success" && (
          <div className='space-y-5 animate-fade-in text-center py-6'>
            <div className='w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto'>
              <CheckCircle2
                size={28}
                className='text-brand-600'
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className='font-semibold text-gray-900'>تم رفع "{state.cityName}" بنجاح</p>
              <p className='text-sm text-gray-500 mt-1'>المدينة الآن في وضع المسودة، يمكنك نشرها من صفحة التفاصيل</p>
            </div>
            <div className='flex items-center justify-center gap-2 pt-2'>
              <Button onClick={() => navigate(`/cities/${state.cityId}`)}>عرض المدينة</Button>
              <Button
                variant='secondary'
                onClick={reset}>
                إضافة مدينة أخرى
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
