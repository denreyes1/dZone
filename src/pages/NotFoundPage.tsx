import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="mt-3 text-lg text-gray-500">This page doesn't exist.</p>
      <Button onClick={() => navigate('/')} className="mt-6">
        Go Home
      </Button>
    </div>
  );
}
