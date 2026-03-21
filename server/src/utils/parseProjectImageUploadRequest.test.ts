import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { parseProjectImageUploadRequest } from './parseProjectImageUploadRequest';
import { HttpError } from '../middleware/errorHandler';

function makeReq(partial: {
  files?: Express.Multer.File[];
  body?: Record<string, unknown>;
}): Request {
  return {
    files: partial.files,
    body: partial.body ?? {},
  } as Request;
}

describe('parseProjectImageUploadRequest', () => {
  it('returns id, files, metadata when valid', () => {
    const files = [
      { buffer: Buffer.from('a'), mimetype: 'image/jpeg' },
    ] as Express.Multer.File[];
    const req = makeReq({
      files,
      body: {
        id: 'clx123abc456def789',
        metadata: JSON.stringify([{ type: 'IMAGE', order: 0 }]),
      },
    });

    const parsed = parseProjectImageUploadRequest(req);
    expect(parsed.id).toBe('clx123abc456def789');
    expect(parsed.files).toBe(files);
    expect(parsed.metadata).toEqual([{ type: 'IMAGE', order: 0 }]);
  });

  it('throws HttpError 400 when no files', () => {
    const req = makeReq({
      body: { id: 'clx123abc456def789', metadata: '[]' },
    });
    expect(() => parseProjectImageUploadRequest(req)).toThrow(HttpError);
  });

  it('throws HttpError 400 when metadata length mismatches files', () => {
    const req = makeReq({
      files: [
        { buffer: Buffer.from('a') },
        { buffer: Buffer.from('b') },
      ] as Express.Multer.File[],
      body: {
        id: 'clx123abc456def789',
        metadata: JSON.stringify([{ type: 'IMAGE' }]),
      },
    });
    expect(() => parseProjectImageUploadRequest(req)).toThrow(HttpError);
  });
});
