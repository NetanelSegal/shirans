import type { ReactNode, Ref } from 'react';
import Image from '@/components/ui/Image';

interface ImagePanelSectionProps {
  image: string;
  /** Empty for decorative photography; named when the photo is the subject. */
  alt?: string;
  children: ReactNode;
  /** Column split at `lg`. Defaults to an even two. */
  columns?: string;
  /** Keeps the photo from becoming a letterbox sliver on wide screens. */
  minHeight?: string;
  sectionRef?: Ref<HTMLElement>;
  ariaLabel?: string;
}

/**
 * A photograph beside a panel of text — the page's one structural idea, used
 * three times.
 *
 * The photo is positioned rather than in flow, and that is the whole point. Laid
 * out normally its own proportions set the row height: at 1920 the hero's photo
 * wanted 530px while the text needed 347, and the difference showed up as a
 * quarter-metre of empty beige under the disclaimer. Taken out of flow, the text
 * sets the height and the photo crops to match.
 */
export function ImagePanelSection({
  image,
  alt = '',
  children,
  columns = 'lg:grid-cols-2',
  minHeight = 'lg:min-h-[22rem]',
  sectionRef,
  ariaLabel,
}: ImagePanelSectionProps) {
  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className={`grid grid-cols-1 overflow-hidden ${columns} ${minHeight}`}
    >
      <div className="relative min-h-64 lg:min-h-full">
        <Image
          src={image}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center bg-surface-sunken p-8 md:p-10 lg:p-8 xl:p-12">
        {children}
      </div>
    </section>
  );
}
