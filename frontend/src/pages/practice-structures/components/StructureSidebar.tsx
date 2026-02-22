import { useRef } from 'react';
import { ChevronRight, Bookmark } from 'lucide-react';
import type { Structure } from '../PracticeStructuresPage';

interface SidebarProps {
  structures: Structure[];
  selectedId: string | null;
  onSelect: (structure: Structure) => void;
  isOpen: boolean;
}

export default function StructureSidebar({
  structures,
  selectedId,
  onSelect,
  isOpen,
}: SidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group structures by category
  const groups: Record<string, Structure[]> = {};
  structures.forEach((s) => {
    const category = s.category;
    const group = (groups[category] ??= []);
    group.push(s);
  });

  return (
    <aside
      className={`fixed lg:relative top-0 left-0 h-full w-[280px] md:w-[320px] bg-white border-r border-orange-100 shadow-xl lg:shadow-none z-30 transition-transform duration-300 transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}
    >
      <div className="p-4 border-b border-pink-50 bg-[#FDF2F7]">
        <h2 className="text-[#F582AE] font-bold flex items-center gap-2">
          <Bookmark size={18} fill="#F582AE" />
          DANH SÁCH CẤU TRÚC
        </h2>
        <p className="text-xs text-pink-400 mt-1 font-medium">
          {structures.length} cấu trúc ngữ pháp
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar" ref={scrollRef}>
        {Object.entries(groups).map(([category, categoryStructures]) => (
          <div key={category} className="mb-4">
            <h3 className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              {category}
            </h3>
            <div className="space-y-px mt-1 px-2">
              {categoryStructures.map((structure) => {
                const isActive = selectedId === structure.title;
                return (
                  <button
                    key={structure.title}
                    onClick={() => {
                      onSelect(structure);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all group flex items-center justify-between border ${
                      isActive
                        ? 'bg-white border-[#F582AE] text-[#F582AE] shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-pink-50 text-slate-600'
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold truncate transition-colors ${isActive ? 'text-[#F582AE]' : ''}`}
                    >
                      {structure.title}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`transition-all duration-200 ${
                        isActive
                          ? 'translate-x-0 text-[#F582AE]'
                          : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
