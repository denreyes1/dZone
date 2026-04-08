import { ContinueCard } from '@/components/widgets/ContinueCard';
import { motion } from 'framer-motion';

export function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-none fixed bottom-24 right-4 z-10 w-80 md:right-6"
    >
      <div className="pointer-events-auto">
        <ContinueCard />
      </div>
    </motion.div>
  );
}
