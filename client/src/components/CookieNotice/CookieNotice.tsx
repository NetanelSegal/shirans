import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { isEnabled as isMeasurementOn } from '@/lib/analytics';

const STORAGE_KEY = 'cookie-notice-seen';

function wasSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * A short note on a visitor's first visit that the site uses Google cookies to
 * measure visits and leads from ads, with a link to the privacy policy. It only
 * shows when measurement actually runs (lib/analytics.ts), so a build with no
 * Google ID never claims cookies it doesn't set. Dismissing it is remembered.
 *
 * On phones it sits above the fixed contact bar, not over it.
 */
export function CookieNotice() {
  const [open, setOpen] = useState(() => isMeasurementOn() && !wasSeen());
  if (!open) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Private mode or blocked storage: it just shows again next visit.
    }
    setOpen(false);
  };

  return (
    <div
      role='region'
      aria-label='הודעה על עוגיות'
      className='fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom)+0.75rem)] z-50 flex items-center gap-4 rounded-card border border-line/60 bg-surface-raised px-4 py-3 shadow-card sm:inset-x-auto sm:start-6 sm:max-w-md lg:bottom-6'
    >
      <p className='text-small text-ink'>
        האתר משתמש בעוגיות של גוגל כדי למדוד ביקורים ופניות שמגיעים מפרסום.{' '}
        <Link to='/privacy' className='underline underline-offset-4'>
          פרטים במדיניות הפרטיות
        </Link>
      </p>
      <Button size='sm' variant='primary' onClick={dismiss} className='shrink-0'>
        הבנתי
      </Button>
    </div>
  );
}
