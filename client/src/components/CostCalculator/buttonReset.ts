/**
 * `index.css` styles every bare `<button>` as a filled slate pill that also
 * scales on hover. Controls that are a button for semantics/accessibility but
 * shouldn't look like one (option cards, progress segments, inline links) opt
 * out with this.
 */
export const BUTTON_RESET =
  'bg-transparent p-0 text-base font-normal hover-capable:hover:scale-100';
