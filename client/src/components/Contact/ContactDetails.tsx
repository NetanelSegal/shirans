import { IconCircle } from '@/components/ui/LineIcon';
import { CONTACT_CHANNELS } from '@/constants/contact';

/** Phone, email and socials, each on a bronze disc, split by hairlines. */
export function ContactDetails() {
  return (
    <ul className='flex flex-col'>
      {CONTACT_CHANNELS.map(({ icon, label, href, ariaLabel, external }) => (
        <li key={href} className='border-b border-line/60 last:border-b-0'>
          <a
            href={href}
            aria-label={ariaLabel}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className='group flex items-center gap-4 py-4'
          >
            <IconCircle icon={icon} size='sm' />
            <span
              dir='ltr'
              className='text-lead text-ink transition-colors group-hover:text-accent-strong'
            >
              {label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
