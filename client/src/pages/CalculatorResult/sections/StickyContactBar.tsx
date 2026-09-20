import { CalendarDays, MessageCircle } from 'lucide-react';
import { PHONE_HREF } from '../contactLinks';

interface StickyContactBarProps {
  /** Hidden from the moment this element is reached — see useHideWhenReached. */
  visible: boolean;
  /** Carries the visitor's answers and a link to their lead — see whatsappMessage. */
  whatsappHref: string;
}

/**
 * The estimate is the reason someone is on this page, and the reaction to it
 * ("so who do I talk to?") can come at any point in the scroll. This keeps both
 * answers within reach without making the visitor hunt for the block at the
 * bottom — and gets out of the way once that block arrives.
 */
export function StickyContactBar({ visible, whatsappHref }: StickyContactBarProps) {
  return (
    <div
      // `fixed`, not `sticky`: the page is a stack of sections, and a sticky
      // child would only stick within whichever one it was declared in.
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-primary/95 backdrop-blur-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      // Out of the tab order and off the screen reader's path while parked, so
      // it can't hand anyone a control they cannot see.
      aria-hidden={!visible}
      {...(visible ? {} : { inert: '' })}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="hidden text-sm text-white/80 sm:block">
          יש שאלה על ההערכה? דברו עם שירן.
        </p>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-5 py-2.5 font-bold text-primary transition-colors duration-150 ease-out hover-capable:hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:flex-none"
          >
            <MessageCircle className="size-5 shrink-0" aria-hidden />
            וואטסאפ
          </a>
          <a
            href={PHONE_HREF}
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/30 px-5 py-2.5 font-bold text-white transition-colors duration-150 ease-out hover-capable:hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:flex-none"
          >
            <CalendarDays className="size-5 shrink-0" aria-hidden />
            שיחה
          </a>
        </div>
      </div>
    </div>
  );
}
