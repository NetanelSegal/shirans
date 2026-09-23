import { describe, it, expect } from 'vitest';
import { slugify, uniqueSlug, estimateReadingMinutes } from './slug';
import { sanitizeArticleHtml, htmlToText } from './sanitizeHtml';

describe('slugify', () => {
  it('keeps Hebrew letters and joins words with hyphens', () => {
    expect(slugify('כמה עולה לבנות בית פרטי')).toBe('כמה-עולה-לבנות-בית-פרטי');
  });

  it('drops punctuation a URL should not carry', () => {
    expect(slugify('כמה עולה לבנות בית פרטי?')).toBe('כמה-עולה-לבנות-בית-פרטי');
    expect(slugify('תכנון, רישוי והיתרים')).toBe('תכנון-רישוי-והיתרים');
  });

  it('lowercases and hyphenates Latin titles', () => {
    expect(slugify('How Much Does It Cost?')).toBe('how-much-does-it-cost');
  });

  it('returns an empty string when nothing usable is left', () => {
    expect(slugify('   ')).toBe('');
    expect(slugify('!!!')).toBe('');
  });

  it('never leaves a leading or trailing hyphen', () => {
    expect(slugify('  בית פרטי  ')).toBe('בית-פרטי');
    expect(slugify('-- test --')).toBe('test');
  });
});

describe('uniqueSlug', () => {
  it('returns the base when it is free', async () => {
    expect(await uniqueSlug('בית', () => Promise.resolve(false))).toBe('בית');
  });

  it('counts up until it finds a free candidate', async () => {
    const taken = new Set(['בית', 'בית-2', 'בית-3']);
    expect(await uniqueSlug('בית', (c) => Promise.resolve(taken.has(c)))).toBe('בית-4');
  });
});

describe('estimateReadingMinutes', () => {
  it('ignores markup and never reports less than a minute', () => {
    expect(estimateReadingMinutes('<p>שלוש מילים כאן</p>')).toBe(1);
  });

  it('scales with the amount of text', () => {
    const body = `<p>${'מילה '.repeat(600)}</p>`;
    expect(estimateReadingMinutes(body)).toBe(3);
  });
});

describe('sanitizeArticleHtml', () => {
  it('keeps the formatting the editor produces', () => {
    const html = '<h2>כותרת</h2><p><strong>מודגש</strong> ורגיל</p><ul><li>פריט</li></ul>';
    expect(sanitizeArticleHtml(html)).toBe(html);
  });

  it('strips script tags', () => {
    const out = sanitizeArticleHtml('<p>שלום</p><script>alert(1)</script>');
    expect(out).not.toContain('script');
    expect(out).toContain('שלום');
  });

  it('strips inline event handlers', () => {
    const out = sanitizeArticleHtml('<img src="https://x/a.png" onerror="alert(1)">');
    expect(out).not.toContain('onerror');
  });

  it('drops javascript: links but keeps ordinary ones', () => {
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:');
    expect(sanitizeArticleHtml('<a href="https://example.com">x</a>')).toContain('https://example.com');
  });

  it('removes iframes and forms', () => {
    const out = sanitizeArticleHtml('<iframe src="https://x"></iframe><form><input></form>');
    expect(out).not.toContain('iframe');
    expect(out).not.toContain('<form');
    expect(out).not.toContain('<input');
  });
});

describe('htmlToText', () => {
  it('returns readable text with collapsed whitespace', () => {
    expect(htmlToText('<p>שלום   <strong>עולם</strong></p>')).toBe('שלום עולם');
  });
});
