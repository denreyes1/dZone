import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { useAuth } from './hooks/useAuth';

export function App() {
  useAuth();

  return (
    <BrowserRouter>
      <div className="noise-overlay" />
      <AppRouter />
    </BrowserRouter>
  );
}
