import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BannerTab from './components/tabs/BannerTab';
import PostTab from './components/tabs/PostTab';
import TestimonialTab from './components/tabs/TestimonialTab';
import ContactTab from './components/tabs/ContactTab';
import SpeakingClubTab from './components/tabs/SpeakingClubTab';
import { Menu } from 'lucide-react';
import type { AdminTab } from '../../lib/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('banners');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    void navigate('/admin/login');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'banners':
        return <BannerTab />;
      case 'posts':
        return <PostTab />;
      case 'testimonials':
        return <TestimonialTab />;
      case 'contacts':
        return <ContactTab />;
      case 'speaking-club':
        return <SpeakingClubTab />;
      default:
        return <BannerTab />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={() => void handleLogout()}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Mobile Only */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <h1 className="text-xl font-black text-primary">Admin</h1>
          <button
            onClick={() => {
              setIsSidebarOpen(true);
            }}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto">{renderActiveTab()}</div>
        </div>
      </main>
    </div>
  );
}
