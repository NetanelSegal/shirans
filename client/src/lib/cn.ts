import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Joins class names and lets a later class override an earlier one from the
 * same group, so a component's defaults can be adjusted with `className`.
 *
 * tailwind-merge doesn't know the token type scale (tailwind.config.js); left
 * alone it would read `text-h2` as a color and drop it next to `text-ink`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'h1', 'h2', 'h3', 'lead', 'body', 'small', 'eyebrow'] },
      ],
    },
  },
});

export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(' '));
}
