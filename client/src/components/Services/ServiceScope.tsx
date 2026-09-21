import { aboutServices } from '@/data/about-content';
import { LineIcon } from '@/components/ui/LineIcon';

/**
 * What the work covers, item by item — a hairline grid of icon + label.
 * Four across on desktop, two on phones.
 */
export function ServiceScope() {
  return (
    <ul className='grid grid-cols-2 overflow-hidden rounded-card border border-line/70 bg-line/70 md:grid-cols-4 [&>li]:bg-surface-soft' style={{ gap: '1px' }}>
      {aboutServices.items.map(({ id, icon, title }) => (
        <li key={id} className='flex flex-col items-center gap-3 px-4 py-7 text-center'>
          <LineIcon name={icon} className='size-7 text-accent' />
          <span className='text-small font-semibold text-ink'>{title}</span>
        </li>
      ))}
    </ul>
  );
}
