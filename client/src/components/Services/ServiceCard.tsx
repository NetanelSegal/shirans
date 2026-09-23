import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { LineIcon } from '@/components/ui/LineIcon';
import { Photo } from '@/components/ui/Photo';
import type { Service } from '@/constants/services';

/**
 * Photo, line icon, title, one line of description, "לפרטים". The whole card
 * is the link, so the target is the card rather than the small text.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card as='article' interactive className='group relative flex h-full flex-col rounded-none'>
      <div className='aspect-[4/3] overflow-hidden'>
        <Photo
          image={service.image}
          sizes='(min-width: 768px) 25vw, 50vw'
          className='size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]'
        />
      </div>
      <div className='flex flex-1 flex-col items-center gap-2 px-4 pb-5 pt-5 text-center'>
        <LineIcon name={service.icon} className='mb-1 size-7 text-accent' />
        <h3 className='text-h3 text-ink'>
          <Link
            to={service.href}
            className='after:absolute after:inset-0 focus-visible:outline-none'
          >
            {service.title}
          </Link>
        </h3>
        <p className='text-small text-ink-muted'>{service.description}</p>
        <span className='mt-auto inline-flex items-center gap-1 pt-2 text-small font-semibold text-ink group-hover:underline group-hover:underline-offset-4'>
          לפרטים
          <ArrowLeft className='size-4' strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </Card>
  );
}
