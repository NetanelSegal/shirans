import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Brand/Logo';
import { LineIcon } from '@/components/ui/LineIcon';
import { Container } from '@/components/ui/Section';
import { SOCIAL_CHANNELS } from '@/constants/contact';
import { NAV_ITEMS } from '@/constants/navigation';

export default function Footer() {
  return (
    <footer className='border-t border-line/60 bg-surface text-ink'>
      <Container className='flex flex-col gap-8 py-10 md:flex-row-reverse md:items-center md:justify-between'>
        <div className='flex items-center justify-between gap-8 md:justify-start'>
          <Link to='/' aria-label='שירן גלעד — דף הבית'>
            <Logo className='h-12 text-ink' />
          </Link>
          <ul className='flex items-center gap-4'>
            {SOCIAL_CHANNELS.map(({ icon, href, ariaLabel }) => (
              <li key={href}>
                <a
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={ariaLabel}
                  className='block text-ink underline-offset-4 hover-capable:hover:underline'
                >
                  <LineIcon name={icon} className='size-6' strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col gap-4'>
          <nav aria-label='ניווט תחתון'>
            <ul className='flex flex-wrap items-center gap-x-4 gap-y-2 text-small'>
              {NAV_ITEMS.map(({ label, to }, index) => (
                <Fragment key={to}>
                  {index > 0 && (
                    <li aria-hidden className='hidden h-3.5 w-px bg-line sm:block' />
                  )}
                  <li>
                    <Link
                      to={to}
                      className='text-ink-muted transition-colors hover-capable:hover:text-ink'
                    >
                      {label}
                    </Link>
                  </li>
                </Fragment>
              ))}
            </ul>
          </nav>
          <p className='text-small text-ink-subtle'>
            © {new Date().getFullYear()} כל הזכויות שמורות | שירן גלעד — אדריכלות ועיצוב פנים
          </p>
        </div>
      </Container>
    </footer>
  );
}
