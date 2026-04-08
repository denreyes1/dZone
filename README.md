# dZone — Your space. Your focus.

A premium virtual focus workspace with immersive ambient scenes, Pomodoro timer, ambient sound mixer, task management, and session tracking.

## Tech Stack

- **React 18** + TypeScript
- **Vite 5** — fast builds and HMR
- **Tailwind CSS 3** — utility-first styling with custom glassmorphism utilities
- **Framer Motion** — smooth animations and transitions
- **Zustand** — lightweight global state management
- **Firebase** — Auth (email/password + Google) and Cloud Firestore
- **Howler.js** — cross-browser ambient audio playback
- **Lucide React** — consistent icon set

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### 1. Install dependencies

```bash
cd dZone
npm install
```

### 2. Configure Firebase

Copy the environment template and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values from the [Firebase Console](https://console.firebase.google.com/):

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

> **Note:** The app works in offline/local mode without Firebase configuration. Auth is skipped and tasks are stored in localStorage.

### 3. Firebase Setup

In the Firebase Console:

1. Enable **Authentication** → Sign-in methods: Email/Password and Google
2. Create a **Cloud Firestore** database
3. Set Firestore rules for authenticated access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
npm run preview
```

## Firestore Data Model

```
users/{uid}
  ├── displayName, email, createdAt, streak, lastActiveDate
  ├── tasks/{taskId}
  │     └── text, completed, createdAt, completedAt
  ├── sessions/{sessionId}
  │     └── sceneId, duration, type, startedAt, endedAt
  └── preferences/main
        └── focusDuration, breakDuration, longBreakDuration,
            preferredScene, soundPresets, theme
```

## Keyboard Shortcuts

| Key     | Action                 |
| ------- | ---------------------- |
| `Space` | Toggle timer           |
| `F`     | Toggle fullscreen      |
| `S`     | Open scene selector    |
| `M`     | Open ambient mixer     |
| `T`     | Open task panel        |
| `Esc`   | Close all panels       |

## Project Structure

```
src/
  config/       — Firebase initialization, environment config
  types/        — Shared TypeScript interfaces
  utils/        — Helpers: cn, formatTime, quotes, constants
  stores/       — Zustand state stores
  services/     — Firebase CRUD operations
  hooks/        — Custom React hooks
  components/
    ui/         — Reusable primitives (Button, Input, GlassPanel, etc.)
    auth/       — Auth guard, login/signup forms
    scene/      — Scene viewer and selector
    timer/      — Timer widget, controls, settings
    audio/      — Ambient sound mixer
    tasks/      — Task panel, items, input
    stats/      — Stats card, streak badge, session history
    widgets/    — Quote widget, continue card
    profile/    — Profile dropdown, settings form
    layout/     — AppShell, FloatingDock
  pages/        — Route-level page components
  router/       — Route definitions and constants
```

## License

Private project.
