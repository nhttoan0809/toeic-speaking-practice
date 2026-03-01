import { useState } from 'react';
import { useAdminManager } from '../../hooks/useAdminManager';
import AdminTable from '../AdminTable';
import type { Column } from '../AdminTable';
import AdminModal from '../AdminModal';
import ImageUpload from '../ImageUpload';
import { supabase } from '../../../../lib/supabase';
import { uploadImage } from '../../../../lib/storage';
import type { Testimonial } from '../../../../lib/types';

export default function TestimonialTab() {
  const { data, loading, fetchData, deleteItem } = useAdminManager<Testimonial>(
    'testimonials',
    'testimonials',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  type TestimonialFormData = Omit<Partial<Testimonial>, 'image_url'> & {
    image_url?: string | File;
  };
  const [formData, setFormData] = useState<TestimonialFormData>({});

  const [saving, setSaving] = useState(false);

  const columns: Column<Testimonial>[] = [
    {
      header: 'Ảnh',
      render: (item) => (
        <img
          src={item.image_url}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-slate-100 border border-slate-100 shadow-sm"
          alt="Avatar"
        />
      ),
      width: 'w-24',
    },
    {
      header: 'Tiêu đề / Phụ đề',
      render: (item) => (
        <div>
          <div className="font-bold text-slate-800">{item.title}</div>
          <div className="text-xs text-slate-400 font-medium">{item.subtitle}</div>
        </div>
      ),
    },
    {
      header: 'Animation Delay',
      render: (item) => <span className="text-slate-400 text-sm italic">{item.delay ?? 0.1}s</span>,
      width: 'w-32',
    },
  ];

  const handleOpenModal = (item?: Testimonial) => {
    setEditingItem(item ?? null);
    setFormData(item ?? { image_url: '', title: '', subtitle: '', delay: 0.1 });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Vui lòng tải lên hình ảnh.');
      return;
    }
    setSaving(true);
    try {
      let finalImageUrl = formData.image_url;
      if (finalImageUrl instanceof File) {
        finalImageUrl = await uploadImage('testimonials', 'testimonial-images', finalImageUrl);
      }

      const saveData = {
        ...formData,
        image_url: finalImageUrl,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('testimonials')
          .update(saveData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([saveData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      void fetchData();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert('Lỗi khi lưu cảm nhận.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Testimonial Management</h2>
        <button
          onClick={() => {
            handleOpenModal();
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg text-sm cursor-pointer"
        >
          Thêm Cảm nhận
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
          void deleteItem(item.id, item.image_url);
        }}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={editingItem ? 'Chỉnh sửa Cảm nhận' : 'Thêm Cảm nhận mới'}
        onSubmit={(e) => {
          void handleSave(e);
        }}
        loading={saving}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh đại diện</label>
            <ImageUpload
              value={formData.image_url ?? ''}
              onChange={(url) => {
                setFormData({ ...formData, image_url: url as string | File });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Họ tên / Tiêu đề</label>
            <input
              type="text"
              value={formData.title ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              placeholder="Ví dụ: Nguyễn Văn A..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Mô tả ngắn / Phụ đề
            </label>
            <input
              type="text"
              value={formData.subtitle ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, subtitle: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder="Ví dụ: Học viên lớp 800+..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Animation Delay (sec)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.delay ?? 0.1}
              onChange={(e) => {
                setFormData({ ...formData, delay: parseFloat(e.target.value) });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
