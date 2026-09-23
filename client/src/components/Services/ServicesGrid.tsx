import { SERVICES } from '@/constants/services';
import { ServiceCard } from './ServiceCard';

/** All services as cards: two across on phones, four from tablets up. */
export function ServicesGrid() {
  return (
    <ul className='grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4'>
      {SERVICES.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}
