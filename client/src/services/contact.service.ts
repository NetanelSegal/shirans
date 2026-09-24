import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import type { CreateContactInput } from '@shirans/shared';
import { assertLiveSubmission } from '../utils/previewDeploy';

/**
 * Submit contact form data to the backend API.
 * Expects CreateContactInput (name, email, phoneNumber, message).
 * Map FooterFormInput.context → message when calling from the form.
 */
export async function submitContact(data: CreateContactInput): Promise<void> {
  assertLiveSubmission();
  await apiClient.post(urls.contact.submit, data);
}
