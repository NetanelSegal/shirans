import { Link, NavLink, useLocation } from 'react-router-dom';
import { appRoutes } from '../../App';
import srcShiranLogo from '../../assets/shiran_logo.svg';
import { useScreenContext } from '../../contexts/ScreenProvider';
import { useEffect, useRef, useState } from 'react';
import UserMenu from './UserMenu';
import Button from '../ui/Button';
import { Menu } from 'lucide-react';

export default function Navbar() {
  const { isSmallScreen } = useScreenContext();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggle && navRef.current && !navRef.current.contains(event.target as Node)) {
        setToggle(false);
      }
    };

    if (isSmallScreen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (isSmallScreen) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [isSmallScreen, toggle]);

  useEffect(() => {
    setToggle(false);
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
      <Link to={'/'} aria-label='שירן גלעד — דף הבית'>
        <img className='h-10' src={srcShiranLogo} alt='' aria-hidden />
      </Link>
      <div ref={navRef} className="flex items-center md:gap-5 gap-2"> {/* Container for mobile toggle and UserMenu */}
        {isSmallScreen && (
          <button
            type="button"
            className='bg-none p-0'
            aria-label='תפריט'
            aria-expanded={toggle}
            onClick={() => setToggle((prev) => !prev)}
          >
            <span className='flex size-8 items-center justify-center rounded-xl bg-secondary text-black'>
              <Menu className='size-5' aria-hidden />
            </span>
          </button>
        )}
        <ul
          className={`flex items-center gap-5 ${isSmallScreen
            ? `fixed left-0 right-0 top-14 -z-20 ${!toggle && '-translate-y-[150%]'} flex-col bg-white p-5 text-primary transition-all duration-300 ease-in-out`
            : 'text-white'
            }`}
        >
          {appRoutes.map(
            ({ title, path, notNavigateable, showInNavbar }) =>
              !notNavigateable && showInNavbar !== false && (
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
                      <Button>{title}</Button>
                    ) : (
                      title
                    )}
                  </NavLink>
                </li>
              ),
          )}
        </ul>
        <UserMenu />
      </div>
    </nav>
  );
}
