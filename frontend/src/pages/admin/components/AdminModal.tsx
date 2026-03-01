import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  loading = false,
}: AdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
              <h3 className="text-xl md:text-2xl font-black text-slate-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <form id="admin-modal-form" onSubmit={onSubmit} className="space-y-6">
                {children}
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-white text-slate-600 font-bold py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                form="admin-modal-form"
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-dark transition-all shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
