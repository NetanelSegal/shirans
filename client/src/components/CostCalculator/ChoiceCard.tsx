import Image from '@/components/ui/Image';
import { BUTTON_RESET } from './buttonReset';
import type { ChoiceOption } from './types';

interface ChoiceCardProps {
  option: ChoiceOption;
  selected: boolean;
  onSelect: () => void;
  variant: 'icon' | 'image' | 'row';
}

const selectedRing = 'border-primary ring-2 ring-primary';
const idleRing =
  'border-primary/15 hover-capable:hover:border-primary/40 hover-capable:hover:shadow-md hover-capable:hover:-translate-y-0.5';

/**
 * Named properties rather than `all`, so the hover lift and the selection ring
 * don't drag unrelated properties along with them. `active:scale` is the bit that
 * makes the card feel like it heard the tap — without it a large card registers
 * as inert on press.
 */
const cardMotion =
  'transition-[transform,border-color,box-shadow] duration-200 ease-out active:scale-[0.98] active:duration-100 motion-reduce:transition-none motion-reduce:hover-capable:hover:translate-y-0 motion-reduce:active:scale-100';

/**
 * The browser's own focus ring is barely legible against a rounded white card,
 * and these are the only controls on most steps — keyboard users need to see
 * where they are. Offset in the card's own surface colour, not white.
 */
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary';

export function ChoiceCard({
  option,
  selected,
  onSelect,
  variant,
}: ChoiceCardProps) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`${BUTTON_RESET} ${cardMotion} ${FOCUS} group overflow-hidden rounded-xl border bg-white text-right ${
        selected ? selectedRing : idleRing
      } ${
        variant === 'row'
          ? 'flex w-full items-center gap-4 p-4 md:flex-col md:items-stretch md:gap-3'
          : ''
      } ${
        // Laid out as a column so the image stays pinned to the top. Browsers
        // vertically centre a button's content, so a card without a sublabel —
        // stretched to match taller siblings in the grid — floated its image away
        // from the top edge.
        variant === 'image' ? 'flex flex-col' : ''
      } ${
        variant === 'icon' ? 'flex flex-col items-center gap-3 p-6 text-center' : ''
      }`}
    >
      {variant === 'image' && option.image && (
        <div className="aspect-[4/3] w-full overflow-hidden">
          <Image
            src={option.image}
            alt=""
            className="size-full object-cover transition-transform duration-500 ease-out hover-capable:group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover-capable:group-hover:scale-100"
          />
        </div>
      )}

      {variant === 'row' && option.image && (
        // `contain`, not `cover` — these are line drawings, and cropping them
        // cuts off the very storeys the option is describing.
        <div className="size-20 shrink-0 overflow-hidden rounded-lg md:h-28 md:w-full">
          <Image src={option.image} alt="" className="size-full object-contain" />
        </div>
      )}

      {Icon && <Icon className="size-7 text-primary" aria-hidden />}

      <div className={variant === 'image' ? 'p-3' : ''}>
        <span className="block font-bold text-primary">{option.label}</span>
        {option.sublabel && (
          <span className="mt-0.5 block text-sm text-primary/70">
            {option.sublabel}
          </span>
        )}
      </div>
    </button>
  );
}
