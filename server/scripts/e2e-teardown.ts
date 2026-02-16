/**
 * E2E teardown: deletes test users (email ending with @example.com).
 * Called by Playwright globalTeardown after E2E tests complete.
 * RefreshToken records are cascade-deleted when User is deleted.
 */
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

dotenv.config();

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('E2E teardown: DATABASE_URL not set, skipping cleanup');
    return;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const result = await prisma.user.deleteMany({
      where: { email: { endsWith: '@example.com' } },
    });
    if (result.count > 0) {
      console.log(`E2E teardown: deleted ${result.count} test user(s)`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('E2E teardown failed:', err);
  process.exit(1);
});
