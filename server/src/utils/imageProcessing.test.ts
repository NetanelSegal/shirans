import { describe, it, expect } from 'vitest';
import { compressImageBuffer } from './imageProcessing';

/** Minimal valid 1×1 PNG */
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('compressImageBuffer', () => {
  it('outputs WebP bytes for a small PNG', async () => {
    const out = await compressImageBuffer(PNG_1X1);
    expect(out.length).toBeGreaterThan(0);
    expect(out.subarray(0, 4).toString('ascii')).toBe('RIFF');
    expect(out.subarray(8, 12).toString('ascii')).toBe('WEBP');
  });
});
