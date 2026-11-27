import { MessageCircle, Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from '@/constants/contact';
import { trackContactClick } from '@/lib/analytics';
import { cn } from '@/lib/cn';

/**
 * WhatsApp and call as two round icon buttons, for the navbar. Most ad clicks
 * come from phones, where these are the shortest path to a conversation.
 */
export function NavQuickContact({ className }: { className?: string }) {
  const circle =
    'inline-flex size-10 items-center justify-center rounded-full border border-on-dark/40 text-on-dark transition-colors duration-150 ease-out hover-capable:hover:border-on-dark hover-capable:hover:bg-on-dark/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <a
        href={WHATSAPP_HREF}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='שליחת הודעת וואטסאפ לשירן'
        title='וואטסאפ'
        className={circle}
        onClick={() => trackContactClick('whatsapp', 'navbar')}
      >
        <MessageCircle className='size-5' strokeWidth={1.5} aria-hidden />
      </a>
      <a
        href={PHONE_HREF}
        aria-label={`התקשרו לשירן ${PHONE_DISPLAY}`}
        title={PHONE_DISPLAY}
        className={circle}
        onClick={() => trackContactClick('phone', 'navbar')}
      >
        <Phone className='size-5' strokeWidth={1.5} aria-hidden />
      </a>
    </div>
  );
}

/**
 * A bar fixed to the bottom of the screen on phones and tablets: WhatsApp and
 * call, always one tap away however far the visitor has scrolled. Layout leaves
 * room for it under the footer so it never covers the last lines of a page.
 */
export function MobileContactBar() {
  const pill =
    'flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-3 font-semibold transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-raised focus-visible:ring-offset-2 focus-visible:ring-offset-primary';
  return (
    <div className='fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-primary/95 backdrop-blur-sm lg:hidden'>
      <div className='mx-auto flex max-w-xl items-center gap-2 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
        <a
          href={WHATSAPP_HREF}
          target='_blank'
          rel='noopener noreferrer'
          className={cn(pill, 'bg-surface-raised text-ink')}
          onClick={() => trackContactClick('whatsapp', 'mobile_bar')}
        >
          <MessageCircle className='size-5 shrink-0' aria-hidden />
          וואטסאפ
        </a>
        <a
          href={PHONE_HREF}
          className={cn(pill, 'border border-on-dark/40 text-on-dark')}
          onClick={() => trackContactClick('phone', 'mobile_bar')}
        >
          <Phone className='size-5 shrink-0' aria-hidden />
          חיוג
        </a>
      </div>
    </div>
  );
}

/** Height of MobileContactBar, for the space Layout keeps under the footer. */
export const MOBILE_CONTACT_BAR_SPACE = 'h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden';
