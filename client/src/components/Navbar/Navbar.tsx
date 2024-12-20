import { Link, NavLink, useLocation } from 'react-router-dom';
import { appRoutes } from '../../App';
import srcShiranLogo from '../../assets/shiran_logo.svg';
import { useScreenContext } from '../../contexts/ScreenProvider';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const { isSmallScreen } = useScreenContext();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);

  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggle && !navRef.current?.contains(event.target as Node)) {
        setToggle((prev) => !prev);
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
      ref={navRef}
      className='px-page-all sticky top-0 z-50 flex items-center justify-between py-2'
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
                    <button className='bg-secondary text-black'>{title}</button>
                  ) : (
                    title
                  )}
                </NavLink>
              </li>
            ),
        )}
      </ul>
    </nav>
  );
}
