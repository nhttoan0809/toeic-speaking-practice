import { useState } from 'react';
import { useAdminManager } from '../../hooks/useAdminManager';
import AdminTable from '../AdminTable';
import type { Column } from '../AdminTable';
import AdminModal from '../AdminModal';
import ImageUpload from '../ImageUpload';
import { supabase } from '../../../../lib/supabase';
import { uploadMultipleImages } from '../../../../lib/storage';
import type { SpeakingClubPost, TimelineEvent, ResourceLink } from '../../../../lib/types';
import { Plus, Trash2, Clock, Link as LinkIcon } from 'lucide-react';

export default function SpeakingClubTab() {
  const { data, loading, fetchData, deleteItem } = useAdminManager<SpeakingClubPost>(
    'speaking_club_posts',
    'speaking-club',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpeakingClubPost | null>(null);

  type SpeakingClubPostFormData = Omit<Partial<SpeakingClubPost>, 'images'> & {
    images?: (string | File)[];
  };
  const [formData, setFormData] = useState<SpeakingClubPostFormData>({});

  const [saving, setSaving] = useState(false);

  const columns: Column<SpeakingClubPost>[] = [
    {
      header: 'Tuần',
      render: (item) => (
        <span className="px-3 py-1 bg-accent text-white font-black text-xs rounded-full">
          W{item.week_number}
        </span>
      ),
      width: 'w-24',
    },
    {
      header: 'Tiêu đề',
      render: (item) => <div className="font-bold text-slate-800 line-clamp-1">{item.title}</div>,
    },
    {
      header: 'Nội dung',
      render: (item) => (
        <div className="text-slate-500 text-sm italic truncate max-w-xs">{item.description}</div>
      ),
    },
    {
      header: 'Ảnh',
      render: (item) => (
        <div className="flex -space-x-2">
          {item.images.slice(0, 3).map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-8 h-8 rounded-full border-2 border-white object-cover bg-slate-100"
              alt="Preview"
            />
          ))}
          {item.images.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
              +{item.images.length - 3}
            </div>
          )}
        </div>
      ),
      width: 'w-32',
    },
  ];

  const handleOpenModal = (item?: SpeakingClubPost) => {
    setEditingItem(item ?? null);
    setFormData(
      item ?? {
        week_number: 1,
        title: '',
        description: '',
        timeline: [],
        resources: [],
        images: [],
      },
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Handle deferred image uploads
      let finalImages = formData.images ?? [];
      const hasFiles = finalImages.some((img) => img instanceof File);

      if (hasFiles) {
        finalImages = await uploadMultipleImages('speaking-club', 'activity-images', finalImages);
      }

      const saveData = {
        ...formData,
        images: finalImages as string[],
      };

      if (editingItem) {
        const { error } = await supabase
          .from('speaking_club_posts')
          .update(saveData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('speaking_club_posts').insert([saveData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      void fetchData();
    } catch (err) {
      console.error('Error saving speaking club post:', err);
      alert('Lỗi khi lưu bài viết Speaking Club.');
    } finally {
      setSaving(false);
    }
  };

  const addTimelineEvent = () => {
    const timeline = [...(formData.timeline ?? [])];
    timeline.push({ time: '', activity: '', description: '' });
    setFormData({ ...formData, timeline });
  };

  const removeTimelineEvent = (index: number) => {
    const timeline = (formData.timeline ?? []).filter((_, i) => i !== index);
    setFormData({ ...formData, timeline });
  };

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    const timeline = [...(formData.timeline ?? [])];
    const event = { ...timeline[index] } as TimelineEvent;
    if (field === 'description') {
      event.description = value;
    } else {
      event[field] = value;
    }
    timeline[index] = event;
    setFormData({ ...formData, timeline });
  };

  const addResource = () => {
    const resources = [...(formData.resources ?? [])];
    resources.push({ label: '', url: '' });
    setFormData({ ...formData, resources });
  };

  const removeResource = (index: number) => {
    const resources = (formData.resources ?? []).filter((_, i) => i !== index);
    setFormData({ ...formData, resources });
  };

  const updateResource = (index: number, field: keyof ResourceLink, value: string) => {
    const resources = [...(formData.resources ?? [])];
    const res = { ...resources[index] } as ResourceLink;
    res[field] = value;
    resources[index] = res;
    setFormData({ ...formData, resources });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Speaking Club Management</h2>
        <button
          onClick={() => {
            handleOpenModal();
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg text-sm cursor-pointer"
        >
          Thêm Hoạt động
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
          void deleteItem(item.id, item.images);
        }}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={editingItem ? 'Chỉnh sửa Hoạt động' : 'Thêm Hoạt động mới'}
        onSubmit={(e) => {
          void handleSave(e);
        }}
        loading={saving}
      >
        <div className="space-y-8">
          {/* Basic Info Container */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Số tuần</label>
              <input
                type="number"
                value={formData.week_number ?? 1}
                onChange={(e) => {
                  setFormData({ ...formData, week_number: parseInt(e.target.value) });
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 appearance-none font-bold text-primary"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tiêu đề buổi học
              </label>
              <input
                type="text"
                value={formData.title ?? ''}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 font-bold text-slate-800"
                placeholder="Ví dụ: Luyện phản xạ Part 2..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả tổng quan</label>
            <textarea
              value={formData.description ?? ''}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
              rows={3}
              placeholder="Nội dung chính của buổi học này là gì?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4">
              Hình ảnh hoạt động
            </label>
            <ImageUpload
              value={formData.images ?? []}
              onChange={(items) => {
                setFormData({ ...formData, images: items as (string | File)[] });
              }}
              multiple
            />
          </div>

          {/* Timeline Section */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Lộ trình (Timeline)
              </h4>
              <button
                type="button"
                onClick={addTimelineEvent}
                className="text-xs bg-white text-primary p-2 rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {formData.timeline?.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => {
                        updateTimelineEvent(i, 'time', e.target.value);
                      }}
                      placeholder="Time (19:00)"
                      className="px-3 py-2 text-xs font-black text-primary bg-slate-50 rounded-lg border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => {
                        updateTimelineEvent(i, 'activity', e.target.value);
                      }}
                      placeholder="Activity name"
                      className="sm:col-span-3 px-3 py-2 text-sm font-bold text-slate-700 bg-slate-50 rounded-lg border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        updateTimelineEvent(i, 'description', e.target.value);
                      }}
                      placeholder="Optional description..."
                      rows={2}
                      className="sm:col-span-4 px-3 py-2 text-xs text-slate-500 bg-slate-50 rounded-lg border border-transparent focus:border-primary/30 focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeTimelineEvent(i);
                    }}
                    className="absolute -top-2 -right-2 bg-red-50 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-red-100 shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-accent" />
                Tài liệu bổ trợ
              </h4>
              <button
                type="button"
                onClick={addResource}
                className="text-xs bg-white text-accent p-2 rounded-lg border border-accent/20 hover:bg-accent hover:text-white transition-all shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {formData.resources?.map((res, i) => (
                <div key={i} className="flex gap-2 items-start group">
                  <input
                    type="text"
                    value={res.label}
                    onChange={(e) => {
                      updateResource(i, 'label', e.target.value);
                    }}
                    placeholder="Tên tài liệu"
                    className="flex-1 px-3 py-2 text-xs font-bold bg-white rounded-lg border border-slate-200 focus:border-accent/40 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={res.url}
                    onChange={(e) => {
                      updateResource(i, 'url', e.target.value);
                    }}
                    placeholder="Link (URL)"
                    className="flex-[2_2_0%] px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:border-accent/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removeResource(i);
                    }}
                    className="bg-white text-red-400 p-2.5 rounded-lg border border-slate-100 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
