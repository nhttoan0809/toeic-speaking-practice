import { useState } from 'react';
import { useAdminManager } from '../../hooks/useAdminManager';
import AdminTable from '../AdminTable';
import type { Column } from '../AdminTable';
import AdminModal from '../AdminModal';
import ImageUpload from '../ImageUpload';
import { supabase } from '../../../../lib/supabase';
import { uploadImage } from '../../../../lib/storage';
import type { Post } from '../../../../lib/types';

export default function PostTab() {
  const { data, loading, fetchData, deleteItem } = useAdminManager<Post>('posts', 'posts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Post | null>(null);

  type PostFormData = Omit<Partial<Post>, 'image_url'> & {
    image_url?: string | File;
  };
  const [formData, setFormData] = useState<PostFormData>({});

  const [saving, setSaving] = useState(false);

  const columns: Column<Post>[] = [
    {
      header: 'Thumbnail',
      render: (item) => (
        <img
          src={item.image_url}
          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100 shadow-sm"
          alt="Thumbnail"
        />
      ),
      width: 'w-24',
    },
    {
      header: 'Nội dung',
      render: (item) => (
        <div className="max-w-xs truncate font-medium text-slate-700">{item.content}</div>
      ),
    },
    {
      header: 'Liên kết',
      render: (item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline text-sm font-bold truncate block max-w-[150px]"
        >
          {item.link}
        </a>
      ),
      width: 'w-40',
    },
  ];

  const handleOpenModal = (item?: Post) => {
    setEditingItem(item ?? null);
    setFormData(item ?? { image_url: '', content: '', link: '' });
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
        finalImageUrl = await uploadImage('posts', 'post-images', finalImageUrl);
      }

      const saveData = {
        ...formData,
        image_url: finalImageUrl,
      };

      if (editingItem) {
        const { error } = await supabase.from('posts').update(saveData).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('posts').insert([saveData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      void fetchData();
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Lỗi khi lưu bài viết.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Post Management</h2>
        <button
          onClick={() => {
            handleOpenModal();
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg text-sm cursor-pointer"
        >
          Thêm Bài viết
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
        title={editingItem ? 'Chỉnh sửa Bài viết' : 'Thêm Bài viết mới'}
        onSubmit={(e) => {
          void handleSave(e);
        }}
        loading={saving}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh</label>
            <ImageUpload
              value={formData.image_url ?? ''}
              onChange={(url) => {
                setFormData({ ...formData, image_url: url as string | File });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung</label>
            <textarea
              value={formData.content ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              rows={5}
              placeholder="Nhập nội dung bài viết..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              External Link (FB...)
            </label>
            <input
              type="text"
              value={formData.link ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, link: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
