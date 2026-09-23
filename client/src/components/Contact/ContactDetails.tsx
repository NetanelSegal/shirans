import { IconCircle } from '@/components/ui/LineIcon';
import { CONTACT_CHANNELS } from '@/constants/contact';
import { cn } from '@/lib/cn';

/**
 * Phone, email and socials, each on a disc, split by hairlines.
 *
 * `tone` follows the band it sits on: the contact page puts these on navy, so
 * the type, the hairlines and the discs all have to flip with it.
 */
export function ContactDetails({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark';
  return (
    <ul className='flex flex-col'>
      {CONTACT_CHANNELS.map(({ icon, label, href, ariaLabel, external }) => (
        <li
          key={href}
          className={cn('border-b last:border-b-0', isDark ? 'border-on-dark/20' : 'border-line/60')}
        >
          <a
            href={href}
            aria-label={ariaLabel}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className='group flex items-center gap-4 py-4'
          >
            <IconCircle icon={icon} size='sm' variant={isDark ? 'outline' : 'accent'} />
            <span
              dir='ltr'
              className={cn(
                'text-lead transition-colors',
                isDark
                  ? 'text-on-dark group-hover:text-on-dark/70'
                  : 'text-ink underline-offset-4 group-hover:underline',
              )}
            >
              {label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
