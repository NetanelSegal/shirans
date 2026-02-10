import { Link, useNavigate } from 'react-router-dom';
import DataCarousel from '../DataCarousel';
import Image from '../ui/Image';
import { projects } from '@/data/shiran.projects';
import type { ProjectResponse } from '@shirans/shared';

const data: ProjectResponse[] = projects.filter((p) => p.favourite);

export default function FavoriteProjects() {
  const nav = useNavigate();
  return (
    <>
      <h2 className='heading mb-4 text-center font-semibold'>
        פרוייקטים נבחרים
      </h2>
      <DataCarousel
        keyProperty='id'
        dataArray={data}
        containerClassname='max-w-[900px] mx-auto'
        singleItem={({ mainImage, id }, index) => (
          <div className='relative mb-2 aspect-video size-full overflow-hidden rounded-xl'>
            <Link to={`/projects/${id}`} state={{ project: data[index] }}>
              <Image
                key={id}
                draggable='false'
                className='size-full object-cover object-center transition-all duration-300 ease-in-out hover:scale-105'
                src={mainImage}
                alt=''
              />
            </Link>
          </div>
        )}
        carouselNavigation={({ title }, incrementIndex, decrementIndex) => (
          <div className='mt-2 flex flex-wrap gap-1'>
            <div className='flex h-10 grow basis-1/2 items-center rounded-xl bg-primary px-6 text-white'>
              <span className='paragraph'>{title}</span>
            </div>
            <div className='mx-auto flex w-fit items-center gap-2'>
              <button className='bg-primary' onClick={decrementIndex}>
                <i className='fa-solid fa-arrow-right'></i>
              </button>
              <button className='bg-primary' onClick={incrementIndex}>
                <i className='fa-solid fa-arrow-left'></i>
              </button>
              <button
                className='w-fit shrink text-nowrap bg-secondary text-black'
                onClick={() => nav('/projects')}
              >
                כל הפרוייקטים
              </button>
            </div>
          </div>
        )}
      />
    </>
  );
}
