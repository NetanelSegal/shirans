import { useAuth } from '@/contexts/AuthContext';
import { useScreenContext } from '@/contexts/ScreenProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, startTransition } from 'react';

interface AdminNavbarProps {
  onMenuToggle: () => void;
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
  const { user, logout, isLoading } = useAuth();
  const { isSmallScreen } = useScreenContext();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    startTransition(() => navigate('/'));
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 bg-surface-raised p-4 shadow-card" dir="rtl">
      {/* Back to site + Mobile menu toggle */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            setShowUserMenu(false);
            startTransition(() => navigate('/'));
          }}
          className="flex items-center gap-2 rounded-card bg-surface-sunken px-4 py-2 text-ink transition-colors hover:bg-surface-sunken/80"
          aria-label="חזרה לאתר"
        >
          <i className="fa-solid fa-arrow-right" aria-hidden />
          <span className="hidden sm:inline">חזרה לאתר</span>
        </Link>
        {isSmallScreen && (
          <button
            onClick={onMenuToggle}
            className="bg-none p-0"
            aria-label="תפריט"
          >
            <i className="fa-solid fa-bars flex size-8 items-center justify-center rounded-card bg-surface-sunken text-ink" aria-hidden />
          </button>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1 min-w-0" />

      {/* User dropdown */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 rounded-card bg-surface-sunken px-4 py-2 text-ink hover:bg-surface-sunken/80 transition-all duration-200"
          aria-expanded={showUserMenu}
          aria-haspopup="true"
        >
          {user?.name || 'מנהל'}
          <i className={`fa-solid fa-chevron-down text-sm transition-transform ${showUserMenu ? 'rotate-180' : ''}`} aria-hidden />
        </button>

        {showUserMenu && (
          <div
            className="absolute left-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] origin-top-left rounded-card border border-line/70 bg-surface-raised p-4 shadow-raised"
            role="menu"
          >
            <div className="mb-3 border-b border-line/70 pb-3 text-right">
              <p className="font-bold text-ink">{user?.name || 'מנהל'}</p>
              <p className="truncate text-sm text-ink-muted" title={user?.email || ''}>
                {user?.email || ''}
              </p>
              {user?.role && (
                <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-on-dark">
                  {user.role === 'ADMIN' ? 'מנהל' : 'משתמש'}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  startTransition(() => navigate('/'));
                }}
                className="flex w-full items-center justify-between gap-2 rounded-card px-4 py-2 text-right transition-colors hover:bg-surface-sunken"
                role="menuitem"
              >
                <i className="fa-solid fa-home" aria-hidden />
                <span>חזרה לאתר</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-card bg-danger px-4 py-2 text-on-dark transition-colors hover:bg-danger disabled:opacity-50"
                disabled={isLoading}
                role="menuitem"
              >
                <span>{isLoading ? 'מתנתק...' : 'התנתק'}</span>
                <i className="fa-solid fa-right-from-bracket" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
