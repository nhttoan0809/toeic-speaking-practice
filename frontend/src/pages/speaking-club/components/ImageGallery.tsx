import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
  }, [selectedIndex, images.length]);

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, handleNext, handlePrev, closeModal]);

  if (images.length === 0) return null;

  const displayImages = images.slice(0, 2);
  const remainingCount = images.length - 2;

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
        <ImageIcon className="w-4 h-4 text-primary" />
        Khoảnh khắc buổi học
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* First 2 images */}
        {displayImages.map((img, i) => (
          <div
            key={i}
            className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group"
            onClick={() => {
              setSelectedIndex(i);
            }}
          >
            <img
              src={img}
              alt={`Activity ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}

        {/* 3rd item: Either image or placeholder */}
        {images.length === 3 ? (
          <div
            className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group"
            onClick={() => {
              setSelectedIndex(2);
            }}
          >
            <img
              src={images[2]}
              alt="Activity 3"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : images.length > 3 ? (
          <div
            className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer relative group"
            onClick={() => {
              setSelectedIndex(2);
            }}
          >
            <img
              src={images[2]}
              alt="Activity 3"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 blur-[2px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-slate-900/50">
              <span className="text-2xl font-black">+{remainingCount}</span>
              <span className="text-xs font-bold uppercase tracking-wider">Xem thêm</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 md:p-8"
            onClick={closeModal}
          >
            <button
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-60"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 md:left-8 p-2 text-white/50 hover:text-white transition-colors z-60"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              className="absolute right-4 md:right-8 p-2 text-white/50 hover:text-white transition-colors z-60"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center p-4"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <img
                src={images[selectedIndex]}
                alt="Gallery preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-bold">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
