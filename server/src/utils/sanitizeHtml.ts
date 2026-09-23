import DOMPurify from 'isomorphic-dompurify';

/**
 * Article bodies are HTML written in the admin's editor and rendered on the
 * site with dangerouslySetInnerHTML, so they are sanitised here — on the way
 * in, once — rather than trusted because "only an admin writes them". An admin
 * account is one stolen password away from being someone else.
 *
 * The allow-list is what the editor can actually produce: text, headings,
 * lists, links, images, tables and quotes. No script, style, iframe, form or
 * event handler survives.
 */
const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'h2', 'h3', 'h4',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'sub', 'sup',
  'ul', 'ol', 'li',
  'blockquote', 'figure', 'figcaption',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'span', 'div',
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'dir', 'style', 'class'];

export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Only web links and images; no javascript: or data: payloads.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'srcset', 'formaction'],
  });
}

/** Plain text from HTML — for meta descriptions and list previews. */
export function htmlToText(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/\s+/g, ' ')
    .trim();
}
