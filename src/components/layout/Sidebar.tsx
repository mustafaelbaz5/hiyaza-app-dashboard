import { NavLink } from 'react-router-dom';
import { Sprout, PlusCircle, LandPlot } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-screen sticky top-0 flex flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-card">
          <LandPlot className="text-white" size={18} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">HiyazaFinder</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">لوحة تحكم حيازة</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="px-3 pb-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide">القائمة</p>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300'
            }`
          }
        >
          <Sprout size={18} />
          المدن الزراعية
        </NavLink>

        <NavLink
          to="/cities/new"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300'
            }`
          }
        >
          <PlusCircle size={18} />
          إضافة مدينة
        </NavLink>
      </nav>

      <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">الإصدار 1.0</p>
      </div>
    </aside>
  );
}
