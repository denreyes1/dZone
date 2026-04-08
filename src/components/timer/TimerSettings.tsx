import { useState } from 'react';
import { X } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { useUIStore } from '@/stores/uiStore';
import { usePreferences } from '@/hooks/usePreferences';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function TimerSettings() {
  const { focusDuration, breakDuration, longBreakDuration } = useTimerStore();
  const toggleTimerSettings = useUIStore((s) => s.toggleTimerSettings);
  const { updatePreferences } = usePreferences();

  const [focus, setFocus] = useState(focusDuration);
  const [brk, setBrk] = useState(breakDuration);
  const [longBrk, setLongBrk] = useState(longBreakDuration);

  function handleSave() {
    updatePreferences({
      focusDuration: focus,
      breakDuration: brk,
      longBreakDuration: longBrk,
    });
    toggleTimerSettings();
  }

  return (
    <GlassPanel
      variant="strong"
      className="absolute bottom-20 left-1/2 w-80 -translate-x-1/2 p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-100">Timer Settings</h3>
        <button
          onClick={toggleTimerSettings}
          className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
      <div className="space-y-3">
        <Input
          id="focus-dur"
          label="Focus (min)"
          type="number"
          min={1}
          max={120}
          value={focus}
          onChange={(e) => setFocus(Number(e.target.value))}
        />
        <Input
          id="break-dur"
          label="Break (min)"
          type="number"
          min={1}
          max={30}
          value={brk}
          onChange={(e) => setBrk(Number(e.target.value))}
        />
        <Input
          id="long-break-dur"
          label="Long Break (min)"
          type="number"
          min={1}
          max={60}
          value={longBrk}
          onChange={(e) => setLongBrk(Number(e.target.value))}
        />
        <Button onClick={handleSave} className="w-full">
          Save
        </Button>
      </div>
    </GlassPanel>
  );
}
