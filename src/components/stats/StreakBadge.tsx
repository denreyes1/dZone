import { Flame } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Flame size={16} className={streak > 0 ? 'text-orange-400' : 'text-gray-600'} />
      <span className="text-sm font-semibold text-gray-200">{streak}</span>
      <span className="text-xs text-gray-500">day streak</span>
    </div>
  );
}
