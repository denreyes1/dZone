import { motion } from 'framer-motion';
import { GripHorizontal } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { useUIStore } from '@/stores/uiStore';
import { formatTime } from '@/utils/formatTime';
import { TimerControls } from './TimerControls';
import { StopwatchControls } from './StopwatchControls';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { usePanelDrag } from '@/hooks/usePanelDrag';
import { cn } from '@/utils/cn';
import type { TimerView } from '@/stores/timerStore';

const TABS: { key: TimerView; label: string }[] = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'stopwatch', label: 'Stopwatch' },
];

export function TimerWidget() {
  const showTimer = useUIStore((s) => s.showTimer);
  const {
    timerView,
    setTimerView,
    mode,
    timeRemaining,
    sessionsCompleted,
    focusDuration,
    breakDuration,
    longBreakDuration,
    stopwatchElapsed,
    laps,
  } = useTimerStore();
  const drag = usePanelDrag('timer', 24, 24);

  if (!showTimer) return null;

  const totalTime =
    mode === 'focus'
      ? focusDuration * 60
      : mode === 'break'
        ? breakDuration * 60
        : longBreakDuration * 60;

  const pomodoroProgress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const circumference = 2 * Math.PI * 54;

  const isStopwatch = timerView === 'stopwatch';
  const displayTime = isStopwatch ? stopwatchElapsed : timeRemaining;
  const progress = isStopwatch ? (stopwatchElapsed % 60) / 60 : pomodoroProgress;
  const strokeDashoffset = circumference * (1 - progress);

  const modeLabel = mode === 'focus' ? 'Focus' : mode === 'break' ? 'Break' : 'Long Break';
  const ringColor = isStopwatch ? '#22d3ee' : mode === 'focus' ? '#f59e0b' : '#6366f1';
  const modeColor = isStopwatch
    ? 'text-cyan-400'
    : mode === 'focus'
      ? 'text-accent-amber'
      : 'text-accent-indigo';

  return (
    <div style={{ ...drag.containerStyle, zIndex: 30 }}>
      <GlassPanel
        variant="strong"
        className="flex flex-col items-center gap-4 p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Drag handle */}
        <div
          {...drag.dragHandleProps}
          className="-mx-6 -mt-6 flex cursor-grab items-center justify-center px-6 pb-2 pt-3 active:cursor-grabbing"
        >
          <GripHorizontal size={16} className="text-gray-600" />
        </div>

        {/* Tab switcher */}
        <div className="flex w-full items-center justify-center gap-1 rounded-lg bg-white/5 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTimerView(tab.key)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-all',
                timerView === tab.key
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-300',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mode label (pomodoro only) */}
        {!isStopwatch && (
          <div className={cn('text-center text-xs font-semibold uppercase tracking-widest', modeColor)}>
            {modeLabel}
          </div>
        )}

        {/* Ring + time */}
        <div className="relative flex items-center justify-center">
          <svg width="132" height="132" className="-rotate-90">
            <circle
              cx="66"
              cy="66"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="6"
            />
            <motion.circle
              cx="66"
              cy="66"
              r="54"
              fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute">
            <span className="font-mono text-3xl font-bold text-gray-100">
              {formatStopwatchOrTimer(displayTime, isStopwatch)}
            </span>
          </div>
        </div>

        {/* Controls */}
        {isStopwatch ? <StopwatchControls /> : <TimerControls />}

        {/* Footer */}
        {!isStopwatch && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  i < sessionsCompleted % 4 ? 'bg-accent-amber' : 'bg-white/15',
                )}
              />
            ))}
            <span className="ml-2 text-xs text-gray-500">{sessionsCompleted} sessions</span>
          </div>
        )}

        {/* Laps */}
        {isStopwatch && laps.length > 0 && (
          <div className="scrollbar-thin max-h-[100px] w-full space-y-1 overflow-y-auto">
            {[...laps].reverse().map((lapTime, i) => {
              const lapNumber = laps.length - i;
              const prevLap = lapNumber > 1 ? laps[lapNumber - 2] : 0;
              const split = lapTime - prevLap;
              return (
                <div key={i} className="flex items-center justify-between px-2 text-xs">
                  <span className="text-gray-500">Lap {lapNumber}</span>
                  <span className="font-mono text-gray-400">
                    +{formatStopwatchOrTimer(split, true)}
                  </span>
                  <span className="font-mono text-gray-300">
                    {formatStopwatchOrTimer(lapTime, true)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function formatStopwatchOrTimer(totalSeconds: number, isStopwatch: boolean): string {
  if (!isStopwatch) return formatTime(totalSeconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
