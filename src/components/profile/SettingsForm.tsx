import { usePreferences } from '@/hooks/usePreferences';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SCENES } from '@/utils/constants';
import { useState } from 'react';

export function SettingsForm() {
  const { preferences, updatePreferences } = usePreferences();
  const [focus, setFocus] = useState(preferences.focusDuration);
  const [brk, setBrk] = useState(preferences.breakDuration);
  const [longBrk, setLongBrk] = useState(preferences.longBreakDuration);
  const [scene, setScene] = useState(preferences.preferredScene);

  function handleSave() {
    updatePreferences({
      focusDuration: focus,
      breakDuration: brk,
      longBreakDuration: longBrk,
      preferredScene: scene,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Timer Defaults
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Input
            id="pref-focus"
            label="Focus (min)"
            type="number"
            min={1}
            max={120}
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
          />
          <Input
            id="pref-break"
            label="Break (min)"
            type="number"
            min={1}
            max={30}
            value={brk}
            onChange={(e) => setBrk(Number(e.target.value))}
          />
          <Input
            id="pref-long"
            label="Long Break"
            type="number"
            min={1}
            max={60}
            value={longBrk}
            onChange={(e) => setLongBrk(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Default Scene
        </h3>
        <select
          value={scene}
          onChange={(e) => setScene(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 focus:border-accent-amber/40 focus:outline-none focus:ring-2 focus:ring-accent-amber/40"
        >
          {SCENES.map((s) => (
            <option key={s.id} value={s.id} className="bg-panel">
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Preferences
      </Button>
    </div>
  );
}
