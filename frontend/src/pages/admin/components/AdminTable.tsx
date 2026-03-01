import { Edit2, Trash2, Loader2 } from 'lucide-react';

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
  alignRight?: boolean;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  emptyMessage?: string;
}

export default function AdminTable<T extends { id: number }>({
  data,
  columns,
  loading,
  onEdit,
  onDelete,
  emptyMessage = 'Chưa có bản ghi nào.',
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto custom-scrollbar">
      <table className="w-full text-left min-w-[700px]">
        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 w-20">ID</th>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-6 py-4 ${col.width ?? ''} ${col.alignRight ? 'text-right' : ''}`}
              >
                {col.header}
              </th>
            ))}
            <th className="px-6 py-4 text-right w-32">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4 font-medium text-slate-400 text-sm italic">#{item.id}</td>
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`px-6 py-4 text-sm md:text-base text-slate-700 ${
                    col.alignRight ? 'text-right' : ''
                  }`}
                >
                  {col.render(item)}
                </td>
              ))}
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => {
                    onEdit(item);
                  }}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    onDelete(item);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
