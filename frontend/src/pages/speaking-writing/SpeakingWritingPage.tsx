import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import SectionHeader from './components/SectionHeader';
import ContentArea from './components/ContentArea';
import { SECTIONS } from './components/data';
import type { TabId } from './components/types';

export default function SpeakingWriting() {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeTab, setActiveTab] = useState<TabId>('eval');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSection = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  // Body scroll lock & Fail-safe cleanup
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      // Force cleanup if unmounting while open
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isMobileMenuOpen]);

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    
    const contentElement = document.getElementById('content-area');
    if (contentElement) {
        // contentElement.scrollIntoView({ behavior: 'smooth' });
    } else {
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex bg-slate-50 font-sans selection:bg-primary/20">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />

      <MobileNav 
        isOpen={isMobileMenuOpen}
        onOpen={() => setIsMobileMenuOpen(true)}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* --- Main Content Area --- */}
      <main className="flex-1 lg:pl-0" id="content-area">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          <SectionHeader section={currentSection} />

          <ContentArea 
            section={currentSection}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSectionChange={handleSectionChange}
          />
        </div>
      </main>
    </div>
  );
}
