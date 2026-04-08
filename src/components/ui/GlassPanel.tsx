import { type ReactNode } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassPanelProps extends MotionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
}

const variantClass = {
  default: 'glass',
  strong: 'glass-strong',
  subtle: 'glass-subtle',
};

export function GlassPanel({
  children,
  className,
  variant = 'default',
  ...motionProps
}: GlassPanelProps) {
  return (
    <motion.div className={cn(variantClass[variant], 'p-4', className)} {...motionProps}>
      {children}
    </motion.div>
  );
}
