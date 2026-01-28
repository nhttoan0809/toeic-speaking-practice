import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  fixedText?: string;
  texts: string[];
  speed?: number;
  pause?: number;
  className?: string;
}

export default function Typewriter({
  fixedText,
  texts,
  speed = 50,
  pause = 2000,
  className,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentFullText = texts[currentTextIndex];
      if (currentFullText === undefined) return;

      if (isDeleting) {
        setDisplayedText((prev) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedText((prev) => currentFullText.substring(0, prev.length + 1));
      }

      if (!isDeleting && displayedText === currentFullText) {
        setTimeout(() => {
          setIsDeleting(true);
        }, pause);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);
    return () => {
      clearTimeout(timer);
    };
  }, [displayedText, isDeleting, currentTextIndex, texts, speed, pause]);

  return (
    <span className={className}>
      {fixedText}
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-1 h-[1em] bg-current align-middle ml-1"
      />
    </span>
  );
}
