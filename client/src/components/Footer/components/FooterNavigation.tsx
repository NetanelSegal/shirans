import { appRoutes } from '@/App';
import { Link } from 'react-router-dom';

export default function FooterNavigation() {
  return (
    <div className='gap-5 text-white underline sm:mx-0 sm:flex sm:items-end md:pb-2'>
      {appRoutes.map(
        (route, index) =>
          index % 3 === 0 && (
            <div
              key={index / 3}
              className='flex justify-center gap-5 text-center sm:flex-col sm:gap-0'
            >
              {appRoutes.slice(index, index + 3).map(
                ({ title, path }) =>
                  path !== '*' && (
                    <Link key={title} className='sm:text-start' to={path}>
                      <p>{title}</p>
                    </Link>
                  ),
              )}
            </div>
          ),
      )}
    </div>
  );
}
