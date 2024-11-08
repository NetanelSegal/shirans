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
    _id: '6723e461b0a875a1848156eb',
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
    _id: '6723e461b0a875a1848156f1',
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
    _id: '6723e461b0a875a1848156e9',
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
    _id: '6723e461b0a875a1848156ec',
    title: 'Seaside Apartments',
    categories: ['apartments'],
    description: 'Beachfront apartments with stunning ocean views.',
    mainImage: 'https://placehold.co/850x500',
    images: ['https://placehold.co/750x450'],
    plans: ['https://placehold.co/800x500', 'https://placehold.co/950x650'],
    location: 'Ocean Drive 2',
    client: 'Coastal Living Inc.',
    isCompleted: false,
    constructionArea: 1600,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156ee',
    title: 'City Plaza Public Space',
    categories: ['publicSpaces'],
    description: 'A public plaza with shops, cafes, and open-air seating.',
    mainImage: 'https://placehold.co/1000x650',
    images: ['https://placehold.co/850x550'],
    plans: ['https://placehold.co/950x600', 'https://placehold.co/700x400'],
    location: 'Downtown Square',
    client: 'City Council',
    isCompleted: false,
    constructionArea: 2500,
    favourite: true,
  },
];

export default function FavoriteProjectsSection() {
  const nav = useNavigate();
  return (
    <section className='py-section-all'>
      <h2 className='heading mb-2 font-semibold'>הפרוייקטים שלנו</h2>

      <DataCarousel<IProject>
        keyProperty='_id'
        dataArray={data}
        singleItem={({ mainImage, _id }) => (
          <div className='mb-2 aspect-video size-full overflow-hidden rounded-xl'>
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
        carouselNavigation={(incrementIndex, decrementIndex, { title }) => (
          <div className='flex flex-wrap gap-1'>
            <div className='flex h-10 grow items-center rounded-xl bg-primary px-6 text-white'>
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
                className='bg-secondary w-fit shrink text-nowrap text-black'
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
