import { NavLink } from 'react-router-dom';
import { Sprout, PlusCircle } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-l border-gray-200 bg-white h-screen sticky top-0 p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 px-2 py-3 mb-2">
        <Sprout className="text-emerald-600" size={22} />
        <span className="font-semibold text-gray-900">HiyazaFinder</span>
      </div>

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
            isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        <Sprout size={18} />
        المدن الزراعية
      </NavLink>

      <NavLink
        to="/cities/new"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
            isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        <PlusCircle size={18} />
        إضافة مدينة
      </NavLink>
    </aside>
  );
}
