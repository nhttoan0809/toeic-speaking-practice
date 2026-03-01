import { useState } from 'react';
import { useAdminManager } from '../../hooks/useAdminManager';
import AdminTable from '../AdminTable';
import type { Column } from '../AdminTable';
import AdminModal from '../AdminModal';
import { supabase } from '../../../../lib/supabase';
import type { Contact } from '../../../../lib/types';

export default function ContactTab() {
  const { data, loading, fetchData, deleteItem } = useAdminManager<Contact>('contacts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Partial<Contact>>({});
  const [saving, setSaving] = useState(false);

  const columns: Column<Contact>[] = [
    {
      header: 'Nền tảng',
      render: (item) => (
        <span className="capitalize text-sm font-black text-primary bg-primary/5 px-3 py-1 rounded-full">
          {item.platform_id}
        </span>
      ),
      width: 'w-32',
    },
    {
      header: 'Tên / Nhãn',
      render: (item) => (
        <div>
          <div className="text-sm md:text-base font-bold text-slate-700">{item.name}</div>
          <div className="text-xs text-slate-400 font-medium italic">{item.label}</div>
        </div>
      ),
    },
    {
      header: 'Link',
      render: (item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 hover:text-primary transition-colors text-xs truncate block max-w-[150px]"
        >
          {item.link}
        </a>
      ),
    },
  ];

  const handleOpenModal = (item?: Contact) => {
    setEditingItem(item ?? null);
    setFormData(
      item ?? {
        platform_id: 'fanpage',
        name: '',
        label: '',
        description: '',
        link: '',
        delay: 0.1,
      },
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase.from('contacts').update(formData).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('contacts').insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      void fetchData();
    } catch (err) {
      console.error('Error saving contact:', err);
      alert('Lỗi khi lưu thông tin liên hệ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Contact Management</h2>
        <button
          onClick={() => {
            handleOpenModal();
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg text-sm cursor-pointer"
        >
          Thêm Liên hệ
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
        title={editingItem ? 'Chỉnh sửa Liên hệ' : 'Thêm Liên hệ mới'}
        onSubmit={(e) => {
          void handleSave(e);
        }}
        loading={saving}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nền tảng</label>
              <select
                value={formData.platform_id}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    platform_id: e.target.value as Contact['platform_id'],
                  });
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700 appearance-none bg-white"
              >
                <option value="fanpage">Fanpage</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook Personal</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Animation Delay</label>
              <input
                type="number"
                step="0.1"
                value={formData.delay ?? 0.1}
                onChange={(e) => {
                  setFormData({ ...formData, delay: parseFloat(e.target.value) });
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tên hiển thị</label>
            <input
              type="text"
              value={formData.name ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              placeholder="Ví dụ: Ms.Smile Fanpage..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Label (@...)</label>
            <input
              type="text"
              value={formData.label ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, label: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder="Ví dụ: @mssmile.toeic..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả</label>
            <textarea
              value={formData.description ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              rows={2}
              placeholder="Mô tả ngắn gọn về kênh này..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Link liên kết</label>
            <input
              type="url"
              value={formData.link ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, link: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-primary font-medium"
              placeholder="https://..."
              required
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
