/** The query parameter the admin leads screen opens a specific lead from. */
export const LEAD_QUERY_PARAM = 'lead';

/**
 * A link that opens one lead's details in the admin.
 *
 * Built from the current origin rather than a configured host, so the link a
 * visitor sends from the live site points at the live admin and the one sent
 * from a preview build points at that preview.
 */
export function adminLeadUrl(leadId: string): string {
  const origin =
    typeof window === 'undefined' ? '' : window.location.origin;
  return `${origin}/admin/calculator-leads?${LEAD_QUERY_PARAM}=${leadId}`;
}
