/**
 * Playwright globalTeardown: cleans up E2E test users from the database.
 * Invokes the server's e2e-teardown script which deletes users with email ending in @example.com.
 */
import { execSync } from 'child_process';

export default async function globalTeardown() {
  try {
    execSync('npm run e2e:teardown -w server', {
      stdio: 'inherit',
      env: process.env,
    });
  } catch {
    // Teardown is best-effort; do not fail the test run if cleanup fails
  }
}
