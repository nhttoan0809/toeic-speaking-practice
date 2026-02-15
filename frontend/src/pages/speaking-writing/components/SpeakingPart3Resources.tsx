import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, MessageSquare, AlertCircle } from 'lucide-react';

interface SpeakingPart3Item {
  id: string;
  situation: string;
  question_5: string;
  question_6: string;
  question_7: string;
}

interface TestData {
  id: string;
  title: string;
  part: SpeakingPart3Item | null;
}

interface ExamResponse {
  id: string;
  title: string;
  speaking_part_3: SpeakingPart3Item[];
}

export default function SpeakingPart3Resources() {
  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('toeic_exams')
          .select(
            `
            id,
            title,
            speaking_part_3 (
              id,
              situation,
              question_5,
              question_6,
              question_7
            )
          `,
          )
          .eq('source', 'study4')
          .order('title', { ascending: true });

        if (fetchError) throw fetchError;

        const rawData = data as unknown as ExamResponse[];

        // Sort title numerically
        const sortedData = [...rawData].sort((a, b) => {
          const numA = parseInt(a.title.replace('Test ', '')) || 0;
          const numB = parseInt(b.title.replace('Test ', '')) || 0;
          return numA - numB;
        });

        setTests(
          sortedData.map((item) => ({
            id: item.id,
            title: item.title,
            part: item.speaking_part_3[0] ?? null,
          })),
        );
      } catch (err: unknown) {
        console.error('Error fetching Speaking Part 3 data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium">Đang tải tài liệu Part 3...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50 rounded-3xl border border-red-100 px-6">
        <AlertCircle className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold mb-2">Lỗi tải dữ liệu</h3>
        <p className="text-center max-w-md">{error}</p>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Trả lời câu hỏi</h3>
          <p className="text-slate-500 mt-1">Tổng cộng {tests.length} bộ đề thi Speaking Part 3</p>
        </div>
        <div className="hidden md:block px-4 py-2 bg-primary/5 text-primary text-sm font-bold rounded-full border border-primary/10">
          Nguồn: Study4
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-12">
        {tests.map((test, idx) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">
                {test.title}
              </h4>
            </div>

            {test.part ? (
              <div className="space-y-8">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Tình huống (Situation)
                  </span>
                  <p className="text-slate-700 italic leading-relaxed text-sm md:text-base font-medium">
                    "{test.part.situation}"
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { label: 'Câu hỏi 5', text: test.part.question_5 },
                    { label: 'Câu hỏi 6', text: test.part.question_6 },
                    { label: 'Câu hỏi 7', text: test.part.question_7 },
                  ].map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="relative pl-5 border-l-2 border-primary/10 hover:border-primary/40 transition-colors"
                    >
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary/20" />
                      <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-1">
                        {q.label}
                      </span>
                      <p className="text-slate-800 font-bold leading-relaxed">{q.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm py-4">
                Chưa có nội dung cho bài thi này.
              </p>
            )}

            <div className="mt-8 pt-4 flex items-center justify-end">
              <button className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1">
                Luyện tập ngay
                <motion.span initial={{ x: 0 }} whileHover={{ x: 3 }}>
                  →
                </motion.span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
