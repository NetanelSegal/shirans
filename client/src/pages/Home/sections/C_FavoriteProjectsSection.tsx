import DataCarousel from '@/components/DataCarousel';
import Image from '@/components/Image';
import { useNavigate } from 'react-router-dom';
interface IProject {
  _id: string;
  title: string;
  categories: string[];
  description: string;
  mainImage: string;
  images: string[];
  plans: string[];
  location: string;
  client: string;
  isCompleted: boolean;
  constructionArea: number;
  favourite: boolean;
}

const data: IProject[] = [
  {
    _id: '000',
    title: 'Community Park Project',
    categories: ['publicSpaces'],
    description: 'A new community park with green spaces and playgrounds.',
    mainImage: 'https://placehold.co/1000x700',
    images: ['https://placehold.co/800x500'],
    plans: ['https://placehold.co/950x600'],
    location: 'Parkside Blvd',
    client: 'City Council',
    isCompleted: true,
    constructionArea: 3000,
    favourite: true,
  },
  {
    _id: '001',
    title: 'City Park Development',
    categories: ['publicSpaces'],
    description: 'A modern public park with walking trails and benches.',
    mainImage: 'https://placehold.co/1050x550',
    images: ['https://placehold.co/900x500', 'https://placehold.co/600x400'],
    plans: ['https://placehold.co/1000x600'],
    location: 'East End Park',
    client: 'Municipal Department',
    isCompleted: false,
    constructionArea: 2200,
    favourite: true,
  },
  {
    _id: '002',
    title: 'Villa in Green Hills',
    categories: ['privateHouses'],
    description: 'A luxurious private villa with expansive gardens.',
    mainImage: 'https://placehold.co/1000x600',
    images: ['https://placehold.co/800x500', 'https://placehold.co/600x400'],
    plans: ['https://placehold.co/900x600', 'https://placehold.co/700x450'],
    location: '123 Green Hill Road',
    client: 'John Doe',
    isCompleted: true,
    constructionArea: 450,
    favourite: true,
  },
  {
    _id: '003',
    title: 'Modern Apartment Building',
    categories: ['privateHouses'],
    description: 'A contemporary apartment building with modern architecture.',
    mainImage: 'https://placehold.co/1000x600',
    images: ['https://placehold.co/800x500', 'https://placehold.co/600x400'],
    plans: ['https://placehold.co/900x600', 'https://placehold.co/700x450'],
    location: '456 City Street',
    client: 'Jane Smith',
    isCompleted: false,
    constructionArea: 1200,
    favourite: true,
  },
  {
    _id: '004',
    title: 'Residential Building',
    categories: ['privateHouses'],
    description: 'A residential building with a modern facade.',
    mainImage: 'https://placehold.co/1000x600',
    images: ['https://placehold.co/800x500', 'https://placehold.co/600x400'],
    plans: ['https://placehold.co/900x600', 'https://placehold.co/700x450'],
    location: '789 Main Street',
    client: 'Michael Johnson',
    isCompleted: true,
    constructionArea: 1800,
    favourite: true,
  },
];

export default function FavoriteProjectsSection() {
  const nav = useNavigate();
  return (
    <section className='py-section-all'>
      <h2 className='heading mb-2 font-semibold'>הפרוייקטים שלנו</h2>

      <DataCarousel
        keyProperty='_id'
        dataArray={data}
        singleItem={({ mainImage, _id }) => (
          <div className='relative mb-2 aspect-video size-full overflow-hidden rounded-xl'>
            <Image
              key={_id}
              onClick={() => nav(`/projects/${_id}`)}
              draggable='false'
              className='size-full object-cover object-center transition-all duration-300 ease-in-out hover:scale-105'
              src={`${mainImage}`}
              alt=''
            />
          </div>
        )}
        carouselNavigation={({ title }, incrementIndex, decrementIndex) => (
          <div className='flex flex-wrap gap-1'>
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
    </section>
  );
}
