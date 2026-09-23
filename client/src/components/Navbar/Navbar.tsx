import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Section';
import { NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/lib/cn';
import UserMenu from './UserMenu';

/** How far the page scrolls before the bar over a photo turns solid. */
const SOLID_AFTER_PX = 24;

/**
 * Fixed at the top. Over a photo hero it starts transparent and turns navy
 * once the page scrolls; everywhere else it is navy from the start.
 */
export default function Navbar({ overPhoto }: { overPhoto: boolean }) {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SOLID_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Reset on real navigation only. Keyed on `location` this also fired for
   * query-string changes, so any page that keeps state in the URL — the cost
   * calculator's step, for one — threw the visitor back to the top of the page
   * on every interaction.
   */
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // The open menu covers the page; don't let it scroll underneath.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isSolid = !overPhoto || isScrolled || isOpen;

  return (
    <header dir='rtl' className='fixed inset-x-0 top-0 z-50 text-on-dark'>
      {/*
       * The bar's blur lives here and not on <header>. `backdrop-filter` makes
       * an element the containing block for its `position: fixed` descendants,
       * so with it on <header> the mobile sheet below resolved `top: nav` and
       * `bottom: 0` against the 4.5rem bar — a zero-height panel that painted
       * no background at all while its links spilled over the page.
       */}
      <div
        className={cn(
          'transition-[background-color,box-shadow] duration-300 ease-out',
          isSolid ? 'bg-primary-deep/95 shadow-card backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <Container className='flex h-nav items-center justify-between gap-6'>
          <Link to='/' className='shrink-0' aria-label='שירן גלעד — דף הבית'>
            <Logo className='h-10 md:h-11' />
          </Link>

          <nav aria-label='ראשי' className='hidden lg:block'>
            <ul className='flex items-center gap-8'>
              {NAV_ITEMS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative py-2 text-small font-semibold transition-colors',
                        'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:bg-on-dark after:transition-transform after:duration-300 after:ease-out',
                        isActive
                          ? 'text-on-dark after:scale-x-100'
                          : 'text-on-dark/80 after:scale-x-0 hover-capable:hover:text-on-dark',
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className='flex items-center gap-3'>
            <ButtonLink to='/contact' variant='light' size='sm' arrow className='hidden sm:inline-flex'>
              קביעת שיחה
            </ButtonLink>
            <UserMenu />
            <button
              type='button'
              className='inline-flex size-10 items-center justify-center rounded-full text-on-dark lg:hidden'
              aria-label={isOpen ? 'סגירת תפריט' : 'תפריט'}
              aria-expanded={isOpen}
              aria-controls='mobile-menu'
              onClick={() => setIsOpen((open) => !open)}
            >
              {isOpen ? <X className='size-6' strokeWidth={1.5} /> : <Menu className='size-6' strokeWidth={1.5} />}
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile menu: a full-height navy sheet under the bar. */}
      <div
        id='mobile-menu'
        className={cn(
          'fixed inset-x-0 bottom-0 top-nav bg-primary-deep transition-[opacity,visibility] duration-300 ease-out lg:hidden',
          isOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <Container className='flex h-full flex-col gap-10 py-10'>
          <ul className='flex flex-col'>
            {NAV_ITEMS.map(({ label, to }, index) => (
              <li
                key={to}
                className={cn(
                  'border-b border-on-dark/15 transition-[opacity,transform] duration-500 ease-out',
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                )}
                style={{ transitionDelay: isOpen ? `${60 + index * 40}ms` : '0ms' }}
              >
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn('block py-4 text-h3 font-normal', isActive ? 'text-on-dark' : 'text-on-dark/75')
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ButtonLink to='/contact' variant='light' arrow fullWidth>
            קביעת שיחה
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
