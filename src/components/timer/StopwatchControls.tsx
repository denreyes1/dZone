import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { Button } from '@/components/ui/Button';

export function StopwatchControls() {
  const { stopwatchRunning, stopwatchElapsed, startStopwatch, pauseStopwatch, resetStopwatch, addLap } =
    useTimerStore();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={resetStopwatch} title="Reset">
        <RotateCcw size={16} />
      </Button>

      <Button
        variant={stopwatchRunning ? 'secondary' : 'primary'}
        size="lg"
        onClick={stopwatchRunning ? pauseStopwatch : startStopwatch}
        className="px-8"
      >
        {stopwatchRunning ? <Pause size={18} /> : <Play size={18} />}
        {stopwatchRunning ? 'Pause' : 'Start'}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={addLap}
        disabled={!stopwatchRunning && stopwatchElapsed === 0}
        title="Lap"
      >
        <Flag size={16} />
      </Button>
    </div>
  );
}
