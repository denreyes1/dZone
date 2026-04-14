import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Pin } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { cn } from '@/utils/cn';
import type { ColumnConfig, BoardTask } from '@/types/kanban';

interface KanbanColumnProps {
  column: string;
  config: ColumnConfig;
  tasks: BoardTask[];
  onAddClick: (column: string) => void;
  onEditTask: (task: BoardTask) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<BoardTask>) => void;
  onPin?: (column: string) => void;
}

export function KanbanColumn({ column, config, tasks, onAddClick, onEditTask, onDeleteTask, onUpdateTask, onPin }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column });
  const itemIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div
      className={cn(
        'flex w-64 shrink-0 flex-col rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-colors md:w-72',
        isOver && 'border-accent-amber/30 bg-accent-amber/[0.04]',
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className={cn('text-sm font-semibold', config.color)}>{config.label}</h3>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {onPin && (
            <button
              onClick={() => onPin(column)}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-gray-300"
              title="Pin column"
            >
              <Pin size={13} />
            </button>
          )}
          <button
            onClick={() => onAddClick(column)}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-gray-300"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex min-h-[60px] flex-1 flex-col gap-2 overflow-y-auto"
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
            />
          ))}

          {tasks.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 py-8">
              <p className="text-xs text-gray-600">No tasks</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
