import { useState, useEffect, useRef, type FormEvent } from 'react';
import { AlignLeft, ListChecks } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TagInput, type TagInputHandle } from './TagInput';
import { ChecklistEditor } from './ChecklistEditor';
import type { ColumnConfig, TaskTag, ChecklistItem } from '@/types/kanban';

type DescMode = 'description' | 'checklist';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, column: string, tags: TaskTag[], checklist: ChecklistItem[]) => void;
  defaultColumn: string;
  columns: ColumnConfig[];
  tagHistory: TaskTag[];
  onAddToTagHistory: (tag: TaskTag) => void;
}

export function AddTaskModal({ open, onClose, onAdd, defaultColumn, columns, tagHistory, onAddToTagHistory }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [mode, setMode] = useState<DescMode>('description');
  const [column, setColumn] = useState<string>(defaultColumn);
  const [tags, setTags] = useState<TaskTag[]>([]);
  const tagInputRef = useRef<TagInputHandle>(null);

  useEffect(() => {
    if (open) {
      setColumn(defaultColumn);
      setTitle('');
      setDescription('');
      setChecklist([]);
      setMode('description');
      setTags([]);
    }
  }, [open, defaultColumn]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const finalTags = tagInputRef.current?.flush() ?? tags;
    const finalChecklist = checklist.filter((item) => item.text.trim() !== '');
    onAdd(trimmed, description.trim(), column, finalTags, finalChecklist);
    setTitle('');
    setDescription('');
    setChecklist([]);
    setColumn(defaultColumn);
    setTags([]);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="task-title"
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              {mode === 'description' ? 'Description (optional)' : 'Checklist'}
            </label>
            <div className="flex rounded-lg bg-white/5 p-0.5">
              <button
                type="button"
                onClick={() => setMode('description')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
                  mode === 'description'
                    ? 'bg-white/10 text-gray-100'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <AlignLeft size={12} />
                Text
              </button>
              <button
                type="button"
                onClick={() => setMode('checklist')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
                  mode === 'checklist'
                    ? 'bg-white/10 text-gray-100'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <ListChecks size={12} />
                Checklist
              </button>
            </div>
          </div>

          {mode === 'description' ? (
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-accent-amber/40 focus:outline-none focus:ring-2 focus:ring-accent-amber/40"
            />
          ) : (
            <ChecklistEditor items={checklist} onChange={setChecklist} />
          )}
        </div>

        <TagInput ref={tagInputRef} tags={tags} onChange={setTags} history={tagHistory} onAddToHistory={onAddToTagHistory} />
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
        <Button type="submit" className="w-full">
          Add Task
        </Button>
      </form>
    </Modal>
  );
}
