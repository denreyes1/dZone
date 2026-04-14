import { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { PinOff, Plus, X } from 'lucide-react';
import { usePanelDrag } from '@/hooks/usePanelDrag';
import { usePanelResize, type ResizeEdge } from '@/hooks/usePanelResize';
import { TaskCard } from './TaskCard';
import { cn } from '@/utils/cn';
import type { BoardTask, ColumnConfig } from '@/types/kanban';

const RESIZE_EDGES: { edge: ResizeEdge; className: string }[] = [
  { edge: 'n', className: 'absolute -top-1 left-3 right-3 h-2' },
  { edge: 's', className: 'absolute -bottom-1 left-3 right-3 h-2' },
  { edge: 'e', className: 'absolute -right-1 top-3 bottom-3 w-2' },
  { edge: 'w', className: 'absolute -left-1 top-3 bottom-3 w-2' },
  { edge: 'nw', className: 'absolute -top-1 -left-1 h-3 w-3' },
  { edge: 'ne', className: 'absolute -top-1 -right-1 h-3 w-3' },
  { edge: 'sw', className: 'absolute -bottom-1 -left-1 h-3 w-3' },
  { edge: 'se', className: 'absolute -bottom-1 -right-1 h-3 w-3' },
];

interface PinnedColumnViewProps {
  config: ColumnConfig;
  tasks: BoardTask[];
  onUnpin: () => void;
  onClose: () => void;
  onAddClick: () => void;
  onEditTask: (task: BoardTask) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<BoardTask>) => void;
  onReorder: (tasks: { id: string; order: number }[]) => void;
  externalDnd?: boolean;
}

export function PinnedColumnView({
  config,
  tasks,
  onUnpin,
  onClose,
  onAddClick,
  onEditTask,
  onDeleteTask,
  onUpdateTask,
  onReorder,
  externalDnd = false,
}: PinnedColumnViewProps) {
  const drag = usePanelDrag(
    `pinned-${config.id}`,
    Math.max(12, window.innerWidth - 340),
    Math.max(12, window.innerHeight * 0.1),
  );
  const resize = usePanelResize(`pinned-${config.id}`, 300, Math.min(500, window.innerHeight * 0.65), {
    minW: 220,
    minH: 200,
    getPos: () => drag.pos,
    setPos: drag.setPos,
    savePos: drag.savePos,
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [localTasks, setLocalTasks] = useState<BoardTask[] | null>(null);

  const displayed = externalDnd ? tasks : (localTasks ?? tasks);
  const itemIds = useMemo(() => displayed.map((t) => t.id), [displayed]);
  const activeTask = useMemo(
    () => (!externalDnd && activeId ? displayed.find((t) => t.id === activeId) ?? null : null),
    [activeId, displayed, externalDnd],
  );

  const { setNodeRef } = useDroppable({ id: config.id });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
      setLocalTasks([...tasks]);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && localTasks) {
        const oldIndex = localTasks.findIndex((t) => t.id === active.id);
        const newIndex = localTasks.findIndex((t) => t.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = arrayMove(localTasks, oldIndex, newIndex);
          onReorder(reordered.map((t, i) => ({ id: t.id, order: i })));
        }
      }

      setActiveId(null);
      setLocalTasks(null);
    },
    [localTasks, onReorder],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setLocalTasks(null);
  }, []);

  const taskList = (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto"
      >
        {displayed.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}

        {displayed.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 py-8">
            <p className="text-xs text-gray-600">No tasks</p>
          </div>
        )}
      </div>
    </SortableContext>
  );

  return (
    <div
      style={{ ...drag.containerStyle, ...resize.sizeStyle, zIndex: 20 }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass flex h-full flex-col overflow-hidden p-3"
      >
        <div
          {...drag.dragHandleProps}
          className="mb-2 flex cursor-grab items-center justify-between select-none active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <h3 className={cn('text-sm font-semibold', config.color)}>{config.label}</h3>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
              {tasks.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={onAddClick}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-gray-300"
              title="Add task"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={onUnpin}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-amber-400"
              title="Unpin — back to full board"
            >
              <PinOff size={14} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {externalDnd ? (
          taskList
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            {taskList}
            {createPortal(
              <DragOverlay dropAnimation={null}>
                {activeTask && (
                  <div style={{ width: resize.size.w - 24 }}>
                    <TaskCard
                      task={activeTask}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      isDragOverlay
                    />
                  </div>
                )}
              </DragOverlay>,
              document.body,
            )}
          </DndContext>
        )}
      </motion.div>

      {RESIZE_EDGES.map(({ edge, className }) => (
        <div key={edge} className={className} {...resize.handleProps(edge)} />
      ))}
    </div>
  );
}
