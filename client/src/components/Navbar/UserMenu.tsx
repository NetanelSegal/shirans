import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export default function UserMenu() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);

  return (
    <div className="relative" ref={userMenuRef} dir="rtl">
      <button
        type="button"
        aria-label='תפריט משתמש'
        aria-expanded={showUserMenu}
        aria-haspopup="true"
        onClick={() => setShowUserMenu((prev) => !prev)}
        className='flex items-center gap-2 rounded-card bg-surface-sunken p-2 text-ink hover:bg-surface-sunken/80 transition-all duration-200'
      >
        <User className="size-5" aria-hidden />
      </button>

      {showUserMenu && (
        <div
          className='absolute left-0 top-full mt-2 w-48 origin-top-left rounded-card bg-surface-raised p-4 shadow-raised transition-all duration-200 ease-in-out'
          style={{
            transform: showUserMenu ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
            opacity: showUserMenu ? 1 : 0,
            pointerEvents: showUserMenu ? 'auto' : 'none',
          }}
        >
          {isAuthenticated && user ? (
            <>
              <div className='mb-2 border-b border-line/70 pb-2 text-right'>
                <p className='font-bold text-ink'>{user.name}</p>
                <p className='text-sm text-ink-muted'>{user.email}</p>
              </div>
              {user.role === 'ADMIN' && (
                <Link
                  onClick={() => setShowUserMenu(false)}
                  to='/admin'
                  className='mb-2 block w-full rounded-card bg-primary px-4 py-2 text-on-dark text-center hover:bg-primary/90 transition-colors'
                >
                  לוח בקרה
                </Link>
              )}
              <button
                onClick={handleLogout}
                className='w-full rounded-card bg-danger px-4 py-2 text-on-dark hover:bg-danger transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 text-right flex items-center justify-between'
                disabled={isLoading}
              >
                <span>{isLoading ? 'מתנתק...' : 'התנתק'}</span>
                <LogOut className="size-4 shrink-0" aria-hidden />
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setShowUserMenu(false)} to='/login' className='block w-full rounded-card bg-primary px-4 py-2 text-on-dark hover:bg-primary/80 transition-all duration-200 text-center mb-2'>
                התחברות
              </Link>
              <Link onClick={() => setShowUserMenu(false)} to='/register' className='block w-full rounded-card bg-surface-sunken px-4 py-2 text-ink hover:bg-surface-sunken/80 transition-all duration-200 text-center'>
                הרשמה
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
