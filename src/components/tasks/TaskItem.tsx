import { motion } from 'framer-motion';
import { Trash2, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
    >
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all',
          task.completed
            ? 'border-accent-amber bg-accent-amber text-void'
            : 'border-white/20 hover:border-accent-amber/50',
        )}
      >
        {task.completed && <Check size={12} strokeWidth={3} />}
      </button>

      <span
        className={cn(
          'flex-1 text-sm transition-colors',
          task.completed ? 'text-gray-500 line-through' : 'text-gray-200',
        )}
      >
        {task.text}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 rounded-lg p-1 text-gray-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}
