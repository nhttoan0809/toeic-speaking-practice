import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Section } from './types';

interface SectionHeaderProps {
  section: Section;
}

export default function SectionHeader({ section }: SectionHeaderProps) {
  return (
    <motion.header 
      key={`${section.id}-header`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider mb-2">
        {section.module ? section.module.toUpperCase() : 'GENERAL'}
        <ChevronRight className="w-4 h-4" />
      </div>
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
        {section.title}
      </h1>
      <div className="h-1.5 w-20 bg-primary rounded-full" />
    </motion.header>
  );
}
