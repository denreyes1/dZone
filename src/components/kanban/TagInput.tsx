import { useState, useRef, type KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { TaskTag } from '@/types/kanban';

const TAG_COLORS = [
  '#9ca3af',
  '#60a5fa',
  '#fbbf24',
  '#34d399',
  '#f87171',
  '#a78bfa',
  '#f472b6',
  '#22d3ee',
  '#fb923c',
  '#818cf8',
];

interface TagInputProps {
  tags: TaskTag[];
  onChange: (tags: TaskTag[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag() {
    const label = input.trim();
    if (!label) return;
    if (tags.some((t) => t.label.toLowerCase() === label.toLowerCase())) return;
    onChange([...tags, { label, color: selectedColor }]);
    setInput('');
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Tags</label>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: tag.color + '20',
                color: tag.color,
                border: `1px solid ${tag.color}40`,
              }}
            >
              {tag.label}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="rounded-full p-0.5 transition-colors hover:bg-white/10"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a tag..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 pr-8 text-sm text-gray-100 placeholder:text-gray-500 focus:border-accent-amber/40 focus:outline-none focus:ring-2 focus:ring-accent-amber/40"
          />
          {input.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 transition-colors hover:text-accent-amber"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {TAG_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={cn(
              'h-5 w-5 rounded-full transition-all',
              selectedColor === color
                ? 'ring-2 ring-white/60 ring-offset-1 ring-offset-transparent scale-110'
                : 'opacity-60 hover:opacity-100',
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
