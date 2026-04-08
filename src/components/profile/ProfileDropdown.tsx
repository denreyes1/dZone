import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { signOut } from '@/services/auth';
import { cn } from '@/utils/cn';
import { isFirebaseAvailable } from '@/config/firebase';

export function ProfileDropdown() {
  const user = useAuthStore((s) => s.user);
  const toggleStats = useUIStore((s) => s.toggleStats);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleLogout() {
    try {
      await signOut();
      navigate('/');
    } catch {
      // ignore
    }
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-amber/20 text-sm font-semibold text-accent-amber transition-colors hover:bg-accent-amber/30"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="glass-strong absolute right-0 top-12 z-50 w-56 overflow-hidden p-1.5">
          <div className="border-b border-white/10 px-3 py-2.5">
            <p className="text-sm font-medium text-gray-100">{displayName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <div className="py-1">
            <DropdownItem icon={BarChart3} label="Stats" onClick={() => { toggleStats(); setOpen(false); }} />
            <DropdownItem icon={Settings} label="Settings" onClick={() => { navigate('/settings'); setOpen(false); }} />
            {isFirebaseAvailable() && (
              <DropdownItem icon={LogOut} label="Sign out" onClick={handleLogout} danger />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
        danger
          ? 'text-red-400 hover:bg-red-500/10'
          : 'text-gray-300 hover:bg-white/5 hover:text-white',
      )}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
