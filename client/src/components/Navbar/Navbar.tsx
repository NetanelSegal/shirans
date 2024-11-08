import { Link, NavLink } from 'react-router-dom';
import { appRoutes } from '../../App';
import srcShiranLogo from '../../assets/shiran_logo.svg';
import { useScreenContext } from '../../contexts/ScreenProvider';
import { useState } from 'react';

export default function Navbar() {
  const { isSmallScreen } = useScreenContext();
  const [toggle, setToggle] = useState(false);

  return (
    <nav className='px-page-all sticky top-0 z-10 flex items-center justify-between py-2'>
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
          <i className='fa-solid fa-bars bg-secondary flex size-8 items-center justify-center rounded-xl text-primary' />
        </button>
      )}
      <ul
        className={`flex items-center gap-5 ${
          isSmallScreen
            ? `fixed left-0 right-0 top-14 -z-20 ${!toggle && '-translate-y-[150%]'} flex-col bg-white p-5 text-primary transition-all duration-300 ease-in-out`
            : 'text-white'
        }`}
      >
        {appRoutes.map(({ title, path }) => (
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
                <button className='bg-secondary text-primary'>{title}</button>
              ) : (
                title
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
