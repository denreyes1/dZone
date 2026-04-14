import { useRef, type KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';
import type { ChecklistItem } from '@/types/kanban';

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export function ChecklistEditor({ items, onChange }: ChecklistEditorProps) {
  const lastInputRef = useRef<HTMLInputElement>(null);

  function addItem() {
    onChange([...items, { text: '', checked: false }]);
    setTimeout(() => lastInputRef.current?.focus(), 0);
  }

  function updateText(index: number, text: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, text } : item)));
  }

  function toggleCheck(index: number) {
    onChange(items.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange([...items.slice(0, index + 1), { text: '', checked: false }, ...items.slice(index + 1)]);
      setTimeout(() => {
        const inputs = (e.currentTarget as HTMLElement)
          .closest('[data-checklist]')
          ?.querySelectorAll<HTMLInputElement>('input[type="text"]');
        inputs?.[index + 1]?.focus();
      }, 0);
    }
    if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) {
      e.preventDefault();
      removeItem(index);
      setTimeout(() => {
        const inputs = (e.currentTarget as HTMLElement)
          .closest('[data-checklist]')
          ?.querySelectorAll<HTMLInputElement>('input[type="text"]');
        const focusIdx = Math.max(0, index - 1);
        inputs?.[focusIdx]?.focus();
      }, 0);
    }
  }

  return (
    <div data-checklist className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggleCheck(i)}
            className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 accent-accent-amber"
          />
          <input
            ref={i === items.length - 1 ? lastInputRef : undefined}
            type="text"
            value={item.text}
            onChange={(e) => updateText(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            placeholder="Item..."
            className={`flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-gray-100 placeholder:text-gray-600 focus:border-accent-amber/40 focus:outline-none ${
              item.checked ? 'text-gray-500 line-through' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="shrink-0 rounded-md p-0.5 text-gray-600 transition-colors hover:text-red-400"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
      >
        <Plus size={12} />
        Add item
      </button>
    </div>
  );
}
