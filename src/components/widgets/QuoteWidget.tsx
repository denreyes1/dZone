import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomQuote, type Quote } from '@/utils/quotes';
import { usePanelDrag } from '@/hooks/usePanelDrag';

export function QuoteWidget() {
  const [quote, setQuote] = useState<Quote>(getRandomQuote);
  const drag = usePanelDrag('quote', 24, window.innerHeight - 160);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ ...drag.containerStyle, zIndex: 20 }}
      {...drag.dragHandleProps}
      className="cursor-grab select-none active:cursor-grabbing"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={quote.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm"
        >
          <p className="text-sm italic leading-relaxed text-gray-400/80">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="mt-1 text-xs text-gray-600">&mdash; {quote.author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
