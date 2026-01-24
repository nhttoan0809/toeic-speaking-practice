import Typewriter from '../components/ui/Typewriter';

export default function SpeakingWriting() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full mx-4">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
          Speaking & Writing
        </h1>
        <div className="h-12 flex items-center justify-center">
            <Typewriter 
            texts={["Coming Soon...", "Stay Tuned!", "We are working on it..."]} 
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-light"
            speed={80}
            pause={1500}
            />
        </div>
        <p className="mt-8 text-slate-500">
            Nội dung đang được biên soạn kỹ lưỡng để mang đến trải nghiệm tốt nhất cho bạn.
        </p>
      </div>
    </div>
  );
}
