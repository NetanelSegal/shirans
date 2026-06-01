import { describe, expect, it } from 'vitest';
import { optimizeCloudinaryImageUrl } from './cloudinaryImage';

describe('optimizeCloudinaryImageUrl', () => {
  it('adds transforms to Cloudinary URLs', () => {
    const url =
      'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg';
    expect(optimizeCloudinaryImageUrl(url, 800)).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/v1/sample.jpg',
    );
  });

  it('returns non-Cloudinary URLs unchanged', () => {
    expect(optimizeCloudinaryImageUrl('https://example.com/a.jpg', 800)).toBe(
      'https://example.com/a.jpg',
    );
  });

  it('does not double-apply width transforms', () => {
    const url =
      'https://res.cloudinary.com/demo/image/upload/w_400,f_auto/sample.jpg';
    expect(optimizeCloudinaryImageUrl(url, 800)).toBe(url);
  });
});
