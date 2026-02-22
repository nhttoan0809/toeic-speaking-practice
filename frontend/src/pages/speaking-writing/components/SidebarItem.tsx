import { motion } from 'framer-motion';
import { Mic2, PenTool } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Section } from './types';

interface SidebarItemProps {
  section: Section;
  active: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

export default function SidebarItem({ section, active, onClick, isMobile }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 group relative cursor-pointer',
        active
          ? 'bg-primary text-white shadow-xl shadow-primary/25 translate-x-1'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
      )}
    >
      <span
        className={cn(
          'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
          active ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200',
        )}
      >
        {section.icon ? (
          <section.icon className="w-4 h-4" />
        ) : section.module === 'speaking' ? (
          <Mic2 className="w-4 h-4" />
        ) : (
          <PenTool className="w-4 h-4" />
        )}
      </span>
      <span className="flex-1 text-left leading-tight truncate">{section.title}</span>
      {active && (
        <motion.div
          layoutId={isMobile ? 'mobileActiveLine' : 'desktopActiveLine'}
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full hidden lg:block"
        />
      )}
    </button>
  );
}
