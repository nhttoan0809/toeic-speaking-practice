import { Sparkles, Users, Mic2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GradientText from '../../../components/ui/GradientText';

export default function SpeakingClubHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            Join the Community
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-800 leading-tight">
            Welcome to the <br />
            <GradientText
              colors={['#0d9488', '#2dd4bf', '#0d9488', '#2dd4bf', '#0d9488']}
              animationSpeed={3}
              showBorder={false}
              className="mx-auto mt-2"
            >
              Speaking Club
            </GradientText>
          </h1>
          <p className="mt-8 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Nơi kết nối đam mê, phá bỏ rào cản ngôn ngữ và cùng nhau chinh phục kỹ năng Speaking.
            Mỗi tuần một chủ đề, mỗi buổi một trải nghiệm mới mẻ.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Kết nối bè bạn</h3>
              <p className="text-slate-500 text-sm">
                Gặp gỡ những người bạn cùng chung mục tiêu TOEIC.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Mic2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Thực hành liên tục</h3>
              <p className="text-slate-500 text-sm">
                Môi trường nói tiếng Anh 100% giúp phản xạ tự nhiên.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Tự tin bứt phá</h3>
              <p className="text-slate-500 text-sm">
                Vượt qua nỗi sợ nói sai, tự tin diễn đạt ý tưởng.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
