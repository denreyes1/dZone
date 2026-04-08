import {
  Anchor,
  AppWindow,
  AudioLines,
  AudioWaveform,
  Bell,
  Bird,
  BookOpen,
  Briefcase,
  Bug,
  Building2,
  Car,
  Cat,
  Church,
  CircleDot,
  Clock,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  Coffee,
  Cog,
  Disc,
  Dog,
  Droplets,
  Egg,
  Fan,
  FerrisWheel,
  FileText,
  Fish,
  Flame,
  FlaskConical,
  Footprints,
  Hammer,
  Keyboard,
  Landmark,
  Leaf,
  MilkOff,
  Moon,
  Plane,
  Projector,
  Rabbit,
  Radio,
  Sailboat,
  Ship,
  ShoppingCart,
  Siren,
  Snowflake,
  Sparkles,
  Tent,
  Thermometer,
  TrainFront,
  TreePalm,
  TreePine,
  Type,
  Umbrella,
  Users,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wind,
  Wine,
  type LucideIcon,
} from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/utils/cn';
import type { AmbientSound } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Anchor,
  AppWindow,
  AudioLines,
  AudioWaveform,
  Bell,
  Bird,
  BookOpen,
  Briefcase,
  Bug,
  Building2,
  Car,
  Cat,
  Church,
  CircleDot,
  Clock,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  Coffee,
  Cog,
  Disc,
  Dog,
  Droplets,
  Egg,
  Fan,
  FerrisWheel,
  FileText,
  Fish,
  Flame,
  FlaskConical,
  Footprints,
  Hammer,
  Keyboard,
  Landmark,
  Leaf,
  MilkOff,
  Moon,
  Plane,
  Projector,
  Rabbit,
  Radio,
  Sailboat,
  Ship,
  ShoppingCart,
  Siren,
  Snowflake,
  Sparkles,
  Tent,
  Thermometer,
  TrainFront,
  TreePalm,
  TreePine,
  Type,
  Umbrella,
  Users,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wind,
  Wine,
};

interface SoundChannelProps {
  sound: AmbientSound;
}

export function SoundChannel({ sound }: SoundChannelProps) {
  const soundState = useAudioStore((s) => s.sounds[sound.id]);
  const toggleSound = useAudioStore((s) => s.toggleSound);
  const setSoundVolume = useAudioStore((s) => s.setSoundVolume);

  const isPlaying = soundState?.playing ?? false;
  const volume = soundState?.volume ?? 60;
  const Icon = iconMap[sound.icon] ?? Radio;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => toggleSound(sound.id)}
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all',
          isPlaying
            ? 'bg-accent-amber/20 text-accent-amber'
            : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300',
        )}
      >
        <Icon size={18} />
      </button>
      <div className="flex-1">
        <p className="mb-1 text-sm font-medium text-gray-200">{sound.name}</p>
        <Slider
          value={volume}
          onChange={(v) => setSoundVolume(sound.id, v)}
          className={cn(!isPlaying && 'opacity-30')}
        />
      </div>
    </div>
  );
}
