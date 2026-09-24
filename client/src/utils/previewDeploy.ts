import { isPreviewDeploy } from '@/config/env';

/**
 * Thrown instead of submitting a public form on a preview deploy. Previews share
 * the production database and alert inbox, so a test submission there would
 * reach Shiran as a real lead.
 */
export class PreviewSubmissionBlockedError extends Error {
  constructor() {
    super('Form submissions are disabled on preview deploys');
    this.name = 'PreviewSubmissionBlockedError';
  }
}

/** Call first in every public (visitor-facing) submission. */
export function assertLiveSubmission(): void {
  if (isPreviewDeploy) throw new PreviewSubmissionBlockedError();
}
