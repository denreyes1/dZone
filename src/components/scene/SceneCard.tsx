import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Scene } from '@/types';

interface SceneCardProps {
  scene: Scene;
  active: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export function SceneCard({ scene, active, onClick, onDelete }: SceneCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${scene.videoId}/hqdefault.jpg`;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber/50',
        active && 'ring-2 ring-accent-amber glow-amber',
      )}
    >
      <div className="aspect-video w-full">
        <div
          className="absolute inset-0"
          style={{ background: scene.gradient }}
        />
        <img
          src={thumbnailUrl}
          alt={scene.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-left text-sm font-medium text-white">{scene.name}</p>
        <p className="text-left text-xs text-gray-300">{scene.description}</p>
      </div>
      {onDelete && (
        <div
          className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-gray-300 transition-colors hover:bg-red-500/80 hover:text-white">
            <X size={12} />
          </span>
        </div>
      )}
    </button>
  );
}
