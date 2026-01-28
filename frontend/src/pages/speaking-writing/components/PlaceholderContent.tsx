import { BookOpen } from 'lucide-react';

export default function PlaceholderContent({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
        <BookOpen className="w-8 h-8 text-slate-300" />
        <div className="absolute inset-0 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed">{subtitle}</p>

      <div className="mt-12 space-y-5 w-full max-w-md">
        <div className="h-10 bg-slate-50 rounded-2xl w-full border border-slate-100" />
        <div className="h-32 bg-slate-50 rounded-2xl w-full border border-slate-100" />
        <div className="flex gap-4">
          <div className="h-10 bg-slate-50 rounded-2xl flex-1 border border-slate-100" />
          <div className="h-10 bg-slate-50 rounded-2xl flex-1 border border-slate-100" />
        </div>
      </div>
    </div>
  );
}
