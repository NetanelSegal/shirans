/**
 * Playwright globalSetup: creates E2E admin user before tests.
 */
import { execSync } from 'child_process';

export default async function globalSetup() {
  try {
    execSync('npm run e2e:setup -w server', {
      stdio: 'inherit',
      env: process.env,
    });
  } catch (err) {
    console.warn('E2E setup failed (admin user may already exist):', err);
  }
}
