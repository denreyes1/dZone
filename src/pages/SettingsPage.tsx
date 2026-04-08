import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { SettingsForm } from '@/components/profile/SettingsForm';
import { SessionHistory } from '@/components/stats/SessionHistory';
import { StreakBadge } from '@/components/stats/StreakBadge';
import { useSessions } from '@/hooks/useSessions';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/services/auth';
import { isFirebaseAvailable } from '@/config/firebase';

export function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { streak } = useSessions();

  async function handleLogout() {
    try {
      await signOut();
      navigate('/');
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-void">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-accent-indigo/3 via-void to-accent-amber/3" />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/app')}
            className="mb-6 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to workspace
          </button>

          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-amber/20">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <Sparkles size={24} className="text-accent-amber" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100">
                {user?.displayName || 'User'}
              </h1>
              <p className="text-sm text-gray-500">{user?.email || 'Offline mode'}</p>
            </div>
            <StreakBadge streak={streak} className="ml-auto" />
          </div>

          <div className="space-y-8">
            <section className="glass p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-100">Preferences</h2>
              <SettingsForm />
            </section>

            <section className="glass p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-100">Recent Sessions</h2>
              <SessionHistory />
            </section>

            {isFirebaseAvailable() && user && (
              <Button variant="danger" onClick={handleLogout} className="w-full">
                Sign Out
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
