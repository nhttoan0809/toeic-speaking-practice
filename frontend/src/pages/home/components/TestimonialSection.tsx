import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Testimonial } from '../../../lib/types';

export default function TestimonialSection() {
  const [selectedItem, setSelectedItem] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTestimonials();
  }, []);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4 tracking-wide uppercase"
        >
          Success Stories
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black text-slate-800 mb-6"
        >
          Học viên nói gì về <span className="text-primary italic">Ms.Smile</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto text-lg"
        >
          Những kết quả thật, cảm xúc thật từ chính những bạn đã đồng hành cùng trung tâm trong suốt
          thời gian qua.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (item.delay ?? 0.1) * ((index % 3) + 1) }}
              onClick={() => {
                setSelectedItem(item);
              }}
              className="break-inside-avoid mb-6 group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 cursor-pointer"
            >
              {/* Hover Indicator */}
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>

              {/* Smooth Backdrop Blur with Mask */}
              <div
                className="absolute inset-x-0 bottom-0 z-10 h-1/2 backdrop-blur-xs pointer-events-none"
                style={{
                  maskImage: 'linear-gradient(to top, black, transparent)',
                  WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
                }}
              />

              {/* Content Overlay with enhanced contrast */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-6 pt-12 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-all duration-500">
                <p className="text-white/70 text-sm font-medium mb-1 drop-shadow-md">
                  {item.subtitle}
                </p>
                <h3 className="text-white text-xl font-bold group-hover:text-primary transition-colors drop-shadow-lg">
                  {item.title}
                </h3>
              </div>

              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedItem(null);
              }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] z-10 flex flex-col items-center"
            >
              <button
                onClick={() => {
                  setSelectedItem(null);
                }}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="w-full overflow-hidden rounded-3xl shadow-2xl bg-white/5 border border-white/10">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                />
              </div>

              <div className="text-center mt-6">
                <h3 className="text-white text-2xl font-bold mb-1">{selectedItem.title}</h3>
                <p className="text-white/60 font-medium">{selectedItem.subtitle}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
