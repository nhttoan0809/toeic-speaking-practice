import { useState } from 'react';
import { useAdminManager } from '../../hooks/useAdminManager';
import AdminTable from '../AdminTable';
import type { Column } from '../AdminTable';
import AdminModal from '../AdminModal';
import { supabase } from '../../../../lib/supabase';
import type { Banner } from '../../../../lib/types';

export default function BannerTab() {
  const { data, loading, fetchData, deleteItem } = useAdminManager<Banner>('banners');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Partial<Banner>>({});
  const [saving, setSaving] = useState(false);

  const columns: Column<Banner>[] = [
    {
      header: 'Nội dung Slogan',
      render: (item) => (
        <div className="max-w-[200px] truncate wrap-break-word text-xs text-slate-500">
          {item.text}
        </div>
      ),
    },
    {
      header: 'Trạng thái',
      render: (item) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${item.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}
        >
          {item.is_active ? 'Đang bật' : 'Đã tắt'}
        </span>
      ),
      width: 'w-32',
    },
  ];

  const handleOpenModal = (item?: Banner) => {
    setEditingItem(item ?? null);
    setFormData(item ?? { text: '', is_active: true });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase.from('banners').update(formData).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('banners').insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      void fetchData();
    } catch (err) {
      console.error('Error saving banner:', err);
      alert('Lỗi khi lưu banner.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Banner Management</h2>
        <button
          onClick={() => {
            handleOpenModal();
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg text-sm cursor-pointer"
        >
          Thêm Banner
        </button>
      </div>

      <AdminTable
        data={data}
        columns={columns}
        loading={loading}
        onEdit={(item) => {
          handleOpenModal(item);
        }}
        onDelete={(item) => {
          void deleteItem(item.id);
        }}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={editingItem ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
        onSubmit={(e) => {
          void handleSave(e);
        }}
        loading={saving}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Slogan Text</label>
            <textarea
              value={formData.text ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, text: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              rows={4}
              placeholder="Nhập nội dung slogan..."
              required
            />
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => {
                setFormData({ ...formData, is_active: e.target.checked });
              }}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">
              Kích hoạt ngay
            </label>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
