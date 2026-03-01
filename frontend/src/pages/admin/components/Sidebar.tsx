import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Image,
  FileText,
  MessageSquare,
  Share2,
  LogOut,
  X,
  Mic2,
  type LucideIcon,
} from 'lucide-react';
import type { AdminTab } from '../../../lib/types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: AdminTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}: SidebarProps) {
  const navItems: { id: AdminTab; label: string; icon: LucideIcon }[] = [
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'contacts', label: 'Contacts', icon: Share2 },
    { id: 'speaking-club', label: 'Speaking Club', icon: Mic2 },
  ];

  const renderNavButtons = () => (
    <nav className="flex-1 p-4 space-y-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id);
            setIsSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === item.id
              ? 'bg-primary text-white shadow-lg shadow-teal-200/50'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <item.icon size={20} /> {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <>
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
                {renderNavButtons()}
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
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-black text-primary">Ms.Smile Admin</h1>
        </div>
        {renderNavButtons()}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
