import { Calendar, Link as LinkIcon, MapPin } from 'lucide-react';
import type { SpeakingClubPost } from '../../../lib/types';
import { motion } from 'framer-motion';
import ImageGallery from './ImageGallery';

interface WeeklyCardProps {
  post: SpeakingClubPost;
  index: number;
}

export default function WeeklyCard({ post, index }: WeeklyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Images & Info */}
        <div className="p-8 border-r border-slate-50">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-accent text-white font-bold text-sm">
                Tuần {post.week_number}
              </span>
              {post.session_start_time && (
                <div className="text-primary text-sm font-bold flex items-center gap-1 bg-primary/5 w-fit px-3 py-1.5 rounded-lg border border-primary/10">
                  <Calendar className="w-4 h-4" />
                  Ngày bắt đầu: {new Date(post.session_start_time).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
            {/* {post.session_start_time && (
              <div className="text-primary text-sm font-bold flex items-center gap-1 bg-primary/5 w-fit px-3 py-1.5 rounded-lg border border-primary/10">
                <Calendar className="w-4 h-4" />
                Ngày bắt đầu: {new Date(post.session_start_time).toLocaleDateString('vi-VN')}
              </div>
            )} */}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4">{post.title}</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">{post.description}</p>

          <div className="space-y-6">
            {/* Resources */}
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <LinkIcon className="w-4 h-4 text-primary" />
                Tài liệu & Tài nguyên
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm font-medium border border-slate-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
                  >
                    {res.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={post.images} />
          </div>
        </div>

        {/* Right Side: Timeline */}
        <div className="p-8 bg-slate-50/50">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-8">
            <MapPin className="w-4 h-4 text-accent" />
            Lộ trình hoạt động
          </h4>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {post.timeline.map((item, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon Circle */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-slate-200 group-[.is-active]:bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                </div>

                {/* Content Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl border border-white bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-black text-primary text-xs uppercase tracking-wider">
                      {item.time}
                    </div>
                  </div>
                  <div className="text-slate-800 font-bold text-sm mb-1">{item.activity}</div>
                  {item.description && (
                    <div className="text-slate-500 text-xs leading-relaxed">{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
