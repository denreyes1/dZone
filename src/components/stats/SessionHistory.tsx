import { Clock } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { formatDuration } from '@/utils/formatTime';
import { SCENES } from '@/utils/constants';

export function SessionHistory() {
  const { recentSessions } = useSessions();

  if (recentSessions.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-600">
        No sessions recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {recentSessions.slice(0, 5).map((session) => {
        const scene = SCENES.find((s) => s.id === session.sceneId);
        return (
          <div
            key={session.id}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5"
          >
            <Clock size={14} className="shrink-0 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-300">{scene?.name ?? 'Unknown scene'}</p>
            </div>
            <span className="text-sm font-medium text-gray-400">
              {formatDuration(session.duration)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
