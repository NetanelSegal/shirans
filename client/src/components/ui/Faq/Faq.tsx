import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Plus } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * The questions column at the foot of a service page. Every answer is in the
 * HTML whether or not its panel is open, so search engines read the whole list
 * — `hidden` on a collapsed panel, not a conditional render.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <dl className='border-t border-line/70'>
      {items.map(({ question, answer }) => (
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
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </dl>
  );
}
