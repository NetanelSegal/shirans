import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
        onClick={() => setShowUserMenu((prev) => !prev)}
        className='flex items-center gap-2 rounded-xl bg-secondary p-2 text-black hover:bg-secondary/80 transition-all duration-200'
      >
        <i className="fa-solid fa-user"></i>
        <i className={`fa-solid fa-chevron-down text-sm transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}></i>
      </button>

      {showUserMenu && (
        <div
          className='absolute left-0 top-full mt-2 w-48 origin-top-left rounded-xl bg-white p-4 shadow-lg transition-all duration-200 ease-in-out'
          style={{
            transform: showUserMenu ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
            opacity: showUserMenu ? 1 : 0,
            pointerEvents: showUserMenu ? 'auto' : 'none',
          }}
        >
          {isAuthenticated && user ? (
            <>
              <div className='mb-2 border-b border-gray-200 pb-2 text-right'>
                <p className='font-bold text-primary'>{user.name}</p>
                <p className='text-sm text-gray-600'>{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className='w-full rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 text-right flex items-center justify-between'
                disabled={isLoading}
              >
                <span>{isLoading ? 'מתנתק...' : 'התנתק'}</span>
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='block w-full rounded-xl bg-primary px-4 py-2 text-white hover:bg-primary/80 transition-all duration-200 text-center mb-2'>
                התחברות
              </Link>
              <Link to='/register' className='block w-full rounded-xl bg-secondary px-4 py-2 text-black hover:bg-secondary/80 transition-all duration-200 text-center'>
                הרשמה
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
