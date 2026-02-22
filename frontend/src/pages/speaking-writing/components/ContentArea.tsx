import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, PenTool } from 'lucide-react';
import { cn } from '../../../lib/utils';
import PlaceholderContent from './PlaceholderContent';
import SpeakingPart1Resources from './SpeakingPart1Resources';
import SpeakingPart2Resources from './SpeakingPart2Resources';
import SpeakingPart3Resources from './SpeakingPart3Resources';
import SpeakingPart5Resources from './SpeakingPart5Resources';
import { TABS, SECTIONS } from './data';
import type { Section, TabId } from './types';

interface ContentAreaProps {
  section: Section;
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  onSectionChange: (id: string) => void;
}

export default function ContentArea({
  section,
  activeTab,
  onTabChange,
  onSectionChange,
}: ContentAreaProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[60vh] flex flex-col">
      {section.type === 'content' ? (
        <>
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-4 xl:flex xl:items-center xl:px-8 xl:p-0 border-b border-slate-100 bg-slate-50/50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id as TabId);
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 xl:py-5 xl:px-6 text-sm font-bold transition-all relative rounded-2xl xl:rounded-none cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary xl:bg-transparent'
                    : 'text-slate-400 hover:text-slate-600',
                )}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="truncate xl:whitespace-nowrap">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full hidden xl:block"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-12 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${section.id}-${activeTab}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="prose prose-slate max-w-none"
              >
                {section.id === 'speaking-1' && activeTab === 'resources' ? (
                  <SpeakingPart1Resources />
                ) : section.id === 'speaking-2' && activeTab === 'resources' ? (
                  <SpeakingPart2Resources />
                ) : section.id === 'speaking-3' && activeTab === 'resources' ? (
                  <SpeakingPart3Resources />
                ) : section.id === 'speaking-5' && activeTab === 'resources' ? (
                  <SpeakingPart5Resources />
                ) : (
                  <PlaceholderContent
                    title={`${TABS.find((t) => t.id === activeTab)?.label} cho ${section.title}`}
                    subtitle="Nội dung chi tiết đang được đội ngũ giáo viên biên soạn để gửi đến bạn sớm nhất."
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* Overview Sections */
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8">
                {section.icon ? (
                  <section.icon className="w-10 h-10" />
                ) : section.module === 'speaking' ? (
                  <Mic2 className="w-10 h-10" />
                ) : (
                  <PenTool className="w-10 h-10" />
                )}
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">{section.title}</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
                Chào mừng bạn đến với lộ trình luyện tập {section.title}. <br />
                Tại đây, chúng tôi cung cấp đầy đủ các kiến thức nền tảng, mẹo làm bài và hệ thống
                bài tập chuyển sâu cho từng phần thi.
              </p>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {[
                  { label: 'Kiến thức nền', value: '12 bài học' },
                  { label: 'Bài tập thực hành', value: '150+ câu hỏi' },
                  { label: 'Đề thi thử', value: '5 bộ đề' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center"
                  >
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {stat.label}
                    </span>
                    <span className="text-xl font-black text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const firstContentId = SECTIONS.find(
                    (s) => s.module === section.module && s.type === 'content',
                  )?.id;
                  if (firstContentId) onSectionChange(firstContentId);
                }}
                className="mt-10 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Khám phá ngay
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
