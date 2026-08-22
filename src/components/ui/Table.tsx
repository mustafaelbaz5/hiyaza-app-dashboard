import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export interface TableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  key: string;
  align?: 'right' | 'left' | 'center';
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function Table<T>({ columns, rows, rowKey, emptyMessage = 'لا توجد بيانات' }: TableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400 dark:text-gray-600">
        <Inbox size={28} strokeWidth={1.5} />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-right border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide text-${col.align ?? 'right'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-gray-700 dark:text-gray-300 text-${col.align ?? 'right'}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
