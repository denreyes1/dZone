import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { BoardTask } from '@/types/kanban';

interface TaskCardProps {
  task: BoardTask;
  onEdit: (task: BoardTask) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

function TaskCardContent({ task, onEdit, onDelete, isDragOverlay }: TaskCardProps) {
  return (
    <div
      className={cn(
        'glass-subtle group relative p-3',
        !isDragOverlay && 'cursor-grab active:cursor-grabbing',
        isDragOverlay && 'cursor-grabbing shadow-2xl shadow-black/40 ring-1 ring-accent-amber/30',
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-gray-200">{task.title}</p>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {task.description}
          </p>
        )}
      </div>

      {!isDragOverlay && (
        <div
          className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(task)}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-gray-300"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export function TaskCard({ task, onEdit, onDelete, isDragOverlay }: TaskCardProps) {
  if (isDragOverlay) {
    return <TaskCardContent task={task} onEdit={onEdit} onDelete={onDelete} isDragOverlay />;
  }

  return <SortableTaskCard task={task} onEdit={onEdit} onDelete={onDelete} />;
}

function SortableTaskCard({ task, onEdit, onDelete }: Omit<TaskCardProps, 'isDragOverlay'>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'touch-none',
        isDragging && 'pointer-events-none',
      )}
    >
      <TaskCardContent task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
