import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAudioStore } from '@/stores/audioStore';
import { AMBIENT_SOUNDS } from '@/utils/constants';

const CROSSFADE_SEC = 2;
const POLL_INTERVAL_MS = 200;

interface CrossfadeLoop {
  howls: [Howl, Howl];
  active: 0 | 1;
  polling: ReturnType<typeof setInterval> | null;
  fading: boolean;
}

export function useAudio() {
  const sounds = useAudioStore((s) => s.sounds);
  const masterVolume = useAudioStore((s) => s.masterVolume);
  const loopsRef = useRef<Record<string, CrossfadeLoop>>({});
  const volRef = useRef<Record<string, number>>({});

  AMBIENT_SOUNDS.forEach((sound) => {
    const state = sounds[sound.id];
    volRef.current[sound.id] = state
      ? (state.volume / 100) * (masterVolume / 100)
      : 0;
  });

  useEffect(() => {
    AMBIENT_SOUNDS.forEach((sound) => {
      const state = sounds[sound.id];
      const loop = loopsRef.current[sound.id];
      const vol = volRef.current[sound.id] ?? 0;

      if (state?.playing) {
        if (!loop) {
          const make = () =>
            new Howl({ src: [sound.url], loop: false, volume: 0, html5: true });

          const entry: CrossfadeLoop = {
            howls: [make(), make()],
            active: 0,
            polling: null,
            fading: false,
          };
          loopsRef.current[sound.id] = entry;

          entry.howls[0].volume(vol);
          entry.howls[0].play();

          entry.polling = setInterval(() => {
            const cur = entry.howls[entry.active];
            const dur = cur.duration();
            const pos = cur.seek() as number;

            if (dur > 0 && !entry.fading && dur - pos <= CROSSFADE_SEC) {
              entry.fading = true;
              const nextIdx: 0 | 1 = entry.active === 0 ? 1 : 0;
              const next = entry.howls[nextIdx];
              const currentVol = volRef.current[sound.id] ?? 0;

              next.seek(0);
              next.volume(0);
              next.play();
              next.fade(0, currentVol, CROSSFADE_SEC * 1000);
              cur.fade(currentVol, 0, CROSSFADE_SEC * 1000);

              setTimeout(() => {
                cur.stop();
                entry.active = nextIdx;
                entry.fading = false;
              }, CROSSFADE_SEC * 1000);
            }
          }, POLL_INTERVAL_MS);
        } else {
          if (!loop.fading) {
            loop.howls[loop.active].volume(vol);
          }
          if (!loop.howls[loop.active].playing() && !loop.fading) {
            loop.howls[loop.active].play();
          }
        }
      } else if (loop) {
        if (loop.polling) clearInterval(loop.polling);
        loop.howls[0].stop();
        loop.howls[1].stop();
        loop.howls[0].unload();
        loop.howls[1].unload();
        delete loopsRef.current[sound.id];
      }
    });
  }, [sounds, masterVolume]);

  useEffect(() => {
    return () => {
      Object.values(loopsRef.current).forEach((loop) => {
        if (loop.polling) clearInterval(loop.polling);
        loop.howls[0].unload();
        loop.howls[1].unload();
      });
      loopsRef.current = {};
    };
  }, []);
}
