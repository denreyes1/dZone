import { Clock, Target, Flame, X } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { formatDuration } from '@/utils/formatTime';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useUIStore } from '@/stores/uiStore';

export function StatsCard() {
  const { todayFocusTime, todaySessionCount, streak } = useSessions();
  const toggleStats = useUIStore((s) => s.toggleStats);

  const stats = [
    { icon: Clock, label: 'Focus Time', value: formatDuration(todayFocusTime) },
    { icon: Target, label: 'Sessions', value: String(todaySessionCount) },
    { icon: Flame, label: 'Streak', value: `${streak} days` },
  ];

  return (
    <GlassPanel
      variant="strong"
      className="absolute bottom-20 left-1/2 w-[340px] -translate-x-1/2 p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Today's Progress</h2>
        <button
          onClick={toggleStats}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 p-3">
            <Icon size={20} className="text-accent-amber" />
            <span className="text-lg font-bold text-gray-100">{value}</span>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
