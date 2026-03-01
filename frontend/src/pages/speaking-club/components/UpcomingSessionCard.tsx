import { Calendar, Clock, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpcomingSessionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-8 md:p-12 text-center"
    >
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wider animate-pulse">
          <Bell className="w-3 h-3" />
          Coming Soon
        </div>
      </div>

      <div className="max-w-md mx-auto flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <Calendar className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">
            Các buổi học tiếp theo đang được chuẩn bị!
          </h3>
          <p className="text-slate-500">
            Chúng mình đang lên kế hoạch cho những hoạt động bùng nổ nhất. Theo dõi Fanpage để không
            bỏ lỡ thông báo đăng ký nhé!
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Every Sunday
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>10:00 - 13:00</span>
        </div>

        <button className="px-6 py-2.5 rounded-full bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-all">
          Nhắc tôi khi có lịch
        </button>
      </div>
    </motion.div>
  );
}
