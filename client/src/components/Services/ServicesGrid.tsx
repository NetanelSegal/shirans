import { SERVICES } from '@/constants/services';
import { ServiceCard } from './ServiceCard';

/** All services as cards: two across on phones, then all five in one row. */
export function ServicesGrid() {
  return (
    <ul className='grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5'>
      {SERVICES.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}
