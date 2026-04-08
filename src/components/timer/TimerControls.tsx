import { Play, Pause, RotateCcw, SkipForward, Settings } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';

export function TimerControls() {
  const { isRunning, start, pause, reset, skip } = useTimerStore();
  const toggleTimerSettings = useUIStore((s) => s.toggleTimerSettings);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={reset} title="Reset">
        <RotateCcw size={16} />
      </Button>

      <Button
        variant={isRunning ? 'secondary' : 'primary'}
        size="lg"
        onClick={isRunning ? pause : start}
        className="px-8"
      >
        {isRunning ? <Pause size={18} /> : <Play size={18} />}
        {isRunning ? 'Pause' : 'Start'}
      </Button>

      <Button variant="ghost" size="icon" onClick={skip} title="Skip">
        <SkipForward size={16} />
      </Button>

      <Button variant="ghost" size="icon" onClick={toggleTimerSettings} title="Timer settings">
        <Settings size={16} />
      </Button>
    </div>
  );
}
