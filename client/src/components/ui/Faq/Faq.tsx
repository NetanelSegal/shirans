import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface FaqItem {
  question: string;
  answer: string;
  /** Where to read more — shown under the answer. */
  link?: { href: string; label: string };
}

/**
 * The questions column at the foot of a service page. Every answer is in the
 * HTML whether or not its panel is open, so search engines read the whole list
 * — `hidden` on a collapsed panel, not a conditional render.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <dl className='border-t border-line/70'>
      {items.map(({ question, answer, link }) => (
        <Disclosure key={question} as='div' className='border-b border-line/70'>
          {({ open }) => (
            <>
              <dt>
                <DisclosureButton className='flex w-full items-center justify-between gap-6 py-5 text-start text-h3 text-ink underline-offset-4 decoration-1 hover-capable:hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'>
                  <span>{question}</span>
                  <Plus
                    aria-hidden
                    strokeWidth={1.25}
                    className={`size-6 shrink-0 text-accent transition-transform duration-300 ease-out motion-reduce:transition-none ${
                      open ? 'rotate-45' : ''
                    }`}
                  />
                </DisclosureButton>
              </dt>
              <DisclosurePanel static as='dd' hidden={!open} className='pb-6 text-body text-ink-muted'>
                <p className='max-w-measure'>{answer}</p>
                {link && (
                  <Link
                    to={link.href}
                    className='mt-3 inline-block text-small font-semibold text-accent-strong underline underline-offset-4'
                  >
                    {link.label}
                  </Link>
                )}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </dl>
  );
}
