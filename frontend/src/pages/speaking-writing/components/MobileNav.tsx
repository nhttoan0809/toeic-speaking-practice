import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, BookOpen, X } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { SECTIONS } from './data';

interface MobileNavProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function MobileNav({ 
  isOpen, 
  onOpen, 
  onClose, 
  activeSection, 
  onSectionChange 
}: MobileNavProps) {
  if (typeof document === 'undefined') return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            key="sw-fab-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onOpen}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-2xl shadow-primary/40 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none"
            aria-label="Mở mục lục"
          >
            <Menu className="w-6 h-6" />
            <span className="font-black text-xs uppercase tracking-widest pr-1">Mục lục</span>
          </motion.button>
        )}
      </AnimatePresence>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              id="sw-mobile-nav-root"
              key="sw-mobile-nav-portal"
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-9999 lg:hidden"
            >
              <motion.div 
                key="sw-backdrop"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 }
                }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.aside 
                key="sw-drawer"
                variants={{
                  initial: { x: '-100%' },
                  animate: { x: 0 },
                  exit: { x: '-100%' }
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto custom-scrollbar"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                    <BookOpen className="text-primary w-6 h-6" />
                    S&W Practice
                  </h2>
                  <button 
                    onClick={onClose} 
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="p-4 space-y-6">
                      <SidebarItem 
                          active={activeSection === 'overview'} 
                          onClick={() => onSectionChange('overview')}
                          section={SECTIONS[0]}
                      />

                      <div className="space-y-2">
                          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Speaking</div>
                          {SECTIONS.filter(s => s.module === 'speaking').map(section => (
                              <SidebarItem 
                                  key={section.id}
                                  active={activeSection === section.id}
                                  onClick={() => onSectionChange(section.id)}
                                  section={section}
                                  isMobile
                              />
                          ))}
                      </div>

                      <div className="space-y-2">
                          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Writing</div>
                          {SECTIONS.filter(s => s.module === 'writing').map(section => (
                              <SidebarItem 
                                  key={section.id}
                                  active={activeSection === section.id}
                                  onClick={() => onSectionChange(section.id)}
                                  section={section}
                                  isMobile
                              />
                          ))}
                      </div>
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
