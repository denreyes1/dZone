import type { Timestamp } from 'firebase/firestore';

export interface DZoneUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Timestamp | null;
  streak: number;
  lastActiveDate: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp | null;
  completedAt: Timestamp | null;
}

export type SessionType = 'focus' | 'break';

export interface FocusSession {
  id: string;
  sceneId: string;
  duration: number;
  type: SessionType;
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;
}

export interface UserPreferences {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  preferredScene: string;
  soundPresets: Record<string, number>;
  theme: 'dark' | 'light';
  showBoard: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  preferredScene: 'ambience-1',
  soundPresets: {},
  theme: 'dark',
  showBoard: true,
};

export type TimerMode = 'focus' | 'break' | 'longBreak';

export interface Scene {
  id: string;
  name: string;
  description: string;
  videoId: string;
  gradient: string;
}

export type SoundCategory =
  | 'rain'
  | 'nature'
  | 'noise'
  | 'animals'
  | 'places'
  | 'transport'
  | 'things'
  | 'urban';

export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: SoundCategory;
}

export interface SoundState {
  playing: boolean;
  volume: number;
}
