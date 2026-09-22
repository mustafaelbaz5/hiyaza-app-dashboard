import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { CitiesPage } from "./pages/CitiesPage";
import { AddCityPage } from "./pages/AddCityPage";
import { CityDetailPage } from "./pages/CityDetailPage";
import { AppControlPage } from "./pages/AppControlPage";
import { supabase } from "./config/supabase";
function Login() {
  const [error, setError] = useState("");
  return (
    <main
      className='min-h-screen flex items-center justify-center bg-gray-50'
      dir='rtl'>
      <form
        className='bg-white rounded-2xl shadow-card p-8 w-full max-w-sm space-y-4'
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const { error: x } = await supabase.auth.signInWithPassword({
            email: String(f.get("email")),
            password: String(f.get("password")),
          });
          if (x) setError("بيانات الدخول غير صحيحة");
        }}>
        <h1 className='text-xl font-bold text-gray-900'>دخول لوحة التحكم</h1>
        <p className='text-sm text-gray-500'>إدارة المدن والبيانات المنشورة</p>
        <input
          className='w-full border rounded-lg p-3'
          name='email'
          type='email'
          placeholder='البريد الإلكتروني'
          required
        />
        <input
          className='w-full border rounded-lg p-3'
          name='password'
          type='password'
          placeholder='كلمة المرور'
          required
        />
        <button
          className='w-full rounded-lg bg-brand-600 text-white p-3'
          type='submit'>
          دخول
        </button>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
      </form>
    </main>
  );
}
export default function App() {
  const [session, setSession] = useState<any>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const x = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => x.data.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <div className='p-8 text-right'>جارِ التحميل...</div>;
  if (!session) return <Login />;
  return (
    <AppLayout>
      <Routes>
        <Route
          path='/'
          element={<CitiesPage />}
        />
        <Route
          path='/cities/new'
          element={<AddCityPage />}
        />
        <Route
          path='/cities/:id'
          element={<CityDetailPage />}
        />
        <Route
          path='/control'
          element={<AppControlPage />}
        />
      </Routes>
    </AppLayout>
  );
}
