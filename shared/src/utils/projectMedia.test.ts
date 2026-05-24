import { describe, it, expect } from 'vitest';
import type { ProjectMediaItem } from '../types/responses.types';
import {
  buildFullReorderIds,
  buildFullReorderIdsFromMove,
  getMainImageUrl,
  isSameMediaOrder,
  getMediaIdOrder,
  getMediaOrderKey,
  getNextMediaOrders,
  mergeServerMediaIntoDraft,
  applyMediaIdOrder,
  getMediaUrlsByType,
  sortProjectMedia,
} from './projectMedia';

const sampleMedia: ProjectMediaItem[] = [
  { id: 'main', url: 'main.jpg', type: 'MAIN', order: 0 },
  { id: 'img-a', url: 'a.jpg', type: 'IMAGE', order: 1 },
  { id: 'img-b', url: 'b.jpg', type: 'IMAGE', order: 2 },
  { id: 'plan-a', url: 'plan-a.jpg', type: 'PLAN', order: 3 },
  { id: 'plan-b', url: 'plan-b.jpg', type: 'PLAN', order: 4 },
  { id: 'video', url: 'v.mp4', type: 'VIDEO', order: 5 },
];

describe('projectMedia helpers', () => {
  it('sortProjectMedia orders by order then id', () => {
    const shuffled = [sampleMedia[2]!, sampleMedia[0]!, sampleMedia[1]!];
    expect(sortProjectMedia(shuffled).map((m) => m.id)).toEqual([
      'main',
      'img-a',
      'img-b',
    ]);
  });

  it('getMainImageUrl returns MAIN url or empty string', () => {
    expect(getMainImageUrl(sampleMedia)).toBe('main.jpg');
    expect(getMainImageUrl([])).toBe('');
  });

  it('getMediaUrlsByType filters and preserves order', () => {
    expect(getMediaUrlsByType(sampleMedia, 'IMAGE')).toEqual(['a.jpg', 'b.jpg']);
    expect(getMediaUrlsByType(sampleMedia, 'PLAN')).toEqual([
      'plan-a.jpg',
      'plan-b.jpg',
    ]);
  });

  it('isSameMediaOrder detects reorder vs unchanged lists', () => {
    expect(isSameMediaOrder(sampleMedia, sampleMedia)).toBe(true);
    const swapped = applyMediaIdOrder(sampleMedia, [
      'main',
      'img-b',
      'img-a',
      'plan-a',
      'plan-b',
      'video',
    ]);
    expect(isSameMediaOrder(sampleMedia, swapped)).toBe(false);
  });

  it('getMediaIdOrder returns sorted ids', () => {
    expect(getMediaIdOrder(sampleMedia)).toEqual([
      'main',
      'img-a',
      'img-b',
      'plan-a',
      'plan-b',
      'video',
    ]);
  });

  it('buildFullReorderIdsFromMove moves IMAGE item to a new index', () => {
    const result = buildFullReorderIdsFromMove(sampleMedia, 'IMAGE', 0, 1);
    expect(result).toEqual(['main', 'img-b', 'img-a', 'plan-a', 'plan-b', 'video']);
  });

  it('buildFullReorderIdsFromMove returns null when indices match', () => {
    expect(buildFullReorderIdsFromMove(sampleMedia, 'IMAGE', 1, 1)).toBeNull();
  });

  it('buildFullReorderIds swaps IMAGE items within global list', () => {
    const result = buildFullReorderIds(sampleMedia, 'IMAGE', 0, 'down');
    expect(result).toEqual(['main', 'img-b', 'img-a', 'plan-a', 'plan-b', 'video']);
  });

  it('buildFullReorderIds swaps PLAN items without moving other types', () => {
    const result = buildFullReorderIds(sampleMedia, 'PLAN', 0, 'down');
    expect(result).toEqual(['main', 'img-a', 'img-b', 'plan-b', 'plan-a', 'video']);
  });

  it('buildFullReorderIds returns null at boundaries', () => {
    expect(buildFullReorderIds(sampleMedia, 'IMAGE', 0, 'up')).toBeNull();
    expect(buildFullReorderIds(sampleMedia, 'IMAGE', 1, 'down')).toBeNull();
  });

  it('buildFullReorderIds returns null for single-item type slice', () => {
    const singleImage: ProjectMediaItem[] = [
      { id: 'main', url: 'main.jpg', type: 'MAIN', order: 0 },
      { id: 'img-a', url: 'a.jpg', type: 'IMAGE', order: 1 },
    ];
    expect(buildFullReorderIds(singleImage, 'IMAGE', 0, 'down')).toBeNull();
  });

  it('getNextMediaOrders appends after the highest existing order', () => {
    expect(getNextMediaOrders(sampleMedia, 2)).toEqual([6, 7]);
    expect(getNextMediaOrders([], 3)).toEqual([0, 1, 2]);
  });

  it('getMediaOrderKey is stable for the same media order', () => {
    expect(getMediaOrderKey(sampleMedia)).toBe(getMediaIdOrder(sampleMedia).join('|'));
  });

  it('mergeServerMediaIntoDraft preserves draft order and appends new items', () => {
    const draft = applyMediaIdOrder(sampleMedia, [
      'main',
      'img-b',
      'img-a',
      'plan-a',
      'plan-b',
      'video',
    ]);
    const server = [
      ...sampleMedia,
      { id: 'img-c', url: 'c.jpg', type: 'IMAGE' as const, order: 6 },
    ];
    const merged = mergeServerMediaIntoDraft(draft, server);
    expect(getMediaIdOrder(merged)).toEqual([
      'main',
      'img-b',
      'img-a',
      'plan-a',
      'plan-b',
      'video',
      'img-c',
    ]);
  });
});
