import { isPreviewDeploy } from '@/config/env';

/**
 * A strip at the bottom of every preview deploy, so nobody mistakes the review
 * link for the live site — and knows why the forms don't send.
 */
export function PreviewBanner() {
  if (!isPreviewDeploy) return null;
  return (
    <div
      role='note'
      className='fixed inset-x-0 bottom-0 z-[60] bg-warning px-4 py-1.5 text-center text-small font-semibold text-on-dark'
    >
      גרסת תצוגה לבדיקה — לא האתר החי. טפסים לא נשלחים.
    </div>
  );
}
