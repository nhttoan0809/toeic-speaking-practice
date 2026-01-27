import { BookOpen, Mic2, PenTool } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { SECTIONS } from './data';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
      <div className="p-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
          <BookOpen className="text-primary w-8 h-8" />
          Speaking & Writing
        </h2>
      </div>

      <nav className="flex-1 px-4 pb-8 space-y-6">
        {/* Main Overview */}
        <div>
          <SidebarItem 
            active={activeSection === 'overview'} 
            onClick={() => onSectionChange('overview')}
            section={SECTIONS[0]}
          />
        </div>

        {/* Speaking Module */}
        <div className="space-y-2">
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Mic2 className="w-4 h-4" />
            Speaking
          </div>
          {SECTIONS.filter(s => s.module === 'speaking').map(section => (
            <SidebarItem 
              key={section.id}
              active={activeSection === section.id}
              onClick={() => onSectionChange(section.id)}
              section={section}
            />
          ))}
        </div>

        {/* Writing Module */}
        <div className="space-y-2">
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Writing
          </div>
          {SECTIONS.filter(s => s.module === 'writing').map(section => (
            <SidebarItem 
              key={section.id}
              active={activeSection === section.id}
              onClick={() => onSectionChange(section.id)}
              section={section}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}
