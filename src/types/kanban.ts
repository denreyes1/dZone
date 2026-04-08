import type { Timestamp } from 'firebase/firestore';

export type BoardColumn = string;

export interface ColumnConfig {
  id: string;
  label: string;
  color: string;
}

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-gray-400' },
  { id: 'todo', label: 'To Do', color: 'text-blue-400' },
  { id: 'in-progress', label: 'In Progress', color: 'text-amber-400' },
  { id: 'done', label: 'Done', color: 'text-emerald-400' },
];

export const COLOR_PRESETS: { name: string; hex: string; textClass: string }[] = [
  { name: 'Gray', hex: '#9ca3af', textClass: 'text-gray-400' },
  { name: 'Blue', hex: '#60a5fa', textClass: 'text-blue-400' },
  { name: 'Amber', hex: '#fbbf24', textClass: 'text-amber-400' },
  { name: 'Emerald', hex: '#34d399', textClass: 'text-emerald-400' },
  { name: 'Red', hex: '#f87171', textClass: 'text-red-400' },
  { name: 'Purple', hex: '#a78bfa', textClass: 'text-purple-400' },
  { name: 'Pink', hex: '#f472b6', textClass: 'text-pink-400' },
  { name: 'Cyan', hex: '#22d3ee', textClass: 'text-cyan-400' },
  { name: 'Orange', hex: '#fb923c', textClass: 'text-orange-400' },
  { name: 'Indigo', hex: '#818cf8', textClass: 'text-indigo-400' },
];

export interface TaskTag {
  label: string;
  color: string;
}

export interface BoardTask {
  id: string;
  title: string;
  description: string;
  column: string;
  order: number;
  tags: TaskTag[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
