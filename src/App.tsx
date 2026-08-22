import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { CitiesPage } from './pages/CitiesPage';
import { AddCityPage } from './pages/AddCityPage';
import { CityDetailPage } from './pages/CityDetailPage';

export function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<CitiesPage />} />
        <Route path="/cities/new" element={<AddCityPage />} />
        <Route path="/cities/:id" element={<CityDetailPage />} />
      </Routes>
    </AppLayout>
  );
}
