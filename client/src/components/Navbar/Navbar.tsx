import { Link, NavLink, useLocation } from 'react-router-dom';
import { appRoutes } from '../../App';
import srcShiranLogo from '../../assets/shiran_logo.svg';
import { useScreenContext } from '../../contexts/ScreenProvider';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isSmallScreen } = useScreenContext();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navRef = useRef<HTMLUListElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false); // Close menu after logout
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggle && !navRef.current?.contains(event.target as Node)) {
        setToggle(false);
      }
      if (showUserMenu && !userMenuRef.current?.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [toggle, showUserMenu]);

  useEffect(() => {
    setToggle(false);
    setShowUserMenu(false); // Close user menu on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <nav
      className='px-page-all sticky top-0 z-50 flex items-center justify-between py-2'
      dir="rtl" // Ensure RTL for the whole navbar
    >
      {/* blue backgound div */}
      <div className='absolute inset-0 -z-10 bg-primary'></div>

      {/* content */}
      <Link to={'/'}>
        <img className='h-10' src={srcShiranLogo} alt='shiran logo icon' />
      </Link>
      {isSmallScreen && (
        <button
          className='bg-none p-0'
          onClick={() => setToggle((prev) => !prev)}
        >
          <i className='fa-solid fa-bars flex size-8 items-center justify-center rounded-xl bg-secondary text-black' />
        </button>
      )}
      <ul
        ref={navRef}
        className={`flex items-center gap-5 ${
          isSmallScreen
            ? `fixed left-0 right-0 top-14 -z-20 ${!toggle && '-translate-y-[150%]'} flex-col bg-white p-5 text-primary transition-all duration-300 ease-in-out`
            : 'text-white'
        }`}
      >
        {appRoutes.map(
          ({ title, path, notNavigateable }) =>
            !notNavigateable && (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    isActive
                      ? 'font-bold'
                      : `font-semibold ${path !== 'contact' && 'opacity-90'}`
                  }
                >
                  {path === 'contact' ? (
                    <button className='rounded-xl bg-secondary px-4 py-2 text-black hover:bg-secondary/80 transition-all duration-200'>
                      {title}
                    </button>
                  ) : (
                    title
                  )}
                </NavLink>
              </li>
            ),
        )}
        {/* Authentication UI */}
        {!isAuthenticated && !isLoading && (
          <>
            <li>
              <Link to='/login'>
                <button className='rounded-xl bg-primary px-4 py-2 text-white hover:bg-primary/80 transition-all duration-200'>
                  התחברות
                </button>
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <button className='rounded-xl bg-secondary px-4 py-2 text-black hover:bg-secondary/80 transition-all duration-200'>
                  הרשמה
                </button>
              </Link>
            </li>
          </>
        )}
        {isAuthenticated && user && (
          <li className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className='flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-black hover:bg-secondary/80 transition-all duration-200'
            >
              <span>{user.name}</span>
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
                <div className='mb-2 border-b border-gray-200 pb-2 text-right'>
                  <p className='font-bold text-primary'>{user.name}</p>
                  <p className='text-sm text-gray-600'>{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className='w-full rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 text-right'
                  disabled={isLoading}
                >
                  {isLoading ? 'מתנתק...' : 'התנתק'}
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

