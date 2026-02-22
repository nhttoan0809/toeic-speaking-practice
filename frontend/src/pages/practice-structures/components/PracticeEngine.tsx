import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, RefreshCcw, Eye, ChevronRight } from 'lucide-react';

interface PracticeProps {
  structure: {
    title: string;
    practice: {
      prompt: string;
      hints: string[];
      answer: string;
    }[];
  };
  onNext: () => void;
}

export default function PracticeEngine({ structure, onNext }: PracticeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCheckPressed, setIsCheckPressed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = structure.practice[currentIdx];

  useEffect(() => {
    setCurrentIdx(0);
    setUserInput('');
    setIsCheckPressed(false);
    setIsCorrect(null);
    setShowAnswer(false);
  }, [structure.title]);

  useEffect(() => {
    setUserInput('');
    setIsCheckPressed(false);
    setIsCorrect(null);
    setShowAnswer(false);
  }, [currentIdx]);

  const handleCheck = () => {
    if (!question) return;
    setIsCheckPressed(true);
    const normalizedInput = userInput
      .trim()
      .toLowerCase()
      .replace(/[.,!?]/g, '');
    const normalizedAnswer = question.answer
      .trim()
      .toLowerCase()
      .replace(/[.,!?]/g, '');

    const isExactMatch = normalizedInput === normalizedAnswer;
    const allHintsPresent = question.hints.every((hint) =>
      normalizedInput.includes(hint.toLowerCase().replace(/[.,!?]/g, '')),
    );

    setIsCorrect(
      isExactMatch || (allHintsPresent && normalizedInput.length > normalizedAnswer.length * 0.5),
    );
  };

  const handleNextQuestion = () => {
    if (currentIdx < structure.practice.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onNext();
    }
  };

  if (!question) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Practice Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-[#67C1C1] rounded-full" />
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4">
          ✍️ Thực hành
          <span className="text-sm font-bold text-teal-500 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            {currentIdx + 1} / {structure.practice.length}
          </span>
        </h2>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-pink-100 space-y-6">
        {/* Question Box */}
        <div className="bg-[#D1FAE5] rounded-2xl p-6 md:p-8 relative">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-2 opacity-60">
            Dịch câu sau
          </h4>
          <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
            {question.prompt}
          </p>
        </div>

        {/* Hint Box */}
        <div className="bg-[#FEF3C7] rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-black text-amber-700 uppercase tracking-wider">
              💡 Gợi ý:
            </span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {question.hints.map((hint, i) => (
              <li key={i} className="flex items-center gap-2 text-amber-800 font-medium text-sm">
                <div className="w-1 h-1 bg-amber-400 rounded-full" />
                {hint}
              </li>
            ))}
          </ul>
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          <textarea
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            placeholder="Nhập câu dịch tiếng Anh của bạn..."
            className="w-full bg-white border-2 border-pink-50 rounded-2xl p-6 min-h-[140px] text-lg font-medium text-slate-800 focus:outline-none focus:border-[#F582AE] focus:ring-4 focus:ring-pink-50 transition-all resize-none shadow-inner"
          />

          {(isCheckPressed || showAnswer) && (
            <div
              className={`p-6 rounded-2xl border ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-pink-50 border-pink-100'
              } animate-in fade-in slide-in-from-top-2 duration-300`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <AlertCircle size={18} className="text-[#F582AE]" />
                )}
                <span
                  className={`text-xs font-black uppercase tracking-widest ${isCorrect ? 'text-green-600' : 'text-[#F582AE]'}`}
                >
                  {isCorrect ? 'Chính xác!' : 'Đáp án tham khảo:'}
                </span>
              </div>
              <p className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-slate-800'}`}>
                {question.answer}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button
            onClick={handleCheck}
            disabled={!userInput.trim() || isCheckPressed}
            className="flex-1 bg-[#F582AE] text-white py-4 rounded-xl font-bold transition-all hover:bg-[#F36C9F] active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-pink-100"
          >
            <Eye size={20} />
            Kiểm tra
          </button>

          <button
            onClick={() => {
              setShowAnswer(true);
            }}
            className="flex-1 bg-[#67C1C1] text-white py-4 rounded-xl font-bold transition-all hover:bg-[#59A8A8] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-teal-50"
          >
            <RefreshCcw size={18} />
            Xem đáp án
          </button>

          <button
            onClick={handleNextQuestion}
            className="flex-1 bg-white border-2 border-[#F582AE] text-[#F582AE] py-4 rounded-xl font-bold transition-all hover:bg-pink-50 active:scale-95 flex items-center justify-center gap-2"
          >
            Câu tiếp theo
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
