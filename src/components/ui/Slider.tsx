import { cn } from '@/utils/cn';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, className }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn('slider w-full cursor-pointer', className)}
      style={{
        background: `linear-gradient(to right, #f59e0b ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
        height: '4px',
        borderRadius: '2px',
        WebkitAppearance: 'none',
        appearance: 'none',
      }}
    />
  );
}
