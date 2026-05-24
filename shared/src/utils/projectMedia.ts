import type { ProjectImageType } from '../constants/projectImage';
import type { ProjectMediaItem, ProjectResponse } from '../types/responses.types';

export type ReorderDirection = 'up' | 'down';

/** API payloads that predate the unified `media[]` field. */
export type LegacyProjectPayload = Omit<ProjectResponse, 'media'> & {
  media?: ProjectMediaItem[] | null;
  mainImage?: string;
  images?: string[];
  plans?: string[];
  videos?: string[];
};

export function sortProjectMedia(
  media: ProjectMediaItem[] | null | undefined,
): ProjectMediaItem[] {
  if (!media?.length) return [];
  return [...media].sort(
    (a, b) => a.order - b.order || a.id.localeCompare(b.id),
  );
}

export function getMainImageUrl(
  media: ProjectMediaItem[] | null | undefined,
): string {
  const main = sortProjectMedia(media).find((item) => item.type === 'MAIN');
  return main?.url ?? '';
}

/** Build unified `media[]` from modern or legacy API payloads. */
export function normalizeProjectMedia(
  project: LegacyProjectPayload,
): ProjectMediaItem[] {
  if (Array.isArray(project.media)) {
    return sortProjectMedia(project.media);
  }

  const items: ProjectMediaItem[] = [];
  let order = 0;
  const projectId = project.id;

  const push = (url: string, type: ProjectImageType, suffix: string) => {
    items.push({
      id: `${projectId}-${suffix}`,
      url,
      type,
      order: order++,
    });
  };

  if (project.mainImage) {
    push(project.mainImage, 'MAIN', 'legacy-main');
  }
  project.images?.forEach((url, index) => {
    push(url, 'IMAGE', `legacy-image-${index}`);
  });
  project.plans?.forEach((url, index) => {
    push(url, 'PLAN', `legacy-plan-${index}`);
  });
  project.videos?.forEach((url, index) => {
    push(url, 'VIDEO', `legacy-video-${index}`);
  });

  return items;
}

/** Normalize a project record from the API into the `media[]` shape. */
export function normalizeProjectResponse(
  project: LegacyProjectPayload,
): ProjectResponse {
  const {
    mainImage: _mainImage,
    images: _images,
    plans: _plans,
    videos: _videos,
    media: _media,
    ...rest
  } = project;

  return {
    ...rest,
    media: normalizeProjectMedia(project),
  };
}

export function getMediaByType(
  media: ProjectMediaItem[],
  type: ProjectImageType,
): ProjectMediaItem[] {
  return sortProjectMedia(media).filter((item) => item.type === type);
}

export function getMediaUrlsByType(
  media: ProjectMediaItem[],
  type: ProjectImageType,
): string[] {
  return getMediaByType(media, type).map((item) => item.url);
}

/**
 * Swap adjacent items within a type slice and return the full media ID list
 * required by PATCH /api/projects/reorderImages.
 */
export function buildFullReorderIds(
  media: ProjectMediaItem[],
  type: 'IMAGE' | 'PLAN',
  indexInType: number,
  direction: ReorderDirection,
): string[] | null {
  const swapIndex = direction === 'up' ? indexInType - 1 : indexInType + 1;
  return buildFullReorderIdsFromMove(media, type, indexInType, swapIndex);
}

/**
 * Move one item within a type slice and return the full media ID list for reorder API.
 */
export function buildFullReorderIdsFromMove(
  media: ProjectMediaItem[],
  type: 'IMAGE' | 'PLAN',
  fromIndex: number,
  toIndex: number,
): string[] | null {
  if (fromIndex === toIndex) return null;

  const sorted = sortProjectMedia(media);
  const typeItems = sorted.filter((item) => item.type === type);
  if (
    fromIndex < 0 ||
    fromIndex >= typeItems.length ||
    toIndex < 0 ||
    toIndex >= typeItems.length
  ) {
    return null;
  }

  const reorderedTypeItems = [...typeItems];
  const [moved] = reorderedTypeItems.splice(fromIndex, 1);
  reorderedTypeItems.splice(toIndex, 0, moved!);

  let typeCursor = 0;
  return sorted.map((item) => {
    if (item.type !== type) {
      return item.id;
    }
    const nextId = reorderedTypeItems[typeCursor]!.id;
    typeCursor += 1;
    return nextId;
  });
}

/** Compare full media order by ID sequence. */
export function isSameMediaOrder(
  a: ProjectMediaItem[],
  b: ProjectMediaItem[],
): boolean {
  const idsA = sortProjectMedia(a).map((item) => item.id);
  const idsB = sortProjectMedia(b).map((item) => item.id);
  return (
    idsA.length === idsB.length && idsA.every((id, index) => id === idsB[index])
  );
}

/** Full media ID list for PATCH /api/projects/reorderImages. */
export function getMediaIdOrder(media: ProjectMediaItem[]): string[] {
  return sortProjectMedia(media).map((item) => item.id);
}

/** Stable key for comparing media membership/order without reference equality. */
export function getMediaOrderKey(media: ProjectMediaItem[]): string {
  return getMediaIdOrder(media).join('|');
}

/** Assign sequential order values after existing media (for uploads). */
export function getNextMediaOrders(
  media: ProjectMediaItem[],
  count: number,
): number[] {
  if (count <= 0) return [];
  const maxOrder = sortProjectMedia(media).reduce(
    (max, item) => Math.max(max, item.order),
    -1,
  );
  return Array.from({ length: count }, (_, index) => maxOrder + 1 + index);
}

/**
 * When the server adds/removes media while a bulk reorder draft is dirty,
 * preserve draft order for surviving IDs and append new server items.
 */
export function mergeServerMediaIntoDraft(
  draft: ProjectMediaItem[],
  server: ProjectMediaItem[],
): ProjectMediaItem[] {
  const serverSorted = sortProjectMedia(server);
  if (isSameMediaOrder(draft, serverSorted)) {
    return serverSorted;
  }

  const serverById = new Map(serverSorted.map((item) => [item.id, item]));
  const draftIds = getMediaIdOrder(draft).filter((id) => serverById.has(id));
  const draftIdSet = new Set(draftIds);
  const appendedIds = serverSorted
    .filter((item) => !draftIdSet.has(item.id))
    .map((item) => item.id);

  return applyMediaIdOrder(serverSorted, [...draftIds, ...appendedIds]);
}

/** Apply a full ID order list to existing media items (local draft UI). */
export function applyMediaIdOrder(
  media: ProjectMediaItem[],
  orderedIds: string[],
): ProjectMediaItem[] {
  const byId = new Map(media.map((item) => [item.id, item]));
  return orderedIds.map((id, order) => {
    const item = byId.get(id);
    if (!item) {
      throw new Error(`Unknown media id: ${id}`);
    }
    return { ...item, order };
  });
}
