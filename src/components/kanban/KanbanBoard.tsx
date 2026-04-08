import { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { X, Settings, Pin, PinOff } from 'lucide-react';
import { useBoardTasks } from '@/hooks/useBoardTasks';
import { useBoardColumns } from '@/hooks/useBoardColumns';
import { usePanelDrag } from '@/hooks/usePanelDrag';
import { usePanelResize, type ResizeEdge } from '@/hooks/usePanelResize';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { ColumnManagerModal } from './ColumnManagerModal';
import { PinnedColumnView } from './PinnedColumnView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useUIStore } from '@/stores/uiStore';
import type { BoardTask, TaskTag } from '@/types/kanban';

type ColumnItems = Record<string, BoardTask[]>;

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

function groupByColumn(tasks: BoardTask[], columnIds: string[]): ColumnItems {
  const groups: ColumnItems = {};
  for (const id of columnIds) {
    groups[id] = [];
  }
  for (const t of tasks) {
    if (groups[t.column]) {
      groups[t.column].push(t);
    }
  }
  for (const id of columnIds) {
    groups[id].sort((a, b) => a.order - b.order);
  }
  return groups;
}

export function KanbanBoard() {
  const { tasks, loading: tasksLoading, error, addTask, updateTask, deleteTask, moveTask, moveTasksBulk } =
    useBoardTasks();
  const {
    columns: boardColumns,
    columnIds,
    loading: colsLoading,
    addColumn,
    removeColumn,
    renameColumn,
    updateColumnColor,
    reorderColumns,
  } = useBoardColumns();
  const toggleBoard = useUIStore((s) => s.toggleBoard);
  const drag = usePanelDrag(
    'board',
    Math.max(12, (window.innerWidth - 900) / 2),
    Math.max(12, window.innerHeight * 0.15),
  );
  const resize = usePanelResize('board', 900, Math.min(500, window.innerHeight * 0.6), {
    minW: 400,
    minH: 250,
    getPos: () => drag.pos,
    setPos: drag.setPos,
    savePos: drag.savePos,
  });

  const loading = tasksLoading || colsLoading;

  const stableColumns = useMemo(() => groupByColumn(tasks, columnIds), [tasks, columnIds]);

  const [columns, setColumns] = useState<ColumnItems | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);
  const [addColumnTarget, setAddColumnTarget] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<BoardTask | null>(null);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [pinnedColumnId, setPinnedColumnId] = useState<string | null>(null);
  const [pinnedAllIds, setPinnedAllIds] = useState<Set<string>>(new Set());
  const allPinned = pinnedAllIds.size > 0;

  const rendered = columns ?? stableColumns;

  const activeTask = useMemo(() => {
    if (!activeId) return null;
    for (const colId of columnIds) {
      const found = rendered[colId]?.find((t) => t.id === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId, rendered, columnIds]);

  const taskCountByColumn = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const col of boardColumns) {
      counts[col.id] = tasks.filter((t) => t.column === col.id).length;
    }
    return counts;
  }, [tasks, boardColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const findContainer = useCallback(
    (id: UniqueIdentifier): string | null => {
      if (columnIds.includes(id as string)) return id as string;
      const src = columns ?? stableColumns;
      for (const colId of columnIds) {
        if (src[colId]?.some((t) => t.id === id)) return colId;
      }
      return null;
    },
    [columns, stableColumns, columnIds],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const col = findContainer(event.active.id);
    setActiveId(event.active.id);
    setSourceColumn(col);
    setColumns(groupByColumn(tasks, columnIds));
  }, [tasks, columnIds, findContainer]);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || !columns) return;

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id) ??
        (columnIds.includes(String(over.id)) ? String(over.id) : null);

      if (!activeContainer || !overContainer || activeContainer === overContainer) return;

      setColumns((prev) => {
        if (!prev) return prev;
        const activeItems = [...(prev[activeContainer] ?? [])];
        const overItems = [...(prev[overContainer] ?? [])];

        const activeIndex = activeItems.findIndex((t) => t.id === active.id);
        if (activeIndex === -1) return prev;

        const [movedItem] = activeItems.splice(activeIndex, 1);
        const moved = { ...movedItem, column: overContainer };

        const overIndex = overItems.findIndex((t) => t.id === over.id);
        if (overIndex >= 0) {
          overItems.splice(overIndex, 0, moved);
        } else {
          overItems.push(moved);
        }

        return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems };
      });
    },
    [columns, findContainer, columnIds],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || !columns) {
        setActiveId(null);
        setColumns(null);
        return;
      }

      const currentContainer = findContainer(active.id);
      const overContainer = findContainer(over.id) ??
        (columnIds.includes(String(over.id)) ? String(over.id) : null);

      if (!currentContainer || !overContainer) {
        setActiveId(null);
        setSourceColumn(null);
        setColumns(null);
        return;
      }

      const wasCrossColumn = sourceColumn !== null && sourceColumn !== currentContainer;

      if (wasCrossColumn) {
        const destItems = columns[currentContainer] ?? [];
        const newIndex = destItems.findIndex((t) => t.id === active.id);
        const order = newIndex >= 0 ? newIndex : destItems.length;
        moveTask(String(active.id), currentContainer, order);
      } else if (currentContainer === overContainer && !columnIds.includes(String(over.id))) {
        const items = columns[currentContainer] ?? [];
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = arrayMove(items, oldIndex, newIndex);
          reordered.forEach((t, i) => {
            updateTask(t.id, { order: i, column: currentContainer });
          });
        }
      }

      setActiveId(null);
      setSourceColumn(null);
      setColumns(null);
    },
    [columns, findContainer, moveTask, updateTask, sourceColumn, columnIds],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setSourceColumn(null);
    setColumns(null);
  }, []);

  function handleEditSave(
    id: string,
    updates: { title: string; description: string; column: string; tags: TaskTag[] },
  ) {
    updateTask(id, updates);
  }

  function handleColumnDelete(id: string) {
    const fallback = removeColumn(id);
    if (fallback) {
      moveTasksBulk(id, fallback);
    }
  }

  const pinnedConfig = pinnedColumnId ? boardColumns.find((c) => c.id === pinnedColumnId) : null;
  const pinnedTasks = useMemo(
    () =>
      pinnedColumnId
        ? tasks.filter((t) => t.column === pinnedColumnId).sort((a, b) => a.order - b.order)
        : [],
    [tasks, pinnedColumnId],
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ ...drag.containerStyle, ...resize.sizeStyle, zIndex: 20 }}
        className="glass-strong flex items-center justify-center p-12"
      >
        <LoadingSpinner size="lg" />
      </motion.div>
    );
  }

  if (allPinned) {
    const visibleColumns = boardColumns.filter((c) => pinnedAllIds.has(c.id));

    const closePinnedColumn = (colId: string) => {
      setPinnedAllIds((prev) => {
        const next = new Set(prev);
        next.delete(colId);
        return next;
      });
    };

    return (
      <>
        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            const pointerCollisions = pointerWithin(args);
            if (pointerCollisions.length > 0) return pointerCollisions;
            return rectIntersection(args);
          }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {visibleColumns.map((col) => (
            <PinnedColumnView
              key={col.id}
              config={col}
              tasks={rendered[col.id] ?? []}
              onUnpin={() => setPinnedAllIds(new Set())}
              onClose={() => closePinnedColumn(col.id)}
              onAddClick={() => setAddColumnTarget(col.id)}
              onEditTask={setEditingTask}
              onDeleteTask={deleteTask}
              onReorder={(items) => {
                items.forEach(({ id, order }) => {
                  updateTask(id, { order, column: col.id });
                });
              }}
              externalDnd
            />
          ))}

          {createPortal(
            <DragOverlay dropAnimation={null}>
              {activeTask && (
                <div className="w-64 md:w-72">
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

        <AddTaskModal
          open={addColumnTarget !== null}
          onClose={() => setAddColumnTarget(null)}
          onAdd={addTask}
          defaultColumn={addColumnTarget ?? (columnIds[0] || '')}
          columns={boardColumns}
        />

        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
          onDelete={deleteTask}
          columns={boardColumns}
        />
      </>
    );
  }

  if (pinnedConfig) {
    return (
      <>
        <PinnedColumnView
          config={pinnedConfig}
          tasks={pinnedTasks}
          onUnpin={() => setPinnedColumnId(null)}
          onClose={toggleBoard}
          onAddClick={() => setAddColumnTarget(pinnedColumnId)}
          onEditTask={setEditingTask}
          onDeleteTask={deleteTask}
          onReorder={(items) => {
            items.forEach(({ id, order }) => {
              updateTask(id, { order, column: pinnedColumnId! });
            });
          }}
        />

        <AddTaskModal
          open={addColumnTarget !== null}
          onClose={() => setAddColumnTarget(null)}
          onAdd={addTask}
          defaultColumn={addColumnTarget ?? pinnedColumnId!}
          columns={boardColumns}
        />

        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
          onDelete={deleteTask}
          columns={boardColumns}
        />
      </>
    );
  }

  return (
    <>
      <div
        style={{ ...drag.containerStyle, ...resize.sizeStyle, zIndex: 20 }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="glass flex h-full flex-col overflow-hidden p-4"
        >
          <div
            {...drag.dragHandleProps}
            className="mb-3 flex cursor-grab items-center justify-between select-none active:cursor-grabbing"
          >
            <h2 className="text-lg font-semibold text-gray-100">Board</h2>
            <div className="flex items-center gap-1">
              {error && <span className="mr-2 text-xs text-red-400">{error}</span>}
              <button
                onClick={() => setPinnedAllIds(new Set(columnIds))}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-amber-400"
                title="Pin all columns"
              >
                <Pin size={16} />
              </button>
              <button
                onClick={() => setShowColumnManager(true)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Manage columns"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={toggleBoard}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={(args) => {
              const pointerCollisions = pointerWithin(args);
              if (pointerCollisions.length > 0) return pointerCollisions;
              return rectIntersection(args);
            }}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="flex flex-1 gap-3 overflow-x-auto pb-2">
              {boardColumns.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col.id}
                  config={col}
                  tasks={rendered[col.id] ?? []}
                  onAddClick={(c) => setAddColumnTarget(c)}
                  onEditTask={setEditingTask}
                  onDeleteTask={deleteTask}
                  onPin={(id) => setPinnedColumnId(id)}
                />
              ))}
            </div>

            {createPortal(
              <DragOverlay dropAnimation={null}>
                {activeTask && (
                  <div className="w-64 md:w-72">
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
        </motion.div>

        {RESIZE_EDGES.map(({ edge, className }) => (
          <div key={edge} className={className} {...resize.handleProps(edge)} />
        ))}
      </div>

      <AddTaskModal
        open={addColumnTarget !== null}
        onClose={() => setAddColumnTarget(null)}
        onAdd={addTask}
        defaultColumn={addColumnTarget ?? (columnIds[0] || '')}
        columns={boardColumns}
      />

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleEditSave}
        onDelete={deleteTask}
        columns={boardColumns}
      />

      <ColumnManagerModal
        open={showColumnManager}
        onClose={() => setShowColumnManager(false)}
        columns={boardColumns}
        taskCountByColumn={taskCountByColumn}
        onAdd={addColumn}
        onRemove={(id) => {
          handleColumnDelete(id);
          return null;
        }}
        onRename={renameColumn}
        onColorChange={updateColumnColor}
        onReorder={reorderColumns}
        onMoveTasksFromColumn={moveTasksBulk}
      />
    </>
  );
}
