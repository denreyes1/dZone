import { create } from 'zustand';
import type { TimerMode } from '@/types';

export type TimerView = 'pomodoro' | 'stopwatch';

interface TimerState {
  timerView: TimerView;
  mode: TimerMode;
  timeRemaining: number;
  isRunning: boolean;
  sessionsCompleted: number;
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionStartTime: number | null;

  stopwatchElapsed: number;
  stopwatchRunning: boolean;
  laps: number[];

  setTimerView: (view: TimerView) => void;
  setMode: (mode: TimerMode) => void;
  setTimeRemaining: (time: number) => void;
  tick: () => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  setDurations: (focus: number, brk: number, longBrk: number) => void;
  incrementSessions: () => void;

  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
  tickStopwatch: () => void;
  addLap: () => void;
}

function getDurationForMode(mode: TimerMode, focus: number, brk: number, longBrk: number): number {
  switch (mode) {
    case 'focus': return focus * 60;
    case 'break': return brk * 60;
    case 'longBreak': return longBrk * 60;
  }
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timerView: 'pomodoro' as TimerView,
  mode: 'focus',
  timeRemaining: 25 * 60,
  isRunning: false,
  sessionsCompleted: 0,
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionStartTime: null,

  stopwatchElapsed: 0,
  stopwatchRunning: false,
  laps: [],

  setTimerView: (view) => set({ timerView: view }),

  setMode: (mode) => {
    const { focusDuration, breakDuration, longBreakDuration } = get();
    set({
      mode,
      timeRemaining: getDurationForMode(mode, focusDuration, breakDuration, longBreakDuration),
      isRunning: false,
      sessionStartTime: null,
    });
  },

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  tick: () => {
    const { timeRemaining } = get();
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  start: () => set({ isRunning: true, sessionStartTime: Date.now() }),
  pause: () => set({ isRunning: false }),

  reset: () => {
    const { mode, focusDuration, breakDuration, longBreakDuration } = get();
    set({
      timeRemaining: getDurationForMode(mode, focusDuration, breakDuration, longBreakDuration),
      isRunning: false,
      sessionStartTime: null,
    });
  },

  skip: () => {
    const { mode, sessionsCompleted, focusDuration, breakDuration, longBreakDuration } = get();
    let nextMode: TimerMode;
    if (mode === 'focus') {
      nextMode = (sessionsCompleted + 1) % 4 === 0 ? 'longBreak' : 'break';
    } else {
      nextMode = 'focus';
    }
    set({
      mode: nextMode,
      timeRemaining: getDurationForMode(nextMode, focusDuration, breakDuration, longBreakDuration),
      isRunning: false,
      sessionStartTime: null,
    });
  },

  setDurations: (focus, brk, longBrk) => {
    const { mode } = get();
    set({
      focusDuration: focus,
      breakDuration: brk,
      longBreakDuration: longBrk,
      timeRemaining: getDurationForMode(mode, focus, brk, longBrk),
    });
  },

  incrementSessions: () => set((s) => ({ sessionsCompleted: s.sessionsCompleted + 1 })),

  startStopwatch: () => set({ stopwatchRunning: true }),
  pauseStopwatch: () => set({ stopwatchRunning: false }),
  resetStopwatch: () => set({ stopwatchElapsed: 0, stopwatchRunning: false, laps: [] }),
  tickStopwatch: () => set((s) => ({ stopwatchElapsed: s.stopwatchElapsed + 1 })),
  addLap: () => {
    const { stopwatchElapsed, laps } = get();
    set({ laps: [...laps, stopwatchElapsed] });
  },
}));
