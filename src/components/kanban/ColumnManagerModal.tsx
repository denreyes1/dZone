import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { COLOR_PRESETS, type ColumnConfig } from '@/types/kanban';
import { cn } from '@/utils/cn';

interface ColumnManagerModalProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  taskCountByColumn: Record<string, number>;
  onAdd: (label: string, color: string) => void;
  onRemove: (id: string) => string | null;
  onRename: (id: string, label: string) => void;
  onColorChange: (id: string, color: string) => void;
  onReorder: (columns: ColumnConfig[]) => void;
  onMoveTasksFromColumn: (fromColumnId: string, toColumnId: string) => void;
}

export function ColumnManagerModal({
  open,
  onClose,
  columns,
  taskCountByColumn,
  onAdd,
  onRemove,
  onRename,
  onColorChange,
  onReorder,
  onMoveTasksFromColumn,
}: ColumnManagerModalProps) {
  const [newLabel, setNewLabel] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);

  function handleMoveUp(index: number) {
    if (index <= 0) return;
    const next = [...columns];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onReorder(next);
  }

  function handleMoveDown(index: number) {
    if (index >= columns.length - 1) return;
    const next = [...columns];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onReorder(next);
  }

  function handleDelete(id: string) {
    const count = taskCountByColumn[id] ?? 0;
    if (count > 0 && confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    if (count > 0) {
      const firstOther = columns.find((c) => c.id !== id);
      if (firstOther) {
        onMoveTasksFromColumn(id, firstOther.id);
      }
    }

    onRemove(id);
    setConfirmDeleteId(null);
  }

  function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    onAdd(label, COLOR_PRESETS[0].textClass);
    setNewLabel('');
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Columns" className="max-w-lg">
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {columns.map((col, index) => {
          const count = taskCountByColumn[col.id] ?? 0;
          const preset = COLOR_PRESETS.find((p) => p.textClass === col.color);

          return (
            <div
              key={col.id}
              className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setColorPickerOpen(colorPickerOpen === col.id ? null : col.id)
                  }
                  className="h-5 w-5 shrink-0 rounded-full border border-white/20 transition-transform hover:scale-110"
                  style={{ backgroundColor: preset?.hex ?? '#9ca3af' }}
                  title="Change color"
                />

                <input
                  type="text"
                  value={col.label}
                  onChange={(e) => onRename(col.id, e.target.value)}
                  className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-gray-100 transition-colors focus:border-white/10 focus:bg-white/5 focus:outline-none"
                />

                <span className="shrink-0 text-[10px] text-gray-500">{count}</span>

                <div className="flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="rounded p-0.5 text-gray-500 transition-colors hover:text-gray-300 disabled:opacity-30"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === columns.length - 1}
                    className="rounded p-0.5 text-gray-500 transition-colors hover:text-gray-300 disabled:opacity-30"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(col.id)}
                  disabled={columns.length <= 1}
                  className={cn(
                    'rounded p-1 transition-colors disabled:opacity-30',
                    confirmDeleteId === col.id
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-gray-500 hover:text-red-400',
                  )}
                  title={
                    confirmDeleteId === col.id
                      ? `Confirm delete (${count} tasks will move)`
                      : 'Delete column'
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {colorPickerOpen === col.id && (
                <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] p-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.textClass}
                      type="button"
                      onClick={() => {
                        onColorChange(col.id, p.textClass);
                        setColorPickerOpen(null);
                      }}
                      className={cn(
                        'h-6 w-6 rounded-full border-2 transition-transform hover:scale-125',
                        col.color === p.textClass
                          ? 'border-white scale-110'
                          : 'border-transparent',
                      )}
                      style={{ backgroundColor: p.hex }}
                      title={p.name}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New column name..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-accent-amber/40 focus:outline-none focus:ring-2 focus:ring-accent-amber/40"
        />
        <Button size="sm" onClick={handleAdd} disabled={!newLabel.trim()}>
          <Plus size={14} />
          Add
        </Button>
      </div>
    </Modal>
  );
}
