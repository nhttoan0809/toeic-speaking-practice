import { Bookmark, Lightbulb } from 'lucide-react';
import type { Structure } from '../PracticeStructuresPage';

interface DetailProps {
  structure?: Structure;
}

export default function StructureDetail({ structure }: DetailProps) {
  if (!structure) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-[#F582AE] rounded-full" />
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
          {structure.title}
        </h2>
      </div>

      {/* Formula & Meaning Card */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-2 text-pink-400 mb-3 relative z-10">
            <Bookmark size={18} fill="#F582AE" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F582AE]">
              Cấu trúc
            </span>
          </div>
          <div className="bg-pink-50 text-[#F582AE] px-4 py-3 rounded-xl font-mono text-sm md:text-base font-bold border border-pink-100 relative z-10 transition-transform group-hover:scale-[1.02]">
            {structure.formula}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-2 text-teal-500 mb-3 relative z-10">
            <Lightbulb size={18} fill="#67C1C1" />
            <span className="text-xs font-bold uppercase tracking-widest">Ý nghĩa</span>
          </div>
          <p className="text-slate-700 font-medium leading-relaxed relative z-10">
            {structure.meaning}
          </p>
        </div>
      </div>

      {/* Examples Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2 uppercase tracking-wide">
          📝 Ví dụ mẫu
        </h3>
        <div className="grid gap-4">
          {structure.examples.map((example, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-pink-50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-100 group-hover:bg-[#F582AE] transition-colors" />
              <div className="flex flex-col gap-2">
                <p className="text-slate-800 font-bold group-hover:text-[#F582AE] transition-colors leading-relaxed pl-2 text-base md:text-lg">
                  {example.en}
                </p>
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-1 h-1 bg-pink-300 rounded-full" />
                  <p className="text-slate-500 text-sm font-medium italic">{example.vi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
