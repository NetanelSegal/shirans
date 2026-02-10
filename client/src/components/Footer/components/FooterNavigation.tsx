import { appRoutes } from '@/App';
import { Link } from 'react-router-dom';

export default function FooterNavigation() {
  const chunks = chunkArray(
    appRoutes.filter(({ notNavigateable }) => !notNavigateable),
    2,
  );
  return (
    <div className='gap-5 text-white underline sm:mx-0 sm:flex sm:items-end md:pb-2'>
      {chunks.map((chunk, chunkIndex) => (
        <div
          key={chunkIndex}
          className='flex justify-center gap-5 text-center sm:flex-col sm:gap-0'
        >
          {chunk.map(({ title, path }) => (
            <Link key={title} className='sm:text-start' to={path}>
              <p>{title}</p>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
