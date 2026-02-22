import { useState } from 'react';
import structuresData from '../../data/toeic-structures.json';

export interface Structure {
  category: string;
  title: string;
  formula: string;
  meaning: string;
  examples: { en: string; vi: string }[];
  practice: {
    prompt: string;
    hints: string[];
    answer: string;
  }[];
}
import StructureSidebar from './components/StructureSidebar';
import StructureDetail from './components/StructureDetail';
import PracticeEngine from './components/PracticeEngine';
import { Menu, X } from 'lucide-react';

export default function PracticeStructuresPage() {
  const [selectedStructureIndex, setSelectedStructureIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedStructure = structuresData[selectedStructureIndex] ?? undefined;

  return (
    <div className="w-full h-screen bg-[#FEF6E4] flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="min-h-[97px] bg-linear-to-r from-[#F582AE] to-[#FF8FAB] text-white p-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                TOEIC Speaking & Writing Practice
              </h1>
              <p className="text-xs md:text-sm text-white/80 font-medium">
                Luyện cấu trúc câu với từ vựng TOEIC 🎯
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => {
              setIsSidebarOpen(false);
            }}
          />
        )}

        {/* Sidebar */}
        <StructureSidebar
          structures={structuresData as Structure[]}
          selectedId={selectedStructure?.title ?? null}
          onSelect={(structure) => {
            const index = structuresData.findIndex((s) => s.title === structure.title);
            setSelectedStructureIndex(index);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {selectedStructure ? (
            <div className="space-y-12 pb-20">
              <StructureDetail structure={selectedStructure} />
              <div className="h-px bg-pink-100/50 my-8" />
              <PracticeEngine
                structure={selectedStructure}
                onNext={() => {
                  if (selectedStructureIndex < structuresData.length - 1) {
                    setSelectedStructureIndex(selectedStructureIndex + 1);
                    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <p>Vui lòng chọn một cấu trúc để luyện tập</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
