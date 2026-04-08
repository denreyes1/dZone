import { X, CheckSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import { useTasks } from '@/hooks/useTasks';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { TaskInput } from './TaskInput';
import { TaskItem } from './TaskItem';

export function TaskPanel() {
  const toggleTaskPanel = useUIStore((s) => s.toggleBoard);
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <GlassPanel
      variant="strong"
      className="absolute bottom-20 left-4 right-4 flex max-h-[70vh] flex-col p-5 md:left-4 md:right-auto md:w-[360px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare size={18} className="text-accent-amber" />
          <h2 className="text-lg font-semibold text-gray-100">Tasks</h2>
          <span className="text-xs text-gray-500">
            {completedCount}/{tasks.length}
          </span>
        </div>
        <button
          onClick={toggleTaskPanel}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <TaskInput onAdd={addTask} />

      <div className="mt-3 flex-1 space-y-1 overflow-y-auto">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-600">
            No tasks yet. Add one above to get started.
          </p>
        )}
      </div>
    </GlassPanel>
  );
}
