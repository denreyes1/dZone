import { useState, useEffect, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TagInput } from './TagInput';
import type { BoardTask, ColumnConfig, TaskTag } from '@/types/kanban';

interface EditTaskModalProps {
  task: BoardTask | null;
  onClose: () => void;
  onSave: (id: string, updates: { title: string; description: string; column: string; tags: TaskTag[] }) => void;
  onDelete: (id: string) => void;
  columns: ColumnConfig[];
}

export function EditTaskModal({ task, onClose, onSave, onDelete, columns }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState<string>('');
  const [tags, setTags] = useState<TaskTag[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setColumn(task.column);
      setTags(task.tags ?? []);
    }
  }, [task]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!task || !title.trim()) return;
    onSave(task.id, { title: title.trim(), description: description.trim(), column, tags });
    onClose();
  }

  function handleDelete() {
    if (!task) return;
    onDelete(task.id);
    onClose();
  }

  return (
    <Modal open={!!task} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="edit-title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="space-y-1.5">
          <label htmlFor="edit-desc" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="edit-desc"
            rows={3}
            placeholder="Add details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-accent-amber/40 focus:outline-none focus:ring-2 focus:ring-accent-amber/40"
          />
        </div>
        <TagInput tags={tags} onChange={setTags} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Column</label>
          <div className="flex flex-wrap gap-2">
            {columns.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setColumn(col.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  column === col.id
                    ? 'bg-accent-amber/20 text-accent-amber ring-1 ring-accent-amber/40'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Save
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </form>
    </Modal>
  );
}
