import { SERVICES } from '@/constants/services';
import { ServiceCard } from './ServiceCard';

/** All services as cards: two across on phones, three on tablets, six on wide screens. */
export function ServicesGrid() {
  return (
    <ul className='grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-6'>
      {SERVICES.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}
