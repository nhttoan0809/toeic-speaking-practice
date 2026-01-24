import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { Post } from '../../data/posts';
import { useEffect } from 'react';

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostModal({ post, isOpen, onClose }: PostModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            layoutId={`post-${post.id}`}
            className="relative lg:max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-900 hover:bg-white transition-colors shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content Wrapper */}
            <div className="flex flex-col h-full overflow-hidden">
              {/* Image Section */}
              <div className="w-full bg-slate-100 shrink-0">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full h-auto max-h-[400px] object-contain mx-auto"
                />
              </div>

              {/* Scrollable Text Content */}
              <div className="grow overflow-y-auto px-8 py-10 custom-scrollbar">
                <div className="whitespace-pre-wrap text-slate-600 leading-relaxed text-lg font-medium">
                  {post.content}
                </div>
              </div>

              {/* Fixed Footer with CTA */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Tham gia ngay tại Facebook
                  <ExternalLink className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
