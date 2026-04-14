import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { BoardTask, ChecklistItem } from '@/types/kanban';

interface TaskCardProps {
  task: BoardTask;
  onEdit: (task: BoardTask) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<BoardTask>) => void;
  isDragOverlay?: boolean;
}

function TaskCardContent({ task, onEdit, onDelete, onUpdate, isDragOverlay }: TaskCardProps) {
  const checklist = task.checklist ?? [];
  const checkedCount = checklist.filter((i) => i.checked).length;

  function toggleItem(index: number) {
    if (!onUpdate) return;
    const updated: ChecklistItem[] = checklist.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item,
    );
    onUpdate(task.id, { checklist: updated });
  }

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
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60">
            {task.description}
          </p>
        )}

        {checklist.length > 0 && (
          <div className="mt-1.5 space-y-0.5">
            <div className="mb-1 flex items-center gap-1.5">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-accent-amber/60 transition-all"
                  style={{ width: `${checklist.length ? (checkedCount / checklist.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] tabular-nums text-gray-500">
                {checkedCount}/{checklist.length}
              </span>
            </div>
            {checklist.map((item, i) => (
              <label
                key={i}
                className="flex items-start gap-1.5 text-[11px] leading-tight"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(i)}
                  className="mt-0.5 h-3 w-3 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 accent-accent-amber"
                />
                <span
                  className={cn(
                    'transition-colors',
                    item.checked ? 'text-gray-500 line-through' : 'text-gray-300',
                  )}
                >
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        )}

        {task.tags?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {task.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight"
                style={{
                  backgroundColor: tag.color + '20',
                  color: tag.color,
                  border: `1px solid ${tag.color}30`,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
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

export function TaskCard({ task, onEdit, onDelete, onUpdate, isDragOverlay }: TaskCardProps) {
  if (isDragOverlay) {
    return <TaskCardContent task={task} onEdit={onEdit} onDelete={onDelete} onUpdate={onUpdate} isDragOverlay />;
  }

  return <SortableTaskCard task={task} onEdit={onEdit} onDelete={onDelete} onUpdate={onUpdate} />;
}

function SortableTaskCard({ task, onEdit, onDelete, onUpdate }: Omit<TaskCardProps, 'isDragOverlay'>) {
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
      <TaskCardContent task={task} onEdit={onEdit} onDelete={onDelete} onUpdate={onUpdate} />
    </div>
  );
}
