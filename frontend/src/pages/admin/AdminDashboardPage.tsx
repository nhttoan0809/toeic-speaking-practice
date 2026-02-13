import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { Banner, Post } from '../../lib/types';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Upload,
  RefreshCw,
  X,
  Menu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'banners' | 'posts'>('banners');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Modal/Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | Post | null>(null);
  const [formData, setFormData] = useState<Banner | Post | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (activeTab === 'banners') {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });
      setBanners(data ?? []);
    } else {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts(data ?? []);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    void fetchData();
  }, [activeTab, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    void navigate('/toeic-speaking-practice/admin/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const table = activeTab;

    if (formData === null) return;

    // Validation for posts: must have an image (either existing or newly selected)
    if (activeTab === 'posts') {
      const postData = formData as Post;
      if (!selectedFile && !postData.image_url) {
        alert('Vui lòng chọn hình ảnh cho bài viết.');
        return;
      }
    }

    setUploadProgress(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, ...saveData } = formData;

      // Handle image upload for posts
      if (activeTab === 'posts' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
        (saveData as Post).image_url = data.publicUrl;

        // If editing and has old image, we could delete it here, but let's keep it simple
        // and just update the database record. Cleanup could be managed separately.
      }

      if (editingItem) {
        const { error } = await supabase.from(table).update(saveData).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([saveData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setFormData(null);
      setSelectedFile(null);
      void fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Đã xảy ra lỗi khi lưu dữ liệu.');
    } finally {
      setUploadProgress(false);
    }
  };

  const deleteStorageImage = async (imageUrl: string) => {
    try {
      if (!imageUrl.includes('/storage/v1/object/public/posts/')) return;
      const filePath = imageUrl.split('/storage/v1/object/public/posts/').pop();
      if (filePath) {
        await supabase.storage.from('posts').remove([filePath]);
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      // For posts, we need to delete the image from storage first
      if (activeTab === 'posts') {
        const post = posts.find((p) => p.id === id);
        if (post?.image_url) {
          await deleteStorageImage(post.image_url);
        }
      }

      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) {
        alert('Lỗi khi xóa: ' + error.message);
      }
      void fetchData();
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex">
      {/* Mobile FAB Trigger */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setIsSidebarOpen(true);
            }}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-2xl shadow-primary/40 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none"
          >
            <Menu className="w-6 h-6" />
            <span className="font-black text-xs uppercase tracking-widest pr-1">Mục lục</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar Sidebar Overlay for Mobile */}
      {createPortal(
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { zIndex: -1 },
                animate: { zIndex: 9999 },
                exit: { zIndex: -1 },
              }}
              className="fixed inset-0 lg:hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setIsSidebarOpen(false);
                }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto"
              >
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h1 className="text-xl font-black text-primary">Ms.Smile Admin</h1>
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab('banners');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                      activeTab === 'banners'
                        ? 'bg-primary text-white shadow-lg shadow-teal-200/50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Image size={20} /> Banners
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('posts');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                      activeTab === 'posts'
                        ? 'bg-primary text-white shadow-lg shadow-teal-200/50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText size={20} /> Posts
                  </button>
                </nav>
                <div className="p-4 mt-auto">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={20} /> Đăng xuất
                  </button>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-black text-primary">Ms.Smile Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('banners');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-primary text-white shadow-lg shadow-teal-200/50'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Image size={20} /> Banners
          </button>
          <button
            onClick={() => {
              setActiveTab('posts');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'posts'
                ? 'bg-primary text-white shadow-lg shadow-teal-200/50'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText size={20} /> Posts
          </button>
        </nav>
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 capitalize">
              {activeTab} Management
            </h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setSelectedFile(null);
                if (activeTab === 'banners') {
                  setFormData({ text: '', is_active: true } as Banner);
                } else {
                  setFormData({ image_url: '', content: '', link: '' } as Post);
                }
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg text-sm md:text-base"
            >
              <Plus size={20} /> Thêm mới
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[600px] md:min-w-full">
                <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 md:px-6 py-4">ID</th>
                    {activeTab === 'banners' ? (
                      <th className="px-4 md:px-6 py-4">Nội dung Slogan</th>
                    ) : (
                      <>
                        <th className="px-4 md:px-6 py-4">Thumbnail</th>
                        <th className="px-4 md:px-6 py-4">Nội dung</th>
                      </>
                    )}
                    <th className="px-4 md:px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'banners' ? banners : posts).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 md:px-6 py-4 font-medium text-slate-400 text-sm">
                        #{item.id}
                      </td>
                      {activeTab === 'banners' ? (
                        <td className="px-4 md:px-6 py-4 font-medium text-slate-700 text-sm md:text-base whitespace-normal wrap-break-word">
                          {(item as Banner).text}
                        </td>
                      ) : (
                        <>
                          <td className="px-4 md:px-6 py-4">
                            <img
                              src={(item as Post).image_url}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover bg-slate-100"
                            />
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="max-w-[150px] md:max-w-xs truncate text-slate-600 text-sm md:text-base">
                              {(item as Post).content}
                            </div>
                          </td>
                        </>
                      )}
                      <td className="px-4 md:px-6 py-4 text-right space-x-1 md:space-x-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setFormData(item);
                            setSelectedFile(null);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            void handleDelete(item.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-6">
              {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {activeTab === 'banners' ? 'Banner' : 'Post'}
            </h3>
            <form
              onSubmit={(e) => {
                void handleSave(e);
              }}
              className="space-y-6"
            >
              {activeTab === 'banners' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Slogan Text</label>
                  <textarea
                    value={(formData as Banner).text || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, text: e.target.value } as Banner);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={3}
                    required
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh</label>
                    <div className="space-y-4">
                      {(formData as Post).image_url || selectedFile ? (
                        <div className="relative group w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={
                              selectedFile
                                ? URL.createObjectURL(selectedFile)
                                : (formData as Post).image_url
                            }
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            alt="Preview"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                              <RefreshCw size={18} /> Thay đổi
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setSelectedFile(file);
                                }}
                              />
                            </label>
                            {selectedFile && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFile(null);
                                }}
                                className="bg-white text-red-500 p-2 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-sm"
                              >
                                <X size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Upload className="w-7 h-7 text-primary" />
                            </div>
                            <p className="text-sm text-slate-600 font-bold">
                              Nhấn để tải lên hình ảnh
                            </p>
                            <p className="text-xs text-slate-400 mt-1 font-medium italic">
                              Ưu tiên tỉ lệ 16:9
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedFile(file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Nội dung bài viết
                    </label>
                    <textarea
                      value={(formData as Post).content || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, content: e.target.value } as Post);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      rows={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      External Link (FB...)
                    </label>
                    <input
                      type="text"
                      value={(formData as Post).link || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, link: e.target.value } as Post);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploadProgress}
                  className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-dark transition-all shadow-lg disabled:opacity-50"
                >
                  {uploadProgress ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
