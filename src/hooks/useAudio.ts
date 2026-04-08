import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAudioStore } from '@/stores/audioStore';
import { AMBIENT_SOUNDS } from '@/utils/constants';

export function useAudio() {
  const sounds = useAudioStore((s) => s.sounds);
  const masterVolume = useAudioStore((s) => s.masterVolume);
  const howlsRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    AMBIENT_SOUNDS.forEach((sound) => {
      const state = sounds[sound.id];
      let howl = howlsRef.current[sound.id];

      if (state?.playing) {
        if (!howl) {
          howl = new Howl({
            src: [sound.url],
            loop: true,
            volume: (state.volume / 100) * (masterVolume / 100),
            html5: true,
          });
          howlsRef.current[sound.id] = howl;
          howl.play();
        } else {
          howl.volume((state.volume / 100) * (masterVolume / 100));
          if (!howl.playing()) howl.play();
        }
      } else if (howl && howl.playing()) {
        howl.pause();
      }
    });
  }, [sounds, masterVolume]);

  useEffect(() => {
    return () => {
      Object.values(howlsRef.current).forEach((h) => h.unload());
      howlsRef.current = {};
    };
  }, []);
}
