import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Contact } from '../../../lib/types';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.42a7.27 7.27 0 0 0-1.32-.12 7.14 7.14 0 0 0-.14 14.28 7.14 7.14 0 0 0 7.14-7.14V7.26a8.1 8.1 0 0 0 5.33 1.94V5.69a4.84 4.84 0 0 1-1.8-.62 4.93 4.93 0 0 1-1.72-1.38z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const PLATFORM_STYLES = {
  facebook: {
    color: 'from-blue-600 to-blue-400',
    icon: <FacebookIcon />,
  },
  fanpage: {
    color: 'from-sky-600 to-sky-400',
    icon: <FacebookIcon />,
  },
  tiktok: {
    color: 'from-slate-900 to-slate-700',
    icon: <TikTokIcon />,
  },
  youtube: {
    color: 'from-red-600 to-red-500',
    icon: <YoutubeIcon />,
  },
} as const;

interface PlatformStyle {
  color: string;
  icon: React.ReactNode;
}

export default function ContactSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchContacts();
  }, []);

  const getPlatformStyle = (platformId: string): PlatformStyle => {
    return (
      (PLATFORM_STYLES as Record<string, PlatformStyle>)[platformId] ?? PLATFORM_STYLES.facebook
    );
  };

  return (
    <section className="container mx-auto px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />

      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block py-2 px-4 rounded-full bg-primary/5 text-primary font-bold text-sm mb-4 tracking-widest uppercase"
        >
          Connect With Us
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black text-slate-800 mb-6"
        >
          Kết nối cùng <span className="text-primary italic">Ms.Smile</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed"
        >
          Đừng bỏ lỡ bất kỳ tài liệu hay tin tức nóng hổi nào. Hãy theo dõi chúng tôi trên các nền
          tảng xã hội để cùng nhau tiến bộ mỗi ngày!
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contacts.map((channel, index) => {
            const style = getPlatformStyle(channel.platform_id);
            return (
              <motion.a
                key={channel.id}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (channel.delay ?? 0.1) * (index + 1), duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="group relative block p-8 rounded-4xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient Accent */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${style.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl rounded-full -mr-10 -mt-10`}
                />

                <div
                  className={`inline-flex items-center justify-center p-4 rounded-2xl bg-linear-to-br ${style.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                >
                  {style.icon}
                </div>

                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-tighter mb-2">
                  {channel.name}
                </h3>
                <div className="text-2xl font-black text-slate-800 mb-4 group-hover:text-primary transition-colors">
                  {channel.label}
                </div>
                <p className="text-slate-500 leading-relaxed mb-8">{channel.description}</p>

                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">
                  Truy cập ngay
                  <ExternalLink className="w-4 h-4" />
                </div>

                {/* Subtle Line Animation */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-primary to-accent group-hover:w-full transition-all duration-700" />
              </motion.a>
            );
          })}
        </div>
      )}
    </section>
  );
}
