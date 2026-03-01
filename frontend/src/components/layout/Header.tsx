import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/logo.webp';
import GradientText from '../ui/GradientText';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Clear all states
  const handleMouseLeaveNav = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  };

  const navLinks = [
    {
      name: 'Speaking Club',
      path: '/toeic-speaking-practice/speaking-club',
      type: 'internal',
    },
    {
      name: 'Speaking & Writing',
      path: '/toeic-speaking-practice/speaking-writing',
      type: 'internal',
    },
    {
      name: 'Thư viện tài liệu',
      type: 'dropdown',
      id: 'docs',
      items: [
        {
          name: 'Cấu trúc câu',
          url: 'https://mssmiletoeic.my.canva.site/luy-n-t-p-c-u-tr-c-si-u-th-n-th-nh-trong-toeic-sw',
          type: 'external',
        },
        {
          name: 'Từ vựng chủ đề',
          type: 'sub-dropdown',
          id: 'vocab',
          items: [
            {
              name: 'Workplace',
              url: 'https://mssmiletoeic.my.canva.site/vocabulary-boost-for-toeic-workplace-theme-sw',
              type: 'external',
            },
            {
              name: 'Personal Tastes',
              url: 'https://mssmiletoeic.my.canva.site/vocabulary-boost-for-toeic-personal-tastes-sw',
              type: 'external',
            },
            {
              name: 'Everyday Life',
              url: 'https://mssmiletoeic.my.canva.site/vocabulary-boost-for-toeic-sw-everyday-life-theme',
              type: 'external',
            },
          ],
        },
      ],
    },
  ];

  return (
    <header id="header" className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/toeic-speaking-practice"
          className="text-2xl font-black tracking-tight text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
        >
          <img src={logo} alt="Logo - Ms.Smile TOEIC" className="size-16" />
          <div className="flex flex-col justify-center">
            <GradientText
              colors={['#0d9488', '#2dd4bf', '#0d9488', '#2dd4bf', '#0d9488']} // Primary emerald colors
              animationSpeed={3}
              showBorder={false}
              className="p-1"
            >
              Ms.Smile TOEIC
            </GradientText>
            <span className="text-sm text-slate-500">Siêu chất siêu nhộn</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative py-2" // Added padding Y to increase hover area
              onMouseEnter={() => {
                if (link.type === 'dropdown') setActiveDropdown(link.id ?? null);
              }}
              onMouseLeave={handleMouseLeaveNav}
            >
              {link.type === 'internal' ? (
                <Link
                  to={link.path ?? ''}
                  className="text-slate-600 hover:text-primary font-bold transition-colors text-sm uppercase tracking-wide"
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  className={`flex items-center gap-1 font-bold transition-colors text-sm uppercase tracking-wide focus:outline-none ${
                    activeDropdown === link.id
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === link.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}

              {/* First Level Dropdown */}
              <AnimatePresence>
                {link.type === 'dropdown' && activeDropdown === link.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-0 overflow-visible"
                    style={{ transformOrigin: 'top left' }}
                  >
                    {link.items.map((item) => (
                      <div
                        key={item.name}
                        className="relative group/sub min-w-[185px]"
                        onMouseEnter={() => {
                          if (item.type === 'sub-dropdown') setActiveSubDropdown(item.id ?? null);
                        }}
                        onMouseLeave={() => {
                          if (item.type === 'sub-dropdown') setActiveSubDropdown(null);
                        }}
                      >
                        {item.type === 'external' ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-5 py-3 text-sm w-auto font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <button className="w-full text-left px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex justify-between items-center transition-colors">
                            {item.name}
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </button>
                        )}

                        {/* Second Level Dropdown */}
                        <AnimatePresence>
                          {item.type === 'sub-dropdown' && activeSubDropdown === item.id && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-0 left-full min-w-[158px] bg-white rounded-xl shadow-xl border border-slate-100 py-2 -ml-1"
                            >
                              {item.items.map((subItem) => (
                                <a
                                  key={subItem.name}
                                  href={subItem.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                  {subItem.name}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Call to Action Button */}
          <a
            href="#"
            className="hidden lg:block bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-orange-200 transition-all hover:scale-105 active:scale-95"
          >
            Đăng ký học thử
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-slate-800" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.type === 'internal' ? (
                    <Link
                      to={link.path ?? ''}
                      className="block text-slate-800 font-bold text-lg"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-bold text-primary text-lg">{link.name}</div>
                      {link.items?.map((item) => (
                        <div key={item.name} className="pl-4 border-l-2 border-slate-100">
                          {item.type === 'external' ? (
                            <a
                              href={item.url}
                              target="_blank"
                              className="block text-slate-600 font-medium py-1"
                            >
                              {item.name}
                            </a>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-slate-800 font-semibold py-1">{item.name}</div>
                              {item.items?.map((sub) => (
                                <a
                                  key={sub.name}
                                  href={sub.url}
                                  target="_blank"
                                  className="block pl-4 text-slate-500 text-sm py-1"
                                >
                                  {sub.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
