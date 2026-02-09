import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface AdminNavbarProps {
  onMenuToggle: () => void;
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white p-4 shadow-md" dir="rtl">
      {/* Mobile menu toggle */}
      <button onClick={onMenuToggle} className="lg:hidden text-primary text-2xl">
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Spacer or Search (future) */}
      <div className="flex-grow"></div>

      {/* User Info and Logout */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-black hover:bg-secondary/80 transition-all duration-200"
        >
          {user?.name || 'מנהל'}
          <i className={`fa-solid fa-chevron-down text-sm transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}></i>
        </button>

        {showUserMenu && (
          <div className="absolute left-0 top-full mt-2 w-48 origin-top-left rounded-xl bg-white p-4 shadow-lg transition-all duration-200 ease-in-out">
            <div className="mb-2 border-b border-gray-200 pb-2 text-right">
              <p className="font-bold text-primary">{user?.name || 'מנהל'}</p>
              <p className="text-sm text-gray-600">{user?.email || 'admin@example.com'}</p>
              {user?.role && (
                <span className="mt-1 inline-block rounded-full bg-primary px-2 py-1 text-xs text-white">
                  {user.role === 'ADMIN' ? 'מנהל' : 'משתמש'}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xl bg-red-500 px-4 py-2 text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              <span>{isLoading ? 'מתנתק...' : 'התנתק'}</span>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
