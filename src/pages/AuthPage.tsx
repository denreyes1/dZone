import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const user = useAuthStore((s) => s.user);
  const clearError = useAuthStore((s) => s.clearError);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/app', { replace: true });
  }, [user, navigate]);

  function toggleMode() {
    clearError();
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
  }

  if (!isFirebaseAvailable()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void px-4">
        <div className="glass-strong w-full max-w-md p-8 text-center">
          <Sparkles size={32} className="mx-auto mb-4 text-accent-amber" />
          <h2 className="mb-2 text-xl font-bold text-gray-100">Firebase Not Configured</h2>
          <p className="mb-6 text-sm text-gray-400">
            Copy <code className="rounded bg-white/10 px-1.5 py-0.5">.env.example</code> to{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5">.env</code> and add your Firebase
            credentials to enable authentication.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="text-sm text-accent-amber underline underline-offset-2 hover:text-amber-400"
          >
            Continue in offline mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 via-void to-accent-amber/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong w-full max-w-md p-8"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles size={24} className="text-accent-amber" />
          <span className="text-2xl font-bold text-gray-100">dZone</span>
        </div>

        <div className="mb-6 flex rounded-xl bg-white/5 p-1">
          <button
            onClick={() => { clearError(); setMode('login'); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { clearError(); setMode('signup'); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'login' ? <LoginForm /> : <SignupForm />}
          </motion.div>
        </AnimatePresence>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-600">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleButton />

        <p className="mt-6 text-center text-xs text-gray-600">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={toggleMode}
            className="text-accent-amber underline-offset-2 hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
