import { describe, it, expect } from 'vitest';
import { updateProjectSchema } from './project.schema';

const projectId = 'clh123456789012345678901234';

describe('updateProjectSchema', () => {
  it('does not inject isCompleted when only favourite is updated', () => {
    const parsed = updateProjectSchema.parse({
      id: projectId,
      favourite: true,
    });

    expect(parsed).toEqual({ id: projectId, favourite: true });
    expect(parsed).not.toHaveProperty('isCompleted');
  });

  it('does not inject favourite when only isCompleted is updated', () => {
    const parsed = updateProjectSchema.parse({
      id: projectId,
      isCompleted: true,
    });

    expect(parsed).toEqual({ id: projectId, isCompleted: true });
    expect(parsed).not.toHaveProperty('favourite');
  });
});
