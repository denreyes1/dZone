import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, CloudRain, Image, ListTodo, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

const features = [
  {
    icon: Image,
    title: 'Immersive Scenes',
    description: 'Choose from handpicked ambient environments designed to set your focus mood.',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    description: 'Built-in focus and break cycles to keep your momentum flowing naturally.',
  },
  {
    icon: CloudRain,
    title: 'Ambient Soundscapes',
    description: 'Layer rain, café chatter, fireplace and more to craft your ideal audio.',
  },
  {
    icon: ListTodo,
    title: 'Task Tracking',
    description: 'Keep your session goals clear with a lightweight, distraction-free task list.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export function LandingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen overflow-y-auto bg-void">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 via-void to-accent-amber/5" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-accent-amber/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent-indigo/5 blur-[120px]" />
      </div>

      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-accent-amber" />
          <span className="text-xl font-bold text-gray-100">dZone</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Button onClick={() => navigate('/app')} size="sm">
              Open App <ArrowRight size={14} />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-20 md:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-center"
        >
          <h1 className="text-display text-4xl leading-tight md:text-6xl">
            Your space.{' '}
            <span className="text-gradient">Your focus.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
            Immersive virtual workspaces designed for deep work.
            Choose a scene, start a timer, and enter your flow state.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate(user ? '/app' : '/auth')}>
              {user ? 'Open Workspace' : 'Start Focusing'} <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          className="mt-24 grid gap-6 md:grid-cols-2"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i + 2}
              className="glass group p-6 transition-colors hover:border-white/15"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-amber/10 text-accent-amber">
                <feature.icon size={20} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-100">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={7}
          className="mt-24 text-center"
        >
          <p className="text-sm text-gray-600">
            Built with care for people who value their focus.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
